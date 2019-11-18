import { getOptions } from '../../utils'
import { processGroups } from '..'
import { GatsbyStorePages } from '../../types'

describe('processGroups', () => {
  it('should ignore additional (missing) languages on "missingLanguagesStrategy=ignore"', () => {
    const pages: GatsbyStorePages = new Map([
      [
        '/regular-page',
        { path: '/regular-page', component: 'val', context: {} },
      ],
      [
        '/one',
        {
          path: '/one',
          component: 'val',
          context: { multilingualId: 'one', language: 'en' },
        },
      ],
      [
        '/ru/one',
        {
          path: '/ru/one',
          component: 'val',
          context: { multilingualId: 'one', language: 'ru' },
        },
      ],
    ])

    const result1 = processGroups(
      pages,
      getOptions({
        availableLanguages: ['en', 'ru', 'de'],
        missingLanguagesStrategy: 'ignore',
      }),
    )

    expect(result1.messages.length).toBe(0)
    expect(result1.pagesToDelete.size).toBe(0)
    expect(result1.pagesToCreate.size).toBe(0)
    expect(result1.redirectsToCreate.size).toBe(0)

    const result2 = processGroups(
      pages,
      getOptions({
        availableLanguages: ['en', 'ru', 'de'],
        missingLanguagesStrategy: 'generate',
        rules: { one: { missingLanguagesStrategy: 'ignore' } },
      }),
    )

    expect(result2.messages.length).toBe(0)
    expect(result2.pagesToDelete.size).toBe(0)
    expect(result2.pagesToCreate.size).toBe(0)
    expect(result2.redirectsToCreate.size).toBe(0)
  })

  it('should return an error message if a multilingual groups does not have a default language page version', () => {
    const pages: GatsbyStorePages = new Map([
      [
        '/ru/one',
        {
          path: '/ru/one',
          component: 'val',
          context: { multilingualId: 'one', language: 'ru' },
        },
      ],
    ])

    const result = processGroups(
      pages,
      getOptions({
        availableLanguages: ['en', 'ru', 'de'],
        missingLanguagesStrategy: 'generate',
      }),
    )

    expect(result.messages.length).toBe(1)
    expect(result.messages[0].type).toBe('panic')
    expect(result.messages[0].message).toMatch(/unable to generate.*"one"/i)
    expect(result.pagesToDelete.size).toBe(0)
    expect(result.pagesToCreate.size).toBe(0)
    expect(result.redirectsToCreate.size).toBe(0)
  })

  it('should produce missing language versions as multilingual pages', () => {
    const pages: GatsbyStorePages = new Map([
      [
        '/one',
        {
          path: '/one',
          component: 'val',
          context: { multilingualId: 'one', language: 'en' },
        },
      ],
    ])

    const result = processGroups(
      pages,
      getOptions({
        availableLanguages: ['en', 'ru', 'de'],
        missingLanguagesStrategy: 'generate',
      }),
    )

    const createdPages = result.pagesToCreate.values()

    expect(result.messages.length).toBe(0)
    expect(result.pagesToDelete.size).toBe(0)
    expect(result.pagesToCreate.size).toBe(2)
    expect(createdPages.next().value).toStrictEqual({
      path: '/ru/one',
      component: 'val',
      context: { multilingualId: 'one', language: 'ru' },
    })
    expect(createdPages.next().value).toStrictEqual({
      path: '/de/one',
      component: 'val',
      context: { multilingualId: 'one', language: 'de' },
    })
    expect(result.redirectsToCreate.size).toBe(0)
  })

  it('should produce missing language versions as gatsby redirects', () => {
    const pages: GatsbyStorePages = new Map([
      [
        '/one',
        {
          path: '/one',
          component: 'val',
          context: { multilingualId: 'one', language: 'en' },
        },
      ],
    ])

    const result = processGroups(
      pages,
      getOptions({
        availableLanguages: ['en', 'ru', 'de'],
        missingLanguagesStrategy: 'redirect',
      }),
    )

    const createdRedirects = result.redirectsToCreate.values()

    expect(result.messages.length).toBe(0)
    expect(result.pagesToDelete.size).toBe(0)
    expect(result.pagesToCreate.size).toBe(0)
    expect(result.redirectsToCreate.size).toBe(2)
    expect(createdRedirects.next().value).toStrictEqual({
      fromPath: '/ru/one',
      toPath: '/one',
      isPermanent: true,
      redirectInBrowser: true,
    })
    expect(createdRedirects.next().value).toStrictEqual({
      fromPath: '/de/one',
      toPath: '/one',
      isPermanent: true,
      redirectInBrowser: true,
    })
  })
})
