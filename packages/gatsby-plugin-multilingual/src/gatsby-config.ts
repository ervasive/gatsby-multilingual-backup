import { GatsbyConfig } from 'gatsby'
import optionsSchema from './schemas/options'

module.exports = (options: unknown): GatsbyConfig | never => {
  const { error } = optionsSchema.validate(options)

  // TODO: review error message
  if (error) {
    throw error
  }

  return { plugins: [] }
}
