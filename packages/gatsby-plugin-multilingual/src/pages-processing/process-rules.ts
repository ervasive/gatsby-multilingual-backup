import { merge } from 'lodash'
import { getLocalizedPath } from '.'
import {
  Options,
  GatsbyStorePages,
  PagesProcessingResult,
  MessageType,
} from '../types'

export const processRules = (
  pages: GatsbyStorePages,
  options: Options,
): PagesProcessingResult => {
  const result: PagesProcessingResult = {
    messages: [],
    pagesToDelete: new Set(),
    pagesToCreate: new Set(),
    redirectsToCreate: new Set(),
  }
  const { availableLanguages, rules } = options

  Object.entries(rules).forEach(([id, rule]) => {
    if (rule.skip) {
      return
    }

    if (rule.languages) {
      Object.entries(rule.languages).forEach(([language, value]) => {
        let path: string
        let slug: string

        if (typeof value === 'string') {
          path = value
          slug = value
        } else {
          path = value.path
          slug = value.slug
        }

        // Check for a valid language value
        if (!availableLanguages.includes(language)) {
          const languages = availableLanguages.join(', ')

          result.messages.push({
            type: MessageType.Error,
            message:
              `"${id}" rule has an invalid language key: "${language}". ` +
              `Allowed values are: [${languages}]`,
          })

          return
        }

        // Validate whether the page specified in the rule exists and if it
        // is, convert it to a multilingual page
        const sourcePage = pages.get(path)

        if (!sourcePage) {
          result.messages.push({
            type: MessageType.Error,
            message:
              `"${path}" page specified in "rules[${id}][${language}]" rule ` +
              `does not exist`,
          })

          return
        } else {
          result.pagesToCreate.add(
            merge({}, sourcePage, {
              path: getLocalizedPath(slug, language, options),
              context: { multilingualId: id, language },
            }),
          )

          result.pagesToDelete.add(sourcePage)
        }
      })
    }
  })

  return result
}
