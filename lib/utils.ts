import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(email: string): string {
  return email
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 20)
}

export function generateSubdomainSlug(email: string): string {
  const base = slugify(email)
  const suffix = Math.random().toString(36).slice(2, 7)
  return `${base}-${suffix}`
}
