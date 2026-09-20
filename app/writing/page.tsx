import Link from 'next/link'
import type { Metadata } from 'next'
import { getPosts, formatDate } from '@/lib/posts'
import { JsonLd } from '@/components/JsonLd'
import { Mark } from '@/components/Mark'
import { blogJsonLd, breadcrumbJsonLd, ogImage, alternates } from '@/lib/seo'

const description =
  'Notes on engineering, and the occasional more personal piece.'

export const metadata: Metadata = {
  title: 'Writing',
  description,
  alternates: alternates('/writing'),
  openGraph: {
    type: 'website',
    title: 'Writing',
    description,
    url: '/writing',
    images: ogImage('/writing'),
  },
  twitter: { card: 'summary_large_image', images: ogImage('/writing') },
}

export default function WritingPage() {
  const posts = getPosts()

  return (
    <main className="page" id="main-content" tabIndex={-1}>
      <JsonLd
        data={[
          blogJsonLd(posts),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Writing', path: '/writing' },
          ]),
        ]}
      />
      <h1 className="page-title">Writing</h1>
      <p className="page-lead">{description}</p>

      {posts.length ? (
        <ol className="posts page-section">
          {posts.map((post, index) => (
            <li key={post.slug} className="post-row">
              <Mark tone="date" i={index}>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </Mark>
              <div>
                <h2 className="post-row__title">
                  <Link href={`/writing/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="post-row__summary">{post.summary}</p>
                <p className="post-row__kind">{post.kind === 'personal' ? 'Personal' : 'Engineering'}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="page-section">
          No posts yet. The <Link href="/writing/rss.xml">RSS feed</Link> will carry the first one.
        </p>
      )}
    </main>
  )
}
