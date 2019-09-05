import { GatsbyNode } from 'gatsby'
import {
  GatsbyPage,
  NAMESPACE_NODE_TYPENAME,
} from '@gatsby-plugin-multilingual/shared'
import getOptions from './get-options'
import prepareCacheDir from './prepare-cache-dir'
import { processTranslations } from './translations'
import { createPagesRegistry, writePagesRegistry } from './pages-registry'
import {
  PLUGIN_NAME,
  CACHE_PAGES_FILE,
  CACHE_NAMESPACES_FILE,
  CACHE_TRANSLATIONS_ALL_FILE,
  CACHE_TRANSLATIONS_DEFAULT_FILE,
} from './constants'
import copyRedirectTemplate from './copyRedirectTemplate'
import generatePages from './generate-pages'

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions,
}): void => {
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

export const onPreBootstrap: GatsbyNode['onPreBootstrap'] = async (
  { getNodesByType, reporter },
  pluginOptions,
): Promise<void> => {
  try {
    await prepareCacheDir()

    const options = getOptions(pluginOptions)
    await copyRedirectTemplate(options.pathToRedirectTemplate)
    await processTranslations(getNodesByType(NAMESPACE_NODE_TYPENAME), options)
  } catch (err) {
    reporter.panic(err)
  }
}

export const onCreateNode: GatsbyNode['onCreateNode'] = async (
  { node, getNodesByType, reporter },
  pluginOptions,
): Promise<void> => {
  if (node.internal.type !== NAMESPACE_NODE_TYPENAME) {
    return
  }

  try {
    const options = getOptions(pluginOptions)
    await processTranslations(getNodesByType(NAMESPACE_NODE_TYPENAME), options)
  } catch (err) {
    reporter.panic(err)
  }
}

export const onCreatePage: GatsbyNode['onCreatePage'] = async (
  { page, actions: { createPage, deletePage, createRedirect }, reporter },
  pluginOptions,
): Promise<void> => {
  const typedPage = (page as unknown) as GatsbyPage

  if (typedPage.path === '/dev-404-page/') {
    return
  }

  const options = getOptions(pluginOptions)
  const { pages, redirects, error, removeOriginalPage } = generatePages(
    typedPage,
    options,
  )

  if (removeOriginalPage) {
    deletePage(typedPage)
  }

  if (error) {
    const message =
      `${PLUGIN_NAME}: The following errors were encountered while ` +
      `processing pages:\n${error.message}`

    switch (error.type) {
      case 'warn':
        reporter.warn(message)
        break
      case 'error':
        reporter.error(message)
        break
      case 'panic':
        reporter.panic(message)
        break
      default:
        reporter.warn('Unknown error type')
        break
    }
  }

  if (redirects) {
    redirects.forEach(redirect => createRedirect(redirect))
  }

  if (pages) {
    pages.forEach(page => createPage(page as GatsbyPage))
  }
}

export const onPostBootstrap: GatsbyNode['onPostBootstrap'] = async ({
  store,
  emitter,
}): Promise<void> => {
  const registry = createPagesRegistry(store.getState().pages).registry
  await writePagesRegistry(registry)

  emitter.on(
    'CREATE_PAGE',
    async (): Promise<void> => {
      const registry = createPagesRegistry(store.getState().pages).registry
      await writePagesRegistry(registry)
    },
  )

  emitter.on(
    'DELETE_PAGE',
    async (): Promise<void> => {
      const registry = createPagesRegistry(store.getState().pages).registry
      await writePagesRegistry(registry)
    },
  )
}
