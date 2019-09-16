import { GatsbyConfig } from 'gatsby'
import { PluginOptions } from './types'
import validateOptions from './validate-options'

module.exports = (options: PluginOptions): GatsbyConfig => {
  validateOptions(options)
  return { plugins: [] }
}
