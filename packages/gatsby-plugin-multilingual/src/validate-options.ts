import * as Joi from '@hapi/joi'
import { validateOptions } from '@gatsby-plugin-multilingual/shared'
import getOptions from './get-options'
import { PLUGIN_NAME } from './constants'
import { PluginOptions } from './types'

const defaults = getOptions()

const messages = {
  defaultLanguage: (): string =>
    [
      `The "defaultLanguage" value must be a string representing the main ` +
        `language of your project.`,
      `Example: "en"`,
      `Default value: "${defaults.defaultLanguage}"`,
    ].join(`\n  `),

  allowedLanguages: (): string =>
    [
      `The "allowedLanguages" value must be an array of strings ` +
        `representing all the languages your project supports.`,
      `Example: ["en", "ru"]`,
      `Default value: ${JSON.stringify(defaults.availableLanguages)} + the ` +
        `value of "defaultLanguage" if not included.`,
    ].join(`\n  `),

  defaultNamespace: (): string =>
    [
      `The "defaultNamespace" value must be a string representing the main ` +
        `translations namespace of your project.`,
      `More info: https://www.i18next.com/principles/namespaces`,
      `Example: "common"`,
      `Default value: "${defaults.defaultNamespace}"`,
    ].join('\n  '),

  includeDefaultLanguageInURL: (): string =>
    [
      `The "includeDefaultLanguageInURL" value must be a boolean which ` +
        `controls whether the language key will be included in URL for pages ` +
        `of the selected default language.`,
      `Example: true`,
      `Default value: ${defaults.includeDefaultLanguageInURL}`,
    ].join('\n  '),
}

const schema = Joi.object().keys({
  defaultLanguage: Joi.string().error(messages.defaultLanguage),
  allowedLanguages: Joi.array()
    .items(Joi.string().error(messages.allowedLanguages))
    .error(messages.allowedLanguages),
  defaultNamespace: Joi.string().error(messages.defaultNamespace),
  includeDefaultLanguageInURL: Joi.boolean().error(
    messages.includeDefaultLanguageInURL,
  ),
})

export default (options?: PluginOptions): void | Error =>
  validateOptions(PLUGIN_NAME, schema, options)
