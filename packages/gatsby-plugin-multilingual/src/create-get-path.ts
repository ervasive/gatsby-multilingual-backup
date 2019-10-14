import parse from 'url-parse'
import isPlainObject from 'lodash/isPlainObject'
import getPageGenericPath from './utils/get-page-generic-path'
import getPagePrefixedPath from './utils/get-page-prefixed-path'
import { ContextProviderData, PagesRegistry, CheckType } from './types'

const invalidArgErrorMessage =
  `The "getPath" function received invalid argument. Only "string" or ` +
  `"object" of the following shape: { path?: string, language?: ` +
  `string, strict?: "ignore" | "warn" | "error", generic?: boolean } are ` +
  `allowed.`

const getMissingPageErrorMessage = (
  path: string,
  language?: string,
): string => {
  const result = [
    `The "getPath" function returned an error. Could not find a ` +
      `page with the following path: "${path}"`,
  ]

  if (language) {
    result.push(`and language: "${language}" combination`)
  }

  return result.join(' ')
}

export default ({
  pages,
  pageGenericPath,
  pageLanguage,
  defaultLanguage,
  includeDefaultLanguageInURL,
  onMissingPaths,
}: {
  pages: PagesRegistry
  pageGenericPath: string
  pageLanguage: string
  defaultLanguage: string
  includeDefaultLanguageInURL: boolean
  onMissingPaths: CheckType
}): ContextProviderData['getPath'] => {
  const fn: ContextProviderData['getPath'] = value => {
    const prevalidatedValue = value as unknown

    if (
      !['undefined', 'string'].includes(typeof prevalidatedValue) &&
      !isPlainObject(prevalidatedValue)
    ) {
      throw new TypeError(invalidArgErrorMessage)
    }

    let path: string
    let language: string
    let onMissingPath: CheckType
    let generic: boolean

    if (prevalidatedValue === undefined) {
      path = pageGenericPath
      language = pageLanguage
      onMissingPath = onMissingPaths
      generic = false
    } else if (typeof prevalidatedValue === 'string') {
      path = prevalidatedValue
      language = pageLanguage
      onMissingPath = onMissingPaths
      generic = false
    } else {
      const values = prevalidatedValue as Record<string, unknown>

      if (!(values.path === undefined || typeof values.path === 'string')) {
        throw new TypeError(invalidArgErrorMessage)
      }

      if (
        !(values.language === undefined || typeof values.language === 'string')
      ) {
        throw new TypeError(invalidArgErrorMessage)
      }

      if (
        !(
          values.onMissingPath === undefined ||
          (typeof values.onMissingPath === 'string' &&
            [CheckType.Ignore, CheckType.Warn, CheckType.Error].includes(
              values.onMissingPath as CheckType,
            ))
        )
      ) {
        throw new TypeError(invalidArgErrorMessage)
      }

      if (
        !(values.generic === undefined || typeof values.generic === 'boolean')
      ) {
        throw new TypeError(invalidArgErrorMessage)
      }

      path = values.path || pageGenericPath
      language = values.language || pageLanguage
      onMissingPath =
        values.onMissingPath === undefined
          ? onMissingPaths
          : (values.onMissingPath as CheckType)
      generic = !!values.generic
    }

    const { slashes, protocol, port, pathname, query, hash } = parse(path, {})

    if (slashes || protocol || port) {
      return path
    }

    const genericPath = getPageGenericPath(pathname, pages)

    if (genericPath.isNothing()) {
      if (onMissingPath === CheckType.Error) {
        throw new Error(getMissingPageErrorMessage(path))
      } else {
        if (onMissingPath === CheckType.Warn) {
          console.warn(getMissingPageErrorMessage(path))
        }

        return path
      }
    } else {
      const path = genericPath.unsafelyUnwrap()

      if (generic) {
        return path
      }

      if (typeof pages[path][language] === 'string') {
        return getPagePrefixedPath({
          genericPath: path,
          language,
          defaultLanguage,
          includeDefaultLanguageInURL,
          pages,
          suffix: `${query}${hash}`,
        })
      } else {
        throw new Error(getMissingPageErrorMessage(path, language))
      }
    }
  }

  return fn
}
