import { getProfile } from '@/lib/data'
import { ogCard } from '@/lib/og-card'

export const dynamic = 'force-static'

export function GET() {
  const profile = getProfile()
  return ogCard({
    eyebrow: 'About',
    title: profile.name,
    subtitle: '13 years shipping production software · now building production AI',
    footer: `${profile.location} · EU work-authorized`,
    withPhoto: true,
  })
}
