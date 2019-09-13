import { PagesRegistry } from '../types'

const invalidValueErrorMessage =
  `Only "string" or "object" of the following shape: ` +
  `{ to: string, language?: string, strict?: boolean} are allowed as an ` +
  `input value.`

const findPageBySlug = (slug: string, pages: PagesRegistry): string | void => {
  for (const [genericPath, languages] of Object.entries(pages)) {
    for (const [_, pageSlug] of Object.entries(languages)) {
      if (slug === pageSlug) {
        return genericPath
      }
    }
  }
}

export default (
  value: unknown,
  fallbacks: { language: string; strict: boolean },
  pages: PagesRegistry,
): string | Error => {
  if (
    !value ||
    !['object', 'string'].includes(typeof value) ||
    Array.isArray(value)
  ) {
    throw new TypeError(invalidValueErrorMessage)
  }

  let path: string
  let language: string
  let strict: boolean

  if (typeof value === 'string') {
    path = value
    language = fallbacks.language
    strict = fallbacks.strict
  } else {
    const values = value as Record<string, unknown>

    if (typeof values.to !== 'string') {
      throw new TypeError(invalidValueErrorMessage)
    }

    if (values.language && typeof values.language !== 'string') {
      throw new TypeError(invalidValueErrorMessage)
    }

    if (
      typeof values.strict !== 'undefined' &&
      typeof values.strict !== 'boolean'
    ) {
      throw new TypeError(invalidValueErrorMessage)
    }

    path = values.to
    language = (values.language as string) || fallbacks.language
    strict =
      typeof values.strict === 'boolean' ? values.strict : fallbacks.strict
  }

  if (!Object.keys(pages).length) return path

  // Try to get the page path as is (from "genericPath") first
  if (pages[path] && pages[path][language]) {
    return pages[path][language]
  }

  // We can try and find it by the slug value otherwise
  const pageGenericPath = findPageBySlug(path, pages)

  if (pageGenericPath && pages[pageGenericPath][language]) {
    return pages[pageGenericPath][language]
  }

  if (strict) {
    throw new Error(
      `Can't find a page with the following parameters: ${JSON.stringify(
        value,
      )}`,
    )
  }

  return path
}
