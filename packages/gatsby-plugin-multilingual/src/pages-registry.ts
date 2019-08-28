import { outputJSON } from 'fs-extra'
import { debounce } from 'lodash'
import { GatsbyPage, LingualPage } from '@gatsby-plugin-multilingual/shared'
import { PagesRegistry } from './types'
import { CACHE_PAGES_FILE } from './constants'

export const createPagesRegistry = (
  pages: Map<string, GatsbyPage>,
): { registry: PagesRegistry; duplicates: LingualPage[] } => {
  const registry: PagesRegistry = {}
  const duplicates: LingualPage[] = []

  for (const page of pages.values()) {
    if (!(page.context as any).lingual) {
      continue
    }

    // Validate here as well?

    const currentPage = (page as unknown) as LingualPage

    const {
      path,
      context: { language, genericPath },
    } = currentPage

    if (!registry[genericPath]) {
      registry[genericPath] = {}
    }

    if (registry[genericPath][language]) {
      duplicates.push(currentPage)
    } else {
      registry[genericPath][language] = path || genericPath
    }
  }

  return { registry, duplicates }
}

export const writePagesRegistry = debounce(
  async (registry: PagesRegistry): Promise<void> => {
    await outputJSON(CACHE_PAGES_FILE, registry)
  },
  150,
)
