import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabase-server'
import type { CheckoutRequest } from '@/types'
import { PLANS } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckoutRequest
    const { plan, email } = body

    if (!plan || !PLANS.find((p) => p.id === plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Optionally pull email from current session if logged in
    let resolvedEmail = email
    if (!resolvedEmail) {
      const supabase = await createServerClient()
      const { data: { user } } = await supabase.auth.getUser()
      resolvedEmail = user?.email
    }

    const session = await createCheckoutSession(plan, resolvedEmail)

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout]', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
