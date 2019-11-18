import { assert, property, anything } from 'fast-check'
import { isUndefined, isBoolean, isString, isPlainObject } from 'lodash'
import { createGetLanguages } from '../create-get-languages'
import { getOptions } from '../../utils'
import { CheckType } from '../../types'

const getLanguages = createGetLanguages({
  currentPageId: 'active',
  currentPageLanguage: 'en',
  pages: {
    active: { en: '/en/active', ru: '/ru/active' },
    other: { en: '/en/other', ru: '/ru/other' },
  },
  options: getOptions(),
})

describe('createGetLanguages', () => {
  it('should error out on invalid value types', () => {
    assert(
      property(
        anything().filter(
          v => !(isUndefined(v) || isString(v) || isPlainObject(v)),
        ),
        data => {
          expect(() => getLanguages(data)).toThrow(
            /The "getLanguages" function received invalid argument/i,
          )
        },
      ),
    )
  })

  it('should error out on invalid value.path types', () => {
    assert(
      property(
        anything().filter(v => !(isUndefined(v) || isString(v))),
        data => {
          expect(() => getLanguages({ path: data })).toThrow(
            /The "getLanguages" function received invalid argument/i,
          )
        },
      ),
    )
  })

  it('should error out on invalid value.skipCurrentLanguage types', () => {
    assert(
      property(
        anything().filter(v => !(isUndefined(v) || isBoolean(v))),
        data => {
          expect(() => getLanguages({ skipCurrentLanguage: data })).toThrow(
            /The "getLanguages" function received invalid argument/i,
          )
        },
      ),
    )
  })

  it('should error out on invalid value.onMissingPath types', () => {
    assert(
      property(
        anything().filter(
          v => !(isUndefined(v) || ['error', 'warn', 'ignore'].includes(v)),
        ),
        data => {
          expect(() => getLanguages({ onMissingPath: data })).toThrow(
            /The "getLanguages" function received invalid argument/i,
          )
        },
      ),
    )
  })

  it('should return languages for current page', () => {
    const result = [
      { isCurrent: true, language: 'en', path: '/en/active' },
      { isCurrent: false, language: 'ru', path: '/ru/active' },
    ]

    expect(getLanguages()).toStrictEqual(result)
    expect(getLanguages({})).toStrictEqual(result)
  })

  it('should return languages for existing page path', () => {
    const result = [
      { isCurrent: true, language: 'en', path: '/en/other' },
      { isCurrent: false, language: 'ru', path: '/ru/other' },
    ]

    expect(getLanguages('other')).toStrictEqual(result)
    expect(getLanguages({ path: 'other' })).toStrictEqual(result)
  })

  it('should skip value for current language', () => {
    const result = [{ isCurrent: false, language: 'ru', path: '/ru/other' }]

    expect(
      getLanguages({ path: 'other', skipCurrentLanguage: true }),
    ).toStrictEqual(result)
  })

  it('should throw on non-existent path and "onMissingPath=error"', () => {
    expect(() =>
      getLanguages({ path: 'non-existent', onMissingPath: CheckType.Error }),
    ).toThrow(/could not find a page with the following path/i)
  })

  it('should console.warn and return empty array on non-existent path and "onMissingPath=warn"', () => {
    const spy = jest.spyOn(global.console, 'warn').mockImplementation(() => {})

    expect(
      getLanguages({
        path: 'non-existent',
        onMissingPath: CheckType.Warn,
      }),
    ).toStrictEqual([])
    expect(spy).toHaveBeenCalledWith(
      expect.stringMatching(/could not find a page with the following path/i),
    )

    spy.mockRestore()
  })

  it('should simply return empty array on non-existent path and "onMissingPath=ignore"', () => {
    const spy = jest.spyOn(global.console, 'warn').mockImplementation(() => {})

    expect(
      getLanguages({ path: 'non-existent', onMissingPath: CheckType.Ignore }),
    ).toStrictEqual([])

    expect(spy).toHaveBeenCalledTimes(0)

    spy.mockRestore()
  })

  it('should preserve provided query string and hash values of a path', () => {
    const result = [
      { isCurrent: true, language: 'en', path: '/en/other?sample=val#val' },
      { isCurrent: false, language: 'ru', path: '/ru/other?sample=val#val' },
    ]

    expect(getLanguages('other?sample=val#val')).toStrictEqual(result)
    expect(getLanguages({ path: 'other?sample=val#val' })).toStrictEqual(result)
  })

  it('should return empty array on non relative path values', () => {
    expect(getLanguages('https://example.com')).toStrictEqual([])
    expect(getLanguages({ path: 'https://example.com' })).toStrictEqual([])
  })
})
