import { merge } from 'lodash'
import { Maybe } from 'true-myth'
import { GatsbyPage, GatsbyRedirect } from '@gatsby-plugin-multilingual/shared'
import shouldPageBeSkipped from './utils/should-page-be-skipped'
import getPageOverride from './utils/get-page-override'
import normalizePath from './utils/normalize-path'
import { REDIRECT_TEMPLATE_FILE } from './constants'
import { multilingualPropertySchema } from './schemas'
import {
  Options,
  MultilingualProperty,
  PagesGeneratorResult,
  MissingLanguages,
  MonolingualPage,
  RedirectPage,
} from './types'

// export const getPossiblyPrefixedPath = (
//   language: string,
//   path: string,
// ): string =>
//   normalizePath(
//     includeDefaultLanguageInURL || language !== defaultLanguage
//       ? `${language}/${path}`
//       : path,
//   )

export const createMonolingualPage = (
  page: GatsbyPage,
  path: string,
  language: string,
  pageId: string,
): MonolingualPage =>
  merge({}, page, {
    path: path,
    context: { language, pageId },
  })

export const createRedirectPage = (
  page: GatsbyPage,
  from: string,
  to: string,
): RedirectPage =>
  merge({}, page, {
    path: from,
    component: REDIRECT_TEMPLATE_FILE,
    context: {
      redirectTo: to,
    },
  })

// Server side redirect, passed to "createRedirect":
// https://www.gatsbyjs.org/docs/actions/#createRedirect
export const createRedirect = (from: string, to: string): GatsbyRedirect => ({
  fromPath: from,
  toPath: to,
  isPermanent: true,
})

const getMultilingualContext = (
  page: GatsbyPage,
): Maybe<MultilingualProperty> => {
  // const { error, value } = multilingualPropertySchema(page.context.multilingual)
  const error = undefined
  const value = undefined
  console.log('is it lazy')

  // return Maybe.of(error ? undefined : (value as MultilingualProperty))
  return Maybe.nothing()
}

export default (
  page: GatsbyPage,
  pages: GatsbyPage[],
  {
    defaultLanguage,
    availableLanguages,
    includeDefaultLanguageInURL,
    missingLanguages,
    mode,
    overrides,
  }: Options,
): PagesGeneratorResult => {
  const result: PagesGeneratorResult = {
    pages: [],
    redirects: [],
    errors: [],
    removeOriginalPage: false,
  }

  let pageId = page.path
  let missingLanguagesStrategy = missingLanguages
  const languageVersions: Map<string, string> = new Map()

  const override = getPageOverride(page, overrides)
    .mapErr(err => result.errors.push({ type: 'warn', message: err }))
    .unwrapOr(Maybe.nothing())

  if (shouldPageBeSkipped(page, mode, override)) {
    return result
  }

  // Try to get the page's missing languages strategy & language versions from
  // the global override if there is one for the current page, or from the page
  // context otherwise
  Maybe.or(getMultilingualContext(page), override).map(property => {
    pageId = property.pageId

    Maybe.of(property.missingLanguages).map(strategy => {
      missingLanguagesStrategy = strategy
      return strategy
    })

    Maybe.of(property.languages).map(languages =>
      languages.map(value => {
        if (typeof value === 'string') {
          languageVersions.set(value, page.path)
        } else {
          languageVersions.set(
            value.language,
            value.path ? value.path : page.path,
          )
        }

        return value
      }),
    )

    return property
  })

  // We won't be needing multilingual context anymore
  delete page.context.multilingual

  // Add missing language versions.
  // NOTE: we only add a language version "implicitly" if:
  //   1. "missing languages strategy" is set to "generate" or "redirect"
  //   2. it wasn't set explicitly by multilingual context or a global override
  //   3. the page with the same "pageId" and "language" combination is not
  //      present in the store
  if (missingLanguagesStrategy !== MissingLanguages.Ignore) {
    availableLanguages.forEach(language => {
      const storePageExists = pages.find(page => {
        // const { error } = Joi.validate(
        //   page.context,
        //   Joi.object({
        //     context: Joi.object({
        //       multilingual: multilingualPropertySchema,
        //     }).required(),
        //   }).required(),
        // )

        const error = false

        return error ? false : true
      })

      if (!languageVersions.get(language) && !storePageExists) {
        languageVersions.set(language, page.path)
      }
    })
  }

  // Filter out invalid language versions
  for (const language of languageVersions.keys()) {
    if (!availableLanguages.includes(language)) {
      languageVersions.delete(language)
    }
  }

  // Warn the user if we end up without any valid language
  if (!languageVersions.size) {
    result.errors.push({
      type: 'warn',
      message:
        `A page with the following path: "${page.path}" does not have ` +
        `any valid (allowed) language. Skipping...`,
    })

    return result
  }

  // Everything seems fine, lets generate some pages
  result.removeOriginalPage = true

  // languageVersions.forEach((path, language) => {
  //   if (language === defaultLanguage) {
  //     result.pages.push(
  //       createMonolingualPage(
  //         page,
  //         getPossiblyPrefixedPath(language, path),
  //         language,
  //         pageId,
  //       ),
  //     )

  //     // Additionally generate redirects when needed
  //     if (includeDefaultLanguageInURL) {
  //       result.pages.push(
  //         createRedirectPage(
  //           page,
  //           normalizePath(path),
  //           getPossiblyPrefixedPath(language, path),
  //         ),
  //       )
  //       result.redirects.push(
  //         createRedirect(
  //           normalizePath(path),
  //           getPossiblyPrefixedPath(language, path),
  //         ),
  //       )
  //     }
  //   } else {
  //     if (missingLanguagesStrategy !== MissingLanguages.Redirect) {
  //       result.pages.push(
  //         createMonolingualPage(
  //           page,
  //           getPossiblyPrefixedPath(language, path),
  //           language,
  //           pageId,
  //         ),
  //       )
  //     } else {
  //       result.pages.push(
  //         createRedirectPage(
  //           page,
  //           getPossiblyPrefixedPath(language, path),
  //           getPossiblyPrefixedPath(defaultLanguage, path),
  //         ),
  //       )
  //       result.redirects.push(
  //         createRedirect(
  //           getPossiblyPrefixedPath(language, path),
  //           getPossiblyPrefixedPath(defaultLanguage, path),
  //         ),
  //       )
  //     }
  //   }
  // })

  console.log(page.path, languageVersions)

  return result
}
