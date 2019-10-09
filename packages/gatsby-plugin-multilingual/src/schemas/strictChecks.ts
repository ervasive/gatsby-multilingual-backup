import Joi from '@hapi/joi'
import { StrictCheckType } from '../types'

const { string } = Joi.types()

export default string.valid(
  StrictCheckType.Ignore,
  StrictCheckType.Warn,
  StrictCheckType.Error,
)
