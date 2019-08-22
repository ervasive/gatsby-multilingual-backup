import * as Joi from '@hapi/joi'
import { findIndex } from 'lodash'
import { validateOptions as sharedValidateOptions } from '@gatsby-plugin-multilingual/shared'
import { PLUGIN_NAME } from './constants'
import { transformJSON, transformYAML } from './transformers'
import { Options, ValidatedOptions } from './types'

const schema = Joi.object().keys({
  path: Joi.string()
    .required()
    .error(
      (): string =>
        `The "path" value is required and it must be a string, pointing to a ` +
        `directory containing translations files. Note that the specified ` +
        `value must be unique (you can't register more than one plugin ` +
        `instance for the same directory path).`,
    ),
  priority: Joi.number().error(
    (): string =>
      `The "priority" value must be a number, specifying the addition order ` +
      `of the translations managed by this plugin instance, providing the ` +
      `mechanism to override the translations added by other plugin ` +
      `instances with the lower "priority" value.`,
  ),
  transformers: Joi.array()
    .items(
      Joi.object().keys({
        type: Joi.string().error(
          (): string =>
            `The "type" value of a transformer item must be a string ` +
            `representing the MIME type this transformer is able to convert ` +
            `to a JSON string.`,
        ),
        handler: Joi.func().error(
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
    ),
})

export const validateOptions = (options?: Options): Error | void =>
  sharedValidateOptions(PLUGIN_NAME, schema, options)

export const getOptions = (
  options: Options = { transformers: [], plugins: [] },
): ValidatedOptions => {
  const result: ValidatedOptions = {
    path: options.path,
    priority: options.priority || 0,
    transformers: options.transformers || [],
    plugins: [],
  }

  // Add default transformers if they weren't provided
  if (
    findIndex(options.transformers, {
      type: 'application/json',
    }) < 0
  ) {
    result.transformers.push(transformJSON)
  }

  if (
    findIndex(options.transformers, {
      type: 'text/yaml',
    }) < 0
  ) {
    result.transformers.push(transformYAML)
  }

  return result
}
