import { getPosts } from '@/lib/posts'
import { getProfile } from '@/lib/data'
import { SITE } from '@/lib/site'
import { absUrl } from '@/lib/seo'

// Served from `rss.xml` rather than a bare route so GitHub Pages, which derives
// Content-Type from the file extension alone, answers with application/xml.
export const dynamic = 'force-static'

const escape = (s: string): string =>
  s.replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!,
  )

export function GET(): Response {
  const profile = getProfile()
  const posts = getPosts()
  const updated = posts[0]?.date

  const items = posts
    .map((post) => {
      const url = absUrl(`/writing/${post.slug}`)
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(post.summary)}</description>
      <category>${escape(post.kind)}</category>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Writing — ${escape(profile.name)}</title>
    <link>${absUrl('/writing')}</link>
    <atom:link href="${SITE.baseUrl}/writing/rss.xml" rel="self" type="application/rss+xml"/>
    <description>Essays and notes on building production AI, plus the occasional more personal piece.</description>
    <language>en</language>
    <managingEditor>${escape(profile.email)} (${escape(profile.name)})</managingEditor>
${updated ? `    <lastBuildDate>${new Date(`${updated}T00:00:00Z`).toUTCString()}</lastBuildDate>\n` : ''}${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
