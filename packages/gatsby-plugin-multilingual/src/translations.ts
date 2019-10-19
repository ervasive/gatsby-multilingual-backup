import path from 'path'
import { outputJSON } from 'fs-extra'
import { NamespaceNode } from '@gatsby-plugin-multilingual/shared'
import { Options, TranslationsAggregatorResult } from './types'
import {
  NAMESPACES_FILE,
  TRANSLATIONS_FILE,
  PUBLIC_TRANSLATIONS_DIR,
} from './constants'

export const aggregateTranslations: TranslationsAggregatorResult = (
  nodes,
  { availableLanguages, defaultNamespace },
) => {
  const result: ReturnType<TranslationsAggregatorResult> = {
    namespaces: new Set([defaultNamespace]),
    translations: {},
  }

  nodes
    .sort((c, n) => n.priority - c.priority)
    .forEach(({ language, namespace, data }) => {
      const parsedData = JSON.parse(data)

      // Pass through only registered languages
      if (!availableLanguages.includes(language)) {
        return
      }

      // Collect namespace value
      if (!result.namespaces.has(namespace)) {
        result.namespaces.add(namespace)
      }

      // Aggregate translations resource
      if (!result.translations[language]) {
        result.translations[language] = {}
      }

      if (!result.translations[language][namespace]) {
        result.translations[language][namespace] = parsedData
      }
    })

  return result
}

// language: {namespace: data}

export const processTranslations = (
  nodes: NamespaceNode[],
  options: Options,
): Promise<void[]> => {
  const result = aggregateTranslations(nodes, options)
  const files: Promise<void>[] = []

  Object.entries(result.translations).forEach(([language, namespaces]) => {
    Object.entries(namespaces).forEach(([namespace, data]) => {
      files.push(
        outputJSON(
          path.join(PUBLIC_TRANSLATIONS_DIR, language, `${namespace}.json`),
          data,
        ),
      )
    })
  })

  return Promise.all([
    outputJSON(NAMESPACES_FILE, Array.from(result.namespaces)),
    outputJSON(TRANSLATIONS_FILE, result.translations),
    ...files,
  ])
}
