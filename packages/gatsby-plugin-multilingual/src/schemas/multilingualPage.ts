import Joi from '@hapi/joi'
import { gatsbyPageSchema } from '.'

const { string, object } = Joi.types()

export const multilingualPageSchema = gatsbyPageSchema.keys({
  context: object
    .keys({
      multilingualId: string.required(),
      language: string.required(),
    })
    .required(),
})
