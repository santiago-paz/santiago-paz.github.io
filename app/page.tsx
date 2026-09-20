import type { Metadata } from 'next'
import Link from 'next/link'
import { getProfile, getProjects } from '@/lib/data'
import { getPosts, formatDate } from '@/lib/posts'
import { cvSizeLabel, colorwayOf, screenOf } from '@/lib/plates'
import { JsonLd } from '@/components/JsonLd'
import { FactRegister } from '@/components/FactRegister'
import { Plate, Hallmarks, AssayMark } from '@/components/Plate'
import { Mark } from '@/components/Mark'
import { Icon } from '@/components/Icon'
import { profilePageJsonLd, alternates } from '@/lib/seo'

export const metadata: Metadata = { alternates: alternates('/') }

export default function HomePage() {
  const profile = getProfile()
  const projects = getProjects()
  const posts = getPosts().slice(0, 3)
  const cvLabel = cvSizeLabel()
  const [first, ...rest] = projects
  // The CV opens with three projects, so the site does too; the rest follow on the bench.
  const featured = rest.slice(0, 2)
  const bench = rest.slice(2)
  const liveCount = projects.filter((project) => project.links.demo).length
  const [firstName, ...lastNames] = profile.name.split(' ')

  return (
    <main id="main-content" tabIndex={-1}>
      <JsonLd data={profilePageJsonLd()} />

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__who">
          <h1 className="hero__name" id="hero-title" translate="no">
            <span>{firstName}</span> <span>{lastNames.join(' ')}</span>
          </h1>
          <p className="hero__role">{profile.role} in {profile.location.split(',')[0]}.</p>
          <p className="hero__tagline">{profile.tagline}</p>
          <div className="actions hero__actions">
            <a className="button" href={profile.links.cv} download="Santiago-Paz-CV.pdf">
              <span className="button__face">
                <Icon name="download" />
                Download CV
                <span className="button__meta">{cvLabel}</span>
              </span>
            </a>
            <a className="text-action" href={`mailto:${profile.email}`}>
              <Icon name="mail" />
              Email me
            </a>
          </div>
        </div>
        <div className="hero__facts">
          <FactRegister profile={profile} portrait strike />
        </div>
      </section>

      <section id="work" className="work" aria-labelledby="work-title">
        <div className="work__head">
          <h2 className="section-title" id="work-title">Work</h2>
          <p>
            {projects.length} projects, each built alone. {liveCount} run live today.
          </p>
        </div>

        <Plate project={first} lead />
        {featured.map((project) => (
          <Plate key={project.slug} project={project} />
        ))}

        <div className="bench">
          <h3 className="bench__title">More projects</h3>
          <ul className="bench__list">
            {bench.map((project) => {
              const screen = screenOf(project.slug)
              return (
                <li
                  key={project.slug}
                  className={`bench__row cw-${colorwayOf(project.slug)}${screen ? ' bench__row--live' : ''}`}
                >
                  <div className="bench__text">
                    <div className="bench__main">
                      <h4 className="bench__name" translate="no">
                        <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                      </h4>
                      <Hallmarks project={project} small />
                    </div>
                    <div className="bench__lede">
                      <p className="bench__summary">{project.summary}</p>
                      <AssayMark project={project} />
                    </div>
                  </div>
                  {screen ? (
                    <figure className="bench__screen screen">
                      <picture>
                        <source
                          media="(max-width: 759px)"
                          srcSet={screen.mobile.src}
                          width={screen.mobile.width}
                          height={screen.mobile.height}
                        />
                        <img
                          src={screen.src}
                          srcSet={screen.srcSet}
                          sizes="(max-width: 759px) 280px, 440px"
                          width={screen.width}
                          height={screen.height}
                          alt={screen.alt}
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                    </figure>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* With no posts yet, the section is left out rather than shown empty. */}
      {posts.length ? (
        <section id="writing" className="writing" aria-labelledby="writing-title">
          <div className="section-head">
            <h2 className="section-title" id="writing-title">Writing</h2>
            <Link href="/writing/" className="text-action">
              All writing
              <Icon name="arrow-right" />
            </Link>
          </div>
          <ol className="posts">
            {posts.map((post, index) => (
              <li key={post.slug} className="post-row">
                <Mark tone="date" i={index}>
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </Mark>
                <div>
                  <h3 className="post-row__title">
                    <Link href={`/writing/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="post-row__summary">{post.summary}</p>
                  <p className="post-row__kind">{post.kind === 'personal' ? 'Personal' : 'Engineering'}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="close" aria-labelledby="contact-title">
        <div className="close__inner">
          <div>
            <h2 className="section-title" id="contact-title">Contact</h2>
            <p className="close__lead">{profile.availability}</p>
            <p className="close__detail">Italian citizen, so no visa sponsorship is needed.</p>
            <div className="actions">
              <a className="button button--inverse" href={`mailto:${profile.email}`}>
                <span className="button__face">
                  <Icon name="mail" />
                  Email me
                </span>
              </a>
              <a className="text-action" href={profile.links.cv} download="Santiago-Paz-CV.pdf">
                <Icon name="download" />
                Download CV ({cvLabel})
              </a>
            </div>
            <p className="close__address">{profile.email}</p>
          </div>
          <div className="close__stamp" aria-hidden="true">
            <Mark tone="maker" large>SP</Mark>
          </div>
        </div>
      </section>
    </main>
  )
}
