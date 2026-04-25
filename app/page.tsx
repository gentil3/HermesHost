import Link from 'next/link'
import { ArrowRight, Lock, Zap, Globe, Shield, RefreshCw } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Pricing } from '@/components/Pricing'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const features = [
  {
    icon: Zap,
    title: 'Up in 60 seconds',
    description:
      'From payment to a live Hermes instance in under a minute. No DevOps, no config hell.',
  },
  {
    icon: Lock,
    title: 'Fully isolated',
    description:
      'Each instance runs in its own container with dedicated resources. Your data stays yours.',
  },
  {
    icon: Globe,
    title: 'Custom subdomain',
    description:
      'Get a clean URL like yourname.myhermes.app — shareable, bookmarkable, professional.',
  },
  {
    icon: Shield,
    title: 'Auto HTTPS',
    description:
      'SSL certificates provisioned and renewed automatically. Zero config required.',
  },
  {
    icon: RefreshCw,
    title: 'Automatic updates',
    description:
      'We push Hermes updates to your instance so you always run the latest version.',
  },
  {
    icon: ArrowRight,
    title: 'Instant scaling',
    description:
      'Upgrade your plan at any time and your instance scales up without any downtime.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Background glow */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full bg-fuchsia-600/5 blur-[100px]" />
      </div>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="animate-fade-in">
          <Badge className="mb-6">Now in public beta</Badge>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Your own Hermes AI agent.
            <br />
            <span className="gradient-text">Live in 60 seconds.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60 sm:text-xl">
            Stop sharing. Stop waiting. Deploy a private, fully managed Hermes AI
            agent on dedicated infrastructure — no DevOps required.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="#pricing">
              <Button size="lg" className="shadow-xl shadow-violet-500/30 min-w-[180px]">
                Start for $19/mo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="min-w-[180px]">
                See how it works
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-white/30">
            No credit card required to explore · Cancel anytime
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2 text-white/20">
          <div className="h-8 w-px bg-gradient-to-b from-white/0 to-white/20" />
          <span className="text-xs">scroll to explore</span>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 border-t border-white/5">
        <div className="container">
          <div className="mb-16 text-center">
            <Badge className="mb-4">Why MyHermes</Badge>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Everything managed.{' '}
              <span className="gradient-text">Nothing to configure.</span>
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-white/5 bg-white/[0.03] p-6 transition-all hover:border-white/10 hover:bg-white/[0.06]"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600/20">
                  <feature.icon className="h-5 w-5 text-violet-400" />
                </div>
                <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-white/50">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 border-t border-white/5">
        <div className="container">
          <div className="mb-16 text-center">
            <Badge className="mb-4">How it works</Badge>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Three steps to your agent
            </h2>
          </div>

          <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Pick a plan',
                description: 'Choose the compute tier that fits your workload.',
              },
              {
                step: '02',
                title: 'Complete checkout',
                description: 'Secure payment via Stripe. Takes 30 seconds.',
              },
              {
                step: '03',
                title: 'Get your URL',
                description:
                  'Your Hermes instance is live. Check your email for the link.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-violet-500/30 bg-violet-600/10">
                  <span className="text-sm font-bold text-violet-400">{item.step}</span>
                </div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-white/50">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <div className="border-t border-white/5">
        <Pricing />
      </div>

      {/* CTA */}
      <section className="py-24 border-t border-white/5">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to deploy your agent?
          </h2>
          <p className="mt-4 text-white/50">
            Join hundreds of teams running Hermes on MyHermes.
          </p>
          <div className="mt-8">
            <Link href="#pricing">
              <Button size="lg" className="shadow-xl shadow-violet-500/30">
                Deploy Now — From $19/mo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-white/40">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">MyHermes</span>
          </div>
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} MyHermes. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-white/30">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
