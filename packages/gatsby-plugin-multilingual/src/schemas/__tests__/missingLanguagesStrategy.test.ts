import { assert, property, anything } from 'fast-check'
import { isUndefined } from 'lodash'
import s from '../missingLanguagesStrategy'
import { MissingLanguagesStrategy } from '../../types'

describe('missingLanguagesSchema', () => {
  it('should error out on invalid values', () => {
    assert(
      property(
        anything().filter(
          v =>
            !(
              isUndefined(v) ||
              [
                MissingLanguagesStrategy.Ignore,
                MissingLanguagesStrategy.Generate,
                MissingLanguagesStrategy.Redirect,
              ].includes(v)
            ),
        ),
        data => {
          expect(s.validate(data).error.details[0].message).toMatch(
            /value" must be one of \[ignore, generate, redirect\]/i,
          )
        },
      ),
    )
  })

  it('should not error out on valid values', () => {
    expect(s.validate(MissingLanguagesStrategy.Ignore).error).toBeUndefined()
    expect(s.validate(MissingLanguagesStrategy.Generate).error).toBeUndefined()
    expect(s.validate(MissingLanguagesStrategy.Redirect).error).toBeUndefined()
  })
})
