import { assert, property, anything } from 'fast-check'
import { isUndefined } from 'lodash'
import { missingLanguagesStrategySchema } from '..'
import { MissingLanguagesStrategy } from '../../types'

describe('missingLanguagesSchema', () => {
  it('should error out on invalid values', () => {
    assert(
      property(
        anything().filter(
          v =>
            !(
              isUndefined(v) ||
              [
                MissingLanguagesStrategy.Ignore,
                MissingLanguagesStrategy.Generate,
                MissingLanguagesStrategy.Redirect,
              ].includes(v)
            ),
        ),
        data => {
          expect(
            missingLanguagesStrategySchema.validate(data).error.details[0]
              .message,
          ).toMatch(/value" must be one of \[ignore, generate, redirect\]/i)
        },
      ),
    )
  })

  it('should not error out on valid values', () => {
    expect(
      missingLanguagesStrategySchema.validate(MissingLanguagesStrategy.Ignore)
        .error,
    ).toBeUndefined()

    expect(
      missingLanguagesStrategySchema.validate(MissingLanguagesStrategy.Generate)
        .error,
    ).toBeUndefined()

    expect(
      missingLanguagesStrategySchema.validate(MissingLanguagesStrategy.Redirect)
        .error,
    ).toBeUndefined()
  })
})
