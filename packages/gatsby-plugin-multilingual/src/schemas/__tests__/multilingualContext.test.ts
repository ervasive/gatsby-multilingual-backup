import { assert, property, anything } from 'fast-check'
import { isUndefined, isString, isArray } from 'lodash'
import s from '../multilingualContext'

describe('multilingualContextSchema', () => {
  it('should error out on invalid pageId inputs', () => {
    assert(
      property(
        anything().filter(v => !(isUndefined(v) || (isString(v) && v.length))),
        data => {
          expect(s.validate({ pageId: data }).error.details[0].message).toMatch(
            /("pageId" must be a string)|("pageId" is not allowed to be empty)/i,
          )
        },
      ),
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

  it('should not error out on valid values', () => {
    expect(
      s.validate({
        pageId: 'val',
        languages: ['en', { language: 'ru', path: 'val' }],
        missingLanguages: 'ignore',
      }).error,
    ).toBeUndefined()
  })
})
