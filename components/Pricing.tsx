'use client'

import { useState } from 'react'
import { Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PLANS } from '@/types'
import type { Plan } from '@/types'

export function Pricing() {
  const [loading, setLoading] = useState<Plan | null>(null)

  async function handleCheckout(plan: Plan) {
    setLoading(plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
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
        <div className="mb-16 text-center">
          <Badge className="mb-4">Simple Pricing</Badge>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Your Hermes agent,{' '}
            <span className="gradient-text">your infrastructure</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">
            Every plan includes a fully isolated Hermes instance, automatic
            updates, and a custom subdomain. Upgrade or cancel anytime.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'relative flex flex-col rounded-xl border p-6 transition-all',
                plan.popular
                  ? 'border-violet-500/50 bg-violet-950/30 glow'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-violet-600 text-white border-0 shadow-lg shadow-violet-500/30">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Zap
                    className={cn(
                      'h-4 w-4',
                      plan.popular ? 'text-violet-400' : 'text-white/40'
                    )}
                  />
                  <span className="text-sm font-medium text-white/60 uppercase tracking-wider">
                    {plan.name}
                  </span>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-white/40 mb-1">/mo</span>
                </div>
                <p className="mt-2 text-sm text-white/50">{plan.description}</p>
              </div>

              <ul className="mb-6 flex-1 space-y-2">
                {[
                  `${plan.vcpu} vCPU`,
                  `${plan.ram} GB RAM`,
                  `${plan.storage} GB SSD`,
                  'Custom subdomain',
                  'Auto HTTPS / SSL',
                  'Automatic updates',
                  'Priority support',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-white/70">
                    <Check className="h-4 w-4 shrink-0 text-violet-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleCheckout(plan.id)}
                disabled={loading !== null}
                variant={plan.popular ? 'default' : 'outline'}
                className={cn(
                  'w-full',
                  plan.popular && 'shadow-lg shadow-violet-500/30'
                )}
              >
                {loading === plan.id ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Redirecting…
                  </span>
                ) : (
                  'Get Started'
                )}
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-white/40">
          All plans billed monthly. Cancel anytime. No setup fees.
        </p>
      </div>
    </section>
  )
}
