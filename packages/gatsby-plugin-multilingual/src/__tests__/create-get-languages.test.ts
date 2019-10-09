import fc from 'fast-check'
import { isString, isPlainObject, isUndefined, isBoolean } from 'lodash'
import createGetLanguages from '../create-get-languages'
import { StrictCheckType } from '../types'

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
              strict: StrictCheckType.Ignore,
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
              strict: StrictCheckType.Ignore,
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
              strict: StrictCheckType.Ignore,
            })({ skipCurrentLanguage })
          }).toThrow(/"getLanguages" function received invalid argument/i)
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
            createGetLanguages({
              pages,
              pageGenericPath: '/page-one',
              pageLanguage: 'en',
              defaultLanguage: 'en',
              includeDefaultLanguageInURL: false,
              strict: StrictCheckType.Ignore,
            })({ strict })
          }).toThrow(/"getLanguages" function received invalid argument/i)
        },
      ),
    )
  })

  it(`should throw an Error on a non-exitent "path" if "strict" is set to Error`, () => {
    const getLanguages = createGetLanguages({
      pages,
      pageGenericPath: '/page-one',
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: false,
      strict: StrictCheckType.Error,
    })

    expect(() => getLanguages('/non-exitent')).toThrow(/could not find a page/i)
    expect(() => getLanguages({ path: '/non-exitent' })).toThrow(
      /could not find a page/i,
    )
  })

  it(`should return an empty array on a non-exitent "path" if "strict" is set to Ignore`, () => {
    const getLanguages = createGetLanguages({
      pages,
      pageGenericPath: '/page-one',
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: false,
      strict: StrictCheckType.Ignore,
    })

    expect(getLanguages('/non-exitent')).toEqual([])
    expect(getLanguages({ path: '/non-exitent' })).toEqual([])
  })

  // TODO: add console.warn spy
  it(`should return an empty array and emit a warning on a non-exitent "path" if "strict" is set to Warn`, () => {
    const getLanguages = createGetLanguages({
      pages,
      pageGenericPath: '/page-one',
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: false,
      strict: StrictCheckType.Warn,
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
        strict: StrictCheckType.Ignore,
      })({ path: '/non-exitent', strict: StrictCheckType.Error }),
    ).toThrow(/could not find a page/i)

    expect(
      createGetLanguages({
        pages,
        pageGenericPath: '/page-one',
        pageLanguage: 'en',
        defaultLanguage: 'en',
        includeDefaultLanguageInURL: false,
        strict: StrictCheckType.Error,
      })({ path: '/non-exitent', strict: StrictCheckType.Ignore }),
    ).toEqual([])
  })

  it(`should return languages array for the current page if the path value was not provided`, () => {
    const getLanguages = createGetLanguages({
      pages,
      pageGenericPath: '/page-two',
      pageLanguage: 'en',
      defaultLanguage: 'en',
      includeDefaultLanguageInURL: true,
      strict: StrictCheckType.Ignore,
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
      strict: StrictCheckType.Ignore,
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
      strict: StrictCheckType.Ignore,
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
      strict: StrictCheckType.Ignore,
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
      strict: StrictCheckType.Ignore,
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
      strict: StrictCheckType.Ignore,
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
