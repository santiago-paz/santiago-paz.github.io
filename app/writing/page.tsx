import Link from 'next/link'
import type { Metadata } from 'next'
import { getPosts, formatDate } from '@/lib/posts'
import { JsonLd } from '@/components/JsonLd'
import { blogJsonLd, breadcrumbJsonLd } from '@/lib/seo'

const description =
  'Notes on building production AI, and the occasional more personal piece.'

export const metadata: Metadata = {
  title: 'Writing',
  description,
  alternates: { canonical: '/writing' },
  openGraph: { type: 'website', title: 'Writing', description, url: '/writing' },
}

export default function WritingPage() {
  const posts = getPosts()

  return (
    <main className="wrap">
      <JsonLd
        data={[
          blogJsonLd(posts),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Writing', path: '/writing' },
          ]),
        ]}
      />
      <Link href="/" className="backlink">
        ‹ Home
      </Link>
      <h1 className="page-title">Writing</h1>
      <p className="page-intro">
        Notes on building production AI, and the occasional more personal piece.
      </p>

      <div className="post-list" style={{ marginTop: 32 }}>
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/writing/${post.slug}`}
            className={`post-item${post.kind === 'personal' ? ' personal' : ''}`}
          >
            <span className="date">{formatDate(post.date)}</span>
            <span className="ptitle">{post.title}</span>
            <span className="kind">{post.kind}</span>
            <p className="pdek">{post.summary}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
