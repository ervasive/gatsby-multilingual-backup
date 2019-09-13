import { navigate as gatsbyNavigate } from 'gatsby-link'
import createNavigate from '../create-navigate'

jest.mock('gatsby-link', () => ({
  navigate: jest.fn(),
}))

const pages = {
  '/page-one': {
    en: '/en/page-one-slug',
    ru: '/ru/путь-к-странице-один',
  },
}

afterEach(() => {
  jest.clearAllMocks()
})

describe(`createNavigate`, () => {
  const navigate = createNavigate(pages, 'en', false)

  it(`should throw a specialized error on invalid value`, () => {
    expect(() => navigate(null)).toThrow(
      /the "navigate" function returned an error/i,
    )
  })

  it(`should call gatsby navigate with a correct path`, () => {
    navigate('/page-one')
    expect((gatsbyNavigate as any).mock.calls.length).toBe(1)
    expect((gatsbyNavigate as any).mock.calls[0][0]).toBe('/en/page-one-slug')
  })
})
