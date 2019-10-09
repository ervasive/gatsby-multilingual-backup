import Joi from '@hapi/joi'
import {
  modeSchema,
  strictChecksSchema,
  missingLanguagesSchema,
  multilingualOverrideSchema,
} from '.'

const { boolean, string, array, object } = Joi.types()

export default object
  .keys({
    defaultLanguage: string,
    availableLanguages: array,
    defaultNamespace: string,
    mode: modeSchema,
    missingLanguages: missingLanguagesSchema,
    includeDefaultLanguageInURL: boolean,
    overrides: [
      Joi.function().arity(1),
      array.items(multilingualOverrideSchema),
    ],
    strictChecks: object.keys({
      paths: strictChecksSchema,
      pages: strictChecksSchema,
      translations: strictChecksSchema,
    }),
    pathToRedirectTemplate: string,
  })
  .required()
