import Joi from '@hapi/joi'
import { missingLanguagesStrategySchema } from '.'

const { boolean, string, object, alternatives } = Joi.types()

export default object.keys({
  languages: object.pattern(
    string,
    alternatives
      .try(
        string,
        object.keys({
          path: string.required(),
          slug: string.required(),
        }),
      )
      .required(),
  ),
  missingLanguagesStrategy: missingLanguagesStrategySchema,
  skip: boolean,
})
