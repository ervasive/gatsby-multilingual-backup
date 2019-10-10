import Joi from '@hapi/joi'
import multilingualPropertySchema from './multilingualProperty'

const { boolean, string, object } = Joi.types()

export default object
  .label('multilingual page')
  .keys({
    path: string.required(),
    context: object.keys({
      multilingual: [boolean, multilingualPropertySchema],
    }),
  })
  .options({
    allowUnknown: true,
  })
