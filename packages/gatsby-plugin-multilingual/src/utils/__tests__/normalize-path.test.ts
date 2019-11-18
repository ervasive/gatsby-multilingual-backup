import { normalizePath } from '..'

describe('normalizePath', (): void => {
  it('should return a normalized path', (): void => {
    expect(normalizePath('/')).toBe('/')
    expect(normalizePath('///')).toBe('/')
    expect(normalizePath('//page/')).toBe('/page/')
    expect(normalizePath('//page//')).toBe('/page/')
  })
})
