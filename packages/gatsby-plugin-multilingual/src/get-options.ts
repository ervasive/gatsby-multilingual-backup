import merge from 'lodash/merge'
import { PluginOptions, PluginValidatedOptions } from './types'

const defaultOptions: PluginValidatedOptions = {
  defaultLanguage: 'en',
  availableLanguages: ['en'],
  defaultNamespace: 'common',
  includeDefaultLanguageInURL: false,
  removeInvalidPages: true,
  removeSkippedPages: true,
  customSlugs: {},
  defaultTranslationsLoader: {
    path: 'translations',
    priority: 0,
    disable: false,
  },
  plugins: [],
}

export default (options?: PluginOptions): PluginValidatedOptions => {
  const merged: PluginValidatedOptions = merge({}, defaultOptions, options)

  if (!merged.availableLanguages.includes(merged.defaultLanguage)) {
    merged.availableLanguages.push(merged.defaultLanguage)
  }

  merged.availableLanguages = Array.from(new Set(merged.availableLanguages))

  return merged
}
