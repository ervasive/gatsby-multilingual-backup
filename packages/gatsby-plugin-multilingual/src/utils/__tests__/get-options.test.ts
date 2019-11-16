import getOptions from '../get-options'
import { DEFAULT_OPTIONS } from '../constants'
import { Options, MissingLanguagesStrategy, CheckType } from '../types'

describe('getOptions', () => {
  it('should set default values on undefined argument', (): void => {
    expect(getOptions()).toStrictEqual(DEFAULT_OPTIONS)
  })

  it('should override default options from the provided argument', (): void => {
    const source: Options = {
      defaultLanguage: 'de',
      availableLanguages: ['ru', 'es', 'de'],
      defaultNamespace: 'custom',
      missingLanguagesStrategy: MissingLanguagesStrategy.Generate,
      includeDefaultLanguageInURL: true,
      removeInvalidPages: true,
      rules: {},
      checks: {
        missingPaths: CheckType.Error,
        missingLanguageVersions: CheckType.Error,
        missingTranslationStrings: CheckType.Error,
      },
      plugins: [],
    }

    expect(getOptions(source)).toStrictEqual(source)
  })

  it('should add the default language to available languages array', (): void => {
    const options = getOptions({
      defaultLanguage: 'fr',
      availableLanguages: ['de'],
    })

    expect(options.availableLanguages.length).toBe(2)
    expect(options.availableLanguages[0]).toBe('de')
    expect(options.availableLanguages[1]).toBe('fr')
  })

  it('should have unique available languages values', (): void => {
    const options = getOptions({
      defaultLanguage: 'fr',
      availableLanguages: ['fr', 'de', 'de', 'ru'],
    })
    expect(options.availableLanguages.length).toBe(3)
    expect(options.availableLanguages[0]).toBe('fr')
    expect(options.availableLanguages[1]).toBe('de')
    expect(options.availableLanguages[2]).toBe('ru')
  })
})
