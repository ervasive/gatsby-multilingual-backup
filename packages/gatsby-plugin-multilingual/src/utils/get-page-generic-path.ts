import { PagesRegistry } from '../types'

export default (path: string, pages: PagesRegistry): string | void => {
  if (pages[path]) {
    return path
  }

  for (const [genericPath, languages] of Object.entries(pages)) {
    for (const [_, slug] of Object.entries(languages)) {
      if (path === slug) {
        return genericPath
      }
    }
  }
}
