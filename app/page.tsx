import type { Metadata } from 'next'
import Link from 'next/link'
import { getProfile, getProjects } from '@/lib/data'
import { getPosts, formatDate } from '@/lib/posts'
import { JsonLd } from '@/components/JsonLd'
import { profilePageJsonLd, alternates } from '@/lib/seo'

export const metadata: Metadata = {
  alternates: alternates('/'),
}

export default function HomePage() {
  const profile = getProfile()
  const projects = getProjects()
  const posts = getPosts().slice(0, 3)

  return (
    <main className="wrap">
      <JsonLd data={profilePageJsonLd()} />
      <section>
        <p className="eyebrow">{profile.role}</p>
        <h1 className="hero-name">{profile.name}</h1>
        <p className="hero-tagline">{profile.tagline}</p>
        <p className="about">{profile.about}</p>
        <dl className="ledger">
          <dt>Location</dt>
          <dd>
            {profile.location} — {profile.workAuthorization}
          </dd>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </dd>
          <dt>Links</dt>
          <dd>
            <a href={profile.links.github} target="_blank" rel="noreferrer">
              GitHub
            </a>{' '}
            ·{' '}
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>{' '}
            · <a href={profile.links.cv}>CV</a>
          </dd>
        </dl>
      </section>

      <section id="work">
        <h2 className="sec">Selected work</h2>
        <div className="work-list">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="work-item"
            >
              <div className="row">
                <h3>{project.title}</h3>
                <span className="arrow" aria-hidden>
                  →
                </span>
              </div>
              <p>{project.summary}</p>
              <div className="stack">{project.stack.slice(0, 4).join(' · ')}</div>
            </Link>
          ))}
        </div>
      </section>

      <section id="writing">
        <h2 className="sec">Writing</h2>
        <div className="post-list">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}`}
              className={`post-item${post.kind === 'personal' ? ' personal' : ''}`}
            >
              <span className="date">{formatDate(post.date)}</span>
              <span className="ptitle">{post.title}</span>
              <span className="kind">{post.kind}</span>
              <p className="pdek">{post.summary}</p>
            </Link>
          ))}
        </div>
        <Link href="/writing" className="more">
          All writing →
        </Link>
      </section>
    </main>
  )
}
