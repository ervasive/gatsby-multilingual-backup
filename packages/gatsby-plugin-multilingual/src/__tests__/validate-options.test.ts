import validateOptions from '../validate-options'

describe('Validate options', (): void => {
  describe('defaultLanguage', (): void => {
    it('should throw on wrong values', (): void => {
      ;[true, NaN, 42, [], {}, Symbol('')].map((item): void => {
        expect((): void => {
          validateOptions({ defaultLanguage: item, plugins: [] })
        }).toThrow(/"defaultLanguage" value/i)
      })
    })
  })

  it('should not throw on allowed values', (): void => {
    ;['en', undefined].map((item): void => {
      expect((): void => {
        validateOptions({ defaultLanguage: item, plugins: [] })
      }).not.toThrow()
    })
  })

  describe('allowedLanguages', (): void => {
    it('should throw on wrong values', (): void => {
      ;[true, NaN, 42, {}, Symbol('')].map((item): void => {
        expect((): void => {
          validateOptions({ allowedLanguages: item, plugins: [] })
        }).toThrow(/"allowedLanguages" value/i)
      })
      ;[[true], [NaN], [42], [{}], [Symbol('')]].map((item): void => {
        expect((): void => {
          validateOptions({ allowedLanguages: item, plugins: [] })
        }).toThrow(/"allowedLanguages" value/i)
      })
    })
  })

  it('should not throw on allowed values', (): void => {
    ;[['en'], [], undefined].map((item): void => {
      expect((): void => {
        validateOptions({ allowedLanguages: item, plugins: [] })
      }).not.toThrow()
    })
  })

  describe('defaultNamespace', (): void => {
    it('should throw on wrong values', (): void => {
      ;[true, NaN, 42, [], {}, Symbol('')].map((item): void => {
        expect((): void => {
          validateOptions({ defaultNamespace: item, plugins: [] })
        }).toThrow(/"defaultNamespace" value/i)
      })
    })
  })

  it('should not throw on allowed values', (): void => {
    ;['common', undefined].map((item): void => {
      expect((): void => {
        validateOptions({ defaultNamespace: item, plugins: [] })
      }).not.toThrow()
    })
  })

  describe('includeDefaultLanguageInURL', (): void => {
    it('should throw on wrong values', (): void => {
      ;[NaN, 42, 'string', [], {}, Symbol('')].map((item): void => {
        expect((): void => {
          validateOptions({ includeDefaultLanguageInURL: item, plugins: [] })
        }).toThrow(/"includeDefaultLanguageInURL" value/i)
      })
    })
  })

  it('should not throw on allowed values', (): void => {
    ;[true, false, undefined].map((item): void => {
      expect((): void => {
        validateOptions({ includeDefaultLanguageInURL: item, plugins: [] })
      }).not.toThrow()
    })
  })
})
