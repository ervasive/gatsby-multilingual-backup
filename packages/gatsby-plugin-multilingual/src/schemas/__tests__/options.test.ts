import optionsSchema from '../options'

describe('optionsSchema', () => {
  it('should', () => {
    const result = optionsSchema.validate(undefined)

    expect(result).toBe(true)
  })
})
