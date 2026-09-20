import { execFileSync } from 'node:child_process'

/**
 * When the sources behind a page last actually changed.
 *
 * The sitemap used to stamp every entry with the build time, which told Google
 * that all twelve pages changed the second CI ran. Google drops `lastmod`
 * values it cannot trust, and "everything changed at once, again" is the
 * clearest way to earn that distrust, so the whole-site timestamp bought
 * nothing.
 *
 * The honest answer is the last commit that touched the page's sources. That
 * needs real history: `actions/checkout` clones a single commit by default, so
 * the deploy workflow asks for `fetch-depth: 0`. Where git cannot answer — a
 * shallow clone, a source tarball, no git at all — the caller falls back to a
 * date it does know.
 */

function git(args: string[]): string | undefined {
  try {
    // stderr goes nowhere on purpose: "not a git repository" is an answer here,
    // not a build failure worth printing.
    return execFileSync('git', args, {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return undefined
  }
}

// A shallow clone answers `git log` from the one commit it has, which would
// date half the site to the last deploy and leave the rest blank. Better to
// know that up front and let every caller fall back together.
const usable = git(['rev-parse', '--is-shallow-repository']) === 'false'

/**
 * The commit date of the last change to any of `sources`, or `undefined` when
 * git cannot say. Paths are relative to the repo root; a directory covers
 * everything under it.
 */
export function lastCommitDate(sources: string[]): Date | undefined {
  if (!usable) return undefined
  const iso = git(['log', '-1', '--format=%cI', '--', ...sources])
  if (!iso) return undefined
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? undefined : date
}

/** `lastCommitDate`, with the date to use when git has no answer. */
export function changedAt(sources: string[], fallback: Date): Date {
  return lastCommitDate(sources) ?? fallback
}
