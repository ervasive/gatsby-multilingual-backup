import Joi from '@hapi/joi'
import { GatsbyPage } from '@gatsby-plugin-multilingual/shared'
import { Options, PageOverride } from '../types'

export default (
  page: GatsbyPage,
  overrides: Options['overrides'],
): PageOverride | void | Error => {
  const override = Array.isArray(overrides)
    ? overrides.find(({ path }) => path === page.path)
    : overrides(page)

  if (!override) {
    return
  }

  const { error, value } = Joi.validate(
    override,
    Joi.object({
      path: Joi.string().required(),
      process: Joi.boolean(),
      languages: Joi.array().items(
        Joi.string(),
        Joi.object({
          language: Joi.string().required(),
          path: Joi.string(),
        }),
      ),
    }).required(),
  )

  if (error) {
    // TODO: error message
    throw new Error('Invalid page override provided')
  }

  return value
}
