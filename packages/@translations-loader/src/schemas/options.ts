import Joi from '@hapi/joi'

const { number, string, array, object } = Joi.types()

export default object.label('options').keys({
  path: string.required(),
  priority: number.integer(),
  transformers: array.items(
    object.keys({
      type: string.required(),
      handler: Joi.function().required(),
    }),
  ),
})
