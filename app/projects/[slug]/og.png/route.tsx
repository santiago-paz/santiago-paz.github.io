import { getProject, getProjectSlugs } from '@/lib/data'
import { ogCard } from '@/lib/og-card'
import { colorwayOf, hallmarksOf, screenOf } from '@/lib/plates'

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
  if (!project) return ogCard({ title: 'Project' })
  return ogCard({
    title: project.title,
    subtitle: project.role,
    // Standing and code only: a long domain would wrap off the card.
    marks: [
      ...hallmarksOf(project).statuses.map((status) => status.label),
      ...(project.links.repo ? [{ label: 'Code', link: true as const }] : []),
    ],
    colorway: colorwayOf(project.slug),
    image: screenOf(project.slug) ? { kind: 'screen', slug: project.slug } : undefined,
  })
}
