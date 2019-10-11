import { Options } from './types'

export const PLUGIN_NAME = '@gatsby-plugin-multilingual/translations-loader'
export const SOURCE_FILESYSTEM_INSTANCE_NAME =
  'gatsby-multilingual-translations-file'

export const DEFAULT_OPTIONS: Options = {
  path: '', // this value specified only to match the type
  priority: 0,
  transformers: [],
  plugins: [],
}
