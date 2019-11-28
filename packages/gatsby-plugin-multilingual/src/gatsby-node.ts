import { difference, debounce } from 'lodash'
import { outputJSON, emptyDir } from 'fs-extra'
import { GatsbyNode } from 'gatsby'
import {
  GatsbyPage,
  NamespaceNode,
  NAMESPACE_NODE_TYPENAME,
} from '@gatsby-plugin-multilingual/shared'
import {
  getOptions,
  validateInstanceUniqueness,
  getLocalizedPath,
} from './utils'
import { optionsSchema, multilingualPageSchema } from './schemas'
import {
  PLUGIN_NAME,
  CACHE_DIR,
  TRANSLATIONS_FILE,
  PAGES_REGISTRY_FILE,
  NAMESPACES_REGISTRY_FILE,
  REGISTRIES_WRITING_INTERVAL,
} from './constants'
import {
  PagesRegistry,
  TranslationsResource,
  PageRulesRecord,
  MultilingualPage,
  MissingLanguagesStrategy,
  CheckType,
} from './types'

/*
 * Pages registry
 *
 * This data structure has an important role in maintaining the uniqueness of
 * each language version for a multilingual pages group, as well as being used
 * on the client-side by page helper functions provided by the multilingual
 * context
 */
export let registry: PagesRegistry = {}

/**
 * resetRegistry
 *
 * It is used mainly for testing purposes
 */
export const resetRegistry = (): void => {
  registry = {}
}

/*
 * pageRulesRecord
 *
 * To simplify the way to check which pages are used by which rules we want to
 * build an inverted data structure
 */
export let pageRulesRecord: PageRulesRecord = {}

/**
 * resetPageRulesRecord
 *
 * It is used mainly for testing purposes
 */
export const resetPageRulesRecord = (): void => {
  pageRulesRecord = {}
}

/*
 * writePagesRegistry
 *
 * To maintain
 */
const writePagesRegistry = debounce(
  (registry: PagesRegistry): Promise<void> =>
    outputJSON(PAGES_REGISTRY_FILE, registry),
  REGISTRIES_WRITING_INTERVAL,
)

/*
 * writeTranslationsRegistry
 *
 * To maintain
 */
const writeTranslationsRegistry = debounce(
  (
    translations: TranslationsResource,
    namespaces: string[],
  ): Promise<[void, void]> | void => {
    return Promise.all([
      outputJSON(TRANSLATIONS_FILE, translations),
      outputJSON(NAMESPACES_REGISTRY_FILE, namespaces),
    ])
  },
  REGISTRIES_WRITING_INTERVAL,
)

/**
 * onCreateWebpackConfig
 *
 * Provide custom webpack aliases
 *
 * We want to expose some dynamically generated data to the client-side using
 * the React's context API. The best way to do it is by initializing a context
 * provider in the "wrapRootElement" Gatsby browser API (both in SSR and the
 * browser) so it would "mount" only once and not on every page change.
 * Unfortunately (for now) Gatsby does not allow us to query data with graphql
 * in "wrapRootElement" API so to mitigate this shortcoming we are going to
 * generate the required files manually (bypassing the Gatsby's data layer) and
 * make it available by using webpack's aliases
 *
 * See: https://github.com/gatsbyjs/gatsby/issues/7747
 */
export const onCreateWebpackConfig: Required<
  GatsbyNode
>['onCreateWebpackConfig'] = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        namespaces: NAMESPACES_REGISTRY_FILE,
        translations: TRANSLATIONS_FILE,
        'pages-registry': PAGES_REGISTRY_FILE,
      },
    },
  })
}

/**
 * onPreBootstrap
 *
 * Validate plugin options, build "pageRulesRecord" object, prepare defaults
 * for dynamically generated plugin files
 */
export const onPreBootstrap: Required<GatsbyNode>['onPreBootstrap'] = (
  { reporter, store },
  pluginOptions,
) => {
  // Validate that there is only a single plugin instance registered
  validateInstanceUniqueness(store.getState().flattenedPlugins).mapErr(
    reporter.panic,
  )

  // Validate plugin options
  const { error } = optionsSchema
    .required()
    .validate(pluginOptions, { abortEarly: false })

  if (error) {
    reporter.panic(
      `[${PLUGIN_NAME}] is misconfigured:\n${error.details
        .map(({ message }) => `- ${message}`)
        .join('\n')}`,
    )
  }

  const options = getOptions(pluginOptions)

  // Build "pageRulesRecord"
  Object.entries(options.rules).forEach(([id, rule]) => {
    if (rule.skip || !rule.languages) {
      return
    }

    Object.entries(rule.languages).forEach(([language, value]) => {
      if (!options.availableLanguages.includes(language)) {
        const languages = options.availableLanguages.join(', ')

        reporter.error(
          `[${PLUGIN_NAME}] "${id}" rule has an invalid language key: ` +
            `"${language}". Allowed values are: [${languages}]`,
        )

        return
      }

      let path: string
      let slug: string

      if (typeof value === 'string') {
        path = value
        slug = value
      } else {
        path = value.path
        slug = value.slug
      }

      if (!pageRulesRecord[path]) {
        pageRulesRecord[path] = []
      }

      pageRulesRecord[path].push({ id, language, slug })
    })
  })

  // Make sure we have a clean state for the plugin run
  emptyDir(CACHE_DIR)
    .then(() =>
      Promise.all([
        outputJSON(PAGES_REGISTRY_FILE, {}),
        outputJSON(NAMESPACES_REGISTRY_FILE, []),
        outputJSON(TRANSLATIONS_FILE, {}),
      ]),
    )
    .catch(reporter.panic)
}

/**
 * onCreatePage
 *
 * Process and convert pages specified in user defined rules, validate and
 * maintain multilingual pages uniqueness, keep the pages "registry" updated
 */
export const onCreatePage: Required<GatsbyNode>['onCreatePage'] = async (
  { page, actions: { createPage, deletePage }, store, reporter },
  pluginOptions,
) => {
  const sourcePage = (page as unknown) as GatsbyPage
  const options = getOptions(pluginOptions)

  // First, let's check if the page is included in the user-defined rules, and
  // if it is, create a multilingual page for each rule that has the page
  const pageRulesEntry = pageRulesRecord[sourcePage.path]

  if (pageRulesEntry) {
    // By default, we want to remove the source page after the creation of its
    // multilingual counterpart except when the value of its path is the same
    // for the multilingual version, meaning that it will be replaced by a
    // multilingual page (which we clearly don't want to delete)
    let shouldPageBeRemoved = true

    pageRulesEntry.forEach(async ({ id, language, slug }) => {
      // Construct a correct localized path based on
      // "includeDefaultLanguageInURL" option
      const localizedPath = getLocalizedPath(slug, language, options)

      createPage({
        ...sourcePage,
        path: localizedPath,
        context: { ...sourcePage.context, multilingualId: id, language },
      })

      if (sourcePage.path === localizedPath) {
        shouldPageBeRemoved = false
      }

      // Update pages registry
      if (!registry[id]) {
        registry[id] = {}
      }

      registry[id][language] = localizedPath
      await writePagesRegistry(registry)
    })

    if (shouldPageBeRemoved) {
      deletePage(sourcePage)
    }

    return
  }

  // Validate that we are dealing with a valid multilingual page
  const { error } = multilingualPageSchema.required().validate(sourcePage)

  if (error) {
    // If the page is multilingual but invalid, delete it and report
    if (
      sourcePage.context.multilingualId ||
      sourcePage.context.multilingualId === '' ||
      sourcePage.context.language ||
      sourcePage.context.language === ''
    ) {
      if (options.removeInvalidPages) {
        deletePage(sourcePage)
      }

      reporter.error(`"${page.path}" page failed validation: ${error.message}`)
    }

    return
  }

  // We can infer the type based on the passed validation
  const multilingualPage = sourcePage as MultilingualPage
  const {
    path,
    context: { multilingualId: id, language },
  } = multilingualPage

  // If there is a user defined rule for this "multilingualId" and "language"
  // pair then we are simply going to remove the provided page
  const rule = options.rules[id]

  if (rule && rule.languages && rule.languages[language]) {
    deletePage(multilingualPage)

    reporter.info(
      `"${multilingualPage.path}" page was deleted due to an existing ` +
        `"rules[${id}][${language}]" rule entry`,
    )

    return
  }

  // Check for a valid language value
  if (!options.availableLanguages.includes(language)) {
    const languages = options.availableLanguages.join(', ')

    reporter.error(
      `"${multilingualPage.path}" page has invalid language value: ` +
        `"${language}". Allowed values are: [${languages}]`,
    )

    if (options.removeInvalidPages) {
      deletePage(multilingualPage)
    }

    return
  }

  // By design we want to have a unique language-specific page within a
  // multilingual group. Before processing a multilingual page, we need to
  // remove any previously defined page stored in the registry for the same
  // multilingual "attributes"
  if (!registry[id]) {
    registry[id] = {}
  }

  const prevPage = store.getState().pages.get(registry[id][language])

  if (prevPage) {
    deletePage(prevPage)
  }

  // Construct a correct localized path based on "includeDefaultLanguageInURL"
  // option
  const localizedPath = getLocalizedPath(path, language, options)

  // Create a new page with an updated localized path. Do nothing if the path
  // value of the provided page maches its localized version (meaning that the
  // page is already in the desired form)
  if (multilingualPage.path !== localizedPath) {
    deletePage(multilingualPage)
    createPage({ ...multilingualPage, path: localizedPath })
  }

  // Update pages registry
  registry[id][language] = localizedPath
  await writePagesRegistry(registry)
}

/**
 * onCreateNode
 *
 * Collect all exisitng "translation namespaces" nodes, extract namespaces and
 * translations, write the extracted values into files
 */
export const onCreateNode: Required<GatsbyNode>['onCreateNode'] = async (
  { getNodesByType },
  pluginOptions,
) => {
  const options = getOptions(pluginOptions)
  const translations: TranslationsResource = {}
  const namespaces: Set<string> = new Set([options.defaultNamespace])
  const nodes = getNodesByType(NAMESPACE_NODE_TYPENAME) as NamespaceNode[]

  nodes
    // In case there are duplicate namespace nodes we want to sort them so the
    // ones with higher priority values take precedence
    .sort((current, next): number => current.priority - next.priority)
    .forEach(({ language, namespace, data }) => {
      namespaces.add(namespace)

      if (!translations[language]) {
        translations[language] = {}
      }

      if (!translations[language][namespace]) {
        translations[language][namespace] = JSON.parse(data)
      }
    })

  // TODO: validate missing translations

  await writeTranslationsRegistry(translations, Array.from(namespaces))
}

/**
 * onPostBootstrap
 *
 * Finish processing of multilingual groups by generating missing
 * language-specific pages/redirects based on "missingLanguagesStrategy" value
 * for each multilingual group
 */
export const onPostBootstrap: Required<GatsbyNode>['onPostBootstrap'] = async (
  { store, actions: { createPage, createRedirect }, reporter },
  pluginOptions,
) => {
  const options = getOptions(pluginOptions)

  Object.entries(registry).forEach(([id, entry]) => {
    const missingLanguagesStrategy =
      options.rules[id] && options.rules[id].missingLanguagesStrategy
        ? options.rules[id].missingLanguagesStrategy
        : options.missingLanguagesStrategy

    if (missingLanguagesStrategy === MissingLanguagesStrategy.Ignore) {
      return
    }

    // In cases where we are instructed to generate additional (missing)
    // language-specific pages or redirects we must have a default language page
    // as a source page
    const missingDefaultLanguageMessage =
      `[${PLUGIN_NAME}] unable to generate missing language-specific pages ` +
      `for multilingual group "${id}", due to the lack of default ` +
      `language page`

    const defaultLanguagePage = store
      .getState()
      .pages.get(entry[options.defaultLanguage])

    if (!defaultLanguagePage) {
      if (options.checks.missingLanguageVersions === CheckType.Error) {
        reporter.panic(missingDefaultLanguageMessage)
      }

      if (options.checks.missingLanguageVersions === CheckType.Warn) {
        reporter.warn(missingDefaultLanguageMessage)
      }

      return
    }

    // Calculate missing language values and generate required pages/redirects
    difference(options.availableLanguages, Object.keys(entry)).forEach(
      language => {
        if (missingLanguagesStrategy === MissingLanguagesStrategy.Generate) {
          createPage({
            ...defaultLanguagePage,
            path: getLocalizedPath(defaultLanguagePage.path, language, options),
            context: { ...defaultLanguagePage.context, language },
          })
        }

        if (missingLanguagesStrategy === MissingLanguagesStrategy.Redirect) {
          createRedirect({
            fromPath: getLocalizedPath(
              defaultLanguagePage.path,
              language,
              options,
            ),
            toPath: defaultLanguagePage.path,
            isPermanent: true,
            redirectInBrowser: true,
          })
        }
      },
    )
  })
}
