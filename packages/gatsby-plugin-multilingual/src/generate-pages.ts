import path from 'path'
import { merge } from 'lodash'
import Joi from '@hapi/joi'
import { GatsbyPage } from '@gatsby-plugin-multilingual/shared'
import normalizePath from './utils/normalize-path'
import {
  PluginValidatedOptions,
  MultilingualPage,
  PagesGeneratorResult,
} from './types'

export default (
  page: GatsbyPage,
  {
    defaultLanguage,
    availableLanguages,
    includeDefaultLanguageInURL,
    removeInvalidPages,
    removeSkippedPages,
  }: PluginValidatedOptions,
): PagesGeneratorResult => {
  let genericPath: string | null = null
  let languages: string[] | null = null

  // If we have a potential MultilingualPage try to validate it and get the
  // multilingual data from it first
  if (page.context.multilingual) {
    const { error } = Joi.validate(
      page.context.multilingual,
      Joi.object({
        languages: Joi.array()
          .items(
            Joi.string().error(
              () =>
                `The "languages" property must be an array of language keys`,
            ),
          )
          .required()
          .error(
            () => `The "languages" property must be an array of language keys`,
          ),
        skip: Joi.boolean().error(
          () => `The "skip" property must be a boolean value`,
        ),
      }),
      {
        allowUnknown: true,
        abortEarly: false,
      },
    )

    if (!error) {
      const multilintualPage = page as MultilingualPage

      if (multilintualPage.context.multilingual.skip) {
        return {
          pages: [],
          redirects: [],
          removeOriginalPage: removeSkippedPages,
        }
      }

      genericPath = multilintualPage.path
      languages = multilintualPage.context.multilingual.languages
    } else {
      const errorMsg = `The page with the path: "${
        page.path
      }" has invalid properties:\n\t- ${error.details
        .map(err => err.message)
        .join('\n\t- ')}`

      return {
        pages: [],
        redirects: [],
        error: {
          type: 'warn',
          message: errorMsg,
        },
        removeOriginalPage: removeInvalidPages,
      }
    }
  }

  // If the previous step was unable to extract multilingual data, try to get it
  // from the path property
  if (!genericPath || !languages) {
    const pathPartsMatches = /(.+)\.(.+)?$/.exec(page.path)

    if (pathPartsMatches) {
      genericPath = pathPartsMatches[1]
      languages = pathPartsMatches[2].replace('/', '').split(',')
    }
  }

  // If by now we couldn't get multilingual data, give up
  if (!genericPath || !languages) {
    return {
      pages: [],
      redirects: [],
    }
  }

  // Get the page's allowed languages.
  // NOTE: if "all" keyword is present than the page supports all available
  // languages.
  const pageLanguages = languages.includes('all')
    ? availableLanguages
    : languages.filter(language => availableLanguages.includes(language))

  // Warn user if we end up without valid languages
  if (!pageLanguages.length) {
    return {
      pages: [],
      redirects: [],
      error: {
        type: 'warn',
        message: `The page with the path: "${page.path}" has no valid languages. Skipping...`,
      },
      removeOriginalPage: false,
    }
  }

  // Everything seems fine, lets generate some pages
  const result: PagesGeneratorResult = {
    pages: [],
    redirects: [],
    removeOriginalPage: true,
  }

  const plainGatsbyPage: GatsbyPage = { ...page }
  delete plainGatsbyPage.context.multilingual

  pageLanguages.forEach((language): void => {
    const shouldIncludeLanguagePrefix =
      includeDefaultLanguageInURL || language !== defaultLanguage

    const pagePath = normalizePath(genericPath as string)
    const pageNewPath = shouldIncludeLanguagePrefix
      ? `/${language}${pagePath}`
      : pagePath

    result.pages.push(
      merge({}, plainGatsbyPage, {
        path: pageNewPath,
        context: {
          language,
          genericPath: pagePath,
        },
      }),
    )

    // Additionally generate redirects when needed
    if (includeDefaultLanguageInURL && language === defaultLanguage) {
      // Client side redirect
      result.pages.push(
        merge({}, plainGatsbyPage, {
          path: pagePath,
          component: path.resolve('.cache/multilingual/RedirectTemplate.js'),
          context: {
            redirectTo: pageNewPath,
          },
        }),
      )

      // Server side redirect
      result.redirects.push({
        fromPath: pagePath,
        toPath: pageNewPath,
        isPermanent: true,
      })
    }
  })

  return result
}
