import { ogCard } from '@/lib/og-card'

export const dynamic = 'force-static'

export function GET() {
  return ogCard({
    title: 'Writing',
    subtitle: 'Notes on engineering, and the occasional more personal piece.',
  })
}
