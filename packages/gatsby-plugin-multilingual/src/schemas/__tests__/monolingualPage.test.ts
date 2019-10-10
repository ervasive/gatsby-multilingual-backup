import { assert, property, anything } from 'fast-check'
import { isString, isPlainObject } from 'lodash'
import s from '../monolingualPage'

describe('monolingualPageSchema', () => {
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
      property(anything().filter(v => !isPlainObject(v)), data => {
        expect(
          s.validate({ path: 'val', context: data }).error.details[0].message,
        ).toMatch(/("context" is required)|("context" must be of type object)/i)
      }),
    )
  })

  it('should error out on invalid context.pageId inputs', () => {
    assert(
      property(anything().filter(v => !(isString(v) && v.length)), data => {
        expect(
          s.validate({ path: 'val', context: { pageId: data } }).error
            .details[0].message,
        ).toMatch(
          /("context.pageId" is required)|("context.pageId" must be a string)|("context.pageId" is not allowed to be empty)/i,
        )
      }),
    )
  })

  it('should error out on invalid context.language inputs', () => {
    assert(
      property(anything().filter(v => !(isString(v) && v.length)), data => {
        expect(
          s.validate({
            path: 'val',
            context: { pageId: 'val', language: data },
          }).error.details[0].message,
        ).toMatch(
          /("context.language" is required)|("context.language" must be a string)|("context.language" is not allowed to be empty)/i,
        )
      }),
    )
  })

  it('should not error out on valid input', () => {
    expect(
      s.validate({
        path: 'value',
        context: { pageId: 'id', language: 'language-vale' },
      }).error,
    ).toBe(undefined)
  })
})
