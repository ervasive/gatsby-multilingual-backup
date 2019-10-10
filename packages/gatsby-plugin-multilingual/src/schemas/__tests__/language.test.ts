import { assert, property, anything } from 'fast-check'
import { isString, isUndefined } from 'lodash'
import s from '../language'

describe('languageSchema', () => {
  it('should error out on invalid language values', () => {
    assert(
      property(anything().filter(v => !(isString(v) && v.length)), data => {
        expect(s.validate({ language: data }).error.details[0].message).toMatch(
          /("language" is required)|("language" must be a string)|("language" is not allowed to be empty)/i,
        )
      }),
    )
  })

  it('should error out on invalid path values', () => {
    assert(
      property(
        anything().filter(v => !(isUndefined(v) || (isString(v) && v.length))),
        data => {
          expect(
            s.validate({ language: 'value', path: data }).error.details[0]
              .message,
          ).toMatch(
            /("path" is required)|("path" must be a string)|("path" is not allowed to be empty)/i,
          )
        },
      ),
    )
  })

  it('should not error out on valid values', () => {
    expect(s.validate({ language: 'value' }).error).toBeUndefined()
    expect(s.validate({ language: 'val', path: 'val' }).error).toBeUndefined()
  })
})
