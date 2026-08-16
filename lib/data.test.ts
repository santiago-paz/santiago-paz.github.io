import { describe, it, expect } from 'vitest'
import { getProfile, getProjects, getProject, getProjectSlugs } from './data'

describe('data', () => {
  it('loads the profile', () => {
    const profile = getProfile()
    expect(profile.name).toBe('Santiago Paz')
    expect(profile.email).toContain('@')
    expect(profile.links.github).toMatch(/^https?:\/\//)
  })

  it('sorts projects by their global order', () => {
    const projects = getProjects()
    expect(projects.length).toBeGreaterThan(0)

    const orders = projects.map((p) => p.order)
    expect(orders).toEqual([...orders].sort((a, b) => a - b))
    // Ordering is only meaningful if no two projects claim the same slot.
    expect(new Set(orders).size).toBe(orders.length)
  })

  it('leads with the three projects the CV opens with', () => {
    expect(getProjects().slice(0, 3).map((p) => p.slug)).toEqual([
      'contract-lens',
      'multi-agent-trading-desk',
      'bedrock-genai-labs',
    ])
  })

  it('gets a project by slug and returns undefined for unknown slugs', () => {
    expect(getProject('contract-lens')?.title).toBe('Contract Lens')
    expect(getProject('not-a-real-slug')).toBeUndefined()
  })

  it('has unique slugs', () => {
    const slugs = getProjectSlugs()
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})
