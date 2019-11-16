import Joi from '@hapi/joi'

const { string, object } = Joi.types()

export const gatsbyPageSchema = object
  .keys({
    path: string.required(),
    component: string.required(),
    context: object.required(),
  })
  .options({
    allowUnknown: true,
  })
