import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getProfile } from '@/lib/data'

export const dynamic = 'force-static'
export const alt = 'Santiago Paz — AI / LLM Application Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const profile = getProfile()
  const crete = await readFile(
    join(process.cwd(), 'assets', 'CreteRound-Regular.ttf'),
  )
  const photo = await readFile(join(process.cwd(), 'public', 'santiago-paz.png'))
  const photoSrc = `data:image/png;base64,${photo.toString('base64')}`

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
            {profile.role}
          </div>
          <div style={{ display: 'flex', fontSize: 104, lineHeight: 1, marginTop: 20 }}>
            {profile.name}
          </div>
          <div style={{ display: 'flex', fontSize: 34, color: '#8f8c83', marginTop: 22 }}>
            {profile.tagline}
          </div>
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
            <span>{profile.location} · EU work-authorized</span>
          </div>
        </div>
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
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Crete Round', data: crete, style: 'normal', weight: 400 },
      ],
    },
  )
}
