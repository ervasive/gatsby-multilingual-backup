import { PagesRegistry } from '../types'

export const getPageId = (
  path: string,
  pages: PagesRegistry,
): string | void => {
  if (pages[path]) {
    return path
  }

  // Extract potential language & slug values
  const parts = /^\/?(.*?)\/.*$/.exec(path)
  const language = parts && parts[1]

  for (const [id, languages] of Object.entries(pages)) {
    for (const [pageLanguage, pageSlug] of Object.entries(languages)) {
      if (language === pageLanguage && path === pageSlug) {
        return id
      }
    }
  }
}
