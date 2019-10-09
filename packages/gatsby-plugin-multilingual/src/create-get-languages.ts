import parse from 'url-parse'
import isPlainObject from 'lodash/isPlainObject'
import getPageGenericPath from './utils/get-page-generic-path'
import getPagePrefixedPath from './utils/get-page-prefixed-path'
import { ContextProviderData, PagesRegistry, StrictCheckType } from './types'

const invalidArgErrorMessage =
  `The "getLanguages" function received invalid argument. Only "string" or ` +
  `"object" of the following shape: { path?: string, skipCurrentLanguage?: ` +
  `boolean, strict?: "ignore" | "warn" | "error" } are allowed.`

const getMissingPageErrorMessage = (path: string): string =>
  `The "getPath" function returned an error. Could not find a ` +
  `page with the following path: "${path}"`

export default ({
  pages,
  pageGenericPath,
  pageLanguage,
  defaultLanguage,
  includeDefaultLanguageInURL,
  strict: globalStrict,
}: {
  pages: PagesRegistry
  pageGenericPath: string
  pageLanguage: string
  defaultLanguage: string
  includeDefaultLanguageInURL: boolean
  strict: StrictCheckType
}): ContextProviderData['getLanguages'] => {
  const fn: ContextProviderData['getLanguages'] = value => {
    const prevalidatedValue = value as unknown

    if (
      !['undefined', 'string'].includes(typeof prevalidatedValue) &&
      !isPlainObject(prevalidatedValue)
    ) {
      throw new TypeError(invalidArgErrorMessage)
    }

    let path: string
    let skipCurrentLanguage: boolean
    let strict: StrictCheckType

    if (prevalidatedValue === undefined) {
      path = pageGenericPath
      skipCurrentLanguage = false
      strict = globalStrict
    } else if (typeof prevalidatedValue === 'string') {
      path = prevalidatedValue
      skipCurrentLanguage = false
      strict = globalStrict
    } else {
      const values = prevalidatedValue as Record<string, unknown>

      if (!(values.path === undefined || typeof values.path === 'string')) {
        throw new TypeError(invalidArgErrorMessage)
      }

      if (
        !(
          values.skipCurrentLanguage === undefined ||
          typeof values.skipCurrentLanguage === 'boolean'
        )
      ) {
        throw new TypeError(invalidArgErrorMessage)
      }

      if (
        !(
          values.strict === undefined ||
          (typeof values.strict === 'string' &&
            [
              StrictCheckType.Ignore,
              StrictCheckType.Warn,
              StrictCheckType.Error,
            ].includes(values.strict as StrictCheckType))
        )
      ) {
        throw new TypeError(invalidArgErrorMessage)
      }

      path = values.path || pageGenericPath
      skipCurrentLanguage = values.skipCurrentLanguage || false
      strict =
        values.strict === undefined
          ? globalStrict
          : (values.strict as StrictCheckType)
    }

    const { slashes, protocol, port, pathname, query, hash } = parse(path, {})

    if (slashes || protocol || port) {
      return []
    }

    const genericPath = getPageGenericPath(pathname, pages)

    if (genericPath.isNothing()) {
      if (strict === StrictCheckType.Error) {
        throw new Error(getMissingPageErrorMessage(path))
      } else {
        if (strict === StrictCheckType.Warn) {
          console.warn(getMissingPageErrorMessage(path))
        }

        return []
      }
    } else {
      const path = genericPath.unsafelyUnwrap()

      return Object.keys(pages[path])
        .filter(language => !(skipCurrentLanguage && language === pageLanguage))
        .map(language => ({
          language,
          path: getPagePrefixedPath({
            genericPath: path,
            language,
            defaultLanguage,
            includeDefaultLanguageInURL,
            pages,
            suffix: `${query}${hash}`,
          }),
          isCurrent: language === pageLanguage,
        }))
    }
  }

  return fn
}
