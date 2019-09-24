import parse from 'url-parse'
import isPlainObject from 'lodash/isPlainObject'
import normalizePath from './utils/normalize-path'
import getPageGenericPath from './utils/get-page-generic-path'
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
    let genericOnly: boolean

    if (typeof prevalidatedValue === 'string') {
      path = prevalidatedValue
      language = pageLanguage
      strict = globalStrict
      genericOnly = false
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
      genericOnly = !!values.generic
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

    if (genericOnly) {
      return genericPath
    }

    if (typeof pages[genericPath][language] === 'string') {
      const pathPrefix =
        !includeDefaultLanguageInURL && language === defaultLanguage
          ? ''
          : language

      const genericPathNormalized =
        pathPrefix !== '' && genericPath === '/' ? '' : genericPath

      const pathValue =
        pages[genericPath][language] === ''
          ? genericPathNormalized
          : pages[genericPath][language]

      return normalizePath(`${pathPrefix}${pathValue}${query}${hash}`)
    } else {
      throw new Error(
        `The "getPath" function returned an error. Could not find a ` +
          `page with the following path: ${path}, and language: ${language}`,
      )
    }
  }

  return fn
}
