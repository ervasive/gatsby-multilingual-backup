import Joi from '@hapi/joi'
import {
  modeSchema,
  strictChecksSchema,
  missingLanguagesSchema,
  multilingualOverrideSchema,
} from '.'

const { boolean, string, array, object, alternatives } = Joi.types()

export default object.keys({
  defaultLanguage: string,
  availableLanguages: array.items(string),
  defaultNamespace: string,
  mode: modeSchema,
  missingLanguages: missingLanguagesSchema,
  includeDefaultLanguageInURL: boolean,
  overrides: alternatives
    .try(Joi.function().arity(1), array.items(multilingualOverrideSchema))
    .messages({
      'alternatives.types':
        '"{{#label}}" may be one of [function, array of overrides]',
    }),
  strictChecks: strictChecksSchema,
  pathToRedirectTemplate: string,
})
