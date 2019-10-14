import { merge } from 'lodash'
import { Maybe } from 'true-myth'
import { GatsbyPage, GatsbyRedirect } from '@gatsby-plugin-multilingual/shared'
import shouldPageBeSkipped from './utils/should-page-be-skipped'
import getPageOverride from './utils/get-page-override'
import normalizePath from './utils/normalize-path'
import { REDIRECT_TEMPLATE_FILE } from './constants'
import multilingualContextSchema from './schemas/multilingualContext'
import {
  Options,
  MultilingualContext,
  PagesGeneratorResult,
  MissingLanguages,
  MonolingualPage,
  RedirectPage,
} from './types'

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

// Clientside page redirect
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

// Gatsby redirect, passed to "createRedirect":
// https://www.gatsbyjs.org/docs/actions/#createRedirect
export const createRedirect = (from: string, to: string): GatsbyRedirect => ({
  fromPath: from,
  toPath: to,
  isPermanent: true,
})

export default (
  page: GatsbyPage,
  pages: Map<string, GatsbyPage>,
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

  // We are going to collect all supported page language versions here.
  // Structure: Map<language, {path, force}>
  //   - language - language key
  //   - path - custom language-specific path or page.path as a fallback
  //   - force - allow this "language version" to overwrite existing store page
  const languageVersions: Map<
    string,
    { path: string; force: boolean }
  > = new Map()

  const override = getPageOverride(page, overrides)
    .mapErr(err => result.errors.push(err))
    .unwrapOr(Maybe.nothing())

  if (shouldPageBeSkipped(page, mode, override)) {
    return result
  }

  // Try to get "multilingual" attributes and language versions from a global
  // override, or if one was not found, from the page's context.
  const {
    error: contextValidationError,
    value: contextValidationValue,
  } = multilingualContextSchema.validate(page.context.multilingual)

  const multilingualContext = Maybe.of(
    contextValidationError
      ? undefined
      : (contextValidationValue as MultilingualContext),
  )

  Maybe.or(multilingualContext, override).map(property => {
    Maybe.of(property.pageId).map(value => {
      pageId = value
      return value
    })

    Maybe.of(property.missingLanguages).map(strategy => {
      missingLanguagesStrategy = strategy
      return strategy
    })

    // In this case, the user explicitly specified language versions through
    // available mechanisms (override, context), so we are going to enforce
    // the generation of these language versions even if some of them may
    // overwrite existing pages.
    Maybe.of(property.languages).map(languages =>
      languages.map(value => {
        if (typeof value === 'string') {
          languageVersions.set(value, { path: page.path, force: true })
        } else {
          languageVersions.set(value.language, {
            path: value.path ? value.path : page.path,
            force: true,
          })
        }

        return value
      }),
    )

    return property
  })

  // We extracted all required data from the multilingual context, and because
  // the provided page is going to be used as the source for the generation of
  // the language-specific pages (preserving all provided context properties),
  // we want to keep it clean.
  delete page.context.multilingual

  // Ensure that in case if the page did not specify any language versions
  // explicitly (meaning this is a non-multilingual page), add the default
  // language version. We need it to (1) serve as the base for other language
  // versions and (2) as the place to redirect pages to if "missingLanguages"
  // strategy is set to "redirect".
  if (!languageVersions.size) {
    languageVersions.set(defaultLanguage, { path: page.path, force: true })
  }

  // Add all missing language versions (that were not added explicitly) if we
  // were instructed to do so. We are not going to enforce pages generation for
  // these language versions as they weren't set by user, meaning that they
  // won't overwite pages from the store but they may be overwritten by some
  // other page with the same "pageId" and multilingual context value.
  if (
    missingLanguagesStrategy !== MissingLanguages.Ignore &&
    languageVersions.has(defaultLanguage)
  ) {
    availableLanguages.forEach(language => {
      if (!languageVersions.has(language)) {
        languageVersions.set(language, { path: page.path, force: false })
      }
    })
  }

  // Filter out invalid language versions.
  for (const language of languageVersions.keys()) {
    if (!availableLanguages.includes(language)) {
      languageVersions.delete(language)
    }
  }

  // Warn the user if we end up without any valid language.
  if (!languageVersions.size) {
    result.errors.push(
      `A page with the following path: "${page.path}" does not have any ` +
        `valid languages. Skipping...`,
    )

    return result
  }

  // Everything seems fine, lets transform language versions into pages and
  // redirects objects.
  languageVersions.forEach(({ path, force }, language) => {
    const basePath = normalizePath(path)
    const languagePath = normalizePath(
      includeDefaultLanguageInURL || language !== defaultLanguage
        ? `${language}/${path}`
        : path,
    )
    const defaultLanguagePath = normalizePath(
      includeDefaultLanguageInURL ? `${defaultLanguage}/${path}` : path,
    )

    // This is the place where we decide which pages are allowed to overwrite
    // existing store pages and which are not.
    if (pages.has(languagePath) && !force) {
      return
    }

    if (language === defaultLanguage) {
      result.pages.push(
        createMonolingualPage(page, languagePath, language, pageId),
      )

      if (includeDefaultLanguageInURL) {
        result.pages.push(createRedirectPage(page, basePath, languagePath))
        result.redirects.push(createRedirect(basePath, languagePath))
      }
    } else {
      if (missingLanguagesStrategy === MissingLanguages.Redirect) {
        result.pages.push(
          createRedirectPage(page, languagePath, defaultLanguagePath),
        )
        result.redirects.push(createRedirect(languagePath, defaultLanguagePath))
      } else {
        result.pages.push(
          createMonolingualPage(page, languagePath, language, pageId),
        )
      }
    }
  })

  // If we reached this point, it means that we have a meaningful result that
  // should replace the source page.
  result.removeOriginalPage = true

  return result
}
