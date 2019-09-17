import * as Joi from '@hapi/joi'
import { transformJSON, transformYAML } from './transformers'
import { PLUGIN_NAME, DEFAULT_OPTIONS } from './constants'
import { Options } from './types'

const schema = Joi.object({
  path: Joi.string()
    .required()
    .error(
      (): string =>
        `The "path" value is required and it must be a string, pointing to a ` +
        `directory containing translations files. Note that the specified ` +
        `value must be unique (you can't register more than one plugin ` +
        `instance for the same directory path).`,
    ),
  priority: Joi.number()
    .integer()
    .error(
      (): string =>
        `The "priority" value must be an integer number, specifying the ` +
        `addition order of the translations managed by this plugin instance, ` +
        `providing the mechanism to override the translations added by other ` +
        `plugin instances with the lower "priority" value.`,
    )
    .default(DEFAULT_OPTIONS.priority),
  transformers: Joi.array()
    .items(
      Joi.object({
        type: Joi.string()
          .required()
          .error(
            (): string =>
              `The "type" value of a transformer item must be a string ` +
              `representing the MIME type this transformer is able to convert ` +
              `to a JSON string.`,
          ),
        handler: Joi.func()
          .required()
          .error(
            (): string =>
              `The "handler" value of a transformer item must be a function ` +
              `that takes a string of arbitrary content and tries to convert ` +
              `it to a valid, parsable JSON string, or throw an error.`,
          ),
      }),
    )
    .error(
      (): string =>
        `The "transformers" value must be an array of objects with the ` +
        `following shape:
          {
            type: string,
            handler: (string) => string | Error
          }`,
    )
    .default(DEFAULT_OPTIONS.transformers),
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

  // Add default transformers if they weren't provided
  if (
    !validatedOptions.transformers.filter(
      transformer => transformer.type === 'application/json',
    ).length
  ) {
    validatedOptions.transformers.push(transformJSON)
  }

  if (
    !validatedOptions.transformers.filter(
      transformer => transformer.type === 'text/yaml',
    ).length
  ) {
    validatedOptions.transformers.push(transformYAML)
  }

  return validatedOptions
}
