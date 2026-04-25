-- Run this in your Supabase SQL editor to set up the database schema.

-- Instances table: one row per provisioned Hermes agent
create table if not exists public.instances (
  id                    uuid          default gen_random_uuid() primary key,
  user_id               uuid          references auth.users(id) on delete set null,
  email                 text          not null,
  plan                  text          not null check (plan in ('lite', 'pro', 'max', 'ultra')),
  stripe_customer_id    text,
  stripe_subscription_id text,
  coolify_project_id    text,
  subdomain             text,
  login_url             text,
  status                text          not null default 'pending'
                          check (status in ('pending', 'provisioning', 'active', 'canceled', 'error')),
  created_at            timestamptz   not null default now(),
  updated_at            timestamptz   not null default now()
);

-- Keep updated_at in sync
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger instances_updated_at
  before update on public.instances
  for each row execute function public.set_updated_at();

-- Row Level Security: users can only see their own instances
alter table public.instances enable row level security;

create policy "Users can read own instances"
  on public.instances for select
  using (auth.uid() = user_id);

create policy "Users can update own instances"
  on public.instances for update
  using (auth.uid() = user_id);

-- Service role can do everything (used by webhooks via supabaseAdmin)
-- No RLS policy needed — service role bypasses RLS by default.

-- Indexes for fast lookups
create index if not exists instances_user_id_idx       on public.instances (user_id);
create index if not exists instances_stripe_sub_idx    on public.instances (stripe_subscription_id);
create index if not exists instances_email_idx         on public.instances (email);
