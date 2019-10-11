import merge from 'lodash/merge'
import { Maybe } from 'true-myth'
import { transformJSON, transformYAML } from './transformers'
import { DEFAULT_OPTIONS } from './constants'
import { Options } from './types'

export default (options?: Partial<Options>): Options =>
  Maybe.of(options)
    .map(value => merge({}, DEFAULT_OPTIONS, value))
    // Add default transformers if they weren't provided
    .map(value => {
      Maybe.of(
        value.transformers.find(t => t.type === 'application/json'),
      ).orElse(() => {
        value.transformers.push(transformJSON)
        return Maybe.nothing()
      })

      Maybe.of(value.transformers.find(t => t.type === 'text/yaml')).orElse(
        () => {
          value.transformers.push(transformYAML)
          return Maybe.nothing()
        },
      )

      return value
    })
    .unwrapOr(DEFAULT_OPTIONS)
