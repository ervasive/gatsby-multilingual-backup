import normalizePath from './normalize-path'
import { PagesRegistry } from '../types'

export default ({
  genericPath,
  language,
  defaultLanguage,
  includeDefaultLanguageInURL,
  pages,
  suffix,
}: {
  genericPath: string
  language: string
  defaultLanguage: string
  includeDefaultLanguageInURL: boolean
  pages: PagesRegistry
  suffix?: string
}): string => {
  const prefix =
    !includeDefaultLanguageInURL && language === defaultLanguage ? '' : language
  const value =
    pages[genericPath][language] === ''
      ? genericPath === '/'
        ? ''
        : genericPath
      : pages[genericPath][language]

  return normalizePath(`${prefix}${value}${suffix || ''}`)
}
