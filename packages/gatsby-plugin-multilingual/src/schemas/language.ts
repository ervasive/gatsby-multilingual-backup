import Joi from '@hapi/joi'

const { string, object } = Joi.types()

export default object.keys({
  language: string.required(),
  path: string,
})
