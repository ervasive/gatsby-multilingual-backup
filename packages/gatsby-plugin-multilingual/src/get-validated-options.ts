import * as Joi from '@hapi/joi'
import { PLUGIN_NAME, DEFAULT_OPTIONS } from './constants'
import { Options } from './types'

// TODO: finish schema and tests after Joi is updated to v16.x
// .pattern(
//   Joi.string()
//     .uri({ relativeOnly: true })
//     .required(),
//   Joi.object()
//     .required()
//     .pattern(
//       Joi.string().required(),
//       Joi.string()
//         .required()
//         .error(errorMessages.customSlugs),
//     )
//     .error(errorMessages.customSlugs),
// )

export const configurationFormat = [
  `- defaultLanguage (string) - The primary language. Defaults to: ` +
    `${JSON.stringify(DEFAULT_OPTIONS.defaultLanguage)}`,
  `- availableLanguages (array of strings) - Supported languages. Defaults ` +
    `to: ${JSON.stringify(DEFAULT_OPTIONS.availableLanguages)}`,
  `- defaultNamespace (string) - The primary translations namespace. More ` +
    `info: https://www.i18next.com/principles/namespaces. Defaults to: ${JSON.stringify(
      DEFAULT_OPTIONS.defaultNamespace,
    )}`,
  `- mode (string "greedy" or "lazy") - The "greedy" mode transforms all ` +
    `existing pages by default (with the ability to exclude specific ones), ` +
    `the "lazy" mode ignores all existing pages by default (with the ability ` +
    `to transform specific ones). Defaults to: ${JSON.stringify(
      DEFAULT_OPTIONS.mode,
    )}`,
  `- missingLanguagePages (string "ignore", "generate" or "redirect") - How ` +
    `should the pages with missing language versions be handled. Defaults ` +
    `to: ${JSON.stringify(DEFAULT_OPTIONS.missingLanguagePages)}`,
  `- includeDefaultLanguageInURL (boolean) - Whether the language key should ` +
    `be included for the default language page version. Defaults to: ` +
    `${JSON.stringify(DEFAULT_OPTIONS.includeDefaultLanguageInURL)}`,
  `- pathOverrides (object) - Globally defined language-aware custom page ` +
    `paths. Defaults to: ${JSON.stringify(DEFAULT_OPTIONS.pathOverrides)}`,
  `- strictChecks (object) - `,
  `- pathToRedirectTemplate (string) - User defined redirect component path.`,
].join(`\n`)

const schema = Joi.object({
  defaultLanguage: Joi.string().default(DEFAULT_OPTIONS.defaultLanguage),
  availableLanguages: Joi.array()
    .items(Joi.string())
    .default(DEFAULT_OPTIONS.availableLanguages),
  defaultNamespace: Joi.string().default(DEFAULT_OPTIONS.defaultNamespace),
  mode: Joi.string()
    .valid('greedy', 'lazy')
    .default(DEFAULT_OPTIONS.mode),
  missingLanguagePages: Joi.string()
    .valid('ignore', 'generate', 'redirect')
    .default(DEFAULT_OPTIONS.missingLanguagePages),
  includeDefaultLanguageInURL: Joi.boolean().default(
    DEFAULT_OPTIONS.includeDefaultLanguageInURL,
  ),
  pathOverrides: Joi.object().default({}),
  strictChecks: Joi.object({
    paths: Joi.boolean().default(DEFAULT_OPTIONS.strictChecks.paths),
    pages: Joi.boolean().default(DEFAULT_OPTIONS.strictChecks.pages),
    translations: Joi.boolean().default(
      DEFAULT_OPTIONS.strictChecks.translations,
    ),
  }).default({ paths: false, pages: false, translations: false }),
  pathToRedirectTemplate: Joi.string(),
}).required()

export default (options: unknown = {}): Options => {
  const { error, value } = Joi.validate(options, schema, {
    allowUnknown: true,
    convert: false,
  })

  if (error) {
    throw new Error(`[${PLUGIN_NAME}] Invalid options provided.`)
  }

  const validatedOptions = value as Options

  // Add default language to available languages if it is not present there
  if (
    !validatedOptions.availableLanguages.includes(
      validatedOptions.defaultLanguage,
    )
  ) {
    validatedOptions.availableLanguages.push(validatedOptions.defaultLanguage)
  }

  // Make sure available languages are unique
  validatedOptions.availableLanguages = Array.from(
    new Set(validatedOptions.availableLanguages),
  )

  return validatedOptions
}
