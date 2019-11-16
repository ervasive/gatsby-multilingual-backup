import { throttle } from 'lodash'
import { outputJSON } from 'fs-extra'
import { NamespaceNode } from '@gatsby-plugin-multilingual/shared'
import { TRANSLATIONS_FILE, NAMESPACES_REGISTRY_FILE } from '../constants'
import { Options, TranslationsResource, NamespacesRegistry } from '../types'

export const generateTranslationsRegistry = (
  nodes: NamespaceNode[],
  { defaultNamespace }: Options,
): {
  translations: TranslationsResource
  namespaces: NamespacesRegistry
} => {
  const translations: TranslationsResource = {}
  const namespaces: Set<string> = new Set([defaultNamespace])

  nodes
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

  return { translations, namespaces: Array.from(namespaces) }
}

export const writeTranslationsRegistry = throttle(
  (nodes: NamespaceNode[], options: Options): Promise<[void, void]> => {
    const { translations, namespaces } = generateTranslationsRegistry(
      nodes,
      options,
    )

    return Promise.all([
      outputJSON(TRANSLATIONS_FILE, translations),
      outputJSON(NAMESPACES_REGISTRY_FILE, namespaces),
    ])
  },
  500,
)
