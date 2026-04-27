import Stripe from 'stripe'
import type { Plan } from '@/types'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
    if (!_stripe) {
          if (!process.env.STRIPE_SECRET_KEY) {
                  throw new Error('STRIPE_SECRET_KEY is not set')
          }
          _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
                  apiVersion: '2025-02-24.acacia',
          })
    }
    return _stripe
}

export const stripe = getStripe

const PRICE_IDS: Record<Plan, string> = {
    lite: process.env.STRIPE_PRICE_LITE!,
    pro: process.env.STRIPE_PRICE_PRO!,
    max: process.env.STRIPE_PRICE_MAX!,
    ultra: process.env.STRIPE_PRICE_ULTRA!,
}

export function getPriceId(plan: Plan): string {
    const id = PRICE_IDS[plan]
    if (!id) throw new Error(`No price ID configured for plan: ${plan}`)
    return id
}

export async function createCheckoutSession(plan: Plan, email?: string) {
    const priceId = getPriceId(plan)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!

  const session = await getStripe().checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/#pricing`,
        customer_email: email,
        allow_promotion_codes: true,
        subscription_data: {
                metadata: { plan },
        },
        metadata: { plan },
        billing_address_collection: 'auto',
  })

  return session
}
