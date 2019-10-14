import { Maybe, Result } from 'true-myth'
import { GatsbyPage } from '@gatsby-plugin-multilingual/shared'
import multilingualContextSchema from '../schemas/multilingualContext'
import multilingualOverrideSchema from '../schemas/multilingualOverride'
import { Options, MultilingualContext, MultilingualOverride } from '../types'

export default (
  page: GatsbyPage,
  overrides: Options['overrides'],
): Result<Maybe<MultilingualOverride>, string> => {
  let pageId = page.path
  let override: unknown

  const {
    error: contextValidationError,
    value: contextValidationValue,
  } = multilingualContextSchema.required().validate(page.context.multilingual)

  if (!contextValidationError) {
    Maybe.of((contextValidationValue as MultilingualContext).pageId).map(
      value => {
        pageId = value
        return value
      },
    )
  }

  if (Array.isArray(overrides)) {
    override = overrides.find(o => o.pageId === pageId)
  }

  if (typeof overrides === 'function') {
    try {
      override = overrides(page)
    } catch (e) {
      return Result.err(
        `The page override function threw an Error: "${e.message}"`,
      )
    }
  }

  if (!override) {
    return Result.ok(Maybe.nothing<MultilingualOverride>())
  }

  const {
    error: overrideValidationError,
    value: overrideValidationValue,
  } = multilingualOverrideSchema.required().validate(override)

  if (overrideValidationError) {
    return Result.err(
      `Page override failed validation: ${overrideValidationError.message}`,
    )
  }

  return Result.ok(Maybe.just(overrideValidationValue as MultilingualOverride))
}
