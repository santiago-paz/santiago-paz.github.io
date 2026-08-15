import { getProfile } from '@/lib/data'
import { ogCard } from '@/lib/og-card'

export const dynamic = 'force-static'

export function GET() {
  const profile = getProfile()
  return ogCard({
    eyebrow: profile.role,
    title: profile.name,
    subtitle: profile.tagline,
    footer: `${profile.location} · EU work-authorized`,
    withPhoto: true,
  })
}
