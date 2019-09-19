import { GatsbyConfig } from 'gatsby'
import { SOURCE_FILESYSTEM_INSTANCE_NAME } from './constants'
import getValidatedOptions from './get-validated-options'
import { Options } from './types'

module.exports = (options: Options): GatsbyConfig => {
  const opts = getValidatedOptions(options)

  return {
    plugins: [
      {
        resolve: 'gatsby-source-filesystem',
        options: {
          name: SOURCE_FILESYSTEM_INSTANCE_NAME,
          path: opts.path,
        },
      },
    ],
  }
}
