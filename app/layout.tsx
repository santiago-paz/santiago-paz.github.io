import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { Crete_Round, Inter_Tight } from 'next/font/google'
import { SITE } from '@/lib/site'
import { getProfile } from '@/lib/data'
import { JsonLd } from '@/components/JsonLd'
import { websiteJsonLd, personJsonLd, ogImage } from '@/lib/seo'
import './globals.css'

const display = Crete_Round({
  variable: '--font-crete',
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const body = Inter_Tight({
  variable: '--font-inter-tight',
  subsets: ['latin'],
  display: 'swap',
})

const profile = getProfile()
const siteTitle = `${SITE.name} — ${profile.role}`

export const metadata: Metadata = {
  metadataBase: new URL(SITE.baseUrl),
  title: {
    default: siteTitle,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  // Feed autodiscovery — lets readers and aggregators find the writing.
  alternates: {
    types: { 'application/rss+xml': `${SITE.baseUrl}/writing/rss.xml` },
  },
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.baseUrl }],
  creator: SITE.name,
  publisher: SITE.name,
  keywords: [
    'Santiago Paz',
    'AI engineer',
    'LLM application engineer',
    'AI engineer Berlin',
    'production AI',
    'RAG',
    'LLM evals',
    'Next.js',
    'TypeScript',
    'Python',
  ],
  // Emits <meta name="google-site-verification" ...> for Search Console.
  verification: {
    google: 'SBSLMdt8_unat2fEXGHp3ciqeGeM4VCE2Q6w-Y6-nSQ',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: siteTitle,
    description: SITE.description,
    url: SITE.baseUrl,
    locale: 'en_US',
    images: ogImage(),
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: SITE.description,
    images: ogImage(),
  },
}

// Tints mobile browser chrome to match the page rather than leaving a white bar
// above a dark site.
export const viewport: Viewport = {
  themeColor: '#111214',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <JsonLd data={[websiteJsonLd(), personJsonLd()]} />
        <header className="site-header">
          <div className="bar">
            <Link href="/" className="home">
              {profile.name}
            </Link>
            <nav>
              <Link href="/about">About</Link>
              <Link href="/#work">Work</Link>
              <Link href="/writing">Writing</Link>
              <a href={`mailto:${profile.email}`}>Contact</a>
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="bar">
            <span>© {profile.name}</span>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={profile.links.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </footer>
      </body>
    </html>
  )
}
