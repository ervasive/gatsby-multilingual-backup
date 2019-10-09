import { Maybe } from 'true-myth'
import { PagesRegistry } from '../types'

export default (path: string, pages: PagesRegistry): Maybe<string> => {
  if (path[0] !== '/') {
    return Maybe.nothing<string>()
  }

  if (path === '/' && pages[path]) {
    return Maybe.just('/')
  }

  // Remove trailing slashes
  const normalizedPath = path.replace(/^(.+?)\/*?$/, '$1')

  if (pages[normalizedPath]) {
    return Maybe.just(normalizedPath)
  }

  // Extract potential language & custom page path values
  const parts = /^\/?(.*?)(\/.*?)?\/?$/.exec(normalizedPath)

  // Let's consider the case where we only have a language value (which means
  // the generic path is at root "/")
  if (parts && parts[1] && !parts[2]) {
    const language = parts[1]

    if (pages['/'] && typeof pages['/'][language] === 'string') {
      return Maybe.just('/')
    }
  }

  // Now we can try to find a generic path with both values provided
  const extractedLanguage = parts && parts[1]
  const extractedPath = parts && parts[2]

  for (const [genericPath, languages] of Object.entries(pages)) {
    for (const [language, customPath] of Object.entries(languages)) {
      if (
        // case: /en/page-path -> { '/page': { en: 'page-path' } }
        (extractedLanguage === language && extractedPath === customPath) ||
        // case: /en/page -> { '/page': { en: '' } }
        (extractedLanguage === language &&
          extractedPath === genericPath &&
          customPath === '')
      ) {
        return Maybe.just(genericPath)
      }
    }
  }

  return Maybe.nothing<string>()
}
