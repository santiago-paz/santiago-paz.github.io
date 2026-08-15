import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export type PostKind = 'engineering' | 'personal' | 'note'

export type PostMeta = {
  slug: string
  title: string
  date: string // ISO 'YYYY-MM-DD'
  kind: PostKind
  summary: string
}

export type Post = PostMeta & { body: string }

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

function readPost(slug: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), 'utf8')
  const { data, content } = matter(raw)
  const kind = data.kind as PostKind
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ''),
    kind: kind === 'engineering' || kind === 'personal' ? kind : 'note',
    summary: String(data.summary ?? ''),
    body: content.trim(),
  }
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}

export function getPosts(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => {
      const post = readPost(slug)
      return {
        slug: post.slug,
        title: post.title,
        date: post.date,
        kind: post.kind,
        summary: post.summary,
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPost(slug: string): Post | undefined {
  const file = path.join(POSTS_DIR, `${slug}.md`)
  if (!fs.existsSync(file)) return undefined
  return readPost(slug)
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
