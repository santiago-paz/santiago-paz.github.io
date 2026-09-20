import Link from 'next/link'
import type { Project } from '@/lib/data'
import { colorwayOf, hallmarksOf, screenOf } from '@/lib/plates'
import { Mark, LinkMark } from './Mark'
import { Icon } from './Icon'

/**
 * The maker's mark and the project's hallmarks, struck as one row:
 * SP, then its standing (pale while it is not yet live), then its code.
 */
export function Hallmarks({
  project,
  small,
  strike,
}: {
  project: Project
  small?: boolean
  /** Only the hero register and the plates' own rows are struck. */
  strike?: boolean
}) {
  const { statuses, code } = hallmarksOf(project)
  return (
    <ul
      className={`hallmarks${small ? ' hallmarks--small' : ''}`}
      aria-label="Marks"
      data-strike={strike ? '' : undefined}
    >
      <li>
        <Mark tone="maker" i={0} srLabel="Built by Santiago Paz">SP</Mark>
      </li>
      {statuses.map((status, index) => (
        <li key={status.label}>
          <Mark tone={status.pale ? 'pale' : 'status'} i={index + 1}>
            {status.label}
          </Mark>
        </li>
      ))}
      {code ? (
        <li>
          <LinkMark href={code} i={statuses.length + 1}>
            Code<span className="sr-only"> for {project.title}</span>
          </LinkMark>
        </li>
      ) : null}
    </ul>
  )
}

/** Where to check the piece yourself: the live product, on its own line. */
export function AssayMark({ project }: { project: Project }) {
  const { live } = hallmarksOf(project)
  if (!live) return null
  return (
    <p className="assay">
      <LinkMark href={live.href} domain>
        {live.label}
      </LinkMark>
    </p>
  )
}

/** The layers built, stacked like courses: the base at the bottom. */
export function BuiltStack({ project }: { project: Project }) {
  return (
    <div className="built">
      <p className="built__label" id={`${project.slug}-built`}>
        Layers built
      </p>
      <ol className="built__stack" aria-labelledby={`${project.slug}-built`}>
        {project.built.map((layer) => (
          <li key={layer}>
            <Mark tone="layer">{layer}</Mark>
          </li>
        ))}
        {project.planned?.map((layer) => (
          <li key={layer}>
            <Mark tone="pale" srLabel={`${layer}, not built yet`}>
              {layer}
            </Mark>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Screen({ project, lead }: { project: Project; lead?: boolean }) {
  const screen = screenOf(project.slug)
  if (!screen) return null
  return (
    <div className="plate__media">
      <figure className="screen">
        <picture>
          <source
            media="(max-width: 759px)"
            srcSet={screen.mobile.src}
            width={screen.mobile.width}
            height={screen.mobile.height}
          />
          {/* A static export serves plain files, so the responsive set is written by hand. */}
          <img
            src={screen.src}
            srcSet={screen.srcSet}
            sizes="(max-width: 759px) 340px, (max-width: 1240px) 70vw, 900px"
            width={screen.width}
            height={screen.height}
            alt={screen.alt}
            loading={lead ? 'eager' : 'lazy'}
            fetchPriority={lead ? 'high' : undefined}
            decoding="async"
          />
        </picture>
      </figure>
    </div>
  )
}

function Register({ project }: { project: Project }) {
  if (!project.register) return null
  return (
    <div className="plate__media plate__media--register">
      <div className="domains">
        <ol className="domains__list">
          {project.register.map((entry) => (
            <li key={entry.mark} className="domains__row">
              <Mark tone="layer" code>
                {entry.mark}
              </Mark>
              <p>{entry.text}</p>
            </li>
          ))}
        </ol>
        {project.registerNote ? <p className="domains__note">{project.registerNote}</p> : null}
      </div>
    </div>
  )
}

/**
 * A project as a specimen plate in its own colors: the name and its hallmarks
 * across the top, the piece itself below, and the layers built standing beside it.
 */
export function Plate({
  project,
  lead,
  as: Heading = 'h3',
}: {
  project: Project
  lead?: boolean
  as?: 'h1' | 'h3'
}) {
  const headingId = `${project.slug}-title`
  const onDetailPage = Heading === 'h1'
  const bare = !screenOf(project.slug) && !project.register
  const classes = ['plate', `cw-${colorwayOf(project.slug)}`]
  if (onDetailPage) classes.push('plate--detail')
  if (bare) classes.push('plate--bare')
  return (
    <article className={classes.join(' ')} aria-labelledby={headingId}>
      <div className="plate__inner">
        <header className="plate__head">
          {onDetailPage ? (
            <Link href="/#work" className="backlink">
              <Icon name="arrow-left" />
              All work
            </Link>
          ) : null}
          <div className="plate__title">
            <Heading className="plate__name" id={headingId} translate="no">
              {onDetailPage ? (
                project.title
              ) : (
                <Link href={`/projects/${project.slug}`}>{project.title}</Link>
              )}
            </Heading>
            <Hallmarks project={project} strike />
          </div>
          <div className="plate__lede">
            <p className="plate__summary">{project.summary}</p>
            <AssayMark project={project} />
          </div>
        </header>
        <div className="plate__body">
          <Screen project={project} lead={lead} />
          <Register project={project} />
          <div className="plate__stack">
            <BuiltStack project={project} />
            {onDetailPage ? null : (
              <Link href={`/projects/${project.slug}`} className="plate__more">
                Project details<span className="sr-only">: {project.title}</span>
                <Icon name="arrow-right" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
