import { GatsbyNode } from 'gatsby'
import { NAMESPACE_NODE_TYPENAME } from '@gatsby-plugin-multilingual/shared'
import { getOptions } from '../utils'
import {
  processRules,
  processGroups,
  commitChanges,
  writePagesRegistry,
} from '../pages-processing'
import { writeTranslationsRegistry } from '../translations-processing'
import { PLUGIN_NAME } from '../constants'
import { GatsbyStorePages } from '../types'

export const onPostBootstrap: GatsbyNode['onPostBootstrap'] = async (
  { store, actions, getNodesByType, reporter, emitter },
  pluginOptions,
) => {
  const options = getOptions(pluginOptions)

  commitChanges(
    processRules(store.getState().pages as GatsbyStorePages, options),
    actions,
    reporter,
  )

  commitChanges(
    processGroups(store.getState().pages as GatsbyStorePages, options),
    actions,
    reporter,
  )

  try {
    await writeTranslationsRegistry(
      getNodesByType(NAMESPACE_NODE_TYPENAME),
      options,
    )

    await writePagesRegistry(store.getState().pages as GatsbyStorePages)
  } catch (e) {
    reporter.panic(`[${PLUGIN_NAME}] ${e}`)
  }

  // Re-process on consecutive "createPages" runs
  emitter.on('CREATE_PAGE_END', async () => {
    commitChanges(
      processRules(store.getState().pages as GatsbyStorePages, options),
      actions,
      reporter,
    )

    commitChanges(
      processGroups(store.getState().pages as GatsbyStorePages, options),
      actions,
      reporter,
    )

    try {
      await writePagesRegistry(store.getState().pages as GatsbyStorePages)
    } catch (e) {
      reporter.panic(`[${PLUGIN_NAME}] ${e}`)
    }
  })

  // Re-process pages registry on consecutive "onCreatePage" runs
  emitter.on('CREATE_PAGE', async () => {
    try {
      await writePagesRegistry(store.getState().pages as GatsbyStorePages)
    } catch (e) {
      reporter.panic(`[${PLUGIN_NAME}] ${e}`)
    }
  })

  // Re-process translations registry on consecutive "sourceNodes" runs
  emitter.on('CREATE_NODE', async () => {
    try {
      await writeTranslationsRegistry(
        getNodesByType(NAMESPACE_NODE_TYPENAME),
        options,
      )
    } catch (e) {
      reporter.panic(`[${PLUGIN_NAME}] ${e}`)
    }
  })
}
