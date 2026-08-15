import { getProfile, getProjects } from '@/lib/data'
import { getPosts } from '@/lib/posts'
import { absUrl } from '@/lib/seo'

// Curated, AI-readable summary of who Santiago Paz is and what he has built.
// https://llmstxt.org — served at /llms.txt
export const dynamic = 'force-static'

export function GET() {
  const profile = getProfile()
  const projects = getProjects()
  const posts = getPosts()

  const lines = [
    `# ${profile.name}`,
    '',
    `> ${profile.role} based in ${profile.location} (${profile.workAuthorization}). ${profile.about}`,
    '',
    `${profile.name} is a senior software engineer who ships production AI/LLM features end-to-end: LLM agents, evaluation harnesses, retrieval pipelines, and the full-stack products around them. Areas of expertise: ${profile.knowsAbout.join(', ')}.`,
    '',
    '## Recognition',
    ...profile.awards.map((a) => `- ${a.title} — ${a.org} (${a.year}).`),
    '',
    '## Pages',
    `- [Home](${absUrl('/')}): Profile, selected work, and latest writing.`,
    `- [About](${absUrl('/about')}): Full bio, focus, tech stack, and FAQ ("Who is Santiago Paz?").`,
    `- [Writing](${absUrl('/writing')}): Essays and notes on building production AI.`,
    `- [llms-full.txt](${absUrl('/llms-full.txt')}): The full text of this site in one file.`,
    '',
    '## Selected work',
    ...projects.map(
      (p) => `- [${p.title}](${absUrl(`/projects/${p.slug}`)}): ${p.summary}`,
    ),
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
  ]

  return new Response(lines.join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  })
}
