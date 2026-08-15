import { SITE } from './site'
import { getProfile, getExperience, type Project, type FaqItem } from './data'
import type { PostMeta } from './posts'

const profile = getProfile()
const experience = getExperience()
const PERSON_ID = `${SITE.baseUrl}/#person`

/**
 * Absolute URL for a site path.
 *
 * `trailingSlash: true` means page routes canonicalise with a trailing slash,
 * so we add one — but only for pages. Paths that name a file (`/llms.txt`,
 * `/santiago-paz.png`) are served as-is and must not gain a slash.
 */
/**
 * Open Graph image descriptor for a page.
 *
 * The cards are served from `og.png` route handlers rather than Next's
 * `opengraph-image` file convention on purpose: GitHub Pages picks the
 * Content-Type from the file extension alone, and the extensionless file the
 * convention emits is served as `application/octet-stream`, which stops
 * LinkedIn, Slack and X from rendering the preview at all.
 *
 * Pass the page path — `ogImage('/about')` → `/about/og.png`.
 */
export function ogImage(path = '', alt = `${profile.name} — ${profile.role}`) {
  const base = path.replace(/\/$/, '')
  return [{ url: `${base}/og.png`, width: 1200, height: 630, alt }]
}

export function absUrl(path = '/'): string {
  const hasExtension = /\.[a-z0-9]+$/i.test(path)
  const normalized = hasExtension || path.endsWith('/') ? path : `${path}/`
  return new URL(normalized, SITE.baseUrl).toString()
}

function countryCode(country: string): string {
  const map: Record<string, string> = { Germany: 'DE', Italy: 'IT' }
  return map[country] ?? country
}

/** The canonical Person entity — the anchor for "who is Santiago Paz". */
export function personJsonLd() {
  const [city, country = ''] = profile.location.split(',').map((s) => s.trim())
  const current = experience.roles.find((role) => !role.end)
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: profile.name,
    url: SITE.baseUrl,
    ...(profile.image ? { image: absUrl(profile.image) } : {}),
    jobTitle: profile.role,
    description: profile.about,
    email: `mailto:${profile.email}`,
    knowsAbout: profile.knowsAbout,
    ...(profile.awards.length
      ? { award: profile.awards.map((a) => `${a.title} (${a.org}, ${a.year})`) }
      : {}),
    sameAs: profile.sameAs,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressCountry: countryCode(country),
    },
    ...(current
      ? {
          worksFor: {
            '@type': 'Organization',
            name: current.company,
            ...(current.url ? { url: current.url } : {}),
          },
        }
      : {}),
    hasOccupation: experience.roles.map((role) => ({
      '@type': 'EmployeeRole',
      roleName: role.title,
      startDate: role.start,
      ...(role.end ? { endDate: role.end } : {}),
      description: role.note,
      worksFor: {
        '@type': 'Organization',
        name: role.company,
        ...(role.url ? { url: role.url } : {}),
      },
    })),
    alumniOf: experience.education.map((item) => ({
      '@type': 'EducationalOrganization',
      name: item.org,
    })),
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.baseUrl}/#website`,
    url: SITE.baseUrl,
    name: `${profile.name} — ${profile.role}`,
    description: SITE.description,
    inLanguage: 'en',
    publisher: { '@id': PERSON_ID },
  }
}

export function profilePageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${SITE.baseUrl}/#profilepage`,
    url: SITE.baseUrl,
    name: `${profile.name} — ${profile.role}`,
    inLanguage: 'en',
    mainEntity: { '@id': PERSON_ID },
  }
}

export function aboutPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${SITE.baseUrl}/about#aboutpage`,
    url: absUrl('/about'),
    name: `About ${profile.name}`,
    inLanguage: 'en',
    mainEntity: { '@id': PERSON_ID },
  }
}

export function faqPageJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absUrl(item.path),
    })),
  }
}

export function projectJsonLd(project: Project) {
  const external = [project.links.demo, project.links.repo].filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    headline: project.title,
    description: project.summary,
    url: absUrl(`/projects/${project.slug}`),
    keywords: project.stack.join(', '),
    author: { '@id': PERSON_ID },
    creator: { '@id': PERSON_ID },
    ...(external.length ? { sameAs: external } : {}),
  }
}

export function blogPostingJsonLd(post: PostMeta) {
  const url = absUrl(`/writing/${post.slug}`)
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.date,
    url,
    mainEntityOfPage: url,
    inLanguage: 'en',
    author: { '@id': PERSON_ID, '@type': 'Person', name: profile.name },
    publisher: { '@id': PERSON_ID },
  }
}

export function blogJsonLd(posts: PostMeta[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE.baseUrl}/writing#blog`,
    url: absUrl('/writing'),
    name: `Writing — ${profile.name}`,
    description:
      'Essays and notes on building production AI, plus the occasional more personal piece.',
    inLanguage: 'en',
    author: { '@id': PERSON_ID },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: absUrl(`/writing/${post.slug}`),
      datePublished: post.date,
    })),
  }
}
