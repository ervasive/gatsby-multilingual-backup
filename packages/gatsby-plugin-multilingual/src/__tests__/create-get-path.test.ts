import createGetPath from '../create-get-path'

const pages = {
  '/page-one': {
    en: '/page-one-path',
    ru: '/путь-к-странице-один',
    de: '',
  },
}

describe(`createGetLanguages`, () => {
  const getPath = createGetPath(pages, 'en', false)

  it(`should throw a TypeError on invalid argument types and shape`, () => {
    ;[
      null,
      undefined,
      1,
      NaN,
      true,
      false,
      [],
      () => {},
      Symbol(''),
      {},
      { path: 1 },
      { path: '', language: 1 },
      { path: '', strict: 1 },
      { path: '', generic: 1 },
    ].map(value =>
      expect(() => getPath(value)).toThrow(
        /"getPath" function received invalid argument/i,
      ),
    )
  })

  it(`should throw an Error on non-existent page or language and strict=true flag`, () => {
    expect(() => getPath({ path: '/non-existent', strict: true })).toThrow(
      /could not find a page/i,
    )
    expect(() =>
      getPath({ path: '/page-one', language: 'es', strict: true }),
    ).toThrow(/could not find a page/i)
  })

  it(`should return the input path value back on non-existent page and strict=false flag`, () => {
    expect(getPath({ path: '/non-existent', strict: false })).toEqual(
      '/non-existent',
    )
  })

  it(`should return correct path values for string inputs`, () => {
    expect(getPath('/page-one')).toEqual('/en/page-one-path')
    expect(getPath('/en/page-one-path')).toEqual('/en/page-one-path')
    expect(getPath('/ru/путь-к-странице-один')).toEqual('/en/page-one-path')
    expect(getPath('/de/page-one')).toEqual('/en/page-one-path')

    expect(
      createGetPath({ '/page': { en: '', ru: '' } }, 'en', false)('/page'),
    ).toEqual('/en/page')
  })

  it(`should return correct path values for object inputs`, () => {
    expect(getPath({ path: '/page-one' })).toEqual('/en/page-one-path')
    expect(getPath({ path: '/en/page-one-path' })).toEqual('/en/page-one-path')
    expect(getPath({ path: '/ru/путь-к-странице-один' })).toEqual(
      '/en/page-one-path',
    )
    expect(getPath({ path: '/de/page-one' })).toEqual('/en/page-one-path')

    expect(
      createGetPath({ '/page': { en: '', ru: '' } }, 'en', false)({
        path: '/page',
      }),
    ).toEqual('/en/page')
  })

  it(`should return correct path values for specified default language`, () => {
    expect(getPath({ path: '/page-one', language: 'en' })).toEqual(
      '/en/page-one-path',
    )
    expect(getPath({ path: '/en/page-one-path', language: 'en' })).toEqual(
      '/en/page-one-path',
    )
    expect(
      getPath({ path: '/ru/путь-к-странице-один', language: 'en' }),
    ).toEqual('/en/page-one-path')
    expect(getPath({ path: '/de/page-one', language: 'en' })).toEqual(
      '/en/page-one-path',
    )
  })

  it(`should return correct path values for specified other language`, () => {
    expect(getPath({ path: '/page-one', language: 'ru' })).toEqual(
      '/ru/путь-к-странице-один',
    )
    expect(getPath({ path: '/en/page-one-path', language: 'ru' })).toEqual(
      '/ru/путь-к-странице-один',
    )
    expect(
      getPath({ path: '/ru/путь-к-странице-один', language: 'ru' }),
    ).toEqual('/ru/путь-к-странице-один')
    expect(getPath({ path: '/de/page-one', language: 'ru' })).toEqual(
      '/ru/путь-к-странице-один',
    )
  })

  it(`should return correct generic path values`, () => {
    expect(getPath({ path: '/page-one', generic: true })).toEqual('/page-one')
    expect(getPath({ path: '/en/page-one-path', generic: true })).toEqual(
      '/page-one',
    )
    expect(
      getPath({ path: '/ru/путь-к-странице-один', generic: true }),
    ).toEqual('/page-one')
    expect(getPath({ path: '/de/page-one', generic: true })).toEqual(
      '/page-one',
    )
  })
})
