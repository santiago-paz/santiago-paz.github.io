import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { Mozilla_Headline, Mozilla_Text } from 'next/font/google'
import { SITE } from '@/lib/site'
import { getProfile } from '@/lib/data'
import { cvSizeLabel } from '@/lib/plates'
import { JsonLd } from '@/components/JsonLd'
import { Mark } from '@/components/Mark'
import { Icon } from '@/components/Icon'
import { SiteNav } from '@/components/SiteNav'
import { StrikeObserver } from '@/components/StrikeObserver'
import { websiteJsonLd, personJsonLd, ogImage } from '@/lib/seo'
import './globals.css'

// Struck capitals for names and marks; the width axis sets how wide each mark is cut.
// Weight tops out at 700, which is the heaviest strike the site has.
// next/font has no metric data for either face, so no size-matched fallback is generated.
const markFace = Mozilla_Headline({
  variable: '--font-mark',
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
})

// The reading face of the same family, drawn for running text rather than for headlines.
const textFace = Mozilla_Text({
  variable: '--font-text',
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['system-ui', 'sans-serif'],
})

const profile = getProfile()
const siteTitle = `${SITE.name} - ${profile.role}`

export const metadata: Metadata = {
  metadataBase: new URL(SITE.baseUrl),
  title: {
    default: siteTitle,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  // Feed autodiscovery - lets readers and aggregators find the writing.
  alternates: {
    types: { 'application/rss+xml': `${SITE.baseUrl}/writing/rss.xml` },
  },
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.baseUrl }],
  creator: SITE.name,
  publisher: SITE.name,
  keywords: [
    'Santiago Paz',
    'full-stack engineer',
    'senior full-stack engineer Berlin',
    'React developer Berlin',
    'Next.js developer',
    'TypeScript',
    'Node.js',
    'product engineer Berlin',
    'GraphQL',
    'multi-tenant SaaS',
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

// Matches the mobile browser chrome to the steel ground.
export const viewport: Viewport = {
  themeColor: '#edf0f3',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cvLabel = cvSizeLabel()
  return (
    <html
      lang="en"
      className={`${markFace.variable} ${textFace.variable}`}
      // The stylesheet sets scroll-behavior: smooth for in-page anchors. Since Next.js 16,
      // this attribute is what makes the router scroll to the top instantly on a route change;
      // without it the jump becomes a second-long animation that any wheel input cancels midway.
      data-scroll-behavior="smooth"
    >
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <JsonLd data={[websiteJsonLd(), personJsonLd()]} />
        <header className="masthead">
          <div className="masthead__bar">
            <Link href="/" className="maker">
              <Mark tone="maker" srLabel={`${profile.name}, home`}>SP</Mark>
              <span className="maker__name" aria-hidden="true" translate="no">
                {profile.name}
              </span>
            </Link>
            <SiteNav />
            <a className="button button--small" href={profile.links.cv} download="Santiago-Paz-CV.pdf">
              <span className="button__face">
                <Icon name="download" />
                CV
                <span className="sr-only"> download ({cvLabel})</span>
              </span>
            </a>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="site-footer__bar">
            <p className="site-footer__identity">
              © {new Date().getFullYear()} {profile.name}
              <span>{profile.location}</span>
            </p>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={profile.links.github} target="_blank" rel="noreferrer">
              GitHub <Icon name="external" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <Icon name="external" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </footer>
        <StrikeObserver />
      </body>
    </html>
  )
}
