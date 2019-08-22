import path from 'path'

export const PLUGIN_NAME = 'gatsby-plugin-multilingual'

export const PUBLIC_DIR = path.resolve('public')
export const CACHE_DIR = path.resolve('.cache', 'multilingual')

export const CACHE_PAGES_FILE = path.resolve(CACHE_DIR, 'pages-registry.json')
export const CACHE_NAMESPACES_FILE = path.resolve(CACHE_DIR, 'namespaces.json')
export const CACHE_TRANSLATIONS_ALL_FILE = path.resolve(
  CACHE_DIR,
  'translations-all.json',
)
export const CACHE_TRANSLATIONS_DEFAULT_FILE = path.resolve(
  CACHE_DIR,
  'translations-default.json',
)

export const PUBLIC_TRANSLATIONS_DIR = path.resolve(PUBLIC_DIR, 'translations')
