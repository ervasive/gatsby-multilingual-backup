import { merge, difference } from 'lodash'
import { getLocalizedPath } from '.'
import { multilingualPageSchema } from '../schemas'
import {
  GatsbyStorePages,
  MultilingualGroups,
  MessageType,
  Options,
  MultilingualPage,
  MissingLanguagesStrategy,
  PagesProcessingResult,
} from '../types'

export const processGroups = (
  pages: GatsbyStorePages,
  options: Options,
): PagesProcessingResult => {
  const result: PagesProcessingResult = {
    messages: [],
    pagesToDelete: new Set(),
    pagesToCreate: new Set(),
    redirectsToCreate: new Set(),
  }

  const groups: MultilingualGroups = {}
  const { defaultLanguage, availableLanguages, rules } = options

  // Group all existing multilingual pages by "multilingualId"
  pages.forEach(page => {
    const { error } = multilingualPageSchema.required().validate(page)

    if (error) {
      return
    }

    const multilingualPage = page as MultilingualPage
    const {
      context: { multilingualId: id, language },
    } = multilingualPage

    if (!groups[id]) {
      groups[id] = new Map()
    }

    groups[id].set(language, multilingualPage)
  })

  // Validate and generate all missing language-specific pages
  Object.entries(groups).forEach(([id, group]) => {
    const missingLanguagesStrategy =
      rules[id] && rules[id].missingLanguagesStrategy
        ? rules[id].missingLanguagesStrategy
        : options.missingLanguagesStrategy

    if (missingLanguagesStrategy === MissingLanguagesStrategy.Ignore) {
      return
    }

    const defaultLanguagePage = group.get(defaultLanguage)

    // In order to generate missing language-specific pages we need to have a
    // default language page
    if (!defaultLanguagePage) {
      result.messages.push({
        type: MessageType.Panic,
        message:
          `Unable to generate missing language-specific pages for "${id}"` +
          `multilingual group due to the lack of a default language page.`,
      })

      return
    }

    // Calculate missing languages and handle them based on the
    // "missingLanguagesStrategy" value
    difference(availableLanguages, Array.from(group.keys())).forEach(
      language => {
        if (missingLanguagesStrategy === MissingLanguagesStrategy.Generate) {
          result.pagesToCreate.add(
            merge({}, defaultLanguagePage, {
              path: getLocalizedPath(
                defaultLanguagePage.path,
                language,
                options,
              ),
              context: { language },
            }),
          )
        }

        if (missingLanguagesStrategy === MissingLanguagesStrategy.Redirect) {
          result.redirectsToCreate.add({
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

  return result
}
