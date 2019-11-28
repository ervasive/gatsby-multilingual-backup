import parse from 'url-parse'
import { isPlainObject } from 'lodash'
import { getPageId } from '../utils'
import { CreateGetPathHelper, GetPathHelper, CheckType } from '../types'

const invalidArgErrorMessage =
  `getPath function received an invalid argument. Only "string" or ` +
  `"object" of the following shape: { path: string [optional], language: ` +
  `string [optional], onMissingPath: "ignore" | "warn" | "error" [optional] } ` +
  `are allowed`

const getMissingPageErrorMessage = (path: string, language: string): string =>
  `getPath function returned an error. Could not find a page with ` +
  `the "${path}" path and "${language}" language values`

export const createGetPath: CreateGetPathHelper = ({
  currentPageId,
  currentPageLanguage,
  pages,
  options,
}) => {
  const fn: GetPathHelper = value => {
    // The value comes from user therefore we want to treat it as unknown
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
    let language: string
    let onMissingPath: CheckType

    if (prevalidatedValue === undefined) {
      path = currentPageId
      language = currentPageLanguage
      onMissingPath = options.checks.missingPaths
    } else if (typeof prevalidatedValue === 'string') {
      path = prevalidatedValue
      language = currentPageLanguage
      onMissingPath = options.checks.missingPaths
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

      path = values.path || currentPageId
      language = values.language || currentPageLanguage
      onMissingPath =
        values.onMissingPath === undefined
          ? options.checks.missingPaths
          : (values.onMissingPath as CheckType)
    }

    const { slashes, protocol, port, pathname, query, hash } = parse(path, {})

    // Pass through non relative path values
    if (slashes || protocol || port) {
      return path
    }

    const id = getPageId(pathname, pages)

    if (id && typeof pages[id][language] === 'string') {
      return pages[id][language] + query + hash
    } else {
      if (onMissingPath === CheckType.Error) {
        throw new Error(getMissingPageErrorMessage(path, language))
      } else {
        if (onMissingPath === CheckType.Warn) {
          console.warn(getMissingPageErrorMessage(path, language))
        }

        return path
      }
    }
  }

  return fn
}
