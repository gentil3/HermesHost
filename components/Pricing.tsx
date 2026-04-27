'use client'

import { useState } from 'react'
import { Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const PLANS = [
  {
    id: 'spark',
    name: 'Spark',
    monthlyPrice: 9,
    yearlyPrice: 7,
    monthlyPriceId: 'price_1TQ9AI74namgSG7Iol4iRtMB',
    yearlyPriceId: 'price_1TQHgi74namgSG7INtN5g5ng',
    description: 'See what your agent can do.',
    teaser: 'Your agent wakes up when you message it.',
    popular: false,
    features: [
      '1 agent instance',
      '1 messaging platform',
      'Remembers last 30 days',
      '10 saved skills',
      'Community support',
    ],
  },
  {
    id: 'solo',
    name: 'Solo',
    monthlyPrice: 19,
    yearlyPrice: 15,
    monthlyPriceId: 'price_1TQ9Cs74namgSG7IJySzlSPM',
    yearlyPriceId: 'price_1TQHfN74namgSG7Iike6frGD',
    description: 'Your agent actually becomes useful.',
    teaser: 'Your agent handles your inbox and remembers what matters.',
    popular: false,
    features: [
      '1 agent instance',
      '2 messaging platforms',
      'Unlimited memory',
      'Unlimited skills',
      '5 scheduled automations',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 49,
    yearlyPrice: 39,
    monthlyPriceId: 'price_1TQ9ES74namgSG7ImIF3glcW',
    yearlyPriceId: 'price_1TQHeJ74namgSG7IYvVCRrjs',
    description: 'Your agent works while you sleep.',
    teaser: 'Your agent runs three jobs in parallel while you have coffee.',
    popular: true,
    features: [
      '3 agent instances',
      'All messaging platforms',
      'Unlimited memory',
      'Unlimited skills + automations',
      'Browser automation',
      '3 parallel subagents',
      'Priority support',
    ],
  },
  {
    id: 'studio',
    name: 'Studio',
    monthlyPrice: 89,
    yearlyPrice: 72,
    monthlyPriceId: 'price_1TQ9Ho74namgSG7IECHOcBlo',
    yearlyPriceId: 'price_1TQHc774namgSG7IqidMCIv7',
    description: 'A fleet of agents, not just one.',
    teaser: 'Your agents run your workflows. You just review the output.',
    popular: false,
    features: [
      '10 agent instances',
      'All platforms + webhooks',
      'Unlimited memory',
      'Unlimited subagents',
      'Browser automation',
      'Full API access',
      'Slack support',
    ],
  },
  {
    id: 'operator',
    name: 'Operator',
    monthlyPrice: 199,
    yearlyPrice: 159,
    monthlyPriceId: 'price_1TQ9K674namgSG7IX3KR2bKf',
    yearlyPriceId: 'price_1TQHak74namgSG7I5pK4qgJN',
    description: 'This is how companies run on agents.',
    teaser: "You don't manage the agents. The agents manage the work.",
    popular: false,
    features: [
      'Unlimited agent instances',
      'All platforms + custom webhooks',
      'Unlimited memory',
      'Unlimited subagents',
      'Browser automation',
      'Full API + SSO + team dashboard',
      'Dedicated support engineer',
      'White-label option',
    ],
  },
]

export function Pricing() {
  const [loading, setLoading] = useState<string | null>(null)
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  async function handleCheckout(priceId: string) {
    setLoading(priceId)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      if (!res.ok) throw new Error('Failed to create checkout session')
      const { url } = await res.json()
      window.location.href = url
    } catch (err) {
      console.error(err)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <section id="pricing" className="py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <Badge className="mb-4">Early Access Pricing — Locked for life on signup</Badge>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Built for people who want the agent,{' '}
            <span className="gradient-text">not the overhead.</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">
            Five tiers. One goal: your agent works harder than you do.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setBilling('monthly')}
              className={cn(
                'rounded-md px-4 py-2 text-sm font-medium transition-all',
                billing === 'monthly'
                  ? 'bg-violet-600 text-white'
                  : 'text-white/50 hover:text-white'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={cn(
                'rounded-md px-4 py-2 text-sm font-medium transition-all flex items-center gap-2',
                billing === 'yearly'
                  ? 'bg-violet-600 text-white'
                  : 'text-white/50 hover:text-white'
              )}
            >
              Yearly
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                ~20% off
              </span>
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PLANS.map((plan) => {
            const price = billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
            const priceId = billing === 'yearly' ? plan.yearlyPriceId : plan.monthlyPriceId
            return (
              <div
                key={plan.id}
                className={cn(
                  'relative flex flex-col rounded-xl border p-5 transition-all',
                  plan.popular
                    ? 'border-violet-500/50 bg-violet-950/30 glow scale-105'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-violet-600 text-white border-0 shadow-lg shadow-violet-500/30 whitespace-nowrap">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className={cn('h-4 w-4', plan.popular ? 'text-violet-400' : 'text-white/40')} />
                    <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                      {plan.name}
                    </span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-white">${price}</span>
                    <span className="text-white/40 mb-1 text-sm">/mo</span>
                  </div>
                  {billing === 'yearly' && (
                    <p className="text-xs text-green-400 mt-1">
                      ${plan.yearlyPrice * 12}/yr · save ${(plan.monthlyPrice - plan.yearlyPrice) * 12}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-white/40 italic">{plan.teaser}</p>
                </div>

                <ul className="mb-6 flex-1 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs text-white/70">
                      <Check className="h-3.5 w-3.5 shrink-0 text-violet-400 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleCheckout(priceId)}
                  disabled={loading !== null}
                  variant={plan.popular ? 'default' : 'outline'}
                  className={cn('w-full text-sm', plan.popular && 'shadow-lg shadow-violet-500/30')}
                >
                  {loading === priceId ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Redirecting…
                    </span>
                  ) : billing === 'yearly' ? (
                    `Pay $${plan.yearlyPrice * 12}/yr`
                  ) : (
                    `Start for $${plan.monthlyPrice}/mo`
                  )}
                </Button>
              </div>
            )
          })}
        </div>

        <p className="mt-8 text-center text-sm text-white/40">
          No hidden credits. Cancel anytime. Early access pricing locked for life on signup. <br />
          AI model API costs billed directly by provider — we never mark these up.
        </p>
      </div>
    </section>
  )
}
