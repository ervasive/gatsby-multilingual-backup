import isPlainObject from 'lodash/isPlainObject'
import getPageGenericPath from './utils/get-page-generic-path'
import { ContextProviderData, PagesRegistry } from './types'

const invalidValueErrorMessage =
  `The "getPath" function received invalid argument. Only "string" or ` +
  `"object" of the following shape: { path: string, language?: ` +
  `string, strict?: boolean, generic?: boolean } are allowed.`

export default (
  pages: PagesRegistry,
  currentPageLanguage: string,
  globalStrict: boolean,
): ContextProviderData['getPath'] => {
  const fn: ContextProviderData['getPath'] = value => {
    if (typeof value !== 'string' && !isPlainObject(value)) {
      throw new TypeError(invalidValueErrorMessage)
    }

    let path: string
    let language: string
    let strict: boolean
    let genericOnly: boolean

    if (typeof value === 'string') {
      path = value
      language = currentPageLanguage
      strict = globalStrict
      genericOnly = false
    } else {
      const values = value as Record<string, unknown>

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
      language = values.language || currentPageLanguage
      strict = typeof values.strict === 'boolean' ? values.strict : globalStrict
      genericOnly = !!values.generic
    }

    const genericPath = getPageGenericPath(path, pages)

    if (genericPath) {
      if (genericOnly) {
        return genericPath
      } else if (pages[genericPath][language]) {
        return pages[genericPath][language]
      }
    }

    if (strict) {
      throw new Error(
        `The "getPath" function returned an error. Could not find a ` +
          `page with the following path: ${path}, and language: ${language}`,
      )
    }

    return path
  }

  return fn
}
