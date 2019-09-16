import createGetPath from '../create-get-path'

const pages = {
  '/page-one': {
    en: '/en/page-one-slug',
    ru: '/ru/путь-к-странице-один',
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
      getPath({ path: '/page-one', language: 'de', strict: true }),
    ).toThrow(/could not find a page/i)
  })

  it(`should return the input path value back on non-existent page and strict=false flag`, () => {
    expect(getPath({ path: '/non-existent', strict: false })).toEqual(
      '/non-existent',
    )

    expect(getPath({ path: '/non-existent', strict: false })).toEqual(
      '/non-existent',
    )
  })

  it(`should return correct path value`, () => {
    expect(getPath('/page-one')).toEqual('/en/page-one-slug')
    expect(getPath('/en/page-one-slug')).toEqual('/en/page-one-slug')
    expect(getPath('/ru/путь-к-странице-один')).toEqual('/en/page-one-slug')

    expect(getPath({ path: '/page-one' })).toEqual('/en/page-one-slug')
    expect(getPath({ path: '/en/page-one-slug' })).toEqual('/en/page-one-slug')
    expect(getPath({ path: '/ru/путь-к-странице-один' })).toEqual(
      '/en/page-one-slug',
    )

    expect(getPath({ path: '/page-one', language: 'en' })).toEqual(
      '/en/page-one-slug',
    )
    expect(getPath({ path: '/en/page-one-slug', language: 'en' })).toEqual(
      '/en/page-one-slug',
    )
    expect(
      getPath({ path: '/ru/путь-к-странице-один', language: 'en' }),
    ).toEqual('/en/page-one-slug')

    expect(getPath({ path: '/page-one', language: 'ru' })).toEqual(
      '/ru/путь-к-странице-один',
    )
    expect(getPath({ path: '/en/page-one-slug', language: 'ru' })).toEqual(
      '/ru/путь-к-странице-один',
    )
    expect(
      getPath({ path: '/ru/путь-к-странице-один', language: 'ru' }),
    ).toEqual('/ru/путь-к-странице-один')

    expect(getPath({ path: '/page-one', generic: true })).toEqual('/page-one')
    expect(getPath({ path: '/en/page-one-slug', generic: true })).toEqual(
      '/page-one',
    )
    expect(
      getPath({ path: '/ru/путь-к-странице-один', generic: true }),
    ).toEqual('/page-one')
  })
})
