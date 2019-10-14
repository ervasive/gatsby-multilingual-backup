import { assert, property, anything } from 'fast-check'
import { isUndefined } from 'lodash'
import s from '../mode'

describe('modeSchema', () => {
  it('should error out on invalid values', () => {
    assert(
      property(
        anything().filter(
          v => !(isUndefined(v) || ['greedy', 'lazy'].includes(v)),
        ),
        data => {
          expect(s.validate(data).error.details[0].message).toMatch(
            /"value" must be one of \[greedy, lazy\]/i,
          )
        },
      ),
    )
  })

  it('should not error out on valid values', () => {
    expect(s.validate('greedy').error).toBeUndefined()
    expect(s.validate('lazy').error).toBeUndefined()
  })
})
