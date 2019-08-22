import path from 'path'
import Joi from '@hapi/joi'
import { merge } from 'lodash'
import { GatsbyNode } from 'gatsby'
import {
  LingualPage,
  NAMESPACE_NODE_TYPENAME,
} from '@gatsby-plugin-multilingual/shared'
import getOptions from './get-options'
import prepareCacheDir from './prepare-cache-dir'
import { processTranslations } from './translations'
import { createPagesRegistry, writePagesRegistry } from './pages-registry'
import normalizePath from './utils/normalize-path'
import {
  CACHE_PAGES_FILE,
  CACHE_NAMESPACES_FILE,
  CACHE_TRANSLATIONS_ALL_FILE,
  CACHE_TRANSLATIONS_DEFAULT_FILE,
} from './constants'

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

const schema = Joi.object({
  context: Joi.object({
    lingual: Joi.boolean(),
    language: Joi.string().required(),
    genericPath: Joi.string().required(),
  }),
})

export const onCreatePage: GatsbyNode['onCreatePage'] = async (
  { page, actions: { createPage, deletePage }, reporter },
  pluginOptions,
): Promise<void> => {
  if (!(page.context as any).lingual) {
    return
  }

  const { error } = Joi.validate(page, schema, {
    allowUnknown: true,
    abortEarly: false,
  })

  if (error) {
    reporter.warn(
      `Error.\n- ${error.details
        .map(({ message }): string => message)
        .join('\n- ')}`,
    )
    return
  }

  const currentPage = (page as unknown) as LingualPage
  const newPages: LingualPage[] = []

  const {
    defaultLanguage,
    availableLanguages,
    includeDefaultLanguageInURL,
  } = getOptions(pluginOptions)

  deletePage(currentPage)

  // Do not create any pages for an unsupported language
  if (![...availableLanguages, 'all'].includes(currentPage.context.language)) {
    return
  }

  // Prepare a page for each language if the language value is set to "all"
  if (currentPage.context.language === 'all') {
    availableLanguages.forEach((language): void => {
      newPages.push(
        merge({}, currentPage, {
          context: {
            language,
          },
        }),
      )
    })
  } else {
    newPages.push(currentPage)
  }

  newPages.forEach((page): void => {
    const shouldIncludeLanguagePrefix =
      includeDefaultLanguageInURL || page.context.language !== defaultLanguage

    const newPage: LingualPage = merge({}, page, {
      path: normalizePath(
        shouldIncludeLanguagePrefix
          ? `${page.context.language}${page.context.genericPath}`
          : page.context.genericPath,
      ),
      context: {
        genericPath: normalizePath(page.context.genericPath),
      },
    })

    createPage(newPage)

    // Additionally generate a redirect for prefixless page variant to the
    // correct one
    if (
      includeDefaultLanguageInURL &&
      page.context.language === defaultLanguage
    ) {
      const redirectPage: LingualPage = merge({}, page, {
        path: normalizePath(page.context.genericPath),
        // TODO: provide a mechanism for user defined redirect components with
        // a fallback
        component: path.resolve('src/templates/stub.js'),
      })

      createPage(redirectPage)
    }
  })
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
