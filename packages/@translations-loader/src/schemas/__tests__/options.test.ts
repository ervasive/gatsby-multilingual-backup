import { assert, property, anything } from 'fast-check'
import { isUndefined, isInteger, isString, isArray, isFunction } from 'lodash'
import s from '../options'

describe('optionsSchema', () => {
  it('should error out on invalid path inputs', () => {
    assert(
      property(anything().filter(v => !(isString(v) && v.length)), data => {
        expect(s.validate({ path: data }).error.details[0].message).toMatch(
          /("path" is required)|("path" must be a string)|("path" is not allowed to be empty)/i,
        )
      }),
    )
  })

  it('should error out on invalid priority inputs', () => {
    assert(
      property(
        anything().filter(v => !(isUndefined(v) || isInteger(parseInt(v)))),
        data => {
          expect(
            s.validate({ path: 'val', priority: data }).error.details[0]
              .message,
          ).toMatch(
            /("priority" must be a number)|("priority" must be an integer)|("priority" cannot be infinity)/i,
          )
        },
      ),
    )
  })

  it('should error out on invalid transformers inputs', () => {
    assert(
      property(
        anything().filter(v => !(isUndefined(v) || isArray(v))),
        data => {
          expect(
            s.validate({ path: 'val', transformers: data }).error.details[0]
              .message,
          ).toMatch(/"transformers" must be an array/i)
        },
      ),
    )
  })

  it('should error out on invalid transformers[item].type inputs', () => {
    assert(
      property(anything().filter(v => !(isString(v) && v.length)), data => {
        expect(
          s.validate({
            path: 'val',
            transformers: [{ type: data, handler: (): void => {} }],
          }).error.details[0].message,
        ).toMatch(
          /("transformers\[0\]\.type" is required)|("transformers\[0\]\.type" must be a string)|("transformers\[0\]\.type" is not allowed to be empty)/i,
        )
      }),
    )
  })

  it('should error out on invalid transformers[item].handler inputs', () => {
    assert(
      property(anything().filter(v => !isFunction(v)), data => {
        expect(
          s.validate({
            path: 'val',
            transformers: [{ type: 'val', handler: data }],
          }).error.details[0].message,
        ).toMatch(
          /("transformers\[0\]\.handler" is required)|("transformers\[0\]\.handler" must be of type function)/i,
        )
      }),
    )
  })
})
