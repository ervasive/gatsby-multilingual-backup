import { GatsbyConfig } from 'gatsby'
import validatedOptions from './get-validated-options'

module.exports = (options: unknown): GatsbyConfig => {
  validatedOptions(options)
  return { plugins: [] }
}
