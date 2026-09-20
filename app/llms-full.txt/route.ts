import { getProfile, getProjects, getFaq, getExperience } from '@/lib/data'
import { getPosts, getPost } from '@/lib/posts'
import { absUrl } from '@/lib/seo'
import { changedAt } from '@/lib/lastmod'

// Full-text version of the site for LLMs — the complete corpus in one file.
// https://llmstxt.org — served at /llms-full.txt
//
// "Complete" is the whole point of this file, so it carries what the About page
// carries: the employment history, education, certifications and languages, not
// only the projects and the writing. An answer engine asked "where has Santiago
// Paz worked?" has to find the answer here or it will guess.
export const dynamic = 'force-static'

const SOURCES = ['data', 'content/posts', 'app/llms-full.txt/route.ts']

/**
 * Push a post's own headings below the heading this file gives it.
 *
 * Each post is inlined under `### <title>`, so a post's own `## Section` would
 * otherwise land level with `## Writing` and `## Contact`: read as an outline,
 * a subheading of one essay becomes a section of Santiago's profile, sibling
 * to Experience. Shifting by two hangs them off the post they belong to.
 *
 * Fenced blocks are left alone, because `# install` in a shell snippet is a
 * comment, not a heading. No post has one today; the next one might.
 */
function nest(markdown: string, by = 2): string {
  let fenced = false
  return markdown
    .split('\n')
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        fenced = !fenced
        return line
      }
      if (fenced) return line
      return line.replace(/^(#{1,6})(\s)/, (_, hashes: string, space: string) =>
        '#'.repeat(Math.min(6, hashes.length + by)) + space,
      )
    })
    .join('\n')
}

export function GET() {
  const profile = getProfile()
  const projects = getProjects()
  const faq = getFaq()
  const experience = getExperience()
  const posts = getPosts()
  const updated = changedAt(SOURCES, new Date()).toISOString().slice(0, 10)

  const out: string[] = [
    `# ${profile.name}: full profile`,
    '',
    `> ${profile.role} based in ${profile.location}. ${profile.workAuthorization}. ${profile.about}`,
    '',
    `Last updated: ${updated}. Canonical source: ${absUrl('/')}`,
    '',
    '## At a glance',
    '',
    `- Name: ${profile.name}`,
    `- Role: ${profile.role}`,
    `- Location: ${profile.location}`,
    `- Work authorization: ${profile.workAuthorization}`,
    `- Availability: ${profile.availability}`,
    `- Languages: ${profile.languages.map((l) => `${l.name} (${l.level})`).join(', ')}`,
    `- Email: ${profile.email}`,
    `- GitHub: ${profile.links.github}`,
    `- LinkedIn: ${profile.links.linkedin}`,
    `- CV (PDF): ${absUrl(profile.links.cv)}`,
    '',
    `Areas of expertise: ${profile.knowsAbout.join(', ')}.`,
    '',
    '## Recognition',
    ...profile.awards.map(
      (a) => `- ${a.title}. ${a.org} (${a.year}). Source: ${a.url ?? ''}`.trim(),
    ),
    '',
    '## Experience',
    '',
    experience.summary,
    '',
  ]

  for (const role of experience.roles) {
    out.push(`### ${role.title} at ${role.company}`, '')
    const facts = [role.period, role.location, role.url].filter(Boolean)
    out.push(facts.join(' · '), '', role.note, '')
  }

  out.push('## Education', '')
  for (const item of experience.education) {
    out.push(`- ${item.credential} at ${item.org} (${item.period}).`)
  }

  out.push('', '## Certifications', '')
  for (const cert of experience.certifications) {
    out.push(`- ${cert.name}. Status: ${cert.status}.`)
  }

  out.push('', '## FAQ', '')
  for (const item of faq) {
    out.push(`### ${item.q}`, '', item.a, '')
  }

  out.push('## Projects', '')
  for (const p of projects) {
    out.push(
      `### ${p.title}`,
      '',
      p.summary,
      '',
      `Page: ${absUrl(`/projects/${p.slug}`)}`,
      `Role: ${p.role}`,
      `Stack: ${p.stack.join(', ')}`,
    )
    if (p.stage) out.push(`Stage: ${p.stage}`)
    out.push('', 'Highlights:')
    for (const h of p.highlights) out.push(`- ${h}`)
    out.push('', p.description)
    if (p.disclosure) out.push('', `Disclosure: ${p.disclosure}`)
    if (p.links.demo) out.push('', `Demo: ${p.links.demo}`)
    if (p.links.repo) out.push(`Code: ${p.links.repo}`)
    out.push('')
  }

  out.push('## Writing', '')
  for (const meta of posts) {
    const post = getPost(meta.slug)
    if (!post) continue
    out.push(
      `### ${post.title}`,
      '',
      `Date: ${post.date} · ${post.kind} · ${absUrl(`/writing/${post.slug}`)}`,
      '',
      nest(post.body),
      '',
    )
  }

  out.push(
    '## Contact',
    `- Email: ${profile.email}`,
    `- GitHub: ${profile.links.github}`,
    `- LinkedIn: ${profile.links.linkedin}`,
    '',
  )

  return new Response(out.join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  })
}
