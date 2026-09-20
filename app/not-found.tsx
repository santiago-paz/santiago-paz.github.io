import type { Metadata } from 'next'
import Link from 'next/link'
import { Icon } from '@/components/Icon'

// Give the 404 its own title, or it inherits the site title and reads
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
    <main className="page page--reading" id="main-content" tabIndex={-1}>
      <h1 className="page-title">Page not found</h1>
      <p className="page-lead">
        Nothing lives at this address. The link may be old, or the page may have moved.
      </p>
      <div className="actions">
        <Link href="/" className="button">
          <span className="button__face">
            <Icon name="arrow-left" />
            Go to the home page
          </span>
        </Link>
        <Link href="/#work" className="text-action">
          See the work
          <Icon name="arrow-right" />
        </Link>
      </div>
    </main>
  )
}
