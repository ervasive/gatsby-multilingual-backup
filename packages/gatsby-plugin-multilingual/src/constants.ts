import path from 'path'
import {
  Options,
  Mode,
  CheckType,
  MissingLanguages,
  TranslationsBundling,
} from './types'

export const PLUGIN_NAME = 'gatsby-plugin-multilingual'

export const CACHE_DIR = path.resolve('.cache', 'multilingual')
export const PUBLIC_DIR = path.resolve('public')
export const PUBLIC_TRANSLATIONS_DIR = path.resolve(PUBLIC_DIR, 'translations')

export const PAGES_REGISTRY_FILE = path.resolve(CACHE_DIR, 'pages.json')
export const PATHNAMES_REGISTRY_FILE = path.resolve(CACHE_DIR, 'pathnames.json')
export const NAMESPACES_FILE = path.resolve(CACHE_DIR, 'namespaces.json')
export const TRANSLATIONS_FILE = path.resolve(CACHE_DIR, 'translations.json')
export const REDIRECT_TEMPLATE_FILE = path.resolve(CACHE_DIR, 'Redirect.js')

export const DEFAULT_OPTIONS: Options = {
  defaultLanguage: 'en',
  availableLanguages: ['en'],
  defaultNamespace: 'common',
  includeDefaultLanguageInURL: false,
  mode: Mode.Lazy,
  missingLanguages: MissingLanguages.Ignore,
  translationsBundling: TranslationsBundling.PageLanguage,
  checks: {
    missingPaths: CheckType.Ignore,
    missingLanguageVersions: CheckType.Ignore,
    missingTranslationStrings: CheckType.Ignore,
  },
  overrides: [],
  plugins: [],
}
