import path from 'path'
import { Options, CheckType, MissingLanguagesStrategy } from './types'

export const PLUGIN_NAME = 'gatsby-plugin-multilingual'

export const CACHE_DIR = path.resolve('.cache', 'multilingual')
export const PAGES_REGISTRY_FILE = path.resolve(CACHE_DIR, 'pages.json')
export const NAMESPACES_REGISTRY_FILE = path.resolve(
  CACHE_DIR,
  'namespaces.json',
)
export const TRANSLATIONS_FILE = path.resolve(CACHE_DIR, 'translations.json')

export const DEFAULT_OPTIONS: Options = {
  defaultLanguage: 'en',
  availableLanguages: ['en'],
  defaultNamespace: 'common',
  includeDefaultLanguageInURL: false,
  missingLanguagesStrategy: MissingLanguagesStrategy.Ignore,
  removeInvalidPages: true,
  checks: {
    missingPaths: CheckType.Ignore,
    missingLanguageVersions: CheckType.Ignore,
    missingTranslationStrings: CheckType.Ignore,
  },
  rules: {},
  plugins: [],
}
