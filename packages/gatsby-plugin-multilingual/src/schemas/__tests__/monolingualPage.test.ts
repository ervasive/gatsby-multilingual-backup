import s from '../monolingualPage'

describe('monolingualPageSchema', () => {
  it('should error out on undefined input', () => {
    expect(s.validate(undefined).error.details[0].message).toMatch(
      /"MonolingualPage" is required/i,
    )
  })

  it('should error out on invalid path inputs', () => {
    expect(s.validate({ path: undefined }).error.details[0].message).toMatch(
      /"path" is required/i,
    )

    expect(s.validate({ path: [] }).error.details[0].message).toMatch(
      /"path" must be a string/i,
    )

    expect(s.validate({ path: '' }).error.details[0].message).toMatch(
      /"path" is not allowed to be empty/i,
    )
  })

  it('should error out on invalid context inputs', () => {
    expect(
      s.validate({ path: 'value', context: undefined }).error.details[0]
        .message,
    ).toMatch(/"context" is required/i)

    expect(
      s.validate({ path: 'value', context: [] }).error.details[0].message,
    ).toMatch(/"context" must be of type object/i)
  })

  it('should error out on invalid context.pageId inputs', () => {
    expect(
      s.validate({ path: 'value', context: { pageId: undefined } }).error
        .details[0].message,
    ).toMatch(/"context.pageId" is required/i)

    expect(
      s.validate({ path: 'value', context: { pageId: [] } }).error.details[0]
        .message,
    ).toMatch(/"context.pageId" must be a string/i)
  })

  it('should error out on invalid context.language inputs', () => {
    expect(
      s.validate({
        path: 'value',
        context: { pageId: 'id', language: undefined },
      }).error.details[0].message,
    ).toMatch(/"context.language" is required/i)

    expect(
      s.validate({ path: 'value', context: { pageId: 'id', language: [] } })
        .error.details[0].message,
    ).toMatch(/"context.language" must be a string/i)
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
