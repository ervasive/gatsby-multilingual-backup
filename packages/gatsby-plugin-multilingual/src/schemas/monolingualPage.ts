import Joi from '@hapi/joi'

const { string, object } = Joi.types()

export default object
  .label('monolingual page')
  .keys({
    path: string.required(),
    context: object
      .keys({
        pageId: string.required(),
        language: string.required(),
      })
      .required(),
  })
  .options({
    allowUnknown: true,
  })
