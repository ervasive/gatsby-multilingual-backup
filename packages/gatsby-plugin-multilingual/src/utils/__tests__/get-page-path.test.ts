import getPagePath from '../get-page-path'

const pages = {
  '/page-one': {
    en: '/en/page-one-slug',
    ru: '/ru/путь-к-странице-один',
  },
}

describe(`getPagePath`, () => {
  it(`should throw a TypeError on invalid argument type or shape`, () => {
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
      { language: 'en', strict: true },
      { to: 1, language: 'en', strict: true },
      { to: '/path', language: 1, strict: true },
      { to: '/path', language: 'en', strict: 1 },
    ].map(value =>
      expect(() =>
        getPagePath(value, { language: 'en', strict: false }, pages),
      ).toThrow(/only "string" or "object"/is),
    )
  })

  it(`should return the correct path from generic path`, () => {
    expect(
      getPagePath('/page-one', { language: 'en', strict: false }, pages),
    ).toBe('/en/page-one-slug')

    expect(
      getPagePath('/page-one', { language: 'ru', strict: false }, pages),
    ).toBe('/ru/путь-к-странице-один')

    expect(
      getPagePath(
        { to: '/page-one' },
        { language: 'en', strict: false },
        pages,
      ),
    ).toBe('/en/page-one-slug')

    expect(
      getPagePath(
        { to: '/page-one' },
        { language: 'ru', strict: false },
        pages,
      ),
    ).toBe('/ru/путь-к-странице-один')

    expect(
      getPagePath(
        { to: '/page-one', language: 'en' },
        { language: 'ru', strict: false },
        pages,
      ),
    ).toBe('/en/page-one-slug')

    expect(
      getPagePath(
        { to: '/page-one', language: 'ru' },
        { language: 'en', strict: false },
        pages,
      ),
    ).toBe('/ru/путь-к-странице-один')
  })

  it(`should return the correct path from slug`, () => {
    expect(
      getPagePath(
        '/en/page-one-slug',
        { language: 'ru', strict: false },
        pages,
      ),
    ).toBe('/ru/путь-к-странице-один')

    expect(
      getPagePath(
        '/ru/путь-к-странице-один',
        { language: 'en', strict: false },
        pages,
      ),
    ).toBe('/en/page-one-slug')

    expect(
      getPagePath(
        { to: '/en/page-one-slug' },
        { language: 'ru', strict: false },
        pages,
      ),
    ).toBe('/ru/путь-к-странице-один')

    expect(
      getPagePath(
        { to: '/ru/путь-к-странице-один' },
        { language: 'en', strict: false },
        pages,
      ),
    ).toBe('/en/page-one-slug')

    expect(
      getPagePath(
        { to: '/en/page-one-slug', language: 'ru' },
        { language: 'en', strict: false },
        pages,
      ),
    ).toBe('/ru/путь-к-странице-один')

    expect(
      getPagePath(
        { to: '/ru/путь-к-странице-один', language: 'en' },
        { language: 'ru', strict: false },
        pages,
      ),
    ).toBe('/en/page-one-slug')
  })

  it(
    `should return the provided path value if it can't be found in pages ` +
      `registry and "strict" flag was not set`,
    () => {
      expect(
        getPagePath('/non-existent', { language: 'en', strict: false }, {}),
      ).toBe('/non-existent')

      expect(
        getPagePath('/non-existent', { language: 'en', strict: false }, pages),
      ).toBe('/non-existent')

      expect(
        getPagePath('/non-existent', { language: 'ru', strict: false }, pages),
      ).toBe('/non-existent')

      expect(
        getPagePath(
          { to: '/non-existent' },
          { language: 'en', strict: false },
          pages,
        ),
      ).toBe('/non-existent')

      expect(
        getPagePath(
          { to: '/non-existent' },
          { language: 'ru', strict: false },
          pages,
        ),
      ).toBe('/non-existent')

      expect(
        getPagePath(
          { to: '/non-existent', strict: false },
          { language: 'ru', strict: true },
          pages,
        ),
      ).toBe('/non-existent')
    },
  )

  it(
    `should throw an error if the page can't be found with the provided ` +
      `value and "strict" flag was set`,
    () => {
      expect(() =>
        getPagePath('/non-existent', { language: 'ru', strict: true }, pages),
      ).toThrow(/can't find a page with the following parameters/i)

      expect(() =>
        getPagePath('/non-existent', { language: 'ru', strict: true }, pages),
      ).toThrow(/can't find a page with the following parameters/i)

      expect(() =>
        getPagePath(
          { to: '/non-existent' },
          { language: 'en', strict: true },
          pages,
        ),
      ).toThrow(/can't find a page with the following parameters/i)

      expect(() =>
        getPagePath(
          { to: '/non-existent' },
          { language: 'ru', strict: true },
          pages,
        ),
      ).toThrow(/can't find a page with the following parameters/i)
    },
  )
})
