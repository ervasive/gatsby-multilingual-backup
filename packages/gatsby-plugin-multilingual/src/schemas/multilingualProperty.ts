import Joi from '@hapi/joi'
import languageSchema from './language'
import missingLanguagesSchema from './missingLanguages'

const { string, array, object } = Joi.types()

export default object.label('multilingual property').keys({
  pageId: string.required(),
  languages: array.items(string, languageSchema),
  missingLanguages: missingLanguagesSchema,
})
