import s from '../multilingualPage'

describe('multilingualPageSchema', () => {
  it('should error out on undefined input', () => {
    expect(s.validate(undefined).error.details[0].message).toMatch(
      /"MonolingualPage" is required/i,
    )
  })
})
