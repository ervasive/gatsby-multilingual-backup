import Joi from '@hapi/joi'

const { string, object } = Joi.types()

export default object.label('language').keys({
  language: string.required(),
  path: string,
})
