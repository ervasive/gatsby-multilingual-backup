import Joi from '@hapi/joi'
import { checksSchema, missingLanguagesStrategySchema } from '.'
import ruleSchema from './rule'

const { boolean, string, array, object } = Joi.types()

export const optionsSchema = object.keys({
  defaultLanguage: string,
  availableLanguages: array.items(string),
  defaultNamespace: string,
  includeDefaultLanguageInURL: boolean,
  missingLanguagesStrategy: missingLanguagesStrategySchema,
  removeInvalidPages: boolean,
  rules: object.pattern(string, ruleSchema),
  checks: object.keys({
    missingLinkPaths: checksSchema,
    missingLanguageVersions: checksSchema,
    missingTranslationStrings: checksSchema,
  }),
  plugins: array,
})
