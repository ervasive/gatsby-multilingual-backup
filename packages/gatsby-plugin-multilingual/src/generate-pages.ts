import path from 'path'
import { merge } from 'lodash'
import Joi from '@hapi/joi'
import { GatsbyPage } from '@gatsby-plugin-multilingual/shared'
import normalizePath from './utils/normalize-path'
import {
  Options,
  MultilingualPage,
  PagesGeneratorResult,
  MultilingualContextLanguage,
} from './types'

export default (
  page: GatsbyPage,
  {
    defaultLanguage,
    availableLanguages,
    includeDefaultLanguageInURL,
    removeInvalidPages,
    removeSkippedPages,
    customSlugs,
  }: Options,
): PagesGeneratorResult => {
  let genericPath = ''
  const languageToSlugMap: Map<string, string> = new Map()

  // If we have a potential MultilingualPage try to validate it and get the
  // multilingual data from it first
  if (page.context.multilingual) {
    const { error } = Joi.validate(
      page.context.multilingual,
      Joi.object({
        languages: Joi.array()
          .items(
            Joi.string(),
            Joi.object({
              language: Joi.string().required(),
              slug: Joi.string(),
            }),
          )
          .required()
          .error(
            () =>
              `The "languages" property must be an array which can contain ` +
              `two value types:\n` +
              `\tstring - represents a language key` +
              `\tobject - represents a language key and a custom page slug`,
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
      multilintualPage.context.multilingual.languages.map(value => {
        if (typeof value === 'string') {
          languageToSlugMap.set(value, genericPath)
        } else {
          languageToSlugMap.set(value.language, value.slug || genericPath)
        }
      })
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
  if (genericPath === '' || !languageToSlugMap.size) {
    const pathPartsMatches = /(.+)\.(.+)?$/.exec(page.path)

    if (pathPartsMatches) {
      genericPath = pathPartsMatches[1]

      pathPartsMatches[2]
        .replace('/', '')
        .split(',')
        .map(language => {
          languageToSlugMap.set(language, genericPath)
        })
    }
  }

  // If by now we couldn't get multilingual data, give up
  if (genericPath === '' || !languageToSlugMap.size) {
    return {
      pages: [],
      redirects: [],
    }
  }

  // Get the page's allowed languages
  const pageAllowedLanguages: Required<MultilingualContextLanguage>[] = []

  // if "all" keyword is present than the page supports all available languages
  if (languageToSlugMap.get('all')) {
    availableLanguages.forEach(language => {
      pageAllowedLanguages.push({
        language,
        slug: languageToSlugMap.get(language) || genericPath,
      })
    })
  } else {
    languageToSlugMap.forEach((slug, language) => {
      if (availableLanguages.includes(language)) {
        pageAllowedLanguages.push({
          language,
          slug,
        })
      }
    })
  }

  // Warn user if we end up without valid languages
  if (!pageAllowedLanguages.length) {
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

  pageAllowedLanguages.forEach(({ language, slug }): void => {
    const shouldIncludeLanguagePrefix =
      includeDefaultLanguageInURL || language !== defaultLanguage

    // Shared generic page path (used as a unique value in determinig related
    // language-specific pages)
    genericPath = normalizePath(genericPath)

    // Globally defined page slugs take precedence over slug values defined in
    // a page property
    const pageSlug =
      customSlugs[genericPath] && customSlugs[genericPath][language]
        ? customSlugs[genericPath][language]
        : slug

    const pagePrefixlessPath = normalizePath(pageSlug)

    const pagePrefixedPath = normalizePath(
      shouldIncludeLanguagePrefix ? `${language}/${pageSlug}` : pageSlug,
    )

    result.pages.push(
      merge({}, plainGatsbyPage, {
        path: pagePrefixedPath,
        context: {
          language,
          genericPath,
        },
      }),
    )

    // Additionally generate redirects when needed
    if (includeDefaultLanguageInURL && language === defaultLanguage) {
      // Client side redirect
      result.pages.push(
        merge({}, plainGatsbyPage, {
          path: pagePrefixlessPath,
          component: path.resolve('.cache/multilingual/RedirectTemplate.js'),
          context: {
            redirectTo: pagePrefixedPath,
          },
        }),
      )

      // Server side redirect
      result.redirects.push({
        fromPath: pagePrefixlessPath,
        toPath: pagePrefixedPath,
        isPermanent: true,
      })
    }
  })

  return result
}
