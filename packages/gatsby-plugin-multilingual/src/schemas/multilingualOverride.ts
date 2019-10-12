import Joi from '@hapi/joi'
import multilingualContextSchema from './multilingualContext'

const { boolean, string } = Joi.types()

export default multilingualContextSchema.label('multilingual override').keys({
  pageId: string.required(),
  shouldBeProcessed: boolean,
})
