import { getProfile, getProjects, getExperience } from '@/lib/data'
import { getPosts } from '@/lib/posts'
import { absUrl } from '@/lib/seo'
import { changedAt } from '@/lib/lastmod'

// Curated, AI-readable summary of who Santiago Paz is and what he has built.
// https://llmstxt.org, served at /llms.txt
//
// This is the index, not the corpus: enough to answer "who is he, what has he
// built, how do I reach him" without another fetch, and links for the rest.
// `## Optional` is the spec's own heading for what a short context may skip.
export const dynamic = 'force-static'

const SOURCES = ['data', 'content/posts', 'app/llms.txt/route.ts']

export function GET() {
  const profile = getProfile()
  const projects = getProjects()
  const posts = getPosts()
  const current = getExperience().roles.find((role) => !role.end)
  const updated = changedAt(SOURCES, new Date()).toISOString().slice(0, 10)

  const lines = [
    `# ${profile.name}`,
    '',
    `> ${profile.role} based in ${profile.location}. ${profile.workAuthorization}. ${profile.about}`,
    '',
    `${profile.name} is a senior full-stack engineer who ships production software end to end: TypeScript, React and Next.js on the web, with Node.js, GraphQL and PostgreSQL behind them. Areas of expertise: ${profile.knowsAbout.join(', ')}.`,
    '',
    ...(current
      ? [`Currently ${current.title} at ${current.company} (${current.period}).`, '']
      : []),
    `Availability: ${profile.availability}`,
    '',
    `Languages: ${profile.languages.map((l) => `${l.name} (${l.level})`).join(', ')}.`,
    '',
    '## Recognition',
    ...profile.awards.map((a) => `- ${a.title}. ${a.org} (${a.year}).`),
    '',
    '## Pages',
    `- [Home](${absUrl('/')}): Profile, selected work, and latest writing.`,
    `- [About](${absUrl('/about')}): Full bio, experience, education, tech stack, and FAQ ("Who is Santiago Paz?").`,
    `- [Writing](${absUrl('/writing')}): Essays and notes on engineering, plus the occasional personal piece.`,
    `- [CV (PDF)](${absUrl(profile.links.cv)}): The same career in one page, for download.`,
    `- [llms-full.txt](${absUrl('/llms-full.txt')}): The full text of this site in one file, including the complete employment history.`,
    '',
    '## Selected work',
    ...projects.map((p) => {
      const live = p.links.demo ? ` Live at ${p.links.demo}.` : ''
      return `- [${p.title}](${absUrl(`/projects/${p.slug}`)}): ${p.summary}${live}`
    }),
    '',
    '## Writing',
    ...posts.map(
      (p) => `- [${p.title}](${absUrl(`/writing/${p.slug}`)}): ${p.summary}`,
    ),
    '',
    '## Contact',
    `- Email: ${profile.email}`,
    `- GitHub: ${profile.links.github}`,
    `- LinkedIn: ${profile.links.linkedin}`,
    '',
    '## Optional',
    `- [RSS feed](${absUrl('/writing/rss.xml')}): New writing, as it is published.`,
    `- [Sitemap](${absUrl('/sitemap.xml')}): Every page on this site.`,
    '',
    `Last updated: ${updated}.`,
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  })
}
