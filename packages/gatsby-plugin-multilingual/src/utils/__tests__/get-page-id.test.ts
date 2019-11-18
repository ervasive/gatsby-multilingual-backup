import { getPageId } from '..'

const pages = {
  home: {
    en: '/en',
    de: '/de',
  },
  about: {
    en: '/en/about',
    de: '/de/about',
    'pt-br': '/pt-br/about',
  },
}

describe(`getPageId`, () => {
  it(`should return page id for existing id input`, () => {
    expect(getPageId('home', pages)).toBe('home')
    expect(getPageId('about', pages)).toBe('about')
  })

  it(`should return page id for existent slug input`, () => {
    expect(getPageId('/de/about', pages)).toBe('about')
  })

  it(`should return undefined for non-existent id/slug input`, () => {
    expect(getPageId('non-existent', pages)).toBeUndefined()
  })
})
