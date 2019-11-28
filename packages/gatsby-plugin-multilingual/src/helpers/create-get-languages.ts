import parse from 'url-parse'
import { isPlainObject } from 'lodash'
import { getPageId } from '../utils'
import {
  CreateGetLanguagesHelper,
  GetLanguagesHelper,
  CheckType,
} from '../types'

const invalidArgErrorMessage =
  `getLanguages function received an invalid argument. Only "string" or ` +
  `"object" of the following shape: { path: string [optional], ` +
  `skipCurrentLanguage: boolean [optional], onMissingPath: "ignore" | "warn" ` +
  `| "error" [optional] } are allowed`

const getMissingPageErrorMessage = (path: string): string =>
  `getLanguages function returned an error. Could not find a ` +
  `page with the following path: "${path}"`

export const createGetLanguages: CreateGetLanguagesHelper = ({
  currentPageId,
  currentPageLanguage,
  pages,
  options,
}) => {
  const fn: GetLanguagesHelper = value => {
    // The value comes from the user therefore we want to treat it as unknown
    const prevalidatedValue = value as unknown

    if (
      !(
        ['undefined', 'string'].includes(typeof prevalidatedValue) ||
        isPlainObject(prevalidatedValue)
      )
    ) {
      throw new TypeError(invalidArgErrorMessage)
    }

    let path: string
    let skipCurrentLanguage: boolean
    let onMissingPath: CheckType

    if (prevalidatedValue === undefined) {
      path = currentPageId
      skipCurrentLanguage = false
      onMissingPath = options.checks.missingPaths
    } else if (typeof prevalidatedValue === 'string') {
      path = prevalidatedValue
      skipCurrentLanguage = false
      onMissingPath = options.checks.missingPaths
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
          values.onMissingPath === undefined ||
          (typeof values.onMissingPath === 'string' &&
            [CheckType.Ignore, CheckType.Warn, CheckType.Error].includes(
              values.onMissingPath as CheckType,
            ))
        )
      ) {
        throw new TypeError(invalidArgErrorMessage)
      }

      path = values.path || currentPageId
      skipCurrentLanguage = values.skipCurrentLanguage || false
      onMissingPath =
        values.onMissingPath === undefined
          ? options.checks.missingPaths
          : (values.onMissingPath as CheckType)
    }

    const { slashes, protocol, port, pathname, query, hash } = parse(path, {})

    // Ignore non relative path values
    if (slashes || protocol || port) {
      return []
    }

    const id = getPageId(pathname, pages)

    if (id) {
      return Object.keys(pages[id])
        .filter(
          language =>
            !(skipCurrentLanguage && language === currentPageLanguage),
        )
        .map(language => ({
          language,
          path: pages[id][language] + query + hash,
          isCurrent: language === currentPageLanguage,
        }))
    } else {
      if (onMissingPath === CheckType.Error) {
        throw new Error(getMissingPageErrorMessage(path))
      } else {
        if (onMissingPath === CheckType.Warn) {
          console.warn(getMissingPageErrorMessage(path))
        }

        return []
      }
    }
  }

  return fn
}
