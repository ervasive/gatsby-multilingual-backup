import Joi from '@hapi/joi'
import multilingualPropertySchema from './multilingualProperty'

const { boolean } = Joi.types()

export default multilingualPropertySchema.keys({
  shouldBeProcessed: boolean,
})
