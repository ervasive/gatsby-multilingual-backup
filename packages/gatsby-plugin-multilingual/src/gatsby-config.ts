import { GatsbyConfig } from 'gatsby'
import optionsSchema from './schemas/options'
import { PLUGIN_NAME } from './constants'

module.exports = (options: unknown): GatsbyConfig | never => {
  // Validate plugin options
  const { error } = optionsSchema
    .required()
    .validate(options, { abortEarly: false })

  if (error) {
    const msg = `[${PLUGIN_NAME}] is misconfigured:\n${error.details
      .map(({ message }) => `- ${message}`)
      .join('\n')}`

    console.error(msg)
    process.exit(1)
  }

  return { plugins: [] }
}
