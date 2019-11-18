import { generatePagesRegistry } from '../pages-registry'
import { GatsbyStorePages } from '../../types'

jest.mock('fs-extra')

const pages: GatsbyStorePages = new Map([
  [
    '/non-multilingual-page',
    {
      path: '/non-multilingual-page',
      component: 'val',
      context: {},
    },
  ],
  [
    '/en/page-one',
    {
      path: '/en/page-one',
      component: 'val',
      context: { multilingualId: 'one', language: 'en' },
    },
  ],
  [
    '/ru/page-one',
    {
      path: '/ru/page-one',
      component: 'val',
      context: { multilingualId: 'one', language: 'ru' },
    },
  ],
])

describe('pages-registry', () => {
  describe('generatePagesRegistry', () => {
    it('should build pages registry from gatsby pages map', () => {
      expect(generatePagesRegistry(pages)).toStrictEqual({
        one: { en: '/en/page-one', ru: '/ru/page-one' },
      })
    })
  })
})
