import getPageGenericPath from '../get-page-generic-path'

const pages = {
  '/page-one': {
    en: '/en/page-one-slug',
    ru: '/ru/путь-к-странице-один',
  },
}

describe(`getPageGenericPath`, () => {
  it(`should return existing generic path back`, () => {
    expect(getPageGenericPath('/page-one', pages)).toBe('/page-one')
  })

  it(`should return a generic path value on valid slug`, () => {
    expect(getPageGenericPath('/en/page-one-slug', pages)).toBe('/page-one')
    expect(getPageGenericPath('/ru/путь-к-странице-один', pages)).toBe(
      '/page-one',
    )
  })

  it(`should return undefined on non existent page attributes`, () => {
    expect(getPageGenericPath('/page-two', pages)).toBe(undefined)
    expect(getPageGenericPath('/en/page-two-slug', pages)).toBe(undefined)
    expect(getPageGenericPath('/ru/путь-к-странице-два', pages)).toBe(undefined)
  })
})
