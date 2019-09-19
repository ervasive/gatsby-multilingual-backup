import fc from 'fast-check'
import {
  isUndefined,
  isBoolean,
  isString,
  isArray,
  isPlainObject,
} from 'lodash'
import getValidatedOptions from '../get-validated-options'
import {} from 'util'

describe('getValidatedOptions', () => {
  it('should throw on invalid argument types', (): void => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isPlainObject(v) || isUndefined(v))),
        data => {
          expect((): void => {
            getValidatedOptions(data)
          }).toThrow(/invalid plugin options/i)
        },
      ),
    )
  })

  it('should throw on invalid "defaultLanguage" values', (): void => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isString(v) || isUndefined(v))),
        data => {
          expect((): void => {
            getValidatedOptions({ defaultLanguage: data })
          }).toThrow(/"defaultLanguage" value/i)
        },
      ),
    )
  })

  it('should throw on invalid "availableLanguages" values', (): void => {
    fc.assert(
      fc.property(
        fc
          .anything()
          // exclude empty arrays, string[], undefined
          .filter(
            v =>
              !(
                (isArray(v) && v.length === 0) ||
                (isArray(v) &&
                  v.every((item: any) => typeof item === 'string')) ||
                isUndefined(v)
              ),
          ),
        data => {
          expect((): void => {
            getValidatedOptions({ availableLanguages: data })
          }).toThrow(/"availableLanguages" value/i)
        },
      ),
    )
  })

  it('should throw on invalid "defaultNamespace" values', (): void => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isString(v) || isUndefined(v))),
        data => {
          expect((): void => {
            getValidatedOptions({ defaultNamespace: data })
          }).toThrow(/"defaultNamespace" value/i)
        },
      ),
    )
  })

  it('should throw on invalid "customSlugs" values', (): void => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isPlainObject(v) || isUndefined(v))),
        data => {
          expect((): void => {
            getValidatedOptions({ customSlugs: data })
          }).toThrow(/customSlugs" value/i)
        },
      ),
    )
  })

  // TODO: finish the test after Joi is updated to v16.x
  it.skip('should throw on invalid "customSlugs" shape', (): void => {
    ;[{ '/page-path': 1 }].map((value): void => {
      expect((): void => {
        getValidatedOptions({ customSlugs: value })
      }).toThrow(/"customSlugs" value/i)
    })
  })

  it('should throw on invalid "includeDefaultLanguageInURL" values', (): void => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isBoolean(v) || isUndefined(v))),
        data => {
          expect((): void => {
            getValidatedOptions({ includeDefaultLanguageInURL: data })
          }).toThrow(/"includeDefaultLanguageInURL" value/i)
        },
      ),
    )
  })

  it('should throw on invalid "strictPathChecks" values', (): void => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isBoolean(v) || isUndefined(v))),
        data => {
          expect((): void => {
            getValidatedOptions({ strictPathChecks: data })
          }).toThrow(/"strictPathChecks" value/i)
        },
      ),
    )
  })

  it('should throw on invalid "removeInvalidPages" values', (): void => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isBoolean(v) || isUndefined(v))),
        data => {
          expect((): void => {
            getValidatedOptions({ removeInvalidPages: data })
          }).toThrow(/"removeInvalidPages" value/i)
        },
      ),
    )
  })

  it('should throw on invalid "removeSkippedPages" values', (): void => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isBoolean(v) || isUndefined(v))),
        data => {
          expect((): void => {
            getValidatedOptions({ removeSkippedPages: data })
          }).toThrow(/"removeSkippedPages" value/i)
        },
      ),
    )
  })

  it('should add the default language to available languages', (): void => {
    const options = getValidatedOptions({
      defaultLanguage: 'fr',
      availableLanguages: ['de'],
    })
    expect(options.availableLanguages.length).toBe(2)
    expect(options.availableLanguages[0]).toBe('de')
    expect(options.availableLanguages[1]).toBe('fr')
  })

  it('should have unique available languages values', (): void => {
    const options = getValidatedOptions({
      defaultLanguage: 'fr',
      availableLanguages: ['fr', 'de', 'de', 'ru'],
    })
    expect(options.availableLanguages.length).toBe(3)
    expect(options.availableLanguages[0]).toBe('fr')
    expect(options.availableLanguages[1]).toBe('de')
    expect(options.availableLanguages[2]).toBe('ru')
  })
})
