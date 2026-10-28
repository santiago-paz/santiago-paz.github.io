import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Colorway } from './plates'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

type CardColors = {
  field: string
  ink: string
  soft: string
  statusBg: string
  statusFg: string
  linkBg: string
  linkFg: string
  /** A standing that is not live yet, like Waitlist. Without these it is struck like a status. */
  paleBg?: string
  paleFg?: string
  frame?: string
}

// The same colorways as the plates in globals.css, as plain values for Satori.
const COLORS: Record<Colorway, CardColors> = {
  maker: {
    field: '#edf0f3',
    ink: '#111418',
    soft: '#4a5360',
    statusBg: '#111418',
    statusFg: '#edf0f3',
    linkBg: '#2a44a8',
    linkFg: '#f5f7fa',
  },
  'contract-lens': {
    field: '#ffffff',
    ink: '#16181d',
    soft: '#4b505a',
    statusBg: '#a3202f',
    statusFg: '#ffffff',
    linkBg: '#16181d',
    linkFg: '#ffffff',
    frame: '#d5dbe3',
  },
  'trading-desk': {
    field: '#008080',
    ink: '#ffffff',
    soft: '#ffffff',
    statusBg: '#000080',
    statusFg: '#ffffff',
    linkBg: '#c0c0c0',
    linkFg: '#000000',
  },
  reema: {
    field: '#00131f',
    ink: '#e7edf0',
    soft: '#b4c2c8',
    statusBg: '#25ffcd',
    statusFg: '#00131f',
    linkBg: '#e7edf0',
    linkFg: '#00131f',
    frame: '#1d3139',
  },
  pegala: {
    field: '#6c4cf1',
    ink: '#f8f7fd',
    soft: '#f8f7fd',
    statusBg: '#c8f169',
    statusFg: '#2b2352',
    linkBg: '#ffffff',
    linkFg: '#2b2352',
    paleBg: '#5336c9',
    paleFg: '#d5d1e8',
    // The plate's frame, paper at 25%, laid over the violet.
    frame: '#8f77f4',
  },
}

const BLUED = '#2a44a8'
const ON_BLUED = '#f5f7fa'

type CardMark = string | { label: string; link: true } | { label: string; pale: true }

/** The colors a mark is struck in. A pale standing is struck like a status where the colorway has no pale tone. */
function markColors(mark: CardMark, c: CardColors) {
  if (typeof mark !== 'string' && 'link' in mark) return { bg: c.linkBg, fg: c.linkFg }
  if (typeof mark !== 'string' && 'pale' in mark && c.paleBg && c.paleFg) return { bg: c.paleBg, fg: c.paleFg }
  return { bg: c.statusBg, fg: c.statusFg }
}

// Satori does not accept calc() inside polygon points, so bevels are written in pixels.
function fixedBevel(w: number, h: number, cut: number) {
  return `polygon(${cut}px 0, ${w - cut}px 0, ${w}px ${cut}px, ${w}px ${h - cut}px, ${w - cut}px ${h}px, ${cut}px ${h}px, 0 ${h - cut}px, 0 ${cut}px)`
}

function leftBevel(w: number, h: number, cut: number) {
  return `polygon(${cut}px 0, ${w}px 0, ${w}px ${h}px, ${cut}px ${h}px, 0 ${h - cut}px, 0 ${cut}px)`
}

type CardProps = {
  title: string
  /** One line under the title. */
  subtitle?: string
  /** Hallmarks after the SP maker's mark: a link mark (Code) takes the link colors, a pale one (Waitlist) the pale colors. */
  marks?: CardMark[]
  colorway?: Colorway
  /** The approved headshot, or a live product's public screen. */
  image?: { kind: 'portrait' } | { kind: 'screen'; slug: string }
}

// Each read is scoped to its own folder so the build does not trace the whole project.
async function portraitUri() {
  const bytes = await readFile(join(process.cwd(), 'public', 'santiago-paz.png'))
  return `data:image/png;base64,${bytes.toString('base64')}`
}

async function screenUri(slug: string) {
  const bytes = await readFile(join(process.cwd(), 'assets', 'og', `${slug}.jpg`))
  return `data:image/jpeg;base64,${bytes.toString('base64')}`
}

/** The site's single share card design, used by every `og.png` route. */
export async function ogCard({ title, subtitle, marks = [], colorway = 'maker', image }: CardProps) {
  const [markFace, textFace, textBold] = await Promise.all([
    readFile(join(process.cwd(), 'assets', 'MozillaHeadline-Wide-Bold.ttf')),
    readFile(join(process.cwd(), 'assets', 'MozillaText-Regular.ttf')),
    readFile(join(process.cwd(), 'assets', 'MozillaText-Bold.ttf')),
  ])
  const c = COLORS[colorway]

  let picture: string | undefined
  if (image?.kind === 'portrait') picture = await portraitUri()
  if (image?.kind === 'screen') picture = await screenUri(image.slug)

  // Long titles step down a size so they never overflow the card.
  const titleSize = title.length > 20 ? 58 : title.length > 14 ? 72 : 88
  const textWidth = picture ? 640 : 1040

  // The Trading Desk shows its dialog, so it sits taller and narrower than a full page.
  const isDesk = image?.kind === 'screen' && image.slug === 'multi-agent-trading-desk'
  const screenImg = isDesk ? { width: 560, height: 487 } : { width: 680, height: 425 }
  const framePad = c.frame ? 2 : 0
  const screenBox = { width: screenImg.width + framePad * 2, height: screenImg.height + framePad * 2 }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: c.field,
          color: c.ink,
          fontFamily: 'Mozilla Text',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: textWidth,
            padding: '64px 0 60px 72px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontFamily: 'Mozilla Headline',
                fontSize: titleSize,
                lineHeight: 1,
                letterSpacing: -1,
              }}
            >
              {title}
            </div>
            {subtitle ? (
              <div style={{ display: 'flex', marginTop: 24, fontSize: 30, lineHeight: 1.35, color: c.soft }}>
                {subtitle}
              </div>
            ) : null}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <div
              style={{
                display: 'flex',
                padding: '12px 16px 10px',
                background: BLUED,
                color: ON_BLUED,
                fontFamily: 'Mozilla Headline',
                fontSize: 22,
                letterSpacing: 2,
                borderRadius: 3,
              }}
            >
              SP
            </div>
            {marks.map((mark) => {
              const label = typeof mark === 'string' ? mark : mark.label
              const { bg, fg } = markColors(mark, c)
              return (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    padding: '12px 16px 10px',
                    background: bg,
                    color: fg,
                    fontFamily: 'Mozilla Headline',
                    fontSize: 22,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    // Satori cannot bevel a box of unknown width, so share-card marks take a small radius.
                    borderRadius: 3,
                  }}
                >
                  {label}
                </div>
              )
            })}
          </div>
        </div>
        {picture ? (
          image?.kind === 'portrait' ? (
            // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
            <img
              src={picture}
              width={360}
              height={450}
              style={{
                position: 'absolute',
                right: 72,
                top: 90,
                objectFit: 'cover',
                clipPath: fixedBevel(360, 450, 16),
              }}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                position: 'absolute',
                left: 720,
                top: isDesk ? 60 : 110,
                width: screenBox.width,
                height: screenBox.height,
                padding: framePad,
                background: c.frame ?? 'transparent',
                clipPath: leftBevel(screenBox.width, screenBox.height, 14),
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
              <img
                src={picture}
                width={screenImg.width}
                height={screenImg.height}
                style={{ objectFit: 'cover', objectPosition: 'left top' }}
              />
            </div>
          )
        ) : null}
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Mozilla Headline', data: markFace, style: 'normal', weight: 700 },
        { name: 'Mozilla Text', data: textFace, style: 'normal', weight: 400 },
        { name: 'Mozilla Text', data: textBold, style: 'normal', weight: 700 },
      ],
    },
  )
}
