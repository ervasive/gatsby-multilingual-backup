import merge from 'lodash/merge'
import uniq from 'lodash/uniq'
import { Maybe } from 'true-myth'
import { DEFAULT_OPTIONS } from './constants'
import { Options } from './types'

export default (options?: Partial<Options>): Options =>
  Maybe.of(options)
    .map(value => merge({}, DEFAULT_OPTIONS, value))
    .map(value => ({
      ...value,
      availableLanguages: uniq([
        ...value.availableLanguages,
        value.defaultLanguage,
      ]),
    }))
    .unwrapOr(DEFAULT_OPTIONS)
