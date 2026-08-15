import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SITE } from '@/lib/site'
import { getPost, getPostSlugs, formatDate } from '@/lib/posts'
import { Markdown } from '@/components/Markdown'
import { JsonLd } from '@/components/JsonLd'
import { blogPostingJsonLd, breadcrumbJsonLd, ogImage } from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  const path = `/writing/${post.slug}`
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary,
      url: path,
      publishedTime: post.date,
      authors: [SITE.name],
      images: ogImage(path, post.title),
    },
    // See the note in app/projects/[slug]/page.tsx — `card` must be restated.
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: ogImage(path, post.title),
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return (
    <main className="wrap">
      <JsonLd
        data={[
          blogPostingJsonLd(post),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Writing', path: '/writing' },
            { name: post.title, path: `/writing/${post.slug}` },
          ]),
        ]}
      />
      <Link href="/writing" className="backlink">
        ‹ Writing
      </Link>
      <header
        className={`post-head${post.kind === 'personal' ? ' personal' : ''}`}
      >
        <div className="meta">
          <span className="kind">{post.kind}</span>
          <span>{formatDate(post.date)}</span>
        </div>
        <h1>{post.title}</h1>
      </header>
      <Markdown>{post.body}</Markdown>
    </main>
  )
}
