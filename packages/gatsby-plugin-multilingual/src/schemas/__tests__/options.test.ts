import { assert, property, anything } from 'fast-check'
import { isUndefined, isString, isArray, isFunction } from 'lodash'
import s from '../options'
import { isBoolean } from 'util'

describe('optionsSchema', () => {
  it('should error out on invalid defaultLanguage inputs', () => {
    assert(
      property(
        anything().filter(v => !(isUndefined(v) || (isString(v) && v.length))),
        data => {
          expect(
            s.validate({ defaultLanguage: data }).error.details[0].message,
          ).toMatch(
            /("defaultLanguage" must be a string)|("defaultLanguage" is not allowed to be empty)/i,
          )
        },
      ),
    )
  })

  it('should error out on invalid availableLanguages inputs', () => {
    assert(
      property(
        anything().filter(v => !(isUndefined(v) || isArray(v))),
        data => {
          expect(
            s.validate({ availableLanguages: data }).error.details[0].message,
          ).toMatch(/"availableLanguages" must be an array/i)
        },
      ),
    )

    assert(
      property(
        anything().filter(v => !(isUndefined(v) || isString(v))),
        data => {
          expect(
            s.validate({ availableLanguages: [data] }).error.details[0].message,
          ).toMatch(/"availableLanguages\[0\]" must be a string/i)
        },
      ),
    )
  })

  it('should error out on invalid defaultNamespace inputs', () => {
    assert(
      property(
        anything().filter(v => !(isUndefined(v) || (isString(v) && v.length))),
        data => {
          expect(
            s.validate({ defaultNamespace: data }).error.details[0].message,
          ).toMatch(
            /("defaultNamespace" must be a string)|("defaultNamespace" is not allowed to be empty)/i,
          )
        },
      ),
    )
  })

  // Skip "mode" property as it is validated separately
  // Skip "missingLanguages" property as it is validated separately

  it('should error out on invalid includeDefaultLanguageInURL inputs', () => {
    assert(
      property(
        anything().filter(v => !(isUndefined(v) || isBoolean(v))),
        data => {
          expect(
            s.validate({ includeDefaultLanguageInURL: data }).error.details[0]
              .message,
          ).toMatch(/"includeDefaultLanguageInURL" must be a boolean/i)
        },
      ),
    )
  })

  it('should error out on invalid overrides inputs', () => {
    assert(
      property(
        anything().filter(
          v => !(isUndefined(v) || isArray(v) || isFunction(v)),
        ),
        data => {
          expect(
            s.validate({ overrides: data }).error.details[0].message,
          ).toMatch(
            /"overrides" may be one of \[function, array of overrides\]/i,
          )
        },
      ),
    )
  })

  // Skip "strictChecks" property as it is validated separately

  it('should error out on invalid pathToRedirectTemplate inputs', () => {
    assert(
      property(
        anything().filter(v => !(isUndefined(v) || (isString(v) && v.length))),
        data => {
          expect(
            s.validate({ pathToRedirectTemplate: data }).error.details[0]
              .message,
          ).toMatch(
            /("pathToRedirectTemplate" must be a string)|("pathToRedirectTemplate" is not allowed to be empty)/i,
          )
        },
      ),
    )
  })
})
