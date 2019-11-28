import path from 'path'
import { Options, CheckType, MissingLanguagesStrategy } from './types'

export const PLUGIN_NAME = 'gatsby-plugin-multilingual'

export const CACHE_DIR = path.resolve('.cache', 'multilingual')
export const PAGES_REGISTRY_FILE = path.join(CACHE_DIR, 'pages.json')
export const NAMESPACES_REGISTRY_FILE = path.join(CACHE_DIR, 'namespaces.json')
export const TRANSLATIONS_FILE = path.join(CACHE_DIR, 'translations.json')

export const REGISTRIES_WRITING_INTERVAL = 1000

export const DEFAULT_OPTIONS: Options = {
  defaultLanguage: 'en',
  availableLanguages: ['en'],
  defaultNamespace: 'common',
  includeDefaultLanguageInURL: false,
  missingLanguagesStrategy: MissingLanguagesStrategy.Ignore,
  removeInvalidPages: true,
  checks: {
    missingPaths: CheckType.Warn,
    missingLanguageVersions: CheckType.Warn,
    missingTranslationStrings: CheckType.Warn,
  },
  rules: {},
  plugins: [],
}
