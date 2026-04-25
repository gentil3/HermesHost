import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { Dashboard } from '@/components/Dashboard'
import type { Instance } from '@/types'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const supabase = await createServerClient()
  const params = await searchParams

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If the user just returned from Stripe and is not authenticated yet,
  // send a magic link and show a "check your email" page.
  if (!user) {
    if (params.session_id) {
      return <CheckEmailPage />
    }
    redirect('/')
  }

  const { data: instances } = await supabase
    .from('instances')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <Dashboard
      instances={(instances as Instance[]) ?? []}
      email={user.email ?? ''}
    />
  )
}

function CheckEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-600/10 blur-[120px] -z-10" />

      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 max-w-md w-full">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-violet-600/20">
          <svg className="h-8 w-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white">Check your email</h1>
        <p className="mt-3 text-white/60">
          Payment confirmed! We&apos;re spinning up your Hermes instance now.
          We&apos;ve sent a login link to your email — click it to access your
          dashboard.
        </p>

        <div className="mt-6 rounded-lg bg-white/5 p-4">
          <p className="text-sm text-white/40">
            Didn&apos;t get it? Check your spam folder or{' '}
            <a href="/" className="text-violet-400 hover:underline">
              go back home
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
