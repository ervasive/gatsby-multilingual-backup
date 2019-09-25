import getPagePrefixedPath from '../get-page-prefixed-path'

const pages = {
  '/': {
    en: '',
    de: '',
  },
  '/page': {
    en: '/page-custom-path-en',
    de: '/page-custom-path-de',
    es: '',
  },
}

describe(`getPagePrefixedPath`, () => {
  it(`should return correct values for root path`, () => {
    expect(
      getPagePrefixedPath({
        genericPath: '/',
        language: 'en',
        defaultLanguage: 'en',
        includeDefaultLanguageInURL: false,
        pages,
      }),
    ).toBe('/')

    expect(
      getPagePrefixedPath({
        genericPath: '/',
        language: 'en',
        defaultLanguage: 'en',
        includeDefaultLanguageInURL: true,
        pages,
      }),
    ).toBe('/en')

    expect(
      getPagePrefixedPath({
        genericPath: '/',
        language: 'de',
        defaultLanguage: 'en',
        includeDefaultLanguageInURL: false,
        pages,
      }),
    ).toBe('/de')

    expect(
      getPagePrefixedPath({
        genericPath: '/',
        language: 'de',
        defaultLanguage: 'en',
        includeDefaultLanguageInURL: true,
        pages,
      }),
    ).toBe('/de')
  })

  it(`should return correct values for non empty path`, () => {
    expect(
      getPagePrefixedPath({
        genericPath: '/page',
        language: 'en',
        defaultLanguage: 'en',
        includeDefaultLanguageInURL: false,
        pages,
      }),
    ).toBe('/page-custom-path-en')

    expect(
      getPagePrefixedPath({
        genericPath: '/page',
        language: 'en',
        defaultLanguage: 'en',
        includeDefaultLanguageInURL: true,
        pages,
      }),
    ).toBe('/en/page-custom-path-en')

    expect(
      getPagePrefixedPath({
        genericPath: '/page',
        language: 'de',
        defaultLanguage: 'en',
        includeDefaultLanguageInURL: false,
        pages,
      }),
    ).toBe('/de/page-custom-path-de')

    expect(
      getPagePrefixedPath({
        genericPath: '/page',
        language: 'de',
        defaultLanguage: 'en',
        includeDefaultLanguageInURL: true,
        pages,
      }),
    ).toBe('/de/page-custom-path-de')
  })

  it(`should return correct values for an empty path`, () => {
    expect(
      getPagePrefixedPath({
        genericPath: '/page',
        language: 'es',
        defaultLanguage: 'en',
        includeDefaultLanguageInURL: false,
        pages,
      }),
    ).toBe('/es/page')
  })

  it(`should pass the suffix value to the outputted path`, () => {
    expect(
      getPagePrefixedPath({
        genericPath: '/page',
        language: 'en',
        defaultLanguage: 'en',
        includeDefaultLanguageInURL: false,
        pages,
        suffix: `?var=val#fragment-id`,
      }),
    ).toBe('/page-custom-path-en?var=val#fragment-id')
  })
})
