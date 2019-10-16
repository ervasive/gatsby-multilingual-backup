import Joi from '@hapi/joi'
import modeSchema from './mode'
import checksSchema from './checks'
import missingLanguagesSchema from './missingLanguages'
import multilingualOverrideSchema from './multilingualOverride'

const { boolean, string, array, object, alternatives } = Joi.types()

export default object.keys({
  defaultLanguage: string,
  availableLanguages: array.items(string),
  defaultNamespace: string,
  includeDefaultLanguageInURL: boolean,
  mode: modeSchema,
  missingLanguages: missingLanguagesSchema,
  overrides: alternatives
    .try(Joi.function(), array.items(multilingualOverrideSchema))
    .messages({
      'alternatives.types':
        '"{{#label}}" may be one of [function, array of overrides]',
    }),
  checks: object.keys({
    missingLinkPaths: checksSchema,
    missingLanguageVersions: checksSchema,
    missingTranslationStrings: checksSchema,
  }),
  pathToRedirectTemplate: string,
  plugins: array,
})
