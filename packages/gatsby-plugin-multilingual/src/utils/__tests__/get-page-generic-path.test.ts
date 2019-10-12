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
  it(`should get Nothing type on invalid inputs`, () => {
    expect(getPageGenericPath('', pages).toString()).toBe('Nothing')
    expect(getPageGenericPath('en', pages).toString()).toBe('Nothing')
    expect(getPageGenericPath('page', pages).toString()).toBe('Nothing')
  })

  it(`should get Nothing type on non existent generic paths`, () => {
    expect(getPageGenericPath('/page-two', pages).toString()).toBe('Nothing')
    expect(getPageGenericPath('/page-two/', pages).toString()).toBe('Nothing')
  })

  it(`should get Nothing type on non existent custom paths`, () => {
    expect(getPageGenericPath('/non-existent-page', pages).toString()).toBe(
      'Nothing',
    )
    expect(getPageGenericPath('/non-existent-page/', pages).toString()).toBe(
      'Nothing',
    )

    expect(getPageGenericPath('/en/non-existent-page', pages).toString()).toBe(
      'Nothing',
    )
    expect(getPageGenericPath('/en/non-existent-page/', pages).toString()).toBe(
      'Nothing',
    )

    expect(
      getPageGenericPath('/en/nested/non-existent-page', pages).toString(),
    ).toBe('Nothing')
    expect(
      getPageGenericPath('/en/nested/non-existent-page/', pages).toString(),
    ).toBe('Nothing')
  })

  it(`should return undefined on non existent path[language] values`, () => {
    expect(getPageGenericPath('/en/page', pages).toString()).toBe('Nothing')
    expect(getPageGenericPath('/en/page/', pages).toString()).toBe('Nothing')
  })

  it(`should return correct values for root path`, () => {
    expect(getPageGenericPath('/', pages).toString()).toBe('Just(/)')
    expect(getPageGenericPath('/', {}).toString()).toBe('Nothing')
  })

  it(`should return the root path if the provided value contains only an existing language`, () => {
    expect(getPageGenericPath('/en', pages).toString()).toBe('Just(/)')
    expect(getPageGenericPath('/en/', pages).toString()).toBe('Just(/)')
  })

  it(
    `should return a correct result for "language/generic-path" if the ` +
      `"generic-path/language" is present and it is an empty string`,
    () => {
      expect(getPageGenericPath('/es/page', pages).toString()).toBe(
        'Just(/page)',
      )
      expect(getPageGenericPath('/es/page/', pages).toString()).toBe(
        'Just(/page)',
      )
    },
  )

  it(`should return correct "generic path" value for valid inputs`, () => {
    expect(getPageGenericPath('/page', pages).toString()).toBe('Just(/page)')
    expect(getPageGenericPath('/page/', pages).toString()).toBe('Just(/page)')

    expect(
      getPageGenericPath('/en/page-custom-path-en', pages).toString(),
    ).toBe('Just(/page)')
    expect(
      getPageGenericPath('/en/page-custom-path-en/', pages).toString(),
    ).toBe('Just(/page)')

    expect(
      getPageGenericPath('/de/page-custom-path-de', pages).toString(),
    ).toBe('Just(/page)')
    expect(
      getPageGenericPath('/de/page-custom-path-de/', pages).toString(),
    ).toBe('Just(/page)')

    expect(
      getPageGenericPath('/pt-br/page-custom-path-pt-br', pages).toString(),
    ).toBe('Just(/page)')
    expect(
      getPageGenericPath('/pt-br/page-custom-path-pt-br/', pages).toString(),
    ).toBe('Just(/page)')

    expect(getPageGenericPath('/nested/page', pages).toString()).toBe(
      'Just(/nested/page)',
    )
    expect(getPageGenericPath('/nested/page/', pages).toString()).toBe(
      'Just(/nested/page)',
    )

    expect(
      getPageGenericPath('/en/nested/page-custom-path-en', pages).toString(),
    ).toBe('Just(/nested/page)')
    expect(
      getPageGenericPath('/en/nested/page-custom-path-en/', pages).toString(),
    ).toBe('Just(/nested/page)')

    expect(
      getPageGenericPath('/de/nested/page-custom-path-de', pages).toString(),
    ).toBe('Just(/nested/page)')
    expect(
      getPageGenericPath('/de/nested/page-custom-path-de/', pages).toString(),
    ).toBe('Just(/nested/page)')

    expect(
      getPageGenericPath(
        '/pt-br/nested/page-custom-path-pt-br',
        pages,
      ).toString(),
    ).toBe('Just(/nested/page)')
    expect(
      getPageGenericPath(
        '/pt-br/nested/page-custom-path-pt-br/',
        pages,
      ).toString(),
    ).toBe('Just(/nested/page)')
  })
})
