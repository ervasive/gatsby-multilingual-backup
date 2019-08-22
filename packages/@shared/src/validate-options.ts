import * as Joi from '@hapi/joi'

export default (
  pluginName: string,
  schema: Joi.ObjectSchema,
  options?: object,
): Error | void => {
  if (!options) return

  const { error } = Joi.validate(options, schema, {
    allowUnknown: true,
    abortEarly: false,
  })

  if (error) {
    throw new Error(
      `Errors in '${pluginName}' configuration.\n- ${error.details
        .map(({ message }): string => message)
        .join('\n- ')}`,
    )
  }
}
