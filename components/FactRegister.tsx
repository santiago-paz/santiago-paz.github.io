import type { Profile } from '@/lib/data'
import { Mark } from './Mark'

/**
 * The facts a recruiter screens for, each keyed by a struck mark,
 * the way an assay certificate reads a row of hallmarks. The portrait sits
 * top right, as on a German CV; rows beside it narrow, rows below it run full width.
 */
export function FactRegister({
  profile,
  portrait,
  strike,
}: {
  profile: Profile
  portrait?: boolean
  /** Strike the marks as the register comes into view (the home page only). */
  strike?: boolean
}) {
  const city = profile.location.split(',')[0]
  const languages = profile.languages
    .map((language) => `${language.name} (${language.level.toLowerCase()})`)
    .join(', ')

  const rows = [
    { mark: 'SP', label: 'Maker', text: 'Every project here is solo work, from the data model to the deploy.' },
    { mark: city.slice(0, 3), label: city, text: `Based in ${city}, on-site or hybrid, and open to fully remote work.` },
    { mark: 'EU', label: 'Work permit', text: 'Italian citizen with EU work authorization. No sponsorship needed.' },
    { mark: '13 yrs', label: 'Experience', text: '13 years shipping production software: TypeScript, React, Next.js, Node.js.' },
    { mark: profile.languages.map((l) => l.code).join(' '), label: 'Languages', text: `${languages}.` },
  ]

  return (
    <div className="register">
      {portrait ? (
        <figure className="register__portrait">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/portrait-320.webp"
            srcSet="/portrait-320.webp 320w, /portrait-640.webp 640w"
            sizes="104px"
            width={640}
            height={800}
            alt={`Portrait of ${profile.name}`}
            fetchPriority="high"
          />
        </figure>
      ) : null}
      <dl className="register__rows" data-strike={strike ? '' : undefined}>
        {rows.map((row, index) => (
          <div className="register__row" key={row.label}>
            <dt>
              <Mark tone={index === 0 ? 'maker' : 'status'} i={index} srLabel={row.label} code>
                {row.mark}
              </Mark>
            </dt>
            <dd>{row.text}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
