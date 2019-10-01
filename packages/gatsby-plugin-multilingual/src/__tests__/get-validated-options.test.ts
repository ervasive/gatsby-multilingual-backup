import fc from 'fast-check'
import {
  isUndefined,
  isBoolean,
  isString,
  isArray,
  isPlainObject,
} from 'lodash'
import getValidatedOptions from '../get-validated-options'

describe('getValidatedOptions', () => {
  it('should throw on invalid argument types', (): void => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isPlainObject(v) || isUndefined(v))),
        data => {
          expect((): void => {
            getValidatedOptions(data)
          }).toThrow(/invalid options provided/i)
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
          }).toThrow(/invalid options provided/i)
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
          }).toThrow(/invalid options provided/i)
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
          }).toThrow(/invalid options provided/i)
        },
      ),
    )
  })

  it('should throw on invalid "mode" values', (): void => {
    fc.assert(
      fc.property(
        fc
          .anything()
          .filter(v => !(isUndefined(v) || v === 'greedy' || v === 'lazy')),
        data => {
          expect((): void => {
            getValidatedOptions({ mode: data })
          }).toThrow(/invalid options provided/i)
        },
      ),
    )
  })

  it('should throw on invalid "missingLanguagePages" values', (): void => {
    fc.assert(
      fc.property(
        fc
          .anything()
          .filter(
            v =>
              !(
                isUndefined(v) ||
                v === 'ignore' ||
                v === 'generate' ||
                v === 'redirect'
              ),
          ),
        data => {
          expect((): void => {
            getValidatedOptions({ missingLanguagePages: data })
          }).toThrow(/invalid options provided/i)
        },
      ),
    )
  })

  it('should throw on invalid "includeDefaultLanguageInURL" values', (): void => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isBoolean(v) || isUndefined(v))),
        data => {
          expect((): void => {
            getValidatedOptions({ includeDefaultLanguageInURL: data })
          }).toThrow(/invalid options provided/i)
        },
      ),
    )
  })

  it('should throw on invalid "pathOverrides" values', (): void => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isPlainObject(v) || isUndefined(v))),
        data => {
          expect((): void => {
            getValidatedOptions({ pathOverrides: data })
          }).toThrow(/invalid options provided/i)
        },
      ),
    )
  })

  it('should throw on invalid "strictChecks" values', (): void => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isPlainObject(v) || isUndefined(v))),
        data => {
          expect((): void => {
            getValidatedOptions({ strictChecks: data })
          }).toThrow(/invalid options provided/i)
        },
      ),
    )
  })

  it('should throw on invalid "strictChecks.paths" values', (): void => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isBoolean(v) || isUndefined(v))),
        data => {
          expect((): void => {
            getValidatedOptions({ strictChecks: { paths: data } })
          }).toThrow(/invalid options provided/i)
        },
      ),
    )
  })

  it('should throw on invalid "strictChecks.pages" values', (): void => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isBoolean(v) || isUndefined(v))),
        data => {
          expect((): void => {
            getValidatedOptions({ strictChecks: { pages: data } })
          }).toThrow(/invalid options provided/i)
        },
      ),
    )
  })

  it('should throw on invalid "strictChecks.translations" values', (): void => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isBoolean(v) || isUndefined(v))),
        data => {
          expect((): void => {
            getValidatedOptions({ strictChecks: { translations: data } })
          }).toThrow(/invalid options provided/i)
        },
      ),
    )
  })

  it('should throw on invalid "pathToRedirectTemplate" values', (): void => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isString(v) || isUndefined(v))),
        data => {
          expect((): void => {
            getValidatedOptions({ pathToRedirectTemplate: data })
          }).toThrow(/invalid options provided/i)
        },
      ),
    )
  })

  it('should set default values on undefined argument', (): void => {
    const result = getValidatedOptions()

    expect(result.defaultLanguage).toBe('en')
    expect(result.availableLanguages).toStrictEqual(['en'])
    expect(result.defaultNamespace).toBe('common')
    expect(result.mode).toBe('lazy')
    expect(result.missingLanguagePages).toBe('ignore')
    expect(result.includeDefaultLanguageInURL).toBe(false)
    expect(result.pathOverrides).toStrictEqual({})
    expect(result.strictChecks.paths).toBe(false)
    expect(result.strictChecks.pages).toBe(false)
    expect(result.strictChecks.translations).toBe(false)
    expect(result.pathToRedirectTemplate).toBe(undefined)
  })

  it('should add the default language to available languages array', (): void => {
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
