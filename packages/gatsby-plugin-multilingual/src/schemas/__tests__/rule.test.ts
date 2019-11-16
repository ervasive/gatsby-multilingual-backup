import { assert, property, anything } from 'fast-check'
import { isUndefined, isBoolean, isString, isPlainObject } from 'lodash'
import s from '../rule'

describe('ruleSchema', () => {
  it('should error out on invalid languages inputs', () => {
    assert(
      property(
        anything().filter(
          v =>
            !(isUndefined(v) || (isString(v) && v.length) || isPlainObject(v)),
        ),
        data => {
          expect(
            s.validate({ languages: data }).error.details[0].message,
          ).toMatch(
            /("languages" must be of type object)|("languages.path" must be one of \[string, object\])/i,
          )
        },
      ),
    )
  })

  it('should error out on invalid languages[language] inputs', () => {
    assert(
      property(
        anything().filter(
          v => !((isString(v) && v.length) || isPlainObject(v)),
        ),
        data => {
          expect(
            s.validate({ languages: { en: data } }).error.details[0].message,
          ).toMatch(
            /("languages\.(.*)" must be one of \[string, object\])|("languages\.(.*)" is not allowed to be empty)|("languages\.(.*)" is required)/i,
          )
        },
      ),
    )
  })

  it('should error out on invalid languages[language].path inputs', () => {
    assert(
      property(
        anything().filter(v => !(isString(v) && v.length)),
        data => {
          expect(
            s.validate({ languages: { en: { path: data } } }).error.details[0]
              .message,
          ).toMatch(
            /("languages\.(.*)\.path" must be a string)|("languages\.(.*)\.path" is required)|("languages\.(.*)\.path" is not allowed to be empty)/i,
          )
        },
      ),
    )
  })

  it('should error out on invalid languages[language].slug inputs', () => {
    assert(
      property(
        anything().filter(v => !(isString(v) && v.length)),
        data => {
          expect(
            s.validate({ languages: { en: { path: 'val', slug: data } } }).error
              .details[0].message,
          ).toMatch(
            /("languages\.(.*)\.slug" must be a string)|("languages\.(.*)\.slug" is required)|("languages\.(.*)\.slug" is not allowed to be empty)/i,
          )
        },
      ),
    )
  })

  // NOTE: The "missingLanguagesStrategy" property is tested separately

  it('should error out on invalid skip inputs', () => {
    assert(
      property(
        anything().filter(v => !(isUndefined(v) || isBoolean(v))),
        data => {
          expect(s.validate({ skip: data }).error.details[0].message).toMatch(
            /"skip" must be a boolean/i,
          )
        },
      ),
    )
  })
})
