import type { Metadata } from 'next'
import Link from 'next/link'
import { getProfile, getFaq, getExperience } from '@/lib/data'
import { JsonLd } from '@/components/JsonLd'
import { aboutPageJsonLd, faqPageJsonLd, breadcrumbJsonLd, ogImage, alternates } from '@/lib/seo'

const description =
  'Santiago Paz is a senior AI / LLM application engineer based in Berlin, with 11+ years shipping production software — Dialpad, Monks, R/GA, Globant. Background, experience, tech stack, and how to get in touch.'

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

  return (
    <main className="wrap">
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
      <Link href="/" className="backlink">
        ‹ Home
      </Link>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="headshot"
        src={profile.image}
        alt={`Portrait of ${profile.name}`}
        width={132}
        height={132}
      />
      <p className="eyebrow">About</p>
      <h1 className="page-title">Santiago Paz</h1>

      <div className="prose" style={{ marginTop: 24 }}>
        <p>
          I&rsquo;m Santiago Paz, a software engineer with 11+ years of
          experience, now focused on AI / LLM application engineering. I&rsquo;m
          based in Berlin, EU work-authorized as an Italian citizen, and I build
          production AI features end-to-end &mdash; from LLM agents and
          evaluation harnesses to the full-stack products around them.
        </p>
        <p>
          Most of my work is shipping real AI products, not demos:{' '}
          <Link href="/projects/splitberlin">SplitBerlin</Link>, a multi-tenant
          SaaS that extracts structured data from legal contracts with a
          two-stage AI pipeline;{' '}
          <Link href="/projects/windows-money">Windows Money</Link>, a
          multi-agent LLM trading system; and{' '}
          <Link href="/projects/pegala">Pegala</Link>, an AI job-search platform;
          and <Link href="/projects/reema">Reema</Link>, a text-to-speech SaaS. I
          care about the parts that make AI features actually ship &mdash; evals,
          reliability, latency, and failure modes &mdash; as much as the model
          itself.
        </p>
        <p>
          Alongside the products I build the fundamentals in the open:{' '}
          <Link href="/projects/bedrock-genai-labs">bedrock-genai-labs</Link> is
          26 runnable labs against live Amazon Bedrock APIs &mdash; a FAISS
          vector store written from scratch, hybrid dense + BM25 retrieval with
          reranking, an agent loop implemented by hand before rebuilding it on
          the Strands Agents SDK, guardrails and PII redaction, and
          LLM-as-judge evaluation. It backs the AWS Certified Generative AI
          Developer &mdash; Professional certification I&rsquo;m working toward.
        </p>
        <p>
          On the stack: TypeScript, React and Next.js on the front end; Python
          and FastAPI on the back end; LLM tooling like the Vercel AI SDK,
          LangChain, and Anthropic and OpenAI models; plus retrieval-augmented
          generation, evaluation harnesses, and prompt engineering.
        </p>
        <p>
          Before Berlin I was in Buenos Aires &mdash; I wrote about the move in{' '}
          <Link href="/writing/leaving-buenos-aires">Leaving Buenos Aires</Link>.
          I&rsquo;m currently open to senior AI / LLM engineering roles.
        </p>
      </div>

      <h2 className="sec">At a glance</h2>
      <dl className="facts">
        <dt>Role</dt>
        <dd>{profile.role}</dd>
        <dt>Based</dt>
        <dd>{profile.location}</dd>
        <dt>Authorization</dt>
        <dd>{profile.workAuthorization}</dd>
        <dt>Languages</dt>
        <dd>
          {profile.languages
            .map((l) => `${l.name} (${l.level})`)
            .join(' · ')}
        </dd>
        <dt>Focus</dt>
        <dd>Production AI/LLM features · full-stack product delivery</dd>
        <dt>Status</dt>
        <dd>Open to senior AI engineering roles</dd>
      </dl>

      <h2 className="sec">Experience</h2>
      <p className="cv-note">{experience.summary}</p>
      <div className="cv-list">
        {experience.roles.map((role) => (
          <div className="cv-item" key={`${role.company}-${role.title}`}>
            <span className="period">{role.period}</span>
            <span>
              <span className="role">{role.title}</span>
              <span className="at"> at </span>
              <span className="org">
                {role.url ? (
                  <a href={role.url} target="_blank" rel="noreferrer">
                    {role.company}
                  </a>
                ) : (
                  role.company
                )}
              </span>
              {role.location ? <span className="where">{role.location}</span> : null}
            </span>
            <p className="cv-dek">{role.note}</p>
          </div>
        ))}
      </div>

      <h2 className="sec">Education &amp; certifications</h2>
      <dl className="facts">
        {experience.education.map((item) => (
          <div key={`${item.org}-${item.credential}`} style={{ display: 'contents' }}>
            <dt>{item.period}</dt>
            <dd>
              {item.credential} — {item.org}
            </dd>
          </div>
        ))}
        {experience.certifications.map((cert) => (
          <div key={cert.name} style={{ display: 'contents' }}>
            <dt>{cert.status}</dt>
            <dd>{cert.name}</dd>
          </div>
        ))}
      </dl>

      <h2 className="sec">Recognition</h2>
      <dl className="facts">
        {profile.awards.map((award) => (
          <div key={award.title} style={{ display: 'contents' }}>
            <dt>{award.year}</dt>
            <dd>
              {award.url ? (
                <a
                  href={award.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--ac)' }}
                >
                  {award.title}
                </a>
              ) : (
                award.title
              )}{' '}
              — {award.org}
            </dd>
          </div>
        ))}
      </dl>

      <h2 className="sec">Frequently asked</h2>
      <div className="faq">
        {faq.map((item) => (
          <div className="faq-item" key={item.q}>
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}
      </div>

      <h2 className="sec">Elsewhere</h2>
      <dl className="facts">
        <dt>Email</dt>
        <dd>
          <a href={`mailto:${profile.email}`} style={{ color: 'var(--ac)' }}>
            {profile.email}
          </a>
        </dd>
        <dt>GitHub</dt>
        <dd>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--ac)' }}
          >
            github.com/santiago-paz
          </a>
        </dd>
        <dt>LinkedIn</dt>
        <dd>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--ac)' }}
          >
            linkedin.com/in/santiago-paz
          </a>
        </dd>
      </dl>
    </main>
  )
}
