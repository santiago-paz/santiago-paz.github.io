import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'
import { getProjectSlugs } from '@/lib/data'
import { getPosts } from '@/lib/posts'
import { changedAt } from '@/lib/lastmod'

export const dynamic = 'force-static'

// `trailingSlash: true` makes /about canonical as /about/, so the sitemap has to
// agree — otherwise every entry here points at a URL that redirects.
const url = (path = ''): string =>
  path ? `${SITE.baseUrl}/${path}/` : `${SITE.baseUrl}/`

export default function sitemap(): MetadataRoute.Sitemap {
  // Only reached when git cannot date a page; see lib/lastmod.ts.
  const built = new Date()

  // Each page is dated by the sources that decide what it says, not by the
  // build. The project pages share data/projects.json, so they move together —
  // which is the truth: one file is what changed.
  const projects = changedAt(
    ['data/projects.json', 'app/projects/[slug]/page.tsx'],
    built,
  )
  const writing = changedAt(['content/posts', 'app/writing/page.tsx'], built)

  return [
    {
      url: url(),
      lastModified: changedAt(
        ['app/page.tsx', 'data/profile.json', 'data/projects.json', 'content/posts'],
        built,
      ),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: url('about'),
      lastModified: changedAt(
        [
          'app/about/page.tsx',
          'data/profile.json',
          'data/experience.json',
          'data/faq.json',
        ],
        built,
      ),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: url('writing'),
      lastModified: writing,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...getProjectSlugs().map((slug) => ({
      url: url(`projects/${slug}`),
      lastModified: projects,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...getPosts().map((post) => ({
      url: url(`writing/${post.slug}`),
      // A post that has never been edited since publication is best dated by
      // the date it carries, not by whenever the file happens to be touched.
      lastModified: changedAt(
        [`content/posts/${post.slug}.md`],
        new Date(`${post.date}T00:00:00Z`),
      ),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
