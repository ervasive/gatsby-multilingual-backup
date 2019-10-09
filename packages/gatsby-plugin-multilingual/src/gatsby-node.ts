import { GatsbyNode } from 'gatsby'
import { isPlainObject } from 'lodash'
import { outputJSON, emptyDir } from 'fs-extra'
import {
  GatsbyPage,
  NAMESPACE_NODE_TYPENAME,
} from '@gatsby-plugin-multilingual/shared'
import getOptions from './get-options'
import { processTranslations } from './translations'
import { createPagesRegistry, writePagesRegistry } from './pages-registry'
import {
  PLUGIN_NAME,
  CACHE_DIR,
  CACHE_PAGES_FILE,
  CACHE_NAMESPACES_FILE,
  CACHE_TRANSLATIONS_ALL_FILE,
  CACHE_TRANSLATIONS_DEFAULT_FILE,
} from './constants'
import copyRedirectTemplate from './copyRedirectTemplate'
import generatePages from './generate-pages'

export const onPreBootstrap: GatsbyNode['onPreBootstrap'] = (
  { getNodesByType, reporter },
  pluginOptions,
) => {
  const options = getOptions(pluginOptions)

  emptyDir(CACHE_DIR)
    .then(() =>
      Promise.all([
        outputJSON(CACHE_PAGES_FILE, {}),
        outputJSON(CACHE_NAMESPACES_FILE, []),
        outputJSON(CACHE_TRANSLATIONS_ALL_FILE, {}),
        outputJSON(CACHE_TRANSLATIONS_DEFAULT_FILE, {}),
        copyRedirectTemplate(options.pathToRedirectTemplate),
        processTranslations(getNodesByType(NAMESPACE_NODE_TYPENAME), options),
      ]),
    )
    .catch(reporter.panic)
}

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions,
}) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        pages: CACHE_PAGES_FILE,
        namespaces: CACHE_NAMESPACES_FILE,
        'translations-all': CACHE_TRANSLATIONS_ALL_FILE,
        'translations-default': CACHE_TRANSLATIONS_DEFAULT_FILE,
      },
    },
  })
}

export const onCreateNode: GatsbyNode['onCreateNode'] = async (
  { node, getNodesByType, reporter },
  pluginOptions,
) => {
  if (node.internal.type !== NAMESPACE_NODE_TYPENAME) {
    return
  }

  const options = getOptions(pluginOptions)

  processTranslations(getNodesByType(NAMESPACE_NODE_TYPENAME), options).catch(
    reporter.panic,
  )
}

export const onCreatePage: GatsbyNode['onCreatePage'] = async (
  {
    page,
    actions: { createPage, deletePage, createRedirect },
    reporter,
    store,
  },
  pluginOptions,
) => {
  const options = getOptions(pluginOptions)

  const result = generatePages(
    (page as unknown) as GatsbyPage,
    Array.from(store.getState().pages.values()) as GatsbyPage[],
    options,
  )
}

export const onPostBootstrap: GatsbyNode['onPostBootstrap'] = async ({
  store,
  emitter,
}) => {
  const registry = createPagesRegistry(store.getState().pages).registry
  await writePagesRegistry(registry)

  emitter.on('CREATE_PAGE', async () => {
    const registry = createPagesRegistry(store.getState().pages).registry
    await writePagesRegistry(registry)
  })

  emitter.on('DELETE_PAGE', async () => {
    const registry = createPagesRegistry(store.getState().pages).registry
    await writePagesRegistry(registry)
  })
}
