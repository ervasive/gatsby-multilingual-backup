import { merge } from 'lodash'
import { GatsbyPage } from '@gatsby-plugin-multilingual/shared'
import { multilingualPageSchema } from '../schemas'
import { getLocalizedPath } from '.'
import {
  Options,
  MessageType,
  MultilingualPage,
  GatsbyStorePages,
  PagesProcessingResult,
} from '../types'

export const processPage = (
  page: GatsbyPage,
  pages: GatsbyStorePages,
  options: Options,
): PagesProcessingResult => {
  const result: PagesProcessingResult = {
    messages: [],
    pagesToDelete: new Set(),
    pagesToCreate: new Set(),
    redirectsToCreate: new Set(),
  }
  const { availableLanguages, removeInvalidPages, rules } = options
  const { error } = multilingualPageSchema.required().validate(page)

  if (error) {
    // If a page is multilingual but invalid, inform user
    if (
      page.context.multilingualId ||
      page.context.multilingualId === '' ||
      page.context.language ||
      page.context.language === ''
    ) {
      result.messages.push({
        type: MessageType.Error,
        message: `"${page.path}" page failed validation: ${error.message}`,
      })

      if (removeInvalidPages) {
        result.pagesToDelete.add(page)
      }
    }

    return result
  }

  // We can infer the type based on the passed validation
  const multilingualPage = page as MultilingualPage
  const {
    path,
    context: { multilingualId: id, language },
  } = multilingualPage

  // If there is a user defined rule for this "multilingualId" and "language"
  // pair then we are simply going to remove the provided page and let the rule
  // process this language version
  const rule = rules[id]

  if (rule && rule.languages && rule.languages[language]) {
    result.messages.push({
      type: MessageType.Info,
      message:
        `"${multilingualPage.path}" page was deleted due to an existing ` +
        `"rules[${id}][${language}]" rule`,
    })

    result.pagesToDelete.add(multilingualPage)
    return result
  }

  // Check for a valid language value
  if (!availableLanguages.includes(language)) {
    const languages = availableLanguages.join(', ')

    result.messages.push({
      type: MessageType.Error,
      message:
        `"${multilingualPage.path}" page has invalid language value: ` +
        `"${language}". Allowed values are: [${languages}]`,
    })

    if (removeInvalidPages) {
      result.pagesToDelete.add(multilingualPage)
    }

    return result
  }

  // Construct a correct localized path based on "includeDefaultLanguageInURL"
  // option
  const localizedPath = getLocalizedPath(path, language, options)

  // A page with a "multilingualId" and "language" pair must be unique, that's
  // why we are checking if there are any previously created pages that we have
  // to remove
  Array.from(pages.values())
    .filter(
      ({ path, context }) =>
        multilingualPage.path !== path &&
        context.multilingualId === id &&
        context.language === language,
    )
    .map(page => {
      // We don'n want to delete an exisitng page if it is going to be
      // re-created anyway
      if (page.path !== localizedPath) {
        result.messages.push({
          type: MessageType.Info,
          message: `"${page.path}" page was overriden by "${localizedPath}" page`,
        })

        result.pagesToDelete.add(page)
      }
    })

  // Create a new page with an updated localized path (do nothing if the path
  // is correct)
  if (multilingualPage.path !== localizedPath) {
    result.pagesToCreate.add(
      merge({}, multilingualPage, {
        path: localizedPath,
      }),
    )

    result.pagesToDelete.add(multilingualPage)
  }

  return result
}
