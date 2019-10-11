import { GatsbyConfig } from 'gatsby'
import { SOURCE_FILESYSTEM_INSTANCE_NAME } from './constants'
import optionsSchema from './schemas/options'
import getOptions from './get-options'
import { Options } from './types'

module.exports = (options: Options): GatsbyConfig => {
  const { error } = optionsSchema.validate(options)

  // TODO: review error message
  if (error) {
    throw error
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
