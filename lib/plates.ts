import fs from 'node:fs'
import path from 'node:path'
import type { Project } from './data'

/** Each live product's plate wears that product's own colors. */
export type Colorway = 'maker' | 'contract-lens' | 'trading-desk' | 'reema'

const COLORWAYS: Record<string, Colorway> = {
  'contract-lens': 'contract-lens',
  'multi-agent-trading-desk': 'trading-desk',
  reema: 'reema',
}

export function colorwayOf(slug: string): Colorway {
  return COLORWAYS[slug] ?? 'maker'
}

/**
 * Public first screens of the live products, captured from their own sites
 * (provenance sits in each file's .json sidecar). Nothing behind a login.
 */
export type Screen = {
  srcSet: string
  src: string
  width: number
  height: number
  mobile: { src: string; width: number; height: number }
  alt: string
}

const SCREENS: Record<string, Screen> = {
  'contract-lens': {
    src: '/work/contract-lens/screen-1200.webp',
    srcSet: '/work/contract-lens/screen-1200.webp 1200w, /work/contract-lens/screen-2400.webp 2400w',
    width: 2400,
    height: 1500,
    mobile: { src: '/work/contract-lens/screen-mobile.webp', width: 780, height: 1328 },
    alt: 'The Contract Lens landing page: "Upload a contract. Get the facts and the deadlines back." A demo below reads a sample service agreement into a contract record.',
  },
  'multi-agent-trading-desk': {
    src: '/work/multi-agent-trading-desk/screen-810.webp',
    srcSet: '/work/multi-agent-trading-desk/screen-810.webp 810w, /work/multi-agent-trading-desk/screen-1620.webp 1620w',
    width: 1620,
    height: 1410,
    mobile: { src: '/work/multi-agent-trading-desk/screen-mobile.webp', width: 764, height: 860 },
    alt: 'The Multi-Agent Trading Desk opening dialog, styled as Windows 98: CEDEAR.AI, with its modules listed: Portfolio, Market data, News, Movements, Auto Trader and Backtesting.',
  },
  reema: {
    src: '/work/reema/screen-1200.webp',
    srcSet: '/work/reema/screen-1200.webp 1200w, /work/reema/screen-2400.webp 2400w',
    width: 2400,
    height: 1500,
    mobile: { src: '/work/reema/screen-mobile.webp', width: 780, height: 1328 },
    alt: 'The Reema landing page in Spanish. A sample article plays through the "listen to this article" player, which highlights the word being read.',
  },
}

export function screenOf(slug: string): Screen | undefined {
  return SCREENS[slug]
}

/**
 * What a project's hallmarks say after the maker's mark: its standing
 * (pale while it is not yet live), where its code is, and where to see it run.
 */
export type Hallmarks = {
  statuses: { label: string; pale: boolean }[]
  code?: string
  live?: { label: string; href: string }
}

export function hallmarksOf(project: Project): Hallmarks {
  const { demo, repo } = project.links
  const statuses: Hallmarks['statuses'] = []
  if (demo) statuses.push({ label: 'Live', pale: false })
  if (project.stage) statuses.push({ label: project.stage, pale: true })
  return {
    statuses,
    code: repo,
    live: demo ? { label: new URL(demo).hostname, href: demo } : undefined,
  }
}

/** "PDF, 127 KB", read from the file at build time so it never goes stale. */
export function cvSizeLabel(): string {
  const file = path.join(process.cwd(), 'public', 'cv', 'santiago-paz.pdf')
  const kb = Math.round(fs.statSync(file).size / 1000)
  // A non-breaking space keeps the number and its unit on one line.
  return `PDF, ${kb} KB`
}
