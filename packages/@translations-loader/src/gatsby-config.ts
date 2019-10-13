import { GatsbyConfig } from 'gatsby'
import { PLUGIN_NAME, SOURCE_FILESYSTEM_INSTANCE_NAME } from './constants'
import optionsSchema from './schemas/options'
import getOptions from './get-options'
import { Options } from './types'

module.exports = (options: Options): GatsbyConfig => {
  // We are going to run options validation here, because we access
  // "getOptions" in this file.
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

  return {
    plugins: [
      {
        resolve: 'gatsby-source-filesystem',
        options: {
          name: SOURCE_FILESYSTEM_INSTANCE_NAME,
          path: getOptions(options).path,
        },
      },
    ],
  }
}
