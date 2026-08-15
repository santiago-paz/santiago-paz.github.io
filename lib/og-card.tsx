import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

type CardProps = {
  /** Small uppercase line above the title. */
  eyebrow: string
  title: string
  /** Optional line under the title. */
  subtitle?: string
  /** Footer line — defaults to the site identity. */
  footer?: string
  /** Show the headshot. Portraits suit the profile pages; content pages read better without. */
  withPhoto?: boolean
}

/**
 * The site's single Open Graph card design, shared by every `opengraph-image`
 * route so social previews stay visually consistent.
 */
export async function ogCard({
  eyebrow,
  title,
  subtitle,
  footer = 'santiagopaz.com',
  withPhoto = false,
}: CardProps) {
  const crete = await readFile(
    join(process.cwd(), 'assets', 'CreteRound-Regular.ttf'),
  )

  let photoSrc: string | undefined
  if (withPhoto) {
    const photo = await readFile(join(process.cwd(), 'public', 'santiago-paz.png'))
    photoSrc = `data:image/png;base64,${photo.toString('base64')}`
  }

  // Long titles need to step down a size or they overflow the card.
  const titleSize = title.length > 46 ? 62 : title.length > 28 ? 80 : 104

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 56,
          background: '#111214',
          color: '#f4f2ec',
          padding: '76px 84px',
          fontFamily: 'Crete Round',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              letterSpacing: 8,
              textTransform: 'uppercase',
              color: '#57a394',
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: titleSize,
              lineHeight: 1.05,
              marginTop: 20,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                display: 'flex',
                fontSize: 30,
                color: '#8f8c83',
                marginTop: 22,
                lineHeight: 1.3,
              }}
            >
              {subtitle}
            </div>
          ) : null}
          <div
            style={{
              display: 'flex',
              gap: 14,
              fontSize: 22,
              color: '#8f8c83',
              marginTop: 40,
            }}
          >
            <span style={{ color: '#57a394' }}>§</span>
            <span>{footer}</span>
          </div>
        </div>
        {photoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoSrc}
            width={300}
            height={300}
            style={{
              width: 300,
              height: 300,
              borderRadius: 300,
              objectFit: 'cover',
              border: '1px solid #3a3b40',
            }}
            alt=""
          />
        ) : null}
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [{ name: 'Crete Round', data: crete, style: 'normal', weight: 400 }],
    },
  )
}
