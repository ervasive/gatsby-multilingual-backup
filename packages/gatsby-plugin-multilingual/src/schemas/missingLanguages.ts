import Joi from '@hapi/joi'
import { MissingLanguages } from '../types'

const { string } = Joi.types()

export default string.valid(
  MissingLanguages.Ignore,
  MissingLanguages.Generate,
  MissingLanguages.Redirect,
)
