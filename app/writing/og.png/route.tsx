import { ogCard } from '@/lib/og-card'

export const dynamic = 'force-static'

export function GET() {
  return ogCard({
    eyebrow: 'Writing',
    title: 'Notes on building production AI',
    subtitle: 'Essays on evals, agents and retrieval — plus the occasional personal piece.',
    footer: 'santiagopaz.com · Santiago Paz',
  })
}
