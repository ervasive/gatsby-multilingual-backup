import getPageGenericPath from '../get-page-generic-path'

const pages = {
  '/page': {
    en: '/page-custom-path-en',
    de: '/page-custom-path-de',
    es: '',
    'pt-br': '/page-custom-path-pt-br',
  },
  '/nested/page': {
    en: '/nested/page-custom-path-en',
    de: '/nested/page-custom-path-de',
    'pt-br': '/nested/page-custom-path-pt-br',
  },
}

describe(`getPageGenericPath`, () => {
  it(`should return existing generic path back`, () => {
    expect(getPageGenericPath('/', pages)).toBe('/')
    expect(getPageGenericPath('/page', pages)).toBe('/page')
    expect(getPageGenericPath('/nested/page', pages)).toBe('/nested/page')
  })

  it(`should return a generic path value on valid inputs`, () => {
    expect(getPageGenericPath('/en/page-custom-path-en', pages)).toBe('/page')
    expect(getPageGenericPath('/de/page-custom-path-de', pages)).toBe('/page')
    expect(getPageGenericPath('/pt-br/page-custom-path-pt-br', pages)).toBe(
      '/page',
    )

    expect(getPageGenericPath('/en/nested/page-custom-path-en', pages)).toBe(
      '/nested/page',
    )
    expect(getPageGenericPath('/de/nested/page-custom-path-de', pages)).toBe(
      '/nested/page',
    )
    expect(
      getPageGenericPath('/pt-br/nested/page-custom-path-pt-br', pages),
    ).toBe('/nested/page')

    expect(getPageGenericPath('/es/page', pages)).toBe('/page')
  })

  it(`should return undefined on invalid or non-existent path inputs`, () => {
    expect(getPageGenericPath('/non-existent-page', pages)).toBe(undefined)
    expect(getPageGenericPath('/en/non-existent-page', pages)).toBe(undefined)
    expect(getPageGenericPath('/en/nested/non-existent-page', pages)).toBe(
      undefined,
    )

    // Input without prepended slash
    expect(getPageGenericPath('page', pages)).toBe(undefined)
    expect(getPageGenericPath('en/page-custom-path-en', pages)).toBe(undefined)
    expect(getPageGenericPath('en/nested/page-custom-path-en', pages)).toBe(
      undefined,
    )

    // Language to custom path mismatch
    expect(getPageGenericPath('/en/page-custom-path-de', pages)).toBe(undefined)

    // Language to empty custom path mismatch
    expect(getPageGenericPath('/en/page', pages)).toBe(undefined)
  })
})
