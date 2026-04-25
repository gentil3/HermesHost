'use client'

import { useState } from 'react'
import {
  ExternalLink,
  Copy,
  Check,
  Zap,
  Server,
  Activity,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Instance } from '@/types'
import { PLANS } from '@/types'
import { createBrowserClient } from '@/lib/supabase'

interface DashboardProps {
  instances: Instance[]
  email: string
}

function StatusBadge({ status }: { status: Instance['status'] }) {
  const map: Record<Instance['status'], { label: string; variant: 'success' | 'warning' | 'secondary' | 'destructive' | 'default' }> = {
    active: { label: 'Active', variant: 'success' },
    provisioning: { label: 'Provisioning…', variant: 'warning' },
    pending: { label: 'Pending', variant: 'secondary' },
    canceled: { label: 'Canceled', variant: 'destructive' },
    error: { label: 'Error', variant: 'destructive' },
  }
  const { label, variant } = map[status] ?? { label: status, variant: 'secondary' }
  return <Badge variant={variant}>{label}</Badge>
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="text-white/40 hover:text-white transition-colors">
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

export function Dashboard({ instances, email }: DashboardProps) {
  const supabase = createBrowserClient()

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-violet-400" />
            <span className="font-bold text-white">MyHermes</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/50">{email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-1.5" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Your Hermes Instances</h1>
          <p className="mt-1 text-white/50">
            Manage your deployed Hermes AI agents.
          </p>
        </div>

        {instances.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {instances.map((instance) => (
              <InstanceCard key={instance.id} instance={instance} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function InstanceCard({ instance }: { instance: Instance }) {
  const plan = PLANS.find((p) => p.id === instance.plan)

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{instance.subdomain ?? 'Provisioning…'}</CardTitle>
            <p className="text-xs text-white/40 mt-0.5">
              {plan?.name} Plan · {plan?.vcpu} vCPU / {plan?.ram}GB RAM
            </p>
          </div>
          <StatusBadge status={instance.status} />
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Specs */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Server, label: 'vCPU', value: plan?.vcpu ?? '—' },
            { icon: Activity, label: 'RAM', value: plan ? `${plan.ram}GB` : '—' },
            { icon: Activity, label: 'SSD', value: plan ? `${plan.storage}GB` : '—' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-lg bg-white/5 p-2.5 text-center">
              <p className="text-[10px] text-white/40 uppercase">{label}</p>
              <p className="text-sm font-semibold text-white mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        {/* Login URL */}
        {instance.login_url && (
          <div className="rounded-lg bg-white/5 p-3">
            <p className="text-[10px] text-white/40 uppercase mb-1">Instance URL</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs text-violet-300 truncate">
                {instance.login_url}
              </code>
              <CopyButton text={instance.login_url} />
            </div>
          </div>
        )}

        {/* CTA */}
        {instance.login_url && instance.status === 'active' ? (
          <a href={instance.login_url} target="_blank" rel="noopener noreferrer" className="block">
            <Button className="w-full" size="sm">
              Open Hermes
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
        ) : (
          <Button className="w-full" size="sm" disabled>
            {instance.status === 'provisioning' || instance.status === 'pending'
              ? 'Setting up your instance…'
              : 'Unavailable'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] py-20 text-center">
      <Zap className="h-10 w-10 text-violet-400/50 mb-4" />
      <h3 className="text-lg font-semibold text-white">No instances yet</h3>
      <p className="mt-1 text-sm text-white/50 max-w-sm">
        You don&apos;t have any Hermes instances. Purchase a plan to get started.
      </p>
      <a href="/#pricing" className="mt-6">
        <Button>Get Started</Button>
      </a>
    </div>
  )
}
