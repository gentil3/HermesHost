export type Plan = 'lite' | 'pro' | 'max' | 'ultra'

export interface PlanConfig {
  id: Plan
  name: string
  price: number
  vcpu: number
  ram: number
  storage: number
  popular?: boolean
  description: string
}

export const PLANS: PlanConfig[] = [
  {
    id: 'lite',
    name: 'Lite',
    price: 19,
    vcpu: 2,
    ram: 4,
    storage: 40,
    description: 'Perfect for personal projects and light workloads.',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 37,
    vcpu: 4,
    ram: 8,
    storage: 80,
    description: 'For teams running production agents at scale.',
  },
  {
    id: 'max',
    name: 'Max',
    price: 75,
    vcpu: 8,
    ram: 16,
    storage: 160,
    popular: true,
    description: 'Maximum performance for demanding AI workloads.',
  },
  {
    id: 'ultra',
    name: 'Ultra',
    price: 129,
    vcpu: 16,
    ram: 32,
    storage: 320,
    description: 'Dedicated high-spec server, bare-metal performance.',
  },
]

export interface Instance {
  id: string
  user_id: string | null
  email: string
  plan: Plan
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  coolify_project_id: string | null
  subdomain: string | null
  login_url: string | null
  status: 'pending' | 'provisioning' | 'active' | 'canceled' | 'error'
  created_at: string
}

export interface ProvisionResult {
  projectId: string
  subdomain: string
  loginUrl: string
}

export interface CheckoutRequest {
  plan: Plan
  email?: string
}

export interface CheckoutResponse {
  url: string
}
