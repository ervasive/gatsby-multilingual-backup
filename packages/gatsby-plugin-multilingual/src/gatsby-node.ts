import { GatsbyNode } from 'gatsby'
import {
  GatsbyPage,
  NAMESPACE_NODE_TYPENAME,
} from '@gatsby-plugin-multilingual/shared'
import getValidatedOptions from './get-validated-options'
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

    const options = getValidatedOptions(pluginOptions)
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
    const options = getValidatedOptions(pluginOptions)
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

  const options = getValidatedOptions(pluginOptions)
  const { pages, redirects, errors, removeOriginalPage } = generatePages(
    typedPage,
    options,
  )

  if (removeOriginalPage) {
    deletePage(typedPage)
  }

  if (errors.length) {
    const message =
      `${PLUGIN_NAME}: The following errors were encountered while ` +
      `processing pages:\n`

    errors.map(error => {
      switch (error.type) {
        case 'warn':
          reporter.warn(message + error.message)
          break
        case 'error':
          reporter.error(message + error.message)
          break
        case 'panic':
          reporter.panic(message + error.message)
          break
        default:
          reporter.warn('Unknown error type')
          break
      }
    })
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
