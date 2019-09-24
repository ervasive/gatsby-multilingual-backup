import getPageGenericPath from '../get-page-generic-path'

const pages = {
  '/': {
    en: '',
    de: '',
  },
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
  it(`should return undefined values on invalid inputs`, () => {
    expect(getPageGenericPath('', pages)).toBe(undefined)
    expect(getPageGenericPath('en', pages)).toBe(undefined)
    expect(getPageGenericPath('page', pages)).toBe(undefined)
  })

  it(`should return undefined values on non existent generic paths`, () => {
    expect(getPageGenericPath('/page-two', pages)).toBe(undefined)
    expect(getPageGenericPath('/page-two/', pages)).toBe(undefined)
  })

  it(`should return undefined values on non existent custom paths`, () => {
    expect(getPageGenericPath('/non-existent-page', pages)).toBe(undefined)
    expect(getPageGenericPath('/non-existent-page/', pages)).toBe(undefined)

    expect(getPageGenericPath('/en/non-existent-page', pages)).toBe(undefined)
    expect(getPageGenericPath('/en/non-existent-page/', pages)).toBe(undefined)

    expect(getPageGenericPath('/en/nested/non-existent-page', pages)).toBe(
      undefined,
    )
    expect(getPageGenericPath('/en/nested/non-existent-page/', pages)).toBe(
      undefined,
    )
  })

  it(`should return undefined on non existent path[language] values`, () => {
    expect(getPageGenericPath('/en/page', pages)).toBe(undefined)
    expect(getPageGenericPath('/en/page/', pages)).toBe(undefined)
  })

  it(`should return correct values for root path`, () => {
    expect(getPageGenericPath('/', pages)).toBe('/')
    expect(getPageGenericPath('/', {})).toBe(undefined)
  })

  it(`should return the root path if the provided value contains only an existing language`, () => {
    expect(getPageGenericPath('/en', pages)).toBe('/')
    expect(getPageGenericPath('/en/', pages)).toBe('/')
  })

  it(
    `should return a correct result for "language/generic-path" if the ` +
      `"generic-path/language" is present and it is an empty string`,
    () => {
      expect(getPageGenericPath('/es/page', pages)).toBe('/page')
      expect(getPageGenericPath('/es/page/', pages)).toBe('/page')
    },
  )

  it(`should return correct "generic path" value for valid inputs`, () => {
    expect(getPageGenericPath('/page', pages)).toBe('/page')
    expect(getPageGenericPath('/page/', pages)).toBe('/page')

    expect(getPageGenericPath('/en/page-custom-path-en', pages)).toBe('/page')
    expect(getPageGenericPath('/en/page-custom-path-en/', pages)).toBe('/page')

    expect(getPageGenericPath('/de/page-custom-path-de', pages)).toBe('/page')
    expect(getPageGenericPath('/de/page-custom-path-de/', pages)).toBe('/page')

    expect(getPageGenericPath('/pt-br/page-custom-path-pt-br', pages)).toBe(
      '/page',
    )
    expect(getPageGenericPath('/pt-br/page-custom-path-pt-br/', pages)).toBe(
      '/page',
    )

    expect(getPageGenericPath('/nested/page', pages)).toBe('/nested/page')
    expect(getPageGenericPath('/nested/page/', pages)).toBe('/nested/page')

    expect(getPageGenericPath('/en/nested/page-custom-path-en', pages)).toBe(
      '/nested/page',
    )
    expect(getPageGenericPath('/en/nested/page-custom-path-en/', pages)).toBe(
      '/nested/page',
    )

    expect(getPageGenericPath('/de/nested/page-custom-path-de', pages)).toBe(
      '/nested/page',
    )
    expect(getPageGenericPath('/de/nested/page-custom-path-de/', pages)).toBe(
      '/nested/page',
    )

    expect(
      getPageGenericPath('/pt-br/nested/page-custom-path-pt-br', pages),
    ).toBe('/nested/page')
    expect(
      getPageGenericPath('/pt-br/nested/page-custom-path-pt-br/', pages),
    ).toBe('/nested/page')
  })
})
