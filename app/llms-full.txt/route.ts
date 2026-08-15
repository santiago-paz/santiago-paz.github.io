import { getProfile, getProjects, getFaq } from '@/lib/data'
import { getPosts, getPost } from '@/lib/posts'

// Full-text version of the site for LLMs — the complete corpus in one file.
// https://llmstxt.org — served at /llms-full.txt
export const dynamic = 'force-static'

export function GET() {
  const profile = getProfile()
  const projects = getProjects()
  const faq = getFaq()
  const posts = getPosts()

  const out: string[] = [
    `# ${profile.name} — full profile`,
    '',
    `> ${profile.role} based in ${profile.location} (${profile.workAuthorization}). ${profile.about}`,
    '',
    `Areas of expertise: ${profile.knowsAbout.join(', ')}.`,
    '',
    '## Recognition',
    ...profile.awards.map(
      (a) => `- ${a.title} — ${a.org} (${a.year}). Source: ${a.url ?? ''}`.trim(),
    ),
    '',
    '## FAQ',
    '',
  ]

  for (const item of faq) {
    out.push(`### ${item.q}`, '', item.a, '')
  }

  out.push('## Projects', '')
  for (const p of projects) {
    out.push(`### ${p.title}`, '', p.summary, '', `Role: ${p.role}`, `Stack: ${p.stack.join(', ')}`, '', 'Highlights:')
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
    out.push(`### ${post.title}`, '', `Date: ${post.date} · ${post.kind}`, '', post.body, '')
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
