import { merge } from 'lodash'
import Joi from '@hapi/joi'
import { GatsbyPage } from '@gatsby-plugin-multilingual/shared'
import normalizePath from './utils/normalize-path'
import { REDIRECT_TEMPLATE_FILE } from './constants'
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
    pathOverrides,
  }: Options,
): PagesGeneratorResult => {
  let genericPath = ''
  const languagePathMap: Map<string, string> = new Map()

  // 1. If we have a potential MultilingualPage try to validate it and get the
  // multilingual data from it as the first step
  if (page.context.multilingual) {
    const { error } = Joi.validate(
      page.context.multilingual,
      Joi.object({
        languages: Joi.array()
          .items(
            Joi.string(),
            Joi.object({
              language: Joi.string().required(),
              path: Joi.string(),
            }),
          )
          .required()
          .error(
            () =>
              `The "languages" property must be an array which can contain ` +
              `two value types:\n` +
              `\tstring - represents a language key` +
              `\tobject - represents a language key and a custom page path`,
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
          errors: [],
          removeOriginalPage: removeSkippedPages,
        }
      }

      genericPath = multilintualPage.path
      multilintualPage.context.multilingual.languages.map(value => {
        if (typeof value === 'string') {
          languagePathMap.set(value, genericPath)
        } else {
          languagePathMap.set(value.language, value.path || genericPath)
        }
      })
    } else {
      const errorMsg =
        `A page with the following path: "${page.path}" has invalid ` +
        `properties:\n\t- ${error.details
          .map(err => err.message)
          .join('\n\t- ')}`

      return {
        pages: [],
        redirects: [],
        errors: [
          {
            type: 'warn',
            message: errorMsg,
          },
        ],
        removeOriginalPage: removeInvalidPages,
      }
    }
  }

  // 2. If the previous step was unable to extract multilingual data, try to get
  // it from the path property
  if (genericPath === '' || !languagePathMap.size) {
    const pathPartsMatches = /(.+)\.(.+)?$/.exec(page.path)

    if (pathPartsMatches) {
      genericPath = pathPartsMatches[1]

      pathPartsMatches[2]
        .replace('/', '')
        .split(',')
        .map(language => {
          languagePathMap.set(language, genericPath)
        })
    }
  }

  // 3. If by now we couldn't get multilingual data, give up
  if (genericPath === '' || !languagePathMap.size) {
    return {
      pages: [],
      redirects: [],
      errors: [],
    }
  }

  // 4. Determine all the languages this page supports
  const pageAllowedLanguages: Required<MultilingualContextLanguage>[] = []

  // if "all" keyword is present than the page supports all available languages
  if (languagePathMap.get('all')) {
    availableLanguages.forEach(language => {
      pageAllowedLanguages.push({
        language,
        path: languagePathMap.get(language) || genericPath,
      })
    })
  } else {
    languagePathMap.forEach((path, language) => {
      if (availableLanguages.includes(language)) {
        pageAllowedLanguages.push({
          language,
          path,
        })
      }
    })
  }

  // 5. Warn the user if we end up without any valid language
  if (!pageAllowedLanguages.length) {
    return {
      pages: [],
      redirects: [],
      errors: [
        {
          type: 'warn',
          message:
            `A page with the following path: "${page.path}" does not have ` +
            `any valid (allowed) language. Skipping...`,
        },
      ],
      removeOriginalPage: false,
    }
  }

  // 6. Everything seems fine, lets generate some pages
  const result: PagesGeneratorResult = {
    pages: [],
    redirects: [],
    removeOriginalPage: true,
    errors: [],
  }

  // We want to pass all the properties of the original page except the
  // "context.multilingual" to the newly generated pages
  const plainGatsbyPage: GatsbyPage = { ...page }
  delete plainGatsbyPage.context.multilingual

  pageAllowedLanguages.forEach(({ language, path }): void => {
    const shouldIncludeLanguagePrefix =
      includeDefaultLanguageInURL || language !== defaultLanguage

    // Globally defined "path overrides" take precedence over the path value
    // provided as a context property
    let plainPath: string

    if (pathOverrides[genericPath] && pathOverrides[genericPath][language]) {
      const pathOverride = pathOverrides[genericPath][language]

      if (typeof pathOverride === 'string' && pathOverride.length) {
        plainPath = normalizePath(pathOverride)
      } else {
        result.errors.push({
          type: 'warn',
          message:
            `Invalid path override found: "${genericPath}.${language}".` +
            `Please make sure its value is a non empty string.`,
        })

        plainPath = normalizePath(path)
      }
    } else {
      plainPath = normalizePath(path)
    }

    const possiblyPrefixedPath = normalizePath(
      shouldIncludeLanguagePrefix ? `${language}/${plainPath}` : plainPath,
    )

    result.pages.push(
      merge({}, plainGatsbyPage, {
        path: possiblyPrefixedPath,
        context: {
          language,
          genericPath: normalizePath(genericPath),
        },
      }),
    )

    // Additionally generate redirects when needed
    if (includeDefaultLanguageInURL && language === defaultLanguage) {
      // Client side redirect
      result.pages.push(
        merge({}, plainGatsbyPage, {
          path: plainPath,
          component: REDIRECT_TEMPLATE_FILE,
          context: {
            redirectTo: possiblyPrefixedPath,
          },
        }),
      )

      // Server side redirect, passed to "createRedirect":
      // https://www.gatsbyjs.org/docs/actions/#createRedirect
      result.redirects.push({
        fromPath: plainPath,
        toPath: possiblyPrefixedPath,
        isPermanent: true,
      })
    }
  })

  // 7. Yay
  return result
}
