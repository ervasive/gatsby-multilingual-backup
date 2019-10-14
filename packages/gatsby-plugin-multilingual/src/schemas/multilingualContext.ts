import Joi from '@hapi/joi'
import languageSchema from './language'
import missingLanguagesSchema from './missingLanguages'

const { string, array, object } = Joi.types()

export default object.keys({
  pageId: string,
  languages: array.items(string, languageSchema),
  missingLanguages: missingLanguagesSchema,
})
