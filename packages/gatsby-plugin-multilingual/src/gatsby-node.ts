import { GatsbyNode } from 'gatsby'
import { outputJSON, emptyDir } from 'fs-extra'
import {
  GatsbyPage,
  NAMESPACE_NODE_TYPENAME,
} from '@gatsby-plugin-multilingual/shared'
import validateInstanceUniqueness from './utils/validate-instance-uniqueness'
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
  { getNodesByType, reporter, store },
  pluginOptions,
) => {
  const options = getOptions(pluginOptions)

  // Validate that there is only a single plugin instance registered
  validateInstanceUniqueness(store.getState().flattenedPlugins).mapErr(err =>
    reporter.panic(err),
  )

  return emptyDir(CACHE_DIR)
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

  const { pages, redirects, errors, removeOriginalPage } = generatePages(
    (page as unknown) as GatsbyPage,
    store.getState().pages,
    options,
  )

  if (errors.length) {
    reporter.warn(
      `[${PLUGIN_NAME}] The following errors were encountered while ` +
        `processing pages:\n${errors.map(e => `- ${e}`).join('\n')}`,
    )
  }

  if (removeOriginalPage) {
    deletePage((page as unknown) as GatsbyPage)
  }

  redirects.forEach(redirect => createRedirect(redirect))
  pages.forEach(page => createPage(page as GatsbyPage))
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
