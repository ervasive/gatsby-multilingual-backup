import { outputJSON } from 'fs-extra'
import { debounce } from 'lodash'
import { GatsbyPage } from '@gatsby-plugin-multilingual/shared'
import { MonolingualPage, PagesRegistry } from './types'
import { PAGES_REGISTRY_FILE } from './constants'
import normalizePath from './utils/normalize-path'

export const createPagesRegistry = (
  pages: Map<string, GatsbyPage>,
): { registry: PagesRegistry; duplicates: MonolingualPage[] } => {
  const registry: PagesRegistry = {}
  const duplicates: MonolingualPage[] = []

  for (const page of pages.values()) {
    if (!page.context.language || !page.context.genericPath) {
      continue
    }

    const currentPage = (page as unknown) as MonolingualPage

    const {
      path,
      context: { language, pageId },
    } = currentPage

    if (!registry[pageId]) {
      registry[pageId] = {}
    }

    if (registry[pageId][language]) {
      duplicates.push(currentPage)
    } else {
      // We are going to set language path to an empty string in cases when
      // the language path matches the generic path value. It will minimize the
      // size of the generated pages registry file.
      const customPath = normalizePath(path.replace(language, ''))

      registry[pageId][language] = customPath === pageId ? '' : customPath
    }
  }

  return { registry, duplicates }
}

export const writePagesRegistry = debounce(
  async (registry: PagesRegistry): Promise<void> => {
    await outputJSON(PAGES_REGISTRY_FILE, registry)
  },
  150,
)
