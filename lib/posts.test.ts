import { describe, it, expect } from 'vitest'
import { getPosts, getPost, formatDate } from './posts'

describe('posts', () => {
  it('lists posts newest-first', () => {
    const posts = getPosts()
    expect(posts.length).toBeGreaterThanOrEqual(2)
    const dates = posts.map((p) => p.date)
    expect(dates).toEqual([...dates].sort().reverse())
  })

  it('parses frontmatter and body', () => {
    const post = getPost('evals-are-the-product')
    expect(post?.title).toBe('Evals are the product, not the model')
    expect(post?.kind).toBe('engineering')
    expect((post?.body.length ?? 0)).toBeGreaterThan(0)
  })

  it('returns undefined for a missing post', () => {
    expect(getPost('does-not-exist')).toBeUndefined()
  })

  it('formats a date as month + year (UTC)', () => {
    expect(formatDate('2026-06-15')).toBe('Jun 2026')
  })
})
