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
    expect(projects.length).toBe(9)
    const groups = projects.map((p) => p.group)
    expect(groups.lastIndexOf('ai-product')).toBeLessThan(
      groups.indexOf('creative-client'),
    )
    const aiOrders = projects
      .filter((p) => p.group === 'ai-product')
      .map((p) => p.order)
    expect(aiOrders).toEqual([...aiOrders].sort((a, b) => a - b))
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
