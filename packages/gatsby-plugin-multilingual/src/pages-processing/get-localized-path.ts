import { normalizePath } from '../utils'
import { Options } from '../types'

export const getLocalizedPath = (
  path: string,
  language: string,
  { defaultLanguage, availableLanguages, includeDefaultLanguageInURL }: Options,
): string => {
  const re = new RegExp(`^/(?:${availableLanguages.join('|')})(/.*)$`)
  const prefixlessPath = path.replace(re, '$1')

  if (language === defaultLanguage && !includeDefaultLanguageInURL) {
    return normalizePath(prefixlessPath)
  } else {
    return normalizePath(`/${language}/${prefixlessPath}`)
  }
}
