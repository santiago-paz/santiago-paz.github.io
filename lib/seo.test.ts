import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { headshotUrls, homeOgImages, personJsonLd, profilePageJsonLd } from './seo'

describe('headshot markup', () => {
  it('names the square headshot as the primary image of the home page', () => {
    expect(profilePageJsonLd().primaryImageOfPage.url).toBe('https://santiagopaz.com/santiago-paz.png')
  })

  it('puts the person inside the profile page, with the layout copy of its id and images', () => {
    const page = profilePageJsonLd()
    const person = personJsonLd()
    expect(page.mainEntity['@type']).toBe('Person')
    expect(page.mainEntity['@id']).toBe(person['@id'])
    expect(page.mainEntity.image).toEqual(person.image)
    expect(page.mainEntity.image.map((image) => image.url)).toEqual(headshotUrls())
  })

  it('lists the share card before the headshot, because link previews take the first image', () => {
    expect(homeOgImages().map((image) => image.url)).toEqual(['/og.png', '/santiago-paz.png'])
  })

  it('declares the size the headshot file really has', () => {
    const headshot = homeOgImages()[1]
    const png = readFileSync(join(process.cwd(), 'public', 'santiago-paz.png'))
    // A PNG holds its width and height as two big-endian integers, right after the signature and the IHDR tag.
    expect({ width: png.readUInt32BE(16), height: png.readUInt32BE(20) }).toEqual({
      width: headshot.width,
      height: headshot.height,
    })
  })
})
