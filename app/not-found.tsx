import Link from 'next/link'

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
