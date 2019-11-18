import { processPage } from '..'
import { getOptions } from '../../utils'

describe('processPage', () => {
  it('should skip a non-multilingual page', () => {
    const result = processPage(
      { path: '/non-multilingual-page', component: 'val', context: {} },
      new Map(),
      getOptions(),
    )

    expect(result.messages.length).toBe(0)
    expect(result.pagesToDelete.size).toBe(0)
    expect(result.pagesToCreate.size).toBe(0)
    expect(result.redirectsToCreate.size).toBe(0)
  })

  it('should report on a page with invalid "multilingualId', () => {
    const result = processPage(
      {
        path: '/invalid-page',
        component: 'val',
        context: { multilingualId: 5 },
      },
      new Map(),
      getOptions(),
    )

    expect(result.messages.length).toBe(1)
    expect(result.messages[0].type).toBe('error')
    expect(result.messages[0].message).toMatch(
      /"\/invalid-page" page failed validation/i,
    )

    expect(result.pagesToDelete.size).toBe(1)
    expect(result.pagesToDelete.values().next().value.path).toBe(
      '/invalid-page',
    )

    expect(result.pagesToCreate.size).toBe(0)
    expect(result.redirectsToCreate.size).toBe(0)
  })

  it('should report on invalid page with empty "multilingualId', () => {
    const result = processPage(
      {
        path: '/invalid-page',
        component: 'val',
        context: { multilingualId: '' },
      },
      new Map(),
      getOptions(),
    )

    expect(result.messages.length).toBe(1)
    expect(result.messages[0].type).toBe('error')
    expect(result.messages[0].message).toMatch(
      /"\/invalid-page" page failed validation/i,
    )

    expect(result.pagesToDelete.size).toBe(1)
    expect(result.pagesToDelete.values().next().value.path).toBe(
      '/invalid-page',
    )

    expect(result.pagesToCreate.size).toBe(0)
    expect(result.redirectsToCreate.size).toBe(0)
  })

  it('should report on invalid page with invalid "language', () => {
    const result = processPage(
      {
        path: '/invalid-page',
        component: 'val',
        context: { language: 5 },
      },
      new Map(),
      getOptions(),
    )

    expect(result.messages.length).toBe(1)
    expect(result.messages[0].type).toBe('error')
    expect(result.messages[0].message).toMatch(
      /"\/invalid-page" page failed validation/i,
    )

    expect(result.pagesToDelete.size).toBe(1)
    expect(result.pagesToDelete.values().next().value.path).toBe(
      '/invalid-page',
    )

    expect(result.pagesToCreate.size).toBe(0)
    expect(result.redirectsToCreate.size).toBe(0)
  })

  it('should report on invalid page with empty "language', () => {
    const result = processPage(
      {
        path: '/invalid-page',
        component: 'val',
        context: { language: '' },
      },
      new Map(),
      getOptions(),
    )

    expect(result.messages.length).toBe(1)
    expect(result.messages[0].type).toBe('error')
    expect(result.messages[0].message).toMatch(
      /"\/invalid-page" page failed validation/i,
    )

    expect(result.pagesToDelete.size).toBe(1)
    expect(result.pagesToDelete.values().next().value.path).toBe(
      '/invalid-page',
    )

    expect(result.pagesToCreate.size).toBe(0)
    expect(result.redirectsToCreate.size).toBe(0)
  })

  it('should not remove invalid multilingual page if "removeInvalidPages=false"', () => {
    const result = processPage(
      {
        path: '/invalid-page',
        component: 'val',
        context: { language: '' },
      },
      new Map(),
      getOptions({ removeInvalidPages: false }),
    )

    expect(result.messages.length).toBe(1)
    expect(result.messages[0].type).toBe('error')
    expect(result.messages[0].message).toMatch(
      /"\/invalid-page" page failed validation/i,
    )

    expect(result.pagesToDelete.size).toBe(0)
    expect(result.pagesToCreate.size).toBe(0)
    expect(result.redirectsToCreate.size).toBe(0)
  })

  it('should skip page processing when there is a corresponding rule', () => {
    const result = processPage(
      {
        path: '/valid-page',
        component: 'val',
        context: { multilingualId: 'valid-page', language: 'en' },
      },
      new Map(),
      getOptions({
        rules: { 'valid-page': { languages: { en: '/valid-page-from-rule' } } },
      }),
    )

    expect(result.messages.length).toBe(1)
    expect(result.messages[0].type).toBe('info')
    expect(result.messages[0].message).toMatch(
      /"\/valid-page" page was deleted due to an existing "rules\[valid-page\]\[en\]" rule/i,
    )

    expect(result.pagesToDelete.size).toBe(1)
    expect(result.pagesToDelete.values().next().value.path).toBe('/valid-page')

    expect(result.pagesToCreate.size).toBe(0)
    expect(result.redirectsToCreate.size).toBe(0)
  })

  it('should report about invalid page language and skip processing', () => {
    const result1 = processPage(
      {
        path: '/valid-page',
        component: 'val',
        context: { multilingualId: 'valid-page', language: 'es' },
      },
      new Map(),
      getOptions(),
    )

    expect(result1.messages.length).toBe(1)
    expect(result1.messages[0].type).toBe('error')
    expect(result1.messages[0].message).toMatch(
      /"\/valid-page" page has invalid language/i,
    )

    expect(result1.pagesToDelete.size).toBe(1)
    expect(result1.pagesToDelete.values().next().value.path).toBe('/valid-page')

    expect(result1.pagesToCreate.size).toBe(0)
    expect(result1.redirectsToCreate.size).toBe(0)

    const result2 = processPage(
      {
        path: '/valid-page',
        component: 'val',
        context: { multilingualId: 'valid-page', language: 'es' },
      },
      new Map(),
      getOptions({ removeInvalidPages: false }),
    )

    expect(result2.messages.length).toBe(1)
    expect(result2.messages[0].type).toBe('error')
    expect(result2.messages[0].message).toMatch(
      /"\/valid-page" page has invalid language/i,
    )

    expect(result2.pagesToDelete.size).toBe(0)
    expect(result1.pagesToCreate.size).toBe(0)
    expect(result1.redirectsToCreate.size).toBe(0)
  })

  it(
    'should replace existing pages with a new one (respecting ' +
      '"includeDefaultLanguageInURL" option for the same multilingualId & ' +
      'language values',
    () => {
      const result = processPage(
        {
          path: '/valid-page-new',
          component: 'val',
          context: { multilingualId: 'valid-page', language: 'en' },
        },
        new Map([
          [
            '/valid-page-one',
            {
              path: '/valid-page-one',
              component: 'val',
              context: { multilingualId: 'valid-page', language: 'en' },
            },
          ],
          [
            '/valid-page-two',
            {
              path: '/valid-page-two',
              component: 'val',
              context: { multilingualId: 'valid-page', language: 'en' },
            },
          ],
        ]),
        getOptions({ includeDefaultLanguageInURL: true }),
      )

      expect(result.messages.length).toBe(2)
      expect(result.messages[0].type).toBe('info')
      expect(result.messages[0].message).toMatch(
        /"\/valid-page-one" page was overriden by "\/en\/valid-page-new" page/i,
      )
      expect(result.messages[1].type).toBe('info')
      expect(result.messages[1].message).toMatch(
        /"\/valid-page-two" page was overriden by "\/en\/valid-page-new" page/i,
      )

      const deletedPages = result.pagesToDelete.values()
      expect(result.pagesToDelete.size).toBe(3)
      expect(deletedPages.next().value.path).toBe('/valid-page-one')
      expect(deletedPages.next().value.path).toBe('/valid-page-two')
      expect(deletedPages.next().value.path).toBe('/valid-page-new')

      const createdPages = result.pagesToCreate.values()
      expect(result.pagesToCreate.size).toBe(1)
      expect(createdPages.next().value.path).toBe('/en/valid-page-new')

      expect(result.redirectsToCreate.size).toBe(0)
    },
  )
})
