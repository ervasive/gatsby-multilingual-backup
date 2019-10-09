import fc from 'fast-check'
import { isString, isPlainObject, isUndefined, isBoolean } from 'lodash'
import createGetPath from '../create-get-path'
import { StrictCheckType } from '../types'

const pages = {
  '/': {
    en: '',
    ru: '',
    de: '',
  },
  '/page-one': {
    en: '/page-path',
    ru: '/путь-к-странице',
    de: '',
  },
}

describe(`createGetPath`, () => {
  it(`should throw a TypeError on invalid argument types`, () => {
    fc.assert(
      fc.property(
        fc
          .anything()
          .filter(v => !(isUndefined(v) || isString(v) || isPlainObject(v))),
        data => {
          expect((): void => {
            createGetPath({
              pages,
              pageGenericPath: '/',
              pageLanguage: 'en',
              defaultLanguage: 'en',
              includeDefaultLanguageInURL: true,
              strict: StrictCheckType.Ignore,
            })(data)
          }).toThrow(/"getPath" function received invalid argument/i)
        },
      ),
    )
  })

  it(`should throw a TypeError on invalid argument object shape`, () => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isUndefined(v) || isString(v))),
        path => {
          expect((): void => {
            createGetPath({
              pages,
              pageGenericPath: '/',
              pageLanguage: 'en',
              defaultLanguage: 'en',
              includeDefaultLanguageInURL: true,
              strict: StrictCheckType.Ignore,
            })({ path })
          }).toThrow(/"getPath" function received invalid argument/i)
        },
      ),
    )

    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isUndefined(v) || isString(v))),
        language => {
          expect((): void => {
            createGetPath({
              pages,
              pageGenericPath: '/',
              pageLanguage: 'en',
              defaultLanguage: 'en',
              includeDefaultLanguageInURL: true,
              strict: StrictCheckType.Ignore,
            })({ language })
          }).toThrow(/"getPath" function received invalid argument/i)
        },
      ),
    )

    fc.assert(
      fc.property(
        fc
          .anything()
          .filter(
            v =>
              !(
                isUndefined(v) ||
                (isString(v) &&
                  [
                    StrictCheckType.Ignore,
                    StrictCheckType.Warn,
                    StrictCheckType.Error,
                  ].includes(v as StrictCheckType))
              ),
          ),
        strict => {
          expect((): void => {
            createGetPath({
              pages,
              pageGenericPath: '/',
              pageLanguage: 'en',
              defaultLanguage: 'en',
              includeDefaultLanguageInURL: true,
              strict: StrictCheckType.Ignore,
            })({ strict })
          }).toThrow(/"getPath" function received invalid argument/i)
        },
      ),
    )

    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isUndefined(v) || isBoolean(v))),
        generic => {
          expect((): void => {
            createGetPath({
              pages,
              pageGenericPath: '/',
              pageLanguage: 'en',
              defaultLanguage: 'en',
              includeDefaultLanguageInURL: true,
              strict: StrictCheckType.Ignore,
            })({ generic })
          }).toThrow(/"getPath" function received invalid argument/i)
        },
      ),
    )
  })

  it(`should throw on a non existent "path" if "strict" is set to Error`, () => {
    const getPath = createGetPath({
      pages,
      pageGenericPath: '/',
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: StrictCheckType.Error,
    })

    expect(() => getPath('/non-existent')).toThrow(/could not find a page/i)
    expect(() => getPath({ path: '/non-existent' })).toThrow(
      /could not find a page/i,
    )
  })

  it(`should return the value back on a non existent "path" if "strict" is set to Ignore`, () => {
    const getPath = createGetPath({
      pages,
      pageGenericPath: '/',
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: StrictCheckType.Ignore,
    })

    expect(getPath('/non-existent')).toBe('/non-existent')
    expect(getPath({ path: '/non-existent' })).toBe('/non-existent')
  })

  // TODO: add console.warn spy
  it(`should return the value back and emit a warning on a non existent "path" if "strict" is set to Warn`, () => {
    const getPath = createGetPath({
      pages,
      pageGenericPath: '/',
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: StrictCheckType.Warn,
    })

    expect(getPath('/non-existent')).toBe('/non-existent')
    expect(getPath({ path: '/non-existent' })).toBe('/non-existent')
  })

  it(`should return a correct "path" if the provided value is valid`, () => {
    const getPath = createGetPath({
      pages,
      pageGenericPath: '/',
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: StrictCheckType.Error,
    })

    expect(getPath()).toBe('/en')
    expect(getPath({})).toBe('/en')
    expect(getPath({ path: undefined })).toBe('/en')

    expect(getPath('/')).toBe('/en')
    expect(getPath({ path: '/' })).toBe('/en')

    expect(getPath('/ru/')).toBe('/en')
    expect(getPath({ path: '/ru/' })).toBe('/en')

    expect(getPath('/en/page-path')).toBe('/en/page-path')
    expect(getPath({ path: '/en/page-path' })).toBe('/en/page-path')

    expect(getPath('/ru/путь-к-странице')).toBe('/en/page-path')
    expect(getPath({ path: '/ru/путь-к-странице' })).toBe('/en/page-path')

    expect(getPath('/de/page-one')).toBe('/en/page-path')
    expect(getPath({ path: '/de/page-one' })).toBe('/en/page-path')
  })

  it(`should return the provided value back if it is not in the form of relative path`, () => {
    const getPath = createGetPath({
      pages,
      pageGenericPath: '/',
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: StrictCheckType.Ignore,
    })

    expect(getPath('https://sample.org')).toEqual('https://sample.org')
    expect(getPath({ path: 'https://sample.org' })).toEqual(
      'https://sample.org',
    )

    expect(getPath('//sample.org')).toEqual('//sample.org')
    expect(getPath({ path: '//sample.org' })).toEqual('//sample.org')

    expect(getPath('sample.org:9090')).toEqual('sample.org:9090')
    expect(getPath({ path: 'sample.org:9090' })).toEqual('sample.org:9090')
  })

  it(`should preserve query string and fragment value of the provided path`, () => {
    const getPath = createGetPath({
      pages,
      pageGenericPath: '/',
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: StrictCheckType.Ignore,
    })

    expect(getPath('/ru/путь-к-странице?var=1#fragment')).toEqual(
      '/en/page-path?var=1#fragment',
    )
    expect(getPath({ path: '/ru/путь-к-странице?var=1#fragment' })).toEqual(
      '/en/page-path?var=1#fragment',
    )
  })

  it(`should throw on non existent "language" value and "strict checks" enabled`, () => {
    const getPath = createGetPath({
      pages,
      pageGenericPath: '/',
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: StrictCheckType.Error,
    })

    expect(() => getPath({ path: '/', language: 'es' })).toThrow(
      /could not find a page/i,
    )

    expect(() =>
      getPath({ path: '/ru/путь-к-странице', language: 'es' }),
    ).toThrow(/could not find a page/i)
  })

  it(`should throw on non existent "language" value and "strict checks" disabled`, () => {
    const getPath = createGetPath({
      pages,
      pageGenericPath: '/',
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: StrictCheckType.Ignore,
    })

    expect(() => getPath({ path: '/', language: 'es' })).toThrow(
      /could not find a page/i,
    )

    expect(() =>
      getPath({ path: '/ru/путь-к-странице', language: 'es' }),
    ).toThrow(/could not find a page/i)
  })

  it(`should return the correct path with custom, valid language value`, () => {
    const getPath = createGetPath({
      pages,
      pageGenericPath: '/',
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: StrictCheckType.Error,
    })

    expect(getPath({ path: '/', language: 'ru' })).toBe('/ru')
    expect(getPath({ path: '/en/page-path', language: 'ru' })).toBe(
      '/ru/путь-к-странице',
    )
  })

  it(`should override global strict checks with the one specified inline`, () => {
    expect(() =>
      createGetPath({
        pages,
        pageGenericPath: '/',
        pageLanguage: 'en',
        defaultLanguage: 'en',
        includeDefaultLanguageInURL: false,
        strict: StrictCheckType.Ignore,
      })({ path: '/non-existent', strict: StrictCheckType.Error }),
    ).toThrow(/could not find a page/i)

    expect(
      createGetPath({
        pages,
        pageGenericPath: '/',
        pageLanguage: 'en',
        defaultLanguage: 'en',
        includeDefaultLanguageInURL: false,
        strict: StrictCheckType.Error,
      })({ path: '/non-existent', strict: StrictCheckType.Ignore }),
    ).toBe('/non-existent')
  })

  it(`should return a generic path value on "generic=true" flag`, () => {
    const getPath = createGetPath({
      pages,
      pageGenericPath: '/',
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: StrictCheckType.Error,
    })

    expect(getPath({ path: '/', generic: true })).toBe('/')
    expect(getPath({ path: '/en/page-path', generic: true })).toBe('/page-one')
    expect(getPath({ path: '/ru/путь-к-странице', generic: true })).toBe(
      '/page-one',
    )
  })
})
