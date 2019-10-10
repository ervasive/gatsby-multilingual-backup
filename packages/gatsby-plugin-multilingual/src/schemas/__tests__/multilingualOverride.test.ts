import { assert, property, anything } from 'fast-check'
import { isUndefined, isBoolean, isString, isArray } from 'lodash'
import s from '../multilingualOverride'

describe('multilingualOverrideSchema', () => {
  it('should error out on invalid pageId inputs', () => {
    assert(
      property(anything().filter(v => !(isString(v) && v.length)), data => {
        expect(s.validate({ pageId: data }).error.details[0].message).toMatch(
          /("pageId" is required)|("pageId" must be a string)|("pageId" is not allowed to be empty)/i,
        )
      }),
    )
  })

  it('should error out on invalid languages inputs', () => {
    assert(
      property(
        anything().filter(v => !(isUndefined(v) || isArray(v))),
        data => {
          expect(
            s.validate({ pageId: 'val', languages: data }).error.details[0]
              .message,
          ).toMatch(/("languages" must be an array)/i)
        },
      ),
    )
  })

  it('should error out on invalid shouldBeProcessed inputs', () => {
    assert(
      property(
        anything().filter(v => !(isUndefined(v) || isBoolean(v))),
        data => {
          expect(
            s.validate({ pageId: 'val', shouldBeProcessed: data }).error
              .details[0].message,
          ).toMatch(/("shouldBeProcessed" must be a boolean)/i)
        },
      ),
    )
  })

  it('should not error out on valid values', () => {
    expect(
      s.validate({
        pageId: 'val',
        languages: ['en', { language: 'ru', path: 'val' }],
        missingLanguages: 'ignore',
        shouldBeProcessed: true,
      }).error,
    ).toBeUndefined()
  })
})
