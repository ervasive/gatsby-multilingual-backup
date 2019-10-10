import Joi from '@hapi/joi'
import { MissingLanguages } from '../types'

const { string } = Joi.types()

export default string
  .label('missing languages')
  .valid(
    MissingLanguages.Ignore,
    MissingLanguages.Generate,
    MissingLanguages.Redirect,
  )
