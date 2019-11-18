import { assert, property, anything } from 'fast-check'
import { isString, isPlainObject } from 'lodash'
import { gatsbyPageSchema } from '..'

describe('gatsbyPageSchema', () => {
  it('should error out on invalid path inputs', () => {
    assert(
      property(
        anything().filter(v => !(isString(v) && v.length)),
        data => {
          expect(
            gatsbyPageSchema.validate({ path: data }).error.details[0].message,
          ).toMatch(
            /("path" is required)|("path" must be a string)|("path" is not allowed to be empty)/i,
          )
        },
      ),
    )
  })

  it('should error out on invalid component inputs', () => {
    assert(
      property(
        anything().filter(v => !(isString(v) && v.length)),
        data => {
          expect(
            gatsbyPageSchema.validate({ path: 'val', component: data }).error
              .details[0].message,
          ).toMatch(
            /("component" is required)|("component" must be a string)|("component" is not allowed to be empty)/i,
          )
        },
      ),
    )
  })

  it('should error out on invalid context inputs', () => {
    assert(
      property(
        anything().filter(v => !isPlainObject(v)),
        data => {
          expect(
            gatsbyPageSchema.validate({
              path: 'val',
              component: 'val',
              context: data,
            }).error.details[0].message,
          ).toMatch(
            /("context" is required)|("context" must be of type object)/i,
          )
        },
      ),
    )
  })

  it('should not error out on valid page object', () => {
    expect(
      gatsbyPageSchema.validate({
        path: 'val',
        component: 'val',
        context: {},
        customProp: true,
      }).error,
    ).toBeUndefined()
  })
})
