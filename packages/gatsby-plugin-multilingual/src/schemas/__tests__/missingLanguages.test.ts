import { assert, property, anything } from 'fast-check'
import { isUndefined } from 'lodash'
import s from '../missingLanguages'
import { MissingLanguages } from '../../types'

describe('missingLanguagesSchema', () => {
  it('should error out on invalid values', () => {
    assert(
      property(
        anything().filter(
          v =>
            !(
              isUndefined(v) ||
              [
                MissingLanguages.Ignore,
                MissingLanguages.Generate,
                MissingLanguages.Redirect,
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
    expect(s.validate(MissingLanguages.Ignore).error).toBeUndefined()
    expect(s.validate(MissingLanguages.Generate).error).toBeUndefined()
    expect(s.validate(MissingLanguages.Redirect).error).toBeUndefined()
  })
})
