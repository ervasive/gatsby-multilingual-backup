import { assert, property, anything } from 'fast-check'
import { isUndefined } from 'lodash'
import s from '../checks'
import { CheckType } from '../../types'

describe('checksSchema', () => {
  it('should error out on invalid values', () => {
    assert(
      property(
        anything().filter(
          v =>
            !(
              isUndefined(v) ||
              [CheckType.Ignore, CheckType.Warn, CheckType.Error].includes(v)
            ),
        ),
        data => {
          expect(s.validate(data).error.details[0].message).toMatch(
            /"value" must be one of \[ignore, warn, error\]/i,
          )
        },
      ),
    )
  })

  it('should not error out on valid values', () => {
    expect(s.validate(CheckType.Ignore).error).toBeUndefined()
    expect(s.validate(CheckType.Warn).error).toBeUndefined()
    expect(s.validate(CheckType.Error).error).toBeUndefined()
  })
})
