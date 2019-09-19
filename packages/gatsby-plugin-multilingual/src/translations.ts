import path from 'path'
import merge from 'lodash/merge'
import { outputJSON } from 'fs-extra'
import { NamespaceNode } from '@gatsby-plugin-multilingual/shared'
import { Options } from './types'
import {
  CACHE_NAMESPACES_FILE,
  CACHE_TRANSLATIONS_ALL_FILE,
  CACHE_TRANSLATIONS_DEFAULT_FILE,
  PUBLIC_TRANSLATIONS_DIR,
} from './constants'

export const aggregateTranslations = (
  nodes: NamespaceNode[],
  { defaultLanguage, availableLanguages, defaultNamespace }: Options,
): Record<string, object> => {
  const result: Record<string, object> = {}
  const namespaces = new Set([defaultNamespace])

  let translations: Record<string, object> = availableLanguages.reduce(
    (acc, language): Record<string, object> =>
      merge({}, acc, { [language]: { [defaultNamespace]: {} } }),
    {},
  )

  translations = merge(
    {},
    translations,
    nodes
      .sort((current, next): number => current.priority - next.priority)
      .reduce((acc: object, node: NamespaceNode): object => {
        namespaces.add(node.namespace)

        return merge({}, acc, {
          [node.language]: {
            [node.namespace]: JSON.parse(node.data),
          },
        })
      }, {}),
  )

  // `cache` related files
  result[CACHE_NAMESPACES_FILE] = Array.from(namespaces)
  result[CACHE_TRANSLATIONS_ALL_FILE] = translations
  result[CACHE_TRANSLATIONS_DEFAULT_FILE] = {
    [defaultLanguage]: translations[defaultLanguage],
  }

  // `public` namespace files
  for (const [language, namespaces] of Object.entries(translations)) {
    for (const [namespace, data] of Object.entries(namespaces)) {
      const filename = path.resolve(
        PUBLIC_TRANSLATIONS_DIR,
        language,
        `${namespace}.json`,
      )
      result[filename] = data
    }
  }

  return result
}

export const processTranslations = async (
  nodes: NamespaceNode[],
  options: Options,
): Promise<void> => {
  const translationsFiles = await aggregateTranslations(nodes, options)

  for (const [filepath, data] of Object.entries(translationsFiles)) {
    await outputJSON(filepath, data)
  }
}
