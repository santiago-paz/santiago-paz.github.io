import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProject, getProjectSlugs } from '@/lib/data'
import { Markdown } from '@/components/Markdown'
import { JsonLd } from '@/components/JsonLd'
import { Plate } from '@/components/Plate'
import { projectJsonLd, breadcrumbJsonLd, ogImage, alternates } from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}
  const path = `/projects/${project.slug}`
  return {
    title: project.title,
    description: project.summary,
    alternates: alternates(path),
    openGraph: {
      type: 'article',
      title: project.title,
      description: project.summary,
      url: path,
      images: ogImage(path, project.title),
    },
    // `card` has to be repeated: page-level `twitter` shallowly replaces the
    // root layout's object, so omitting it silently downgrades to `summary`.
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.summary,
      images: ogImage(path, project.title),
    },
  }
}

/** "A, B and C": the stack reads as a sentence, in its own spelling. */
function listOf(items: string[]): string {
  if (items.length < 2) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  return (
    <main id="main-content" tabIndex={-1}>
      <JsonLd
        data={[
          projectJsonLd(project),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: project.title, path: `/projects/${project.slug}` },
          ]),
        ]}
      />
      <Plate project={project} as="h1" lead />

      <div className="detail">
        <div className="detail__side">
          <section aria-labelledby="role-title">
            <h2 id="role-title">Role</h2>
            <p className="role">{project.role}</p>
          </section>
          <section aria-labelledby="stack-title">
            <h2 id="stack-title">Stack</h2>
            <p className="stack-line">{listOf(project.stack)}.</p>
          </section>
        </div>
        <div className="detail__main">
          {project.disclosure ? <p className="disclosure">{project.disclosure}</p> : null}
          <section aria-labelledby="highlights-title">
            <h2 id="highlights-title">Highlights</h2>
            <ul className="highlights">
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="overview-title">
            <h2 id="overview-title">Overview</h2>
            <Markdown>{project.description}</Markdown>
          </section>
        </div>
      </div>
    </main>
  )
}
