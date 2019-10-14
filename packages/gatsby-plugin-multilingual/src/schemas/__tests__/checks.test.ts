import { assert, property, anything } from 'fast-check'
import { isUndefined } from 'lodash'
import s from '../checks'

describe('checksSchema', () => {
  it('should error out on invalid values', () => {
    assert(
      property(
        anything().filter(
          v => !(isUndefined(v) || ['ignore', 'warn', 'error'].includes(v)),
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
    expect(s.validate('ignore').error).toBeUndefined()
    expect(s.validate('warn').error).toBeUndefined()
    expect(s.validate('error').error).toBeUndefined()
  })
})
