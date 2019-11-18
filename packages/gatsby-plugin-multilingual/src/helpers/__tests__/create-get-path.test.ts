import { assert, property, anything } from 'fast-check'
import { isUndefined, isString, isPlainObject } from 'lodash'
import { createGetPath } from '../create-get-path'
import { getOptions } from '../../utils'
import { CheckType } from '../../types'

const getPath = createGetPath({
  currentPageId: 'active',
  currentPageLanguage: 'en',
  pages: {
    active: { en: '/en/active', ru: '/ru/active' },
    other: { en: '/en/other', ru: '/ru/other' },
  },
  options: getOptions(),
})

describe('createGetPath', () => {
  it('should error out on invalid value types', () => {
    assert(
      property(
        anything().filter(
          v => !(isUndefined(v) || isString(v) || isPlainObject(v)),
        ),
        data => {
          expect(() => getPath(data)).toThrow(
            /The "getPath" function received invalid argument/i,
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
          expect(() => getPath({ path: data })).toThrow(
            /The "getPath" function received invalid argument/i,
          )
        },
      ),
    )
  })

  it('should error out on invalid value.language types', () => {
    assert(
      property(
        anything().filter(v => !(isUndefined(v) || isString(v))),
        data => {
          expect(() => getPath({ language: data })).toThrow(
            /The "getPath" function received invalid argument/i,
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
          expect(() => getPath({ onMissingPath: data })).toThrow(
            /The "getPath" function received invalid argument/i,
          )
        },
      ),
    )
  })

  it('should return localized path for current page', () => {
    expect(getPath()).toBe('/en/active')
    expect(getPath({ language: 'ru' })).toBe('/ru/active')
  })

  it('should return localized path for existing page', () => {
    const result = '/en/other'

    expect(getPath('other')).toBe(result)
    expect(getPath('/en/other')).toBe(result)
    expect(getPath('/ru/other')).toBe(result)
  })

  it('should return localized path for existing language', () => {
    const result = '/ru/other'

    expect(getPath({ path: 'other', language: 'ru' })).toBe(result)
    expect(getPath({ path: '/en/other', language: 'ru' })).toBe(result)
    expect(getPath({ path: '/ru/other', language: 'ru' })).toBe(result)
  })

  it('should throw on non-existent path and "onMissingPath=error"', () => {
    expect(() =>
      getPath({ path: 'non-existent', onMissingPath: CheckType.Error }),
    ).toThrow(
      /could not find a page with the "non-existent" path and "en" language values/i,
    )

    expect(() =>
      getPath({
        path: 'non-existent',
        language: 'ru',
        onMissingPath: CheckType.Error,
      }),
    ).toThrow(
      /could not find a page with the "non-existent" path and "ru" language values/i,
    )
  })

  it('should console.warn and return provided path on non-existent path and "onMissingPath=warn"', () => {
    const spy = jest.spyOn(global.console, 'warn').mockImplementation(() => {})

    expect(
      getPath({ path: 'non-existent', onMissingPath: CheckType.Warn }),
    ).toBe('non-existent')

    expect(
      getPath({
        path: 'non-existent',
        language: 'ru',
        onMissingPath: CheckType.Warn,
      }),
    ).toBe('non-existent')

    expect(spy).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(
        /could not find a page with the "non-existent" path and "en" language values/i,
      ),
    )

    expect(spy).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(
        /could not find a page with the "non-existent" path and "ru" language values/i,
      ),
    )

    spy.mockRestore()
  })

  it('should simply return provided path on non-existent path and "onMissingPath=ignore"', () => {
    const spy = jest.spyOn(global.console, 'warn').mockImplementation(() => {})

    expect(
      getPath({ path: 'non-existent', onMissingPath: CheckType.Ignore }),
    ).toBe('non-existent')

    expect(
      getPath({
        path: 'non-existent',
        language: 'ru',
        onMissingPath: CheckType.Ignore,
      }),
    ).toBe('non-existent')

    expect(spy).toHaveBeenCalledTimes(0)

    spy.mockRestore()
  })

  it('should preserve provided query string and hash values of a path', () => {
    const result = '/en/other?sample=val#val'

    expect(getPath('other?sample=val#val')).toStrictEqual(result)
    expect(getPath({ path: '/en/other?sample=val#val' })).toStrictEqual(result)
    expect(getPath({ path: '/ru/other?sample=val#val' })).toStrictEqual(result)
  })

  it('should return provided path on non relative path values', () => {
    const val = 'https://example.com'

    expect(getPath(val)).toStrictEqual(val)
    expect(getPath({ path: val })).toStrictEqual(val)
  })
})
