import Joi from '@hapi/joi'
import { CheckType } from '../types'

const { string } = Joi.types()

export default string.valid(CheckType.Ignore, CheckType.Warn, CheckType.Error)
