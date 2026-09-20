import { getPost, getPostSlugs, formatDate } from '@/lib/posts'
import { ogCard } from '@/lib/og-card'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return ogCard({ title: 'Writing' })
  return ogCard({
    title: post.title,
    subtitle: post.summary,
    marks: [formatDate(post.date), post.kind === 'personal' ? 'Personal' : 'Engineering'],
  })
}
