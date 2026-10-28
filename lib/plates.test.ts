import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getProjects } from './data'
import { colorwayOf, screenOf } from './plates'

const css = readFileSync(join(process.cwd(), 'app', 'globals.css'), 'utf8')

/** The custom properties one rule sets, such as `--field: #6c4cf1`. */
function tokensOf(selector: string): Record<string, string> {
  const escaped = selector.replace(/\./g, '\\.')
  const rule = css.match(new RegExp(`(?:^|\\n)${escaped}\\s*\\{([^}]*)\\}`))
  const tokens: Record<string, string> = {}
  for (const [, name, value] of (rule?.[1] ?? '').matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    tokens[name] = value.trim()
  }
  return tokens
}

const root = tokensOf(':root')

/** A token's color, following `var(--other)` references and falling back to the maker's own. */
function colorOf(scope: Record<string, string>, name: string): string {
  const value = scope[name] ?? root[name]
  const reference = value?.match(/^var\((--[\w-]+)\)$/)
  return reference ? colorOf(scope, reference[1]) : value
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light + 0.05) / (dark + 0.05)
}

// Every role in DESIGN.md's colorway table has a token. Letters go with a fill, lines go with the field.
const ROLES = [
  '--field',
  '--field-ink',
  '--field-soft',
  '--status-bg',
  '--status-fg',
  '--link-bg',
  '--link-fg',
  '--layer-bg',
  '--layer-fg',
  '--pale-bg',
  '--pale-fg',
  '--underline',
  '--focus',
  '--row-bg',
]
const TEXT_PAIRS = [
  ['--field-ink', '--field'],
  ['--field-soft', '--field'],
  ['--status-fg', '--status-bg'],
  ['--link-fg', '--link-bg'],
  ['--layer-fg', '--layer-bg'],
  ['--pale-fg', '--pale-bg'],
]
const LINE_PAIRS = [
  ['--underline', '--field'],
  ['--focus', '--field'],
]

const colorways = [...new Set(getProjects().map((project) => colorwayOf(project.slug)))]

describe('colorways', () => {
  it('gives every product with a public screen its own colorway', () => {
    for (const project of getProjects()) {
      if (screenOf(project.slug)) expect(colorwayOf(project.slug), project.slug).not.toBe('maker')
    }
  })

  it('puts Pegala in its own colorway', () => {
    expect(colorwayOf('pegala')).toBe('pegala')
    expect(colorwayOf('not-a-real-slug')).toBe('maker')
  })

  describe.each(colorways)('%s', (colorway) => {
    const scope = tokensOf(`.cw-${colorway}`)

    it.skipIf(colorway === 'maker')('fills every role in the colorway table', () => {
      for (const role of ROLES) expect(scope[role], role).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('keeps every text pair at 4.5:1 or better', () => {
      for (const [letters, fill] of TEXT_PAIRS) {
        expect(contrast(colorOf(scope, letters), colorOf(scope, fill)), `${letters} on ${fill}`).toBeGreaterThanOrEqual(4.5)
      }
    })

    it('keeps the underline and the focus ring at 3:1 or better on the field', () => {
      for (const [line, field] of LINE_PAIRS) {
        expect(contrast(colorOf(scope, line), colorOf(scope, field)), `${line} on ${field}`).toBeGreaterThanOrEqual(3)
      }
    })
  })
})
