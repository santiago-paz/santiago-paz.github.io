import type { Metadata } from 'next'
import Link from 'next/link'

// Give the 404 its own title — otherwise it inherits the site title and reads
// like a real page in search results.
//
// The robots override matters: Next emits its own `noindex` for not-found, and
// without this the root layout's `index, follow` is also emitted, leaving two
// contradictory robots tags. Restating noindex keeps them consistent.
export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main className="wrap" style={{ paddingBottom: 64 }}>
      <p className="eyebrow">404</p>
      <h1 className="page-title">Not found</h1>
      <p className="page-intro">
        That page doesn’t exist.{' '}
        <Link href="/" className="more" style={{ marginTop: 0 }}>
          Back home →
        </Link>
      </p>
    </main>
  )
}
