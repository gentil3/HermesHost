import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { priceId, email } = body

    if (!priceId || typeof priceId !== 'string') {
      return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 })
    }

    let resolvedEmail = email
    if (!resolvedEmail) {
      try {
        const supabase = await createServerClient()
        const { data: { user } } = await supabase.auth.getUser()
        resolvedEmail = user?.email
      } catch {
        // not logged in, continue without email
      }
    }

    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: resolvedEmail || undefined,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=true`,
      allow_promotion_codes: true,
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
