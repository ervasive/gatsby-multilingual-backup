import fc from 'fast-check'
import { isString, isPlainObject, isUndefined, isBoolean } from 'lodash'
import createGetLanguages from '../create-get-languages'

const pages = {
  '/': {
    en: '',
    ru: '',
    de: '',
  },
  '/page-one': {
    en: '/page-one-path',
    ru: '/путь-к-странице-один',
    de: '',
  },
  '/page-two': {
    en: '/page-two-path',
    ru: '/путь-к-странице-два',
    de: '',
  },
}

describe(`createGetLanguages`, () => {
  it(`should throw a TypeError on invalid argument types`, () => {
    fc.assert(
      fc.property(
        fc
          .anything()
          .filter(v => !(isUndefined(v) || isString(v) || isPlainObject(v))),
        data => {
          expect((): void => {
            createGetLanguages({
              pages,
              pageGenericPath: '/page-one',
              pageLanguage: 'en',
              defaultLanguage: 'en',
              includeDefaultLanguageInURL: false,
              strict: false,
            })(data)
          }).toThrow(/"getLanguages" function received invalid argument/i)
        },
      ),
    )
  })

  it(`should throw a TypeError on invalid argument object shape`, () => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isString(v) || isUndefined(v))),
        path => {
          expect((): void => {
            createGetLanguages({
              pages,
              pageGenericPath: '/page-one',
              pageLanguage: 'en',
              defaultLanguage: 'en',
              includeDefaultLanguageInURL: false,
              strict: false,
            })({ path })
          }).toThrow(/"getLanguages" function received invalid argument/i)
        },
      ),
    )

    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isBoolean(v) || isUndefined(v))),
        skipCurrentLanguage => {
          expect((): void => {
            createGetLanguages({
              pages,
              pageGenericPath: '/page-one',
              pageLanguage: 'en',
              defaultLanguage: 'en',
              includeDefaultLanguageInURL: false,
              strict: false,
            })({ skipCurrentLanguage })
          }).toThrow(/"getLanguages" function received invalid argument/i)
        },
      ),
    )

    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isBoolean(v) || isUndefined(v))),
        strict => {
          expect((): void => {
            createGetLanguages({
              pages,
              pageGenericPath: '/page-one',
              pageLanguage: 'en',
              defaultLanguage: 'en',
              includeDefaultLanguageInURL: false,
              strict: false,
            })({ strict })
          }).toThrow(/"getLanguages" function received invalid argument/i)
        },
      ),
    )
  })

  it(`should throw an Error on a non-exitent "path" if "strict checks" enabled`, () => {
    const getLanguages = createGetLanguages({
      pages,
      pageGenericPath: '/page-one',
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: false,
      strict: true,
    })

    expect(() => getLanguages('/non-exitent')).toThrow(/could not find a page/i)
    expect(() => getLanguages({ path: '/non-exitent' })).toThrow(
      /could not find a page/i,
    )
  })

  it(`should return an empty array on a non-exitent "path" if "strict checks" disabled`, () => {
    const getLanguages = createGetLanguages({
      pages,
      pageGenericPath: '/page-one',
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: false,
      strict: false,
    })

    expect(getLanguages('/non-exitent')).toEqual([])
    expect(getLanguages({ path: '/non-exitent' })).toEqual([])
  })

  it(`should override global strict checks with the one specified inline`, () => {
    expect(() =>
      createGetLanguages({
        pages,
        pageGenericPath: '/page-one',
        pageLanguage: 'en',
        defaultLanguage: 'en',
        includeDefaultLanguageInURL: false,
        strict: false,
      })({ path: '/non-exitent', strict: true }),
    ).toThrow(/could not find a page/i)

    expect(
      createGetLanguages({
        pages,
        pageGenericPath: '/page-one',
        pageLanguage: 'en',
        defaultLanguage: 'en',
        includeDefaultLanguageInURL: false,
        strict: true,
      })({ path: '/non-exitent', strict: false }),
    ).toEqual([])
  })

  it(`should return languages array for the current page if the path value was not provided`, () => {
    const getLanguages = createGetLanguages({
      pages,
      pageGenericPath: '/page-two',
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: false,
    })

    const expected = [
      { language: 'en', path: '/en/page-two-path', isCurrent: true },
      { language: 'ru', path: '/ru/путь-к-странице-два', isCurrent: false },
      { language: 'de', path: '/de/page-two', isCurrent: false },
    ]

    expect(getLanguages()).toEqual(expected)
    expect(getLanguages({ path: undefined })).toEqual(expected)
  })

  it(`should return languages array for provided existing page path`, () => {
    const getLanguages = createGetLanguages({
      pages,
      pageGenericPath: '/page-one',
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: false,
    })

    const expected = [
      { language: 'en', path: '/en/page-two-path', isCurrent: true },
      { language: 'ru', path: '/ru/путь-к-странице-два', isCurrent: false },
      { language: 'de', path: '/de/page-two', isCurrent: false },
    ]

    expect(getLanguages('/page-two')).toEqual(expected)
    expect(getLanguages({ path: '/page-two' })).toEqual(expected)

    expect(getLanguages('/en/page-two-path')).toEqual(expected)
    expect(getLanguages({ path: '/en/page-two-path' })).toEqual(expected)

    expect(getLanguages('/ru/путь-к-странице-два')).toEqual(expected)
    expect(getLanguages({ path: '/ru/путь-к-странице-два' })).toEqual(expected)

    expect(getLanguages('/de/page-two')).toEqual(expected)
    expect(getLanguages({ path: '/de/page-two' })).toEqual(expected)
  })

  it(`should set isCurrent=true correctly if the "pageLanguage" differs from the "defaultLanguage"`, () => {
    const getLanguages = createGetLanguages({
      pages,
      pageGenericPath: '/page-one',
      pageLanguage: 'ru',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: false,
    })

    const expected = [
      { language: 'en', path: '/en/page-two-path', isCurrent: false },
      { language: 'ru', path: '/ru/путь-к-странице-два', isCurrent: true },
      { language: 'de', path: '/de/page-two', isCurrent: false },
    ]

    expect(getLanguages('/page-two')).toEqual(expected)
    expect(getLanguages({ path: '/page-two' })).toEqual(expected)

    expect(getLanguages('/en/page-two-path')).toEqual(expected)
    expect(getLanguages({ path: '/en/page-two-path' })).toEqual(expected)

    expect(getLanguages('/ru/путь-к-странице-два')).toEqual(expected)
    expect(getLanguages({ path: '/ru/путь-к-странице-два' })).toEqual(expected)

    expect(getLanguages('/de/page-two')).toEqual(expected)
    expect(getLanguages({ path: '/de/page-two' })).toEqual(expected)
  })

  it(`should return languages array skipping the "current language"`, () => {
    const getLanguages = createGetLanguages({
      pages,
      pageGenericPath: '/page-one',
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: false,
      strict: false,
    })

    expect(
      getLanguages({ path: '/page-one', skipCurrentLanguage: true }),
    ).toEqual([
      { language: 'ru', path: '/ru/путь-к-странице-один', isCurrent: false },
      { language: 'de', path: '/de/page-one', isCurrent: false },
    ])
  })

  it(`should return an empty array if the provided path is not relative`, () => {
    const getLanguages = createGetLanguages({
      pages,
      pageGenericPath: '/page-one',
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: false,
    })

    expect(getLanguages('https://sample.org')).toEqual([])
    expect(getLanguages({ path: 'https://sample.org' })).toEqual([])

    expect(getLanguages('//sample.org')).toEqual([])
    expect(getLanguages({ path: '//sample.org' })).toEqual([])

    expect(getLanguages('sample.org:9090')).toEqual([])
    expect(getLanguages({ path: 'sample.org:9090' })).toEqual([])
  })

  it(`should pass query string and fragments to the resulting array values`, () => {
    const getLanguages = createGetLanguages({
      pages,
      pageGenericPath: '/page-one',
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: false,
    })

    const expected = [
      {
        language: 'en',
        path: '/en/page-two-path?var=val#fragment',
        isCurrent: true,
      },
      {
        language: 'ru',
        path: '/ru/путь-к-странице-два?var=val#fragment',
        isCurrent: false,
      },
      {
        language: 'de',
        path: '/de/page-two?var=val#fragment',
        isCurrent: false,
      },
    ]

    expect(getLanguages('/page-two?var=val#fragment')).toEqual(expected)
    expect(getLanguages({ path: '/page-two?var=val#fragment' })).toEqual(
      expected,
    )
  })
})
