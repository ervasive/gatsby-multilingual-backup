import { throttle } from 'lodash'
import { outputJSON } from 'fs-extra'
import { multilingualPageSchema } from '../schemas'
import { PAGES_REGISTRY_FILE } from '../constants'
import { GatsbyStorePages, MultilingualPage, PagesRegistry } from '../types'

export const generatePagesRegistry = (
  pages: GatsbyStorePages,
): PagesRegistry => {
  const registry: PagesRegistry = {}

  pages.forEach(page => {
    const { error } = multilingualPageSchema.required().validate(page)

    if (error) {
      return
    }

    const multilingualPage = page as MultilingualPage
    const {
      path,
      context: { multilingualId: id, language },
    } = multilingualPage

    if (!registry[id]) {
      registry[id] = {}
    }

    registry[id][language] = path
  })

  return registry
}

export const writePagesRegistry = throttle(
  async (pages: GatsbyStorePages): Promise<void> => {
    await outputJSON(PAGES_REGISTRY_FILE, generatePagesRegistry(pages))
  },
  500,
)
