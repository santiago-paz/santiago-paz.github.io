import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SITE } from '@/lib/site'
import { getPost, getPostSlugs, formatDate } from '@/lib/posts'
import { Markdown } from '@/components/Markdown'
import { JsonLd } from '@/components/JsonLd'
import { Mark } from '@/components/Mark'
import { Icon } from '@/components/Icon'
import { blogPostingJsonLd, breadcrumbJsonLd, ogImage, alternates } from '@/lib/seo'

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
    alternates: alternates(path),
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary,
      url: path,
      publishedTime: post.date,
      authors: [SITE.name],
      images: ogImage(path, post.title),
    },
    // See the note in app/projects/[slug]/page.tsx: `card` must be restated.
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
    <main className="page page--reading" id="main-content" tabIndex={-1}>
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
      <Link href="/writing/" className="backlink">
        <Icon name="arrow-left" />
        All writing
      </Link>
      <header className="post-head">
        <h1 className="page-title">{post.title}</h1>
        {/* The date mark sits under the title, the way a plate carries its marks. */}
        <div className="post-head__meta">
          <Mark tone="maker" srLabel="By Santiago Paz">SP</Mark>
          <Mark tone="date">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </Mark>
          <span>{post.kind === 'personal' ? 'Personal' : 'Engineering'}</span>
        </div>
      </header>
      <Markdown>{post.body}</Markdown>
    </main>
  )
}
