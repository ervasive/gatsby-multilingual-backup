import { GatsbyNode } from 'gatsby'
import { outputJSON } from 'fs-extra'
import { GatsbyPage } from '@gatsby-plugin-multilingual/shared'
import getOptions from '../get-options'
import { createPagesRegistry, writePagesRegistry } from '../pages-registry'
import { PATHNAMES_REGISTRY_FILE } from '../constants'
import { PathnamesRegistry } from '../types'

const onPostBootstrap: GatsbyNode['onPostBootstrap'] = async (
  { store, emitter },
  pluginOptions,
) => {
  const options = getOptions(pluginOptions)
  const pages: Map<string, GatsbyPage> = store.getState().pages

  const registry = createPagesRegistry(pages).registry
  await writePagesRegistry(registry)

  const storage: PathnamesRegistry = {}

  pages.forEach(page => {
    storage[page.path] =
      (page.context.language as string) || options.defaultLanguage
  })

  await outputJSON(PATHNAMES_REGISTRY_FILE, storage)

  emitter.on('CREATE_PAGE', async () => {
    const registry = createPagesRegistry(store.getState().pages).registry
    await writePagesRegistry(registry)
  })

  emitter.on('DELETE_PAGE', async () => {
    const registry = createPagesRegistry(store.getState().pages).registry
    await writePagesRegistry(registry)
  })
}

export default onPostBootstrap
