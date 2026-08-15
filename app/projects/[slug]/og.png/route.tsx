import { getProject, getProjectSlugs } from '@/lib/data'
import { ogCard } from '@/lib/og-card'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const project = getProject(slug)
  return ogCard({
    eyebrow: 'Project',
    title: project?.title ?? 'Project',
    subtitle: project?.stack.slice(0, 4).join(' · '),
    footer: 'santiagopaz.com · Santiago Paz',
  })
}
