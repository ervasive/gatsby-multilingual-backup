import { GatsbyConfig } from 'gatsby'
import { PluginOptions } from './types'
import validateOptions from './validate-options'
import getOptions from './get-options'

module.exports = (options: PluginOptions): GatsbyConfig => {
  validateOptions(options)

  const {
    defaultTranslationsLoader: { disable, path, priority },
  } = getOptions(options)

  const config: GatsbyConfig = {
    plugins: [],
  }

  if (!disable) {
    ;(config.plugins || []).push({
      resolve: '@gatsby-plugin-multilingual/translations-loader',
      options: {
        path,
        priority,
      },
    })
  }

  return config
}
