import { SITE } from './site'
import { getProfile, getExperience, type Project, type FaqItem } from './data'
import { screenOf } from './plates'
import type { PostMeta } from './posts'

const profile = getProfile()
const experience = getExperience()
const PERSON_ID = `${SITE.baseUrl}/#person`

/**
 * `alternates` for a page — canonical plus feed autodiscovery.
 *
 * Next merges metadata shallowly, so a page setting `alternates.canonical`
 * replaces the root layout's whole `alternates` object and silently drops the
 * RSS `types` entry. Going through this helper keeps both on every page.
 */
export function alternates(path = '/') {
  return {
    canonical: path,
    types: { 'application/rss+xml': `${SITE.baseUrl}/writing/rss.xml` },
  }
}

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
export function ogImage(path = '', alt = `${profile.name} - ${profile.role}`) {
  const base = path.replace(/\/$/, '')
  return [{ url: `${base}/og.png`, width: 1200, height: 630, alt }]
}

/**
 * Absolute URL for a site path.
 *
 * `trailingSlash: true` means page routes canonicalise with a trailing slash,
 * so we add one — but only for pages. Paths that name a file (`/llms.txt`,
 * `/santiago-paz.png`) are served as-is and must not gain a slash.
 */
export function absUrl(path = '/'): string {
  const hasExtension = /\.[a-z0-9]+$/i.test(path)
  const normalized = hasExtension || path.endsWith('/') ? path : `${path}/`
  return new URL(normalized, SITE.baseUrl).toString()
}

function countryCode(country: string): string {
  const map: Record<string, string> = { Germany: 'DE', Italy: 'IT' }
  return map[country] ?? country
}

type RoleEntry = (typeof experience.roles)[number]

/**
 * An employer. The company's own URL doubles as the `@id`, so the same company
 * named by two different jobs resolves to one node instead of two.
 */
function organization(role: RoleEntry) {
  return {
    '@type': 'Organization',
    ...(role.url ? { '@id': role.url, url: role.url } : {}),
    name: role.company,
  }
}

/** The canonical Person entity — the anchor for "who is Santiago Paz". */
export function personJsonLd() {
  const [city, country = ''] = profile.location.split(',').map((s) => s.trim())
  const current = experience.roles.find((role) => !role.end)
  const roles = experience.roles.map((role) => ({
    '@type': 'EmployeeRole',
    roleName: role.title,
    startDate: role.start,
    ...(role.end ? { endDate: role.end } : {}),
    description: role.note,
    worksFor: organization(role),
  }))
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: profile.name,
    url: SITE.baseUrl,
    ...(profile.image ? { image: absUrl(profile.image) } : {}),
    // The target role first, then whatever the CV lists as the current title —
    // hardcoding the second one lets it drift out of sync with experience.json.
    jobTitle: [profile.role, ...(current ? [current.title] : [])],
    description: profile.about,
    email: `mailto:${profile.email}`,
    knowsAbout: profile.knowsAbout,
    knowsLanguage: profile.languages.map((l) => ({
      '@type': 'Language',
      name: l.name,
      alternateName: l.code,
    })),
    ...(profile.awards.length
      ? { award: profile.awards.map((a) => `${a.title} (${a.org}, ${a.year})`) }
      : {}),
    sameAs: profile.sameAs,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressCountry: countryCode(country),
    },
    // Berlin is where he lives; Italy is what lets him work anywhere in the EU
    // without sponsorship. A recruiter's first filter, so it gets stated twice:
    // once in the FAQ prose, once here where a machine can read it.
    nationality: { '@type': 'Country', name: 'Italy' },
    // The whole employment history, as schema.org's role pattern: a Role stands
    // where the plain value would go, and repeats the property it stands for —
    // so `worksFor` holds roles, and each role's own `worksFor` holds the
    // employer. Hanging the employer off `hasOccupation` instead, which is what
    // this used to do, is what schema.org's validator rejects: `worksFor` is
    // not a property of EmployeeRole, so the employer was dropped nine times
    // over, once per job.
    //
    // The current employer also appears plainly, ahead of the roles, so a
    // reader that wants one answer to "who does he work for" gets it without
    // unwrapping anything. Both point at the same node: the company URL is the
    // `@id`, so Dialpad-the-employer and Dialpad-in-2022 merge rather than
    // becoming two companies with one name.
    ...(current ? { worksFor: [organization(current), ...roles] } : {}),
    hasOccupation: {
      '@type': 'Occupation',
      name: profile.role,
      // O*NET-SOC 15-1252.00, "Software Developers": the standard code, so the
      // occupation resolves to a known thing rather than a job title we made up.
      occupationalCategory: '15-1252.00',
    },
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
    name: `${profile.name} - ${profile.role}`,
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
    name: `${profile.name} - ${profile.role}`,
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
  // The same screen the page shows, so the markup describes the page rather
  // than a second, invisible version of it.
  const screen = screenOf(project.slug)
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    headline: project.title,
    description: project.summary,
    url: absUrl(`/projects/${project.slug}`),
    keywords: project.stack.join(', '),
    ...(screen
      ? {
          image: {
            '@type': 'ImageObject',
            url: absUrl(screen.src),
            width: screen.width,
            height: screen.height,
            caption: screen.alt,
          },
        }
      : {}),
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
    name: `Writing - ${profile.name}`,
    description:
      'Essays and notes on engineering, plus the occasional more personal piece.',
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
