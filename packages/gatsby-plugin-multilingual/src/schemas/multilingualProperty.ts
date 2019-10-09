import Joi from '@hapi/joi'
import { MissingLanguages } from '../types'

const { string, array, object } = Joi.types()

export default object
  .keys({
    pageId: string.required(),
    languages: array.items(
      string,
      object.keys({
        language: string.required(),
        path: string,
      }),
    ),
    missingLanguages: string.valid(
      MissingLanguages.Ignore,
      MissingLanguages.Generate,
      MissingLanguages.Redirect,
    ),
  })
  .required()
