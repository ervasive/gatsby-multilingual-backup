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
  const getLanguages = createGetLanguages({
    pages,
    pageGenericPath: '/page-one',
    pageLanguage: 'en',
    strict: false,
  })

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
        fc.anything().filter(v => !(isBoolean(v) || isUndefined(v))),
        fc.anything().filter(v => !(isBoolean(v) || isUndefined(v))),
        (path, skipCurrentLanguage, strict) => {
          expect((): void => {
            createGetLanguages({
              pages,
              pageGenericPath: '/page-one',
              pageLanguage: 'en',
              strict: false,
            })({ path, skipCurrentLanguage, strict })
          }).toThrow(/"getLanguages" function received invalid argument/i)
        },
      ),
    )
  })

  it(`should throw an Error on non-exitent page and strict=true flag`, () => {
    expect(() => getLanguages({ path: '/non-exitent', strict: true })).toThrow(
      /could not find a page/i,
    )
  })

  it(`should return an empty array on non-existent page and strict=false flag`, () => {
    expect(getLanguages({ path: '/non-exitent', strict: false })).toEqual([])
  })

  it(`should return languages array for the current page if the path was not provided`, () => {
    expect(getLanguages()).toEqual([
      { language: 'en', path: '/en/page-one-path' },
      { language: 'ru', path: '/ru/путь-к-странице-один' },
      { language: 'de', path: '/de/page-one' },
    ])

    expect(getLanguages({ path: undefined })).toEqual([
      { language: 'en', path: '/en/page-one-path' },
      { language: 'ru', path: '/ru/путь-к-странице-один' },
      { language: 'de', path: '/de/page-one' },
    ])
  })

  it(`should return languages array for provided page path as a string`, () => {
    expect(getLanguages('/page-two')).toEqual([
      { language: 'en', path: '/en/page-two-path' },
      { language: 'ru', path: '/ru/путь-к-странице-два' },
      { language: 'de', path: '/de/page-two' },
    ])

    expect(getLanguages('/en/page-two-path')).toEqual([
      { language: 'en', path: '/en/page-two-path' },
      { language: 'ru', path: '/ru/путь-к-странице-два' },
      { language: 'de', path: '/de/page-two' },
    ])

    expect(getLanguages('/ru/путь-к-странице-два')).toEqual([
      { language: 'en', path: '/en/page-two-path' },
      { language: 'ru', path: '/ru/путь-к-странице-два' },
      { language: 'de', path: '/de/page-two' },
    ])

    expect(getLanguages('/de/page-two')).toEqual([
      { language: 'en', path: '/en/page-two-path' },
      { language: 'ru', path: '/ru/путь-к-странице-два' },
      { language: 'de', path: '/de/page-two' },
    ])
  })

  it(`should return languages array for provided page path as an object`, () => {
    expect(getLanguages({ path: '/page-two' })).toEqual([
      { language: 'en', path: '/en/page-two-path' },
      { language: 'ru', path: '/ru/путь-к-странице-два' },
      { language: 'de', path: '/de/page-two' },
    ])

    expect(getLanguages({ path: '/en/page-two-path' })).toEqual([
      { language: 'en', path: '/en/page-two-path' },
      { language: 'ru', path: '/ru/путь-к-странице-два' },
      { language: 'de', path: '/de/page-two' },
    ])

    expect(getLanguages({ path: '/ru/путь-к-странице-два' })).toEqual([
      { language: 'en', path: '/en/page-two-path' },
      { language: 'ru', path: '/ru/путь-к-странице-два' },
      { language: 'de', path: '/de/page-two' },
    ])

    expect(getLanguages({ path: '/de/page-two' })).toEqual([
      { language: 'en', path: '/en/page-two-path' },
      { language: 'ru', path: '/ru/путь-к-странице-два' },
      { language: 'de', path: '/de/page-two' },
    ])
  })

  it(`should return languages array skipping the "current language" if the flag skipCurrentLanguage=true`, () => {
    expect(
      getLanguages({ path: '/page-one', skipCurrentLanguage: true }),
    ).toEqual([
      { language: 'ru', path: '/ru/путь-к-странице-один' },
      { language: 'de', path: '/de/page-one' },
    ])
  })
})
