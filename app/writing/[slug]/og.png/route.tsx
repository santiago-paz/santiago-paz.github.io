import { getPost, getPostSlugs } from '@/lib/posts'
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
  return ogCard({
    eyebrow: 'Writing',
    title: post?.title ?? 'Writing',
    subtitle: post?.summary,
    footer: 'santiagopaz.com · Santiago Paz',
  })
}
