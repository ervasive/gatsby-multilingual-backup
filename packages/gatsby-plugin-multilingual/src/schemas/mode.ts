import Joi from '@hapi/joi'
import { Mode } from '../types'

const { string } = Joi.types()

export default string.label('mode').valid(Mode.Greedy, Mode.Lazy)
