import getOptions from '../get-options'

describe('Get options', (): void => {
  it(
    `should guarantee that 'defaultLanguage' value is included in ` +
      `'availableLanguages' array`,
    (): void => {
      const result = getOptions({
        defaultLanguage: 'ru',
        availableLanguages: ['en'],
        plugins: [],
      })
      expect(result.availableLanguages).toContain('ru')
    },
  )

  it(
    `should guarantee that 'availableLanguages' value consists of unique ` +
      `elements`,
    (): void => {
      const result = getOptions({
        availableLanguages: ['en', 'en', 'ru'],
        plugins: [],
      })
      expect(result.availableLanguages).toEqual(
        Array.from(new Set(result.availableLanguages)),
      )
    },
  )
})
