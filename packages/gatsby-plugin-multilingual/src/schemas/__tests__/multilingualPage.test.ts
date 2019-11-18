import { assert, property, anything } from 'fast-check'
import { isString } from 'lodash'
import { multilingualPageSchema } from '..'

describe('multilingualPageSchema', () => {
  it('should error out on invalid context.multilingualId inputs', () => {
    assert(
      property(
        anything().filter(v => !(isString(v) && v.length)),
        data => {
          expect(
            multilingualPageSchema.validate({
              path: 'val',
              component: 'val',
              context: { multilingualId: data },
            }).error.details[0].message,
          ).toMatch(
            /("context.multilingualId" is required)|("context.multilingualId" must be a string)|("context.multilingualId" is not allowed to be empty)/i,
          )
        },
      ),
    )
  })

  it('should error out on invalid context.language inputs', () => {
    assert(
      property(
        anything().filter(v => !(isString(v) && v.length)),
        data => {
          expect(
            multilingualPageSchema.validate({
              path: 'val',
              component: 'val',
              context: { multilingualId: 'val', language: data },
            }).error.details[0].message,
          ).toMatch(
            /("context.language" is required)|("context.language" must be a string)|("context.language" is not allowed to be empty)/i,
          )
        },
      ),
    )
  })

  it('should not error out on valid page object', () => {
    expect(
      multilingualPageSchema.validate({
        path: 'val',
        component: 'val',
        context: { multilingualId: 'val', language: 'val' },
      }).error,
    ).toBeUndefined()
  })
})
