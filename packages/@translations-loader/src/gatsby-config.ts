import { GatsbyConfig } from 'gatsby'
import { SOURCE_FILESYSTEM_INSTANCE_NAME } from './constants'
import { getOptions, validateOptions } from './options'
import { Options } from './types'

module.exports = (options: Options): GatsbyConfig => {
  validateOptions(options)

  const opts = getOptions(options)

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
