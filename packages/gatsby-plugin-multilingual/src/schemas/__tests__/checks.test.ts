import { assert, property, anything } from 'fast-check'
import { isUndefined } from 'lodash'
import { checksSchema } from '..'
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
          expect(checksSchema.validate(data).error.details[0].message).toMatch(
            /"value" must be one of \[ignore, warn, error\]/i,
          )
        },
      ),
    )
  })

  it('should not error out on valid values', () => {
    expect(checksSchema.validate(CheckType.Ignore).error).toBeUndefined()
    expect(checksSchema.validate(CheckType.Warn).error).toBeUndefined()
    expect(checksSchema.validate(CheckType.Error).error).toBeUndefined()
  })
})
