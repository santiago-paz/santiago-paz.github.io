import { describe, it, expect } from 'vitest'
import { getProfile, getProjects, getProject, getProjectSlugs } from './data'

describe('data', () => {
  it('loads the profile', () => {
    const profile = getProfile()
    expect(profile.name).toBe('Santiago Paz')
    expect(profile.email).toContain('@')
    expect(profile.links.github).toMatch(/^https?:\/\//)
  })

  it('sorts projects: ai-product before creative-client, then by order', () => {
    const projects = getProjects()
    expect(projects.length).toBeGreaterThan(0)

    // Asserted as an invariant rather than against a fixed count, so curating
    // the list down doesn't break the test. `creative-client` may be empty.
    const groups = projects.map((p) => p.group)
    const lastAi = groups.lastIndexOf('ai-product')
    const firstClient = groups.indexOf('creative-client')
    if (lastAi !== -1 && firstClient !== -1) {
      expect(lastAi).toBeLessThan(firstClient)
    }

    for (const group of ['ai-product', 'creative-client'] as const) {
      const orders = projects.filter((p) => p.group === group).map((p) => p.order)
      expect(orders).toEqual([...orders].sort((a, b) => a - b))
    }
  })

  it('gets a project by slug and returns undefined for unknown slugs', () => {
    expect(getProject('splitberlin')?.title).toBe('SplitBerlin')
    expect(getProject('not-a-real-slug')).toBeUndefined()
  })

  it('has unique slugs', () => {
    const slugs = getProjectSlugs()
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})
