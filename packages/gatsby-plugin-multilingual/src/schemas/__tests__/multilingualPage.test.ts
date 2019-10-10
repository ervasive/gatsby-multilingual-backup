import { assert, property, anything } from 'fast-check'
import { isUndefined, isBoolean, isString, isPlainObject } from 'lodash'
import s from '../multilingualPage'

describe('multilingualPageSchema', () => {
  it('should error out on invalid path inputs', () => {
    assert(
      property(anything().filter(v => !(isString(v) && v.length)), data => {
        expect(s.validate({ path: data }).error.details[0].message).toMatch(
          /("path" is required)|("path" must be a string)|("path" is not allowed to be empty)/i,
        )
      }),
    )
  })

  it('should error out on invalid context inputs', () => {
    assert(
      property(
        anything().filter(v => !(isUndefined(v) || isPlainObject(v))),
        data => {
          expect(
            s.validate({ path: 'val', context: data }).error.details[0].message,
          ).toMatch(
            /("context" is required)|("context" must be of type object)/i,
          )
        },
      ),
    )
  })

  it('should error out on invalid context.multilingual inputs', () => {
    // NOTE: we are not testing MultilingualProperty as context.multilingual
    // as this sub schema is tested separately
    assert(
      property(
        anything().filter(
          v => !(isUndefined(v) || isBoolean(v) || isPlainObject(v)),
        ),
        data => {
          expect(
            s.validate({ path: 'val', context: { multilingual: data } }).error
              .details[0].message,
          ).toMatch(
            /"context.multilingual" must be one of \[boolean, object\]/i,
          )
        },
      ),
    )
  })
})
