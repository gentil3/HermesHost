import type { ProvisionResult } from '@/types'
import { generateSubdomainSlug } from './utils'

const API = process.env.COOLIFY_API_URL!
const TOKEN = process.env.COOLIFY_API_TOKEN!
const SERVER_UUID = process.env.COOLIFY_SERVER_UUID!
const TEMPLATE_UUID = process.env.COOLIFY_TEMPLATE_APP_UUID!
const GIT_REPO = process.env.HERMES_GIT_REPO!
const GIT_BRANCH = process.env.HERMES_GIT_BRANCH ?? 'main'
const BASE_DOMAIN = process.env.BASE_DOMAIN!

function headers() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
}

async function coolifyFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, { ...init, headers: headers() })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Coolify API error ${res.status} on ${path}: ${body}`)
  }
  return res.json()
}

export async function createHermesInstance(
  email: string,
  plan: string
): Promise<ProvisionResult> {
  const slug = generateSubdomainSlug(email)
  const subdomain = `${slug}.myhermes.${BASE_DOMAIN}`
  const fqdn = `https://${subdomain}`

  // 1. Create isolated project
  const project = await coolifyFetch('/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify({
      name: `hermes-${slug}`,
      description: `MyHermes · ${plan} plan · ${email}`,
    }),
  })

  const projectUuid: string = project.uuid

  // 2. Deploy Hermes application into the new project
  //    If you have a template app UUID, clone it; otherwise deploy from git.
  let appUuid: string

  if (TEMPLATE_UUID) {
    try {
      const cloned = await coolifyFetch('/api/v1/applications/clone', {
        method: 'POST',
        body: JSON.stringify({
          source_uuid: TEMPLATE_UUID,
          destination_project_uuid: projectUuid,
          destination_server_uuid: SERVER_UUID,
          destination_environment: 'production',
          name: `hermes-${slug}`,
          fqdn,
        }),
      })
      appUuid = cloned.uuid
    } catch {
      // Fall back to fresh git deploy if clone endpoint unavailable
      appUuid = await deployFromGit(projectUuid, slug, fqdn, plan, email)
    }
  } else {
    appUuid = await deployFromGit(projectUuid, slug, fqdn, plan, email)
  }

  // 3. Trigger deploy
  await coolifyFetch(`/api/v1/applications/${appUuid}/start`, {
    method: 'POST',
  })

  return {
    projectId: projectUuid,
    subdomain,
    loginUrl: fqdn,
  }
}

async function deployFromGit(
  projectUuid: string,
  slug: string,
  fqdn: string,
  plan: string,
  email: string
): Promise<string> {
  const app = await coolifyFetch('/api/v1/applications', {
    method: 'POST',
    body: JSON.stringify({
      project_uuid: projectUuid,
      server_uuid: SERVER_UUID,
      environment_name: 'production',
      name: `hermes-${slug}`,
      git_repository: GIT_REPO,
      git_branch: GIT_BRANCH,
      build_pack: 'dockerfile',
      fqdn,
      ports_exposes: '3000',
      instant_deploy: false,
      environment_variables: [
        { key: 'HERMES_PLAN', value: plan },
        { key: 'HERMES_OWNER', value: email },
        { key: 'HERMES_SLUG', value: slug },
      ],
    }),
  })
  return app.uuid
}

export async function deleteHermesInstance(projectUuid: string): Promise<void> {
  await coolifyFetch(`/api/v1/projects/${projectUuid}`, { method: 'DELETE' })
}
