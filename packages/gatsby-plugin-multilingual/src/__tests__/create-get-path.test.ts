import fc from 'fast-check'
import { isString, isPlainObject, isUndefined, isBoolean } from 'lodash'
import createGetPath from '../create-get-path'

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
          .filter(
            v => !(isString(v) || (isPlainObject(v) && Object.keys(v).length)),
          ),
        data => {
          expect((): void => {
            createGetPath({
              pages,
              pageLanguage: 'en',
              defaultLanguage: 'en',
              includeDefaultLanguageInURL: true,
              strict: false,
            })(data)
          }).toThrow(/"getPath" function received invalid argument/i)
        },
      ),
    )
  })

  it(`should throw a TypeError on invalid argument object shape`, () => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !isString(v)),
        fc.anything().filter(v => !(isString(v) || isUndefined(v))),
        fc.anything().filter(v => !(isBoolean(v) || isUndefined(v))),
        fc.anything().filter(v => !(isBoolean(v) || isUndefined(v))),
        (path, language, strict, generic) => {
          expect((): void => {
            createGetPath({
              pages,
              pageLanguage: 'en',
              defaultLanguage: 'en',
              includeDefaultLanguageInURL: true,
              strict: false,
            })({ path, language, strict, generic })
          }).toThrow(/"getPath" function received invalid argument/i)
        },
      ),
    )
  })

  it(`should throw on a non existent "path" if "strict checks" enabled`, () => {
    const getPath = createGetPath({
      pages,
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: true,
    })

    expect(() => getPath('/non-existent')).toThrow(/could not find a page/i)
    expect(() => getPath({ path: '/non-existent' })).toThrow(
      /could not find a page/i,
    )
  })

  it(`should return back a non existent "path" if "strict checks" disabled`, () => {
    const getPath = createGetPath({
      pages,
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: false,
    })

    expect(getPath('/non-existent')).toBe('/non-existent')
    expect(getPath({ path: '/non-existent' })).toBe('/non-existent')
  })

  it(`should return a correct "path" if the provided value is valid`, () => {
    const getPath = createGetPath({
      pages,
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: true,
    })

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
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: false,
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

  it(`should preserve query string and hash value of the provided path`, () => {
    const getPath = createGetPath({
      pages,
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: false,
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
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: true,
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
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: false,
    })

    expect(() => getPath({ path: '/', language: 'es' })).toThrow(
      /could not find a page/i,
    )

    expect(() =>
      getPath({ path: '/ru/путь-к-странице', language: 'es' }),
    ).toThrow(/could not find a page/i)
  })

  it(`should return a correct path with overriden valid language value`, () => {
    const getPath = createGetPath({
      pages,
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: true,
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
        pageLanguage: 'en',
        defaultLanguage: 'en',
        includeDefaultLanguageInURL: false,
        strict: false,
      })({ path: '/non-existent', strict: true }),
    ).toThrow(/could not find a page/i)

    expect(
      createGetPath({
        pages,
        pageLanguage: 'en',
        defaultLanguage: 'en',
        includeDefaultLanguageInURL: false,
        strict: true,
      })({ path: '/non-existent', strict: false }),
    ).toBe('/non-existent')
  })

  it(`should return a generic path value on "generic=true" flag`, () => {
    const getPath = createGetPath({
      pages,
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: true,
    })

    expect(getPath({ path: '/', generic: true })).toBe('/')
    expect(getPath({ path: '/en/page-path', generic: true })).toBe('/page-one')
    expect(getPath({ path: '/ru/путь-к-странице', generic: true })).toBe(
      '/page-one',
    )
  })
})
