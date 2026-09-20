import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'

export const dynamic = 'force-static'

// We WANT to be discoverable by search and AI answer engines, so every known
// crawler — including the AI training/search bots — is explicitly allowed.
const AI_AND_SEARCH_BOTS = [
  'Googlebot',
  'Bingbot',
  'DuckDuckBot',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'Amazonbot',
  'meta-externalagent',
  'CCBot',
]

// The static export writes each page's React payload next to it as plain text:
// `/index.txt`, `/about/index.txt`, `/about/__next.about.txt` and so on. A
// static host answers those with 200 text/plain, so they are a full, crawlable
// copy of every page — the same words, no markup, no canonical to point home.
// Nothing links to them and the browser fetches them regardless of robots.txt,
// so the only thing blocking costs us is duplicate copies in the index.
//
// `/_next/` has a single underscore and stays crawlable: Googlebot needs the
// CSS and JS to render the pages.
const RSC_PAYLOADS = ['/*__next.*', '/*index.txt$']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: RSC_PAYLOADS },
      ...AI_AND_SEARCH_BOTS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: RSC_PAYLOADS,
      })),
    ],
    sitemap: `${SITE.baseUrl}/sitemap.xml`,
    host: SITE.baseUrl,
  }
}
