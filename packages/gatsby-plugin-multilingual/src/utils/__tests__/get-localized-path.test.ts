import { getOptions } from '../../utils'
import { getLocalizedPath } from '../get-localized-path'

describe('getLocalizedPath', () => {
  it('should prepend provided language to path value', () => {
    expect(getLocalizedPath('example', 'ru', getOptions())).toBe('/ru/example')
  })

  it('should replace a valid language prefix with the provided one', () => {
    const options = getOptions({ availableLanguages: ['en', 'ru'] })
    expect(getLocalizedPath('/en/example', 'ru', options)).toBe('/ru/example')
    expect(getLocalizedPath('/ru/example', 'ru', options)).toBe('/ru/example')
  })

  it('should ignore non available language key prefix', () => {
    const options = getOptions({ availableLanguages: ['en', 'ru'] })
    expect(getLocalizedPath('/en/example', 'ru', options)).toBe('/ru/example')
    expect(getLocalizedPath('/ru/example', 'ru', options)).toBe('/ru/example')
    expect(getLocalizedPath('/de/example', 'ru', options)).toBe(
      '/ru/de/example',
    )
  })

  it('should remove language prefix for default language when "options.includeDefaultLanguageInURL=false"', () => {
    const options = getOptions({
      availableLanguages: ['en', 'ru'],
      includeDefaultLanguageInURL: false,
    })

    expect(getLocalizedPath('/example', 'en', options)).toBe('/example')
    expect(getLocalizedPath('/en/example', 'en', options)).toBe('/example')
    expect(getLocalizedPath('/ru/example', 'en', options)).toBe('/example')
    expect(getLocalizedPath('/en/example', 'ru', options)).toBe('/ru/example')
    expect(getLocalizedPath('/ru/example', 'ru', options)).toBe('/ru/example')
  })
})
