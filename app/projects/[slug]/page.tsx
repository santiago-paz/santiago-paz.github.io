import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProject, getProjectSlugs, GROUP_LABELS } from '@/lib/data'
import { Markdown } from '@/components/Markdown'
import { JsonLd } from '@/components/JsonLd'
import { projectJsonLd, breadcrumbJsonLd, ogImage } from '@/lib/seo'

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
    alternates: { canonical: path },
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

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  return (
    <main className="wrap">
      <JsonLd
        data={[
          projectJsonLd(project),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: project.title, path: `/projects/${project.slug}` },
          ]),
        ]}
      />
      <Link href="/#work" className="backlink">
        ‹ Work
      </Link>

      <header className="detail-head">
        <p className="eyebrow">{GROUP_LABELS[project.group]}</p>
        <h1 className="detail-title">{project.title}</h1>
        <p className="detail-summary">{project.summary}</p>
        <p className="detail-role">
          Role — <b>{project.role}</b>
        </p>
        {project.disclosure ? (
          <p className="detail-disclosure">{project.disclosure}</p>
        ) : null}
        <ul className="stack-tags">
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </header>

      <h2 className="sec">Highlights</h2>
      <ul className="highlights">
        {project.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>

      <h2 className="sec">Overview</h2>
      <Markdown>{project.description}</Markdown>

      {project.links.demo || project.links.repo ? (
        <div className="detail-links">
          {project.links.demo ? (
            <a href={project.links.demo} target="_blank" rel="noreferrer">
              Live demo ↗
            </a>
          ) : null}
          {project.links.repo ? (
            <a href={project.links.repo} target="_blank" rel="noreferrer">
              Code ↗
            </a>
          ) : null}
        </div>
      ) : null}
    </main>
  )
}
