import { assert, property, anything } from 'fast-check'
import { isUndefined } from 'lodash'
import s from '../translationsBundling'
import { TranslationsBundling } from '../../types'

describe('translationsBundlingSchema', () => {
  it('should error out on invalid values', () => {
    assert(
      property(
        anything().filter(
          v =>
            !(
              isUndefined(v) ||
              [
                TranslationsBundling.All,
                TranslationsBundling.PageLanguage,
                TranslationsBundling.None,
              ].includes(v)
            ),
        ),
        data => {
          expect(s.validate(data).error.details[0].message).toMatch(
            /"value" must be one of \[all, page-language, none\]/i,
          )
        },
      ),
    )
  })

  it('should not error out on valid values', () => {
    expect(s.validate(TranslationsBundling.All).error).toBeUndefined()
    expect(s.validate(TranslationsBundling.PageLanguage).error).toBeUndefined()
    expect(s.validate(TranslationsBundling.None).error).toBeUndefined()
  })
})
