import Joi from '@hapi/joi'
import { MissingLanguagesStrategy } from '../types'

const { string } = Joi.types()

export const missingLanguagesStrategySchema = string.valid(
  MissingLanguagesStrategy.Ignore,
  MissingLanguagesStrategy.Generate,
  MissingLanguagesStrategy.Redirect,
)
