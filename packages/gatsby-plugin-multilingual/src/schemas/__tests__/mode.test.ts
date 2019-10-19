import { assert, property, anything } from 'fast-check'
import { isUndefined } from 'lodash'
import s from '../mode'
import { Mode } from '../../types'

describe('modeSchema', () => {
  it('should error out on invalid values', () => {
    assert(
      property(
        anything().filter(
          v => !(isUndefined(v) || [Mode.Greedy, Mode.Lazy].includes(v)),
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
    expect(s.validate(Mode.Greedy).error).toBeUndefined()
    expect(s.validate(Mode.Lazy).error).toBeUndefined()
  })
})
