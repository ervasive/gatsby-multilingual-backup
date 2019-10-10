import Joi from '@hapi/joi'
import multilingualPropertySchema from './multilingualProperty'

const { boolean } = Joi.types()

export default multilingualPropertySchema.label('multilingual override').keys({
  shouldBeProcessed: boolean,
})
