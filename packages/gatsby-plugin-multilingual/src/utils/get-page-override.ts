import { Maybe, Result } from 'true-myth'
import { GatsbyPage } from '@gatsby-plugin-multilingual/shared'
import { multilingualOverrideSchema } from '../schemas'
import { Options, MultilingualOverride } from '../types'

export default (
  page: GatsbyPage,
  overrides: Options['overrides'],
): Result<Maybe<MultilingualOverride>, string> => {
  const override = Array.isArray(overrides)
    ? overrides.find(({ pageId }) => pageId === page.path) // and page.context.multilingual.pageId ???
    : overrides(page)

  if (!override) {
    return Result.ok(Maybe.nothing<MultilingualOverride>())
  }

  const { error, value } = multilingualOverrideSchema.validate(override)

  if (error) {
    return Result.err('Invalid page override provided')
  }

  return Result.ok(Maybe.just(value))
}
