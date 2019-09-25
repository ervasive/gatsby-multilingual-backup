import parse from 'url-parse'
import isPlainObject from 'lodash/isPlainObject'
import getPageGenericPath from './utils/get-page-generic-path'
import getPagePrefixedPath from './utils/get-page-prefixed-path'
import { ContextProviderData, PagesRegistry } from './types'

const invalidValueErrorMessage =
  `The "getPath" function received invalid argument. Only "string" or ` +
  `"object" of the following shape: { path: string, language?: ` +
  `string, strict?: boolean, generic?: boolean } are allowed.`

export default ({
  pages,
  pageLanguage,
  defaultLanguage,
  includeDefaultLanguageInURL,
  strict: globalStrict,
}: {
  pages: PagesRegistry
  pageLanguage: string
  defaultLanguage: string
  includeDefaultLanguageInURL: boolean
  strict: boolean
}): ContextProviderData['getPath'] => {
  const fn: ContextProviderData['getPath'] = value => {
    const prevalidatedValue = value as unknown

    if (
      typeof prevalidatedValue !== 'string' &&
      !isPlainObject(prevalidatedValue)
    ) {
      throw new TypeError(invalidValueErrorMessage)
    }

    let path: string
    let language: string
    let strict: boolean
    let generic: boolean

    if (typeof prevalidatedValue === 'string') {
      path = prevalidatedValue
      language = pageLanguage
      strict = globalStrict
      generic = false
    } else {
      const values = prevalidatedValue as Record<string, unknown>

      if (typeof values.path !== 'string') {
        throw new TypeError(invalidValueErrorMessage)
      }

      if (
        typeof values.language !== 'undefined' &&
        typeof values.language !== 'string'
      ) {
        throw new TypeError(invalidValueErrorMessage)
      }

      if (
        typeof values.strict !== 'undefined' &&
        typeof values.strict !== 'boolean'
      ) {
        throw new TypeError(invalidValueErrorMessage)
      }

      if (
        typeof values.generic !== 'undefined' &&
        typeof values.generic !== 'boolean'
      ) {
        throw new TypeError(invalidValueErrorMessage)
      }

      path = values.path
      language = values.language || pageLanguage
      strict = typeof values.strict === 'boolean' ? values.strict : globalStrict
      generic = !!values.generic
    }

    const { slashes, protocol, port, pathname, query, hash } = parse(path, {})

    if (slashes || protocol || port) {
      return path
    }

    const genericPath = getPageGenericPath(pathname, pages)

    if (!genericPath) {
      if (strict) {
        throw new Error(
          `The "getPath" function returned an error. Could not find a ` +
            `page with the following path: ${path}, and language: ${language}`,
        )
      } else {
        return path
      }
    }

    if (generic) {
      return genericPath
    }

    if (typeof pages[genericPath][language] === 'string') {
      return getPagePrefixedPath({
        genericPath,
        language,
        defaultLanguage,
        includeDefaultLanguageInURL,
        pages,
        suffix: `${query}${hash}`,
      })
    } else {
      throw new Error(
        `The "getPath" function returned an error. Could not find a ` +
          `page with the following path: ${path}, and language: ${language}`,
      )
    }
  }

  return fn
}
