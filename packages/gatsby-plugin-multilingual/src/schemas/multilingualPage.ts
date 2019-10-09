import Joi from '@hapi/joi'
import languageSchema from './language'
import missingLanguagesSchema from './missingLanguages'

const { boolean, string, array, object } = Joi.types()

export default object
  .label('MultilingualPage')
  .keys({
    path: string.required(),
    context: object.keys({
      multilingual: [
        boolean,
        object.keys({
          pageId: string.required(),
          languages: array.items(string, languageSchema),
          missingLanguages: missingLanguagesSchema,
        }),
      ],
    }),
  })
  .required()
  .options({
    allowUnknown: true,
  })
