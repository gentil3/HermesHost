import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase'
import { createHermesInstance } from '@/lib/coolify'
import type { Plan } from '@/types'

export const runtime = 'nodejs'

// Stripe requires the raw body to verify webhook signatures
export async function POST(req: NextRequest) {
    const supabaseAdmin = getSupabaseAdmin()
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')

  if (!sig) {
        return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
        event = getStripe().webhooks.constructEvent(
                body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET!
              )
  } catch (err) {
        console.error('[webhook] Signature verification failed:', err)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
        switch (event.type) {
          case 'checkout.session.completed':
                    await handleCheckoutCompleted(supabaseAdmin, event.data.object as Stripe.Checkout.Session)
                    break
          case 'customer.subscription.deleted':
                    await handleSubscriptionDeleted(supabaseAdmin, event.data.object as Stripe.Subscription)
                    break
          case 'invoice.payment_failed':
                    await handlePaymentFailed(supabaseAdmin, event.data.object as Stripe.Invoice)
                    break
          default:
                    // Ignore other events
            break
        }
  } catch (err) {
        console.error('[webhook] Handler error:', err)
        return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

type SupabaseAdminClient = ReturnType<typeof getSupabaseAdmin>

async function handleCheckoutCompleted(supabaseAdmin: SupabaseAdminClient, session: Stripe.Checkout.Session) {
    const email = session.customer_details?.email ?? session.customer_email
    const plan = (session.metadata?.plan ?? 'lite') as Plan
    const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id
    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id

  if (!email) {
        throw new Error('No email on checkout session')
  }

  // 1. Upsert user in Supabase auth (invite / magic link)
  const { data: userRecord, error: userError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: { plan },
  })

  if (userError && userError.message !== 'A user with this email address has already been registered') {
        throw new Error(`Failed to create user: ${userError.message}`)
  }

  const userId = userRecord?.user?.id ?? (await getUserIdByEmail(supabaseAdmin, email))

  // 2. Create pending instance record immediately
  const { data: instance, error: insertError } = await supabaseAdmin
      .from('instances')
      .insert({
              user_id: userId ?? null,
              email,
              plan,
              stripe_customer_id: customerId ?? null,
              stripe_subscription_id: subscriptionId ?? null,
              status: 'provisioning',
      })
      .select()
      .single()

  if (insertError) throw new Error(`Failed to insert instance: ${insertError.message}`)

  // 3. Provision Coolify instance (async — update record when done)
  try {
        const { projectId, subdomain, loginUrl } = await createHermesInstance(email, plan)
        await supabaseAdmin
          .from('instances')
          .update({
                    coolify_project_id: projectId,
                    subdomain,
                    login_url: loginUrl,
                    status: 'active',
          })
          .eq('id', instance.id)
  } catch (provisionErr) {
        console.error('[webhook] Coolify provision failed:', provisionErr)
        await supabaseAdmin
          .from('instances')
          .update({ status: 'error' })
          .eq('id', instance.id)
        // Don't re-throw — payment already taken, handle manually / retry
  }
}

async function handleSubscriptionDeleted(supabaseAdmin: SupabaseAdminClient, subscription: Stripe.Subscription) {
    await supabaseAdmin
      .from('instances')
      .update({ status: 'canceled' })
      .eq('stripe_subscription_id', subscription.id)
}

async function handlePaymentFailed(supabaseAdmin: SupabaseAdminClient, invoice: Stripe.Invoice) {
    const subscriptionId =
          typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id
    if (!subscriptionId) return

  await supabaseAdmin
      .from('instances')
      .update({ status: 'past_due' } as never)
      .eq('stripe_subscription_id', subscriptionId)
}

async function getUserIdByEmail(supabaseAdmin: SupabaseAdminClient, email: string): Promise<string | null> {
    const { data } = await supabaseAdmin.auth.admin.listUsers()
    const user = data.users.find((u) => u.email === email)
    return user?.id ?? null
}
