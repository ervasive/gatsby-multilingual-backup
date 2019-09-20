import { PagesRegistry } from '../types'

export default (path: string, pages: PagesRegistry): string | void => {
  if (pages[path] || path === '/') {
    return path
  }

  const parts = /^\/(.*?)(\/.*)$/.exec(path)

  // Check if we were able to extract a meaningfull data
  // 3 = full match, language key, rest of the path
  if (parts && parts.length >= 3) {
    const extractedLanguage = parts[1]
    const extractedPath = parts[2]

    for (const [genericPath, languages] of Object.entries(pages)) {
      for (const [language, value] of Object.entries(languages)) {
        if (
          // case: /en/page-path -> { '/page': { en: 'page-path' } }
          (extractedLanguage === language && extractedPath === value) ||
          // case: /en/page -> { '/page': { en: '' } }
          (extractedLanguage === language &&
            extractedPath === genericPath &&
            value === '')
        ) {
          return genericPath
        }
      }
    }
  }
}
