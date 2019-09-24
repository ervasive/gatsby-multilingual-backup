import isPlainObject from 'lodash/isPlainObject'
import normalizePath from './utils/normalize-path'
import getPageGenericPath from './utils/get-page-generic-path'
import { ContextProviderData, PagesRegistry } from './types'

const invalidValueErrorMessage =
  `The "getLanguages" function received invalid argument. Only "string" or ` +
  `"object" of the following shape: { path?: string, skipCurrentLanguage?: ` +
  `boolean, strict?: boolean } are allowed.`

export default ({
  pages,
  pageGenericPath,
  pageLanguage,
  strict: globalStrict,
}: {
  pages: PagesRegistry
  pageGenericPath: string
  pageLanguage: string
  strict: boolean
}): ContextProviderData['getLanguages'] => {
  const fn: ContextProviderData['getLanguages'] = value => {
    const prevalidatedValue = value as unknown

    if (
      !['undefined', 'string'].includes(typeof prevalidatedValue) &&
      !isPlainObject(value)
    ) {
      throw new TypeError(invalidValueErrorMessage)
    }

    let path: string
    let skipCurrentLanguage: boolean
    let strict: boolean

    if (typeof prevalidatedValue === 'undefined') {
      path = pageGenericPath
      skipCurrentLanguage = false
      strict = globalStrict
    } else if (typeof prevalidatedValue === 'string') {
      path = prevalidatedValue
      skipCurrentLanguage = false
      strict = globalStrict
    } else {
      const values = prevalidatedValue as Record<string, unknown>

      if (
        typeof values.path !== 'undefined' &&
        typeof values.path !== 'string'
      ) {
        throw new TypeError(invalidValueErrorMessage)
      }

      if (
        typeof values.skipCurrentLanguage !== 'undefined' &&
        typeof values.skipCurrentLanguage !== 'boolean'
      ) {
        throw new TypeError(invalidValueErrorMessage)
      }

      if (
        typeof values.strict !== 'undefined' &&
        typeof values.strict !== 'boolean'
      ) {
        throw new TypeError(invalidValueErrorMessage)
      }

      path = values.path || pageGenericPath
      skipCurrentLanguage = values.skipCurrentLanguage || false
      strict = values.strict || globalStrict
    }

    const genericPath = getPageGenericPath(path, pages)

    if (!genericPath) {
      if (strict) {
        throw new Error(
          `The "getLanguages" function returned an error. Could not find a ` +
            `page with the following path: ${path}`,
        )
      } else {
        return []
      }
    }

    return Object.entries(pages[genericPath])
      .filter(
        ([language]) => !(skipCurrentLanguage && language === pageLanguage),
      )
      .map(([language, path]) => ({
        language,
        path: normalizePath(`${language}/${path === '' ? genericPath : path}`),
      }))
  }

  return fn
}
