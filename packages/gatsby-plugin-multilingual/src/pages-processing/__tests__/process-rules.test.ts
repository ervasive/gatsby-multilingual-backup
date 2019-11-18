import { processRules } from '..'
import { getOptions } from '../../utils'

describe('processRules', () => {
  it('should not process skipped rules', () => {
    const result = processRules(
      new Map([
        [
          '/example',
          {
            path: '/example',
            component: 'val',
            context: {},
          },
        ],
      ]),
      getOptions({ rules: { one: { skip: true } } }),
    )

    expect(result.messages.length).toBe(0)
    expect(result.pagesToDelete.size).toBe(0)
    expect(result.pagesToCreate.size).toBe(0)
    expect(result.redirectsToCreate.size).toBe(0)
  })

  it('should replace existing multilingual pages with pages from rules', () => {
    const result = processRules(
      new Map([
        [
          '/custom-page',
          {
            path: '/custom-page',
            component: 'val',
            context: {},
          },
        ],
      ]),
      getOptions({ rules: { one: { languages: { en: '/custom-page' } } } }),
    )

    expect(result.messages.length).toBe(0)

    expect(result.pagesToDelete.size).toBe(1)
    const deletedPages = result.pagesToDelete.values()
    expect(deletedPages.next().value).toStrictEqual({
      path: '/custom-page',
      component: 'val',
      context: {},
    })

    expect(result.pagesToCreate.size).toBe(1)
    const createdPages = result.pagesToCreate.values()
    expect(createdPages.next().value).toStrictEqual({
      path: '/custom-page',
      component: 'val',
      context: { multilingualId: 'one', language: 'en' },
    })

    expect(result.redirectsToCreate.size).toBe(0)
  })

  it('should assign new slug value to pages specified in rules', () => {
    const result = processRules(
      new Map([
        [
          '/custom-page',
          {
            path: '/custom-page',
            component: 'val',
            context: {},
          },
        ],
      ]),
      getOptions({
        rules: {
          one: {
            languages: {
              en: { path: '/custom-page', slug: '/custom-page-new-slug' },
            },
          },
        },
      }),
    )

    expect(result.messages.length).toBe(0)

    expect(result.pagesToDelete.size).toBe(1)
    const deletedPages = result.pagesToDelete.values()
    expect(deletedPages.next().value).toStrictEqual({
      path: '/custom-page',
      component: 'val',
      context: {},
    })

    expect(result.pagesToCreate.size).toBe(1)
    const createdPages = result.pagesToCreate.values()
    expect(createdPages.next().value).toStrictEqual({
      path: '/custom-page-new-slug',
      component: 'val',
      context: { multilingualId: 'one', language: 'en' },
    })

    expect(result.redirectsToCreate.size).toBe(0)
  })

  it("should not process a rule's language with invalid value", () => {
    const result = processRules(
      new Map([
        [
          '/example',
          {
            path: '/example',
            component: 'val',
            context: {},
          },
        ],
      ]),
      getOptions({
        rules: { one: { languages: { en: '/example', es: '/example' } } },
      }),
    )

    expect(result.messages.length).toBe(1)
    expect(result.messages[0].type).toBe('error')
    expect(result.messages[0].message).toMatch(
      /"one" rule has an invalid language key: "es"/,
    )

    expect(result.pagesToDelete.size).toBe(1)
    const deletedPages = result.pagesToDelete.values()
    expect(deletedPages.next().value).toStrictEqual({
      path: '/example',
      component: 'val',
      context: {},
    })

    expect(result.pagesToCreate.size).toBe(1)
    const createdPages = result.pagesToCreate.values()
    expect(createdPages.next().value).toStrictEqual({
      path: '/example',
      component: 'val',
      context: { multilingualId: 'one', language: 'en' },
    })

    expect(result.redirectsToCreate.size).toBe(0)
  })

  it('should report on non-existent rule page', () => {
    const result = processRules(
      new Map(),
      getOptions({
        rules: { one: { languages: { en: '/example' } } },
      }),
    )

    expect(result.messages.length).toBe(1)
    expect(result.messages[0].type).toBe('error')
    expect(result.messages[0].message).toMatch(
      /"\/example" page specified in "rules\[one\]\[en\]" rule does not exist/,
    )

    expect(result.pagesToDelete.size).toBe(0)
    expect(result.pagesToCreate.size).toBe(0)
    expect(result.redirectsToCreate.size).toBe(0)
  })
})
