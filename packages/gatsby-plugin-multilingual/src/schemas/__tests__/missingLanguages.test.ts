import { assert, property, anything } from 'fast-check'
import { isUndefined } from 'lodash'
import s from '../missingLanguages'

describe('missingLanguagesSchema', () => {
  it('should error out on invalid values', () => {
    assert(
      property(
        anything().filter(
          v =>
            !(isUndefined(v) || ['ignore', 'generate', 'redirect'].includes(v)),
        ),
        data => {
          expect(s.validate(data).error.details[0].message).toMatch(
            /"missing languages" must be one of \[ignore, generate, redirect\]/i,
          )
        },
      ),
    )
  })

  it('should not error out on valid values', () => {
    expect(s.validate('ignore').error).toBeUndefined()
    expect(s.validate('generate').error).toBeUndefined()
    expect(s.validate('redirect').error).toBeUndefined()
  })
})
