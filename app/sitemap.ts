import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'
import { getProjectSlugs } from '@/lib/data'
import { getPostSlugs } from '@/lib/posts'

export const dynamic = 'force-static'

// `trailingSlash: true` makes /about canonical as /about/, so the sitemap has to
// agree — otherwise every entry here points at a URL that redirects.
const url = (path = ''): string =>
  path ? `${SITE.baseUrl}/${path}/` : `${SITE.baseUrl}/`

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    {
      url: url(),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: url('about'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: url('writing'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...getProjectSlugs().map((slug) => ({
      url: url(`projects/${slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...getPostSlugs().map((slug) => ({
      url: url(`writing/${slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
