import Joi from '@hapi/joi'
import multilingualContextSchema from './multilingualContext'

const { boolean, string } = Joi.types()

export default multilingualContextSchema.keys({
  pageId: string.required(),
  shouldBeProcessed: boolean,
})
