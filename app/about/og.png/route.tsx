import { getProfile } from '@/lib/data'
import { ogCard } from '@/lib/og-card'

export const dynamic = 'force-static'

export function GET() {
  const profile = getProfile()
  return ogCard({
    title: `About ${profile.name}`,
    subtitle: 'Senior full-stack engineer. 13 years shipping production software.',
    marks: [profile.location.split(',')[0], 'EU work permit', '13 yrs'],
    image: { kind: 'portrait' },
  })
}
