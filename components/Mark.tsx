import type { CSSProperties, ReactNode } from 'react'
import { Icon } from './Icon'

type Tone = 'maker' | 'status' | 'layer' | 'pale' | 'date'

type MarkProps = {
  children: ReactNode
  tone?: Tone
  /** Position in its row, used to stagger the strike. */
  i?: number
  /** Spoken instead of the visible abbreviation. */
  srLabel?: string
  large?: boolean
  /** An abbreviation or code (SP, EU, D1) that browser translation must leave alone. */
  code?: boolean
}

/** A struck hallmark: a beveled cartouche of capitals. */
export function Mark({ children, tone = 'status', i = 0, srLabel, large, code }: MarkProps) {
  const style = { '--i': i } as CSSProperties
  const className = `mark mark--${tone}${large ? ' mark--large' : ''}`
  const translate = code || tone === 'maker' ? 'no' : undefined
  if (srLabel) {
    return (
      <span className={className} style={style}>
        <span aria-hidden="true" translate={translate}>
          {children}
        </span>
        <span className="sr-only">{srLabel}</span>
      </span>
    )
  }
  return (
    <span className={className} style={style} translate={translate}>
      {children}
    </span>
  )
}

/** A hallmark that opens somewhere: the live product or its code. */
export function LinkMark({
  href,
  children,
  i = 0,
  domain,
}: {
  href: string
  children: ReactNode
  i?: number
  /** Set when the label is a domain name, which keeps its lowercase. */
  domain?: boolean
}) {
  return (
    <a className="mark-link" href={href} target="_blank" rel="noreferrer">
      <span
        className={`mark mark--link${domain ? ' mark--domain' : ''}`}
        style={{ '--i': i } as CSSProperties}
        translate={domain ? 'no' : undefined}
      >
        {children}
        <Icon name="external" />
        <span className="sr-only"> (opens in a new tab)</span>
      </span>
    </a>
  )
}
