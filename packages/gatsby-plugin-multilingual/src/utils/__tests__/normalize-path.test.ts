import normalizePath from '../normalize-path'

describe('normalizePath', (): void => {
  it('should return a normalized path', (): void => {
    expect(normalizePath('path')).toBe('/path')
    expect(normalizePath('/index')).toBe('/')
    expect(normalizePath('/index/')).toBe('/')
    expect(normalizePath('//index/')).toBe('/')
    expect(normalizePath('//index//')).toBe('/')
    expect(normalizePath('/index/subpath')).toBe('/index/subpath')
    expect(normalizePath('/index/subpath/')).toBe('/index/subpath/')
    expect(normalizePath('/index//subpath//')).toBe('/index/subpath/')
  })
})
