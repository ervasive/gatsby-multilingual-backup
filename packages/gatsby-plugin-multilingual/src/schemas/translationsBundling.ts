import Joi from '@hapi/joi'
import { TranslationsBundling } from '../types'

const { string } = Joi.types()

export default string.valid(
  TranslationsBundling.All,
  TranslationsBundling.PageLanguage,
  TranslationsBundling.None,
)
