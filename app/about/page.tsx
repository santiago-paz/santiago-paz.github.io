import type { Metadata } from 'next'
import Link from 'next/link'
import { getProfile, getFaq, getExperience } from '@/lib/data'
import { cvSizeLabel } from '@/lib/plates'
import { JsonLd } from '@/components/JsonLd'
import { FactRegister } from '@/components/FactRegister'
import { Mark } from '@/components/Mark'
import { Icon } from '@/components/Icon'
import { aboutPageJsonLd, faqPageJsonLd, breadcrumbJsonLd, ogImage, alternates } from '@/lib/seo'

const description =
  'Santiago Paz is a senior full-stack engineer based in Berlin: TypeScript, React, Next.js and Node.js. 13 years shipping software at Dialpad, Monks, R/GA and Globant. Background, experience, tech stack, and how to get in touch.'

export const metadata: Metadata = {
  title: 'About',
  description,
  alternates: alternates('/about'),
  openGraph: {
    type: 'profile',
    title: 'About Santiago Paz',
    description,
    url: '/about',
    images: ogImage('/about'),
  },
  twitter: { card: 'summary_large_image', images: ogImage('/about') },
}

export default function AboutPage() {
  const profile = getProfile()
  const faq = getFaq()
  const experience = getExperience()
  const cvLabel = cvSizeLabel()

  return (
    <main className="page" id="main-content" tabIndex={-1}>
      <JsonLd
        data={[
          aboutPageJsonLd(),
          faqPageJsonLd(faq),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />
      <h1 className="page-title">About</h1>

      <div className="prose page-intro">
        <p>
          I&rsquo;m Santiago Paz, a full-stack engineer with 13 years shipping
          production software, most of it on high-traffic web platforms. I work
          in TypeScript, React, Next.js and Node.js, with GraphQL, PostgreSQL
          and Prisma behind them. I&rsquo;m based in Berlin, and I&rsquo;m an
          Italian citizen, so I need no sponsorship to work in the EU.
        </p>
        <p>
          What I build on my own time, I build alone and take all the way to
          production.{' '}
          <Link href="/projects/contract-lens">Contract Lens</Link> is a
          multi-tenant SaaS for German law firms: a contract goes in as a PDF,
          an LLM extraction step returns typed data, and that data drives
          deadlines and alerts.{' '}
          <Link href="/projects/reema">Reema</Link>{' '}
          puts an embeddable &ldquo;listen to this article&rdquo; player on media
          sites, with three text-to-speech providers and an HTML-to-SSML pipeline
          behind it.{' '}
          <Link href="/projects/multi-agent-trading-desk">
            Multi-Agent Trading Desk
          </Link>{' '}
          runs against a live broker API and places nothing until I confirm it.
          All three are live, and you can open them.
        </p>
        <p>
          AI shows up in that work as one part of a product: an extraction step,
          a drafting step, a person approving the result before it counts. The
          deeper AI material I have is study rather than shipped work.{' '}
          <Link href="/projects/bedrock-genai-labs">bedrock-genai-labs</Link>{' '}
          is the curriculum I assembled for the AWS Certified Generative AI
          Developer - Professional certification: 26 lab scaffolds with
          reference solutions, covering retrieval, an agent loop, guardrails and
          LLM-as-judge evaluation. I&rsquo;m still working through it, and I
          say so rather than counting it as experience.
        </p>
        <p>
          My day job is Dialpad, where I build and ship pages across
          dialpad.com: a Next.js App Router site of roughly 1,900 pages across
          five locales, serving millions of visitors. I built most of its blog
          builder, which is live. Each block&rsquo;s form comes from its
          Contentful content model, so adding a field rarely needs UI work, and
          Claude drafts copy through the Anthropic SDK for an editor to approve.
          React, Next.js and TypeScript on the front end, GraphQL and Contentful
          behind them, with performance, SEO and accessibility as release
          criteria.
        </p>
        <p>
          Running underneath the last decade is a recurring thread: visual
          builders. The blog builder at Dialpad, a low-code drag-and-drop
          builder in Angular at Monks, and a campaign page builder at R/GA. All
          of them turn content models into systems non-engineers can drive.
        </p>
        <p>
          On the stack: TypeScript first, with React, Next.js, Node.js and
          Tailwind, and GraphQL, PostgreSQL and Prisma behind them. I also write
          Python and FastAPI. For AI I work with the LLM APIs directly, mostly
          the Anthropic SDK and the Vercel AI SDK. I work in Claude Code daily,
          with custom skills and parallel subagents.
        </p>
        <p>
          Before Berlin I was in Buenos Aires. I wrote about the move in{' '}
          <Link href="/writing/leaving-buenos-aires">Leaving Buenos Aires</Link>.
          I&rsquo;m currently open to senior full-stack and product engineering
          roles.
        </p>
      </div>

      <section className="page-section" aria-labelledby="glance-title">
        <h2 id="glance-title">At a glance</h2>
        <FactRegister profile={profile} portrait />
        <div className="actions">
          <a className="button" href={profile.links.cv} download="Santiago-Paz-CV.pdf">
            <span className="button__face">
              <Icon name="download" />
              Download CV
              <span className="button__meta">{cvLabel}</span>
            </span>
          </a>
        </div>
      </section>

      <section className="page-section" aria-labelledby="experience-title">
        <h2 id="experience-title">Experience</h2>
        <p className="page-lead section-lead">
          {experience.summary}
        </p>
        <ol className="ledger">
          {experience.roles.map((role) => (
            <li className="ledger__row" key={`${role.company}-${role.title}`}>
              <p className="ledger__period">{role.period}</p>
              <div>
                <h3 className="ledger__role">
                  {role.title} <span className="ledger__at">at</span>{' '}
                  {role.url ? (
                    <a href={role.url} target="_blank" rel="noreferrer">
                      {role.company}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    role.company
                  )}
                </h3>
                {role.location ? <span className="ledger__where">{role.location}</span> : null}
                <p className="ledger__note">{role.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="page-section" aria-labelledby="education-title">
        <h2 id="education-title">Education and certification</h2>
        <ul className="keyed">
          {experience.education.map((item, index) => (
            <li key={`${item.org}-${item.credential}`}>
              <Mark tone="date" i={index}>
                {item.period}
              </Mark>
              <p>
                {item.credential} at {item.org}
              </p>
            </li>
          ))}
          {experience.certifications.map((cert, index) => (
            <li key={cert.name}>
              <Mark tone="pale" i={experience.education.length + index}>
                {cert.status}
              </Mark>
              <p>{cert.name}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="page-section" aria-labelledby="recognition-title">
        <h2 id="recognition-title">Recognition</h2>
        <ul className="keyed">
          {profile.awards.map((award, index) => (
            <li key={award.title}>
              <Mark tone="date" i={index}>
                {award.year}
              </Mark>
              <p>
                {award.url ? (
                  <a href={award.url} target="_blank" rel="noreferrer">
                    {award.title}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  award.title
                )}
                . {award.org}.
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="page-section" aria-labelledby="faq-title">
        <h2 id="faq-title">Frequently asked</h2>
        <div className="faq">
          {faq.map((item) => (
            <div key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section" aria-labelledby="elsewhere-title">
        <h2 id="elsewhere-title">Elsewhere</h2>
        <ul className="keyed">
          <li>
            <Mark tone="status" i={0}>Email</Mark>
            <p>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </p>
          </li>
          <li>
            <Mark tone="status" i={1}>GitHub</Mark>
            <p>
              <a href={profile.links.github} target="_blank" rel="noreferrer">
                github.com/santiago-paz
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </li>
          <li>
            <Mark tone="status" i={2}>LinkedIn</Mark>
            <p>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
                linkedin.com/in/santiago-paz
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </li>
        </ul>
      </section>
    </main>
  )
}
