import Joi from '@hapi/joi'
import multilingualContextSchema from './multilingualContext'

const { boolean, string, object } = Joi.types()

export default object
  .keys({
    path: string.required(),
    context: object.keys({
      multilingual: [boolean, multilingualContextSchema],
    }),
  })
  .options({
    allowUnknown: true,
  })
