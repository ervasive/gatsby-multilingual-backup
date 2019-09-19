import * as Joi from '@hapi/joi'
import { PLUGIN_NAME, DEFAULT_OPTIONS } from './constants'
import { Options } from './types'

const errorMessages = {
  defaultLanguage: (): string =>
    [
      `The "defaultLanguage" value must be a string representing the main ` +
        `language of your project.`,
      `Default value: "${JSON.stringify(DEFAULT_OPTIONS.defaultLanguage)}"`,
    ].join('\n'),
  availableLanguages: (): string =>
    [
      `The "availableLanguages" value must be an array of strings ` +
        `representing all the languages your project supports.`,
      `Default value: ${JSON.stringify(DEFAULT_OPTIONS.availableLanguages)}`,
    ].join('\n'),
  defaultNamespace: (): string =>
    [
      `The "defaultNamespace" value must be a string representing the main ` +
        `translations namespace of your project.`,
      `More info: https://www.i18next.com/principles/namespaces`,
      `Default value: "${JSON.stringify(DEFAULT_OPTIONS.defaultNamespace)}"`,
    ].join('\n'),
  customSlugs: (): string =>
    [
      `The "customSlugs" value must be an object representing globally defined ` +
        `custom page slugs of the following shape:`,
      `{ "/page-generic-path": { en: "/en/slugified-page-path", ru: "/ru/путь-к-странице" } }`,
      `Default value: "${JSON.stringify(DEFAULT_OPTIONS.customSlugs)}"`,
    ].join('\n'),
  includeDefaultLanguageInURL: (): string =>
    [
      `The "includeDefaultLanguageInURL" value must be a boolean which ` +
        `controls whether the language key will be included in URL for pages ` +
        `of the default language.`,
      `Default value: ${JSON.stringify(
        DEFAULT_OPTIONS.includeDefaultLanguageInURL,
      )}`,
    ].join('\n'),
  strictPathChecks: (): string =>
    [
      `The "strictPathChecks" value must be a boolean which defines how page ` +
        `path related helpers (getPath, getLanguages) react on non-existent ` +
        `page path values. If the flag is set to "true" any of the specified ` +
        `helpers will throw an error or ignore it otherwise.`,
      `Default value: ${JSON.stringify(DEFAULT_OPTIONS.strictPathChecks)}`,
    ].join('\n'),
  removeInvalidPages: (): string =>
    [
      `The "removeInvalidPages" value must be a boolean which defines if ` +
        `invalid "multilingual" pages should be removed.`,
      `Default value: ${JSON.stringify(DEFAULT_OPTIONS.removeInvalidPages)}`,
    ].join('\n'),
  removeSkippedPages: (): string =>
    [
      `The "removeSkippedPages" value must be a boolean which defines if ` +
        `explicitly skipped "multilingual" pages should be removed.`,
      `Default value: ${JSON.stringify(DEFAULT_OPTIONS.removeSkippedPages)}`,
    ].join('\n'),
}

const schema = Joi.object({
  defaultLanguage: Joi.string()
    .error(errorMessages.defaultLanguage)
    .default(DEFAULT_OPTIONS.defaultLanguage),
  availableLanguages: Joi.array()
    .items(Joi.string().error(errorMessages.availableLanguages))
    .error(errorMessages.availableLanguages)
    .default(DEFAULT_OPTIONS.availableLanguages),
  defaultNamespace: Joi.string()
    .error(errorMessages.defaultNamespace)
    .default(DEFAULT_OPTIONS.defaultNamespace),
  customSlugs: Joi.object()
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
    .error(errorMessages.customSlugs)
    .default({}),
  includeDefaultLanguageInURL: Joi.boolean()
    .error(errorMessages.includeDefaultLanguageInURL)
    .default(DEFAULT_OPTIONS.includeDefaultLanguageInURL),
  strictPathChecks: Joi.boolean()
    .error(errorMessages.strictPathChecks)
    .default(DEFAULT_OPTIONS.strictPathChecks),
  removeInvalidPages: Joi.boolean()
    .error(errorMessages.removeInvalidPages)
    .default(DEFAULT_OPTIONS.removeInvalidPages),
  removeSkippedPages: Joi.boolean()
    .error(errorMessages.removeSkippedPages)
    .default(DEFAULT_OPTIONS.removeSkippedPages),
})
  .required()
  .error((): string => `Invalid plugin options type, must be an object`)

export default (options: unknown = {}): Options => {
  const { error, value } = Joi.validate(options, schema, {
    allowUnknown: true,
    abortEarly: false,
    convert: false,
  })

  if (error) {
    throw new Error(
      `Errors in '${PLUGIN_NAME}' configuration.\n- ${error.details
        .map(({ message }): string => message)
        .join('\n- ')}`,
    )
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
