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
import shouldPageBeProcessed from './utils/should-page-be-processed'
import getPageOverride from './utils/get-page-override'

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
  const options = getValidatedOptions(pluginOptions)

  if (!shouldPageBeProcessed(typedPage, options)) {
    return
  }

  const override = getPageOverride(typedPage, options.overrides)

  // We can have the following page variations here:
  // 1. A regular page without the context property and no overrides
  // 2. A regular page with overrides
  // 3. A page with the context.multilingual property and no overrides
  // 4. A page with the context.multilingual property and overrides

  // pages generation by language note:
  // 1. if the page includes the default language in overrides or context or
  // it is a "regular" page then we are going to generate, for "greedy" all
  // pages, for "lazy" only specified ones.
  // 2. if the page does not include the default language in overrides or
  // context and it is not a regular page, then we only going to generate this
  // particular language version.

  // This array is going to be the source for deciding which pages we will need
  // to generate.
  // 1. We will generate all required (default) language-paths
  // 2. Then we will try to
  // const languagePaths: LanguagePath[] = []

  // if (typedPage)

  // create pages-to-create array
  //   - get the source page "language key"
  //   - get the source page "language path"
  //   - if "missingLanguagePages" is set to generate: generate pages for all
  //      language versions except the existing ones (from the store)
  //   - if "missingLanguagePages" is set to redirect: generate redirects for
  //      all language versions except the existing ones (from the store)
  // add entries into the pages registry
  // actually create pages and redirects
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
