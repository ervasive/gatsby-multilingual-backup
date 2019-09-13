import createGetPagePath from '../create-get-page-path'

const pages = {
  '/page-one': {
    en: '/en/page-one-slug',
    ru: '/ru/путь-к-странице-один',
  },
}

describe(`createGetPagePath`, () => {
  const getPagePath = createGetPagePath(pages, 'en', false)

  it(`should throw a specialized error on invalid value`, () => {
    expect(() => getPagePath(null)).toThrow(
      /the "getPagePath" function returned an error/i,
    )
  })

  it(`should return path correctly`, () => {
    expect(getPagePath('/page-one')).toBe('/en/page-one-slug')
  })
})
