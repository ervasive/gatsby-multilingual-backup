import { GatsbyPage } from '@gatsby-plugin-multilingual/shared'
import generatePages from '../generate-pages'
import getOptions from '../get-options'
import { REDIRECT_TEMPLATE_FILE } from '../constants'
import { MissingLanguages, Mode } from '../types'

describe('generatePages', () => {
  describe('with "missingLanguages" strategy set to "ignore"', () => {
    const options = getOptions({
      defaultLanguage: 'en',
      availableLanguages: ['en', 'ru'],
      includeDefaultLanguageInURL: false,
      mode: Mode.Greedy,
      missingLanguages: MissingLanguages.Ignore,
      overrides: [],
    })

    it(`should produce only the default language version for a regular page`, () => {
      const page: GatsbyPage = {
        path: '/page',
        component: '',
        context: {},
      }

      const pages = new Map<string, GatsbyPage>()

      const expected = {
        pages: [
          {
            path: '/page',
            component: '',
            context: { pageId: '/page', language: 'en' },
          },
        ],
        redirects: [],
        errors: [],
        removeOriginalPage: true,
      }

      expect(generatePages(page, pages, options)).toStrictEqual(expected)
    })

    it(
      `should produce a language version page for a source multilingual page ` +
        `with a single language`,
      () => {
        const page: GatsbyPage = {
          path: '/page',
          component: '',
          context: {
            multilingual: { pageId: '/page', languages: ['en'] },
          },
        }

        const pages = new Map<string, GatsbyPage>()

        const expected = {
          pages: [
            {
              path: '/page',
              component: '',
              context: { pageId: '/page', language: 'en' },
            },
          ],
          redirects: [],
          errors: [],
          removeOriginalPage: true,
        }

        expect(generatePages(page, pages, options)).toStrictEqual(expected)
      },
    )

    it(
      `should produce a language version page for a source multilingual page ` +
        `even if the language with the same pageId and language is already ` +
        `exists in the store`,
      () => {
        const page: GatsbyPage = {
          path: '/page',
          component: '',
          context: {
            multilingual: {
              pageId: '/page',
              languages: [{ language: 'en', path: '/custom-path' }],
            },
          },
        }

        const pages = new Map<string, GatsbyPage>()

        pages.set('/page', {
          path: '/page',
          component: '',
          context: { pageId: '/page', language: 'en' },
        })

        const expected = {
          pages: [
            {
              path: '/custom-path',
              component: '',
              context: { pageId: '/page', language: 'en' },
            },
          ],
          redirects: [],
          errors: [],
          removeOriginalPage: true,
        }

        expect(generatePages(page, pages, options)).toStrictEqual(expected)
      },
    )

    it(
      `should produce all specified language versions for a multilingual ` +
        `page with multiple languages`,
      () => {
        const page: GatsbyPage = {
          path: '/page',
          component: '',
          context: {
            multilingual: { pageId: '/page', languages: ['en', 'ru'] },
          },
        }

        const pages = new Map<string, GatsbyPage>()

        const expected = {
          pages: [
            {
              path: '/page',
              component: '',
              context: { pageId: '/page', language: 'en' },
            },
            {
              path: '/ru/page',
              component: '',
              context: { pageId: '/page', language: 'ru' },
            },
          ],
          redirects: [],
          errors: [],
          removeOriginalPage: true,
        }

        expect(generatePages(page, pages, options)).toStrictEqual(expected)
      },
    )
  })

  describe('with "missingLanguages" strategy set to "generate"', () => {
    const options = getOptions({
      defaultLanguage: 'en',
      availableLanguages: ['en', 'ru'],
      includeDefaultLanguageInURL: false,
      mode: Mode.Greedy,
      missingLanguages: MissingLanguages.Generate,
      overrides: [],
    })

    it(`should produce pages for all available languages from a regular source page`, () => {
      const page: GatsbyPage = {
        path: '/page',
        component: '',
        context: {},
      }

      const pages = new Map<string, GatsbyPage>()

      const expected = {
        pages: [
          {
            path: '/page',
            component: '',
            context: { pageId: '/page', language: 'en' },
          },
          {
            path: '/ru/page',
            component: '',
            context: { pageId: '/page', language: 'ru' },
          },
        ],
        redirects: [],
        errors: [],
        removeOriginalPage: true,
      }

      expect(generatePages(page, pages, options)).toStrictEqual(expected)
    })

    it(
      `should produce pages for all available languages from a multilingual ` +
        `source page with a single (default) language`,
      () => {
        const page: GatsbyPage = {
          path: '/page',
          component: '',
          context: { multilingual: { pageId: '/page', languages: ['en'] } },
        }

        const pages = new Map<string, GatsbyPage>()

        const expected = {
          pages: [
            {
              path: '/page',
              component: '',
              context: { pageId: '/page', language: 'en' },
            },
            {
              path: '/ru/page',
              component: '',
              context: { pageId: '/page', language: 'ru' },
            },
          ],
          redirects: [],
          errors: [],
          removeOriginalPage: true,
        }

        expect(generatePages(page, pages, options)).toStrictEqual(expected)
      },
    )

    it(
      `should produce a single page for the provided language of a ` +
        `multilingual source page with a single (not default) language`,
      () => {
        const page: GatsbyPage = {
          path: '/page',
          component: '',
          context: { multilingual: { pageId: '/page', languages: ['ru'] } },
        }

        const pages = new Map<string, GatsbyPage>()

        const expected = {
          pages: [
            {
              path: '/ru/page',
              component: '',
              context: { pageId: '/page', language: 'ru' },
            },
          ],
          redirects: [],
          errors: [],
          removeOriginalPage: true,
        }

        expect(generatePages(page, pages, options)).toStrictEqual(expected)
      },
    )

    it(
      `should produce only explicitly set language version pages omitting ` +
        `implicitly generated ones if the matching pages are present in the store`,
      () => {
        const page: GatsbyPage = {
          path: '/page',
          component: '',
          context: {
            multilingual: {
              pageId: '/page',
              languages: [{ language: 'en', path: '/custom-path' }],
            },
          },
        }

        const pages = new Map<string, GatsbyPage>()
        pages.set('/page', {
          path: '/page',
          component: '',
          context: { pageId: '/page', language: 'en' },
        })
        pages.set('/ru/page', {
          path: '/ru/page',
          component: '',
          context: { pageId: '/page', language: 'ru' },
        })

        const expected = {
          pages: [
            {
              path: '/custom-path',
              component: '',
              context: { pageId: '/page', language: 'en' },
            },
          ],
          redirects: [],
          errors: [],
          removeOriginalPage: true,
        }

        expect(generatePages(page, pages, options)).toStrictEqual(expected)
      },
    )
  })

  describe('with "missingLanguages" strategy set to "redirect"', () => {
    const options = getOptions({
      defaultLanguage: 'en',
      availableLanguages: ['en', 'ru'],
      includeDefaultLanguageInURL: false,
      mode: Mode.Greedy,
      missingLanguages: MissingLanguages.Redirect,
      overrides: [],
    })

    it(
      `should produce pages and redirects for all available languages from a ` +
        `regular source page`,
      () => {
        const page: GatsbyPage = {
          path: '/page',
          component: '',
          context: {},
        }

        const pages = new Map<string, GatsbyPage>()

        const expected = {
          pages: [
            {
              path: '/page',
              component: '',
              context: { pageId: '/page', language: 'en' },
            },
            {
              path: '/ru/page',
              component: REDIRECT_TEMPLATE_FILE,
              context: { redirectTo: '/page' },
            },
          ],
          redirects: [
            { fromPath: '/ru/page', isPermanent: true, toPath: '/page' },
          ],
          errors: [],
          removeOriginalPage: true,
        }

        expect(generatePages(page, pages, options)).toMatchObject(expected)
      },
    )

    it(
      `should produce pages and redirects for all available languages from a ` +
        `multilingual source page with a single (default) language`,
      () => {
        const page: GatsbyPage = {
          path: '/page',
          component: '',
          context: { multilingual: { pageId: '/page', languages: ['en'] } },
        }

        const pages = new Map<string, GatsbyPage>()

        const expected = {
          pages: [
            {
              path: '/page',
              component: '',
              context: { pageId: '/page', language: 'en' },
            },
            {
              path: '/ru/page',
              component: REDIRECT_TEMPLATE_FILE,
              context: { redirectTo: '/page' },
            },
          ],
          redirects: [
            { fromPath: '/ru/page', isPermanent: true, toPath: '/page' },
          ],
          errors: [],
          removeOriginalPage: true,
        }

        expect(generatePages(page, pages, options)).toStrictEqual(expected)
      },
    )

    // TODO: review description
    it(
      `should produce redirects for a single page of the provided language of a ` +
        `multilingual source page with a single (not default) language`,
      () => {
        const page: GatsbyPage = {
          path: '/page',
          component: '',
          context: { multilingual: { pageId: '/page', languages: ['ru'] } },
        }

        const pages = new Map<string, GatsbyPage>()

        const expected = {
          pages: [
            {
              path: '/ru/page',
              component: REDIRECT_TEMPLATE_FILE,
              context: { redirectTo: '/page' },
            },
          ],
          redirects: [
            { fromPath: '/ru/page', isPermanent: true, toPath: '/page' },
          ],
          errors: [],
          removeOriginalPage: true,
        }

        expect(generatePages(page, pages, options)).toStrictEqual(expected)
      },
    )

    it(
      `should produce only explicitly set language version pages omitting ` +
        `implicitly generated ones if the matching pages are present in the store`,
      () => {
        const page: GatsbyPage = {
          path: '/page',
          component: '',
          context: {
            multilingual: {
              pageId: '/page',
              languages: [{ language: 'en', path: '/custom-path' }],
            },
          },
        }

        const pages = new Map<string, GatsbyPage>()
        pages.set('/page', {
          path: '/page',
          component: '',
          context: { pageId: '/page', language: 'en' },
        })
        pages.set('/ru/page', {
          path: '/ru/page',
          component: '',
          context: { pageId: '/page', language: 'ru' },
        })

        const expected = {
          pages: [
            {
              path: '/custom-path',
              component: '',
              context: { pageId: '/page', language: 'en' },
            },
          ],
          redirects: [],
          errors: [],
          removeOriginalPage: true,
        }

        expect(generatePages(page, pages, options)).toStrictEqual(expected)
      },
    )
  })

  it(`should warn if we end up with no valid languages`, () => {
    const options = getOptions({
      defaultLanguage: 'en',
      availableLanguages: ['en', 'ru'],
      includeDefaultLanguageInURL: false,
      mode: Mode.Greedy,
      missingLanguages: MissingLanguages.Ignore,
      overrides: [],
    })

    const page: GatsbyPage = {
      path: '/page',
      component: '',
      context: {
        multilingual: { pageId: '/page', languages: ['es', 'de'] },
      },
    }

    const pages = new Map<string, GatsbyPage>()

    const result = generatePages(page, pages, options)

    expect(result.pages.length).toBe(0)
    expect(result.redirects.length).toBe(0)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0]).toMatch(/does not have any valid/i)
    expect(result.removeOriginalPage).toBe(false)
  })

  it(`should apply an override over page context`, () => {
    const options = getOptions({
      defaultLanguage: 'en',
      availableLanguages: ['en', 'ru'],
      includeDefaultLanguageInURL: false,
      mode: Mode.Greedy,
      missingLanguages: MissingLanguages.Ignore,
      overrides: [
        {
          pageId: '/page',
          languages: [{ language: 'en', path: '/custom-override-path' }],
        },
      ],
    })

    const page: GatsbyPage = {
      path: '/page',
      component: '',
      context: {
        multilingual: {
          languages: [{ language: 'en', path: '/custom-context-path' }],
        },
      },
    }

    const pages = new Map<string, GatsbyPage>()

    const expected = {
      pages: [
        {
          path: '/custom-override-path',
          component: '',
          context: { pageId: '/page', language: 'en' },
        },
      ],
      redirects: [],
      errors: [],
      removeOriginalPage: true,
    }

    expect(generatePages(page, pages, options)).toStrictEqual(expected)
  })

  it(`should return no pages if the page is marked to be skipped`, () => {
    const options = getOptions({
      defaultLanguage: 'en',
      availableLanguages: ['en', 'ru'],
      includeDefaultLanguageInURL: false,
      mode: Mode.Greedy,
      missingLanguages: MissingLanguages.Ignore,
      overrides: [],
    })

    const page: GatsbyPage = {
      path: '/page',
      component: '',
      context: {
        multilingual: false,
      },
    }

    const pages = new Map<string, GatsbyPage>()

    const expected = {
      pages: [],
      redirects: [],
      errors: [],
      removeOriginalPage: false,
    }

    expect(generatePages(page, pages, options)).toStrictEqual(expected)
  })

  it(`should override missing languages strategy from a page configuration`, () => {
    const options = getOptions({
      defaultLanguage: 'en',
      availableLanguages: ['en', 'ru'],
      includeDefaultLanguageInURL: false,
      mode: Mode.Greedy,
      missingLanguages: MissingLanguages.Generate,
      overrides: [],
    })

    const page: GatsbyPage = {
      path: '/page',
      component: '',
      context: {
        multilingual: { missingLanguages: MissingLanguages.Ignore },
      },
    }

    const pages = new Map<string, GatsbyPage>()

    const expected = {
      pages: [
        {
          path: '/page',
          component: '',
          context: { pageId: '/page', language: 'en' },
        },
      ],
      redirects: [],
      errors: [],
      removeOriginalPage: true,
    }

    expect(generatePages(page, pages, options)).toStrictEqual(expected)
  })

  it(`should prepend a language key on includeDefaultLanguageInURL=true`, () => {
    const options = getOptions({
      defaultLanguage: 'en',
      availableLanguages: ['en', 'ru'],
      includeDefaultLanguageInURL: true,
      mode: Mode.Greedy,
      missingLanguages: MissingLanguages.Ignore,
      overrides: [],
    })

    const page: GatsbyPage = {
      path: '/page',
      component: '',
      context: {},
    }

    const pages = new Map<string, GatsbyPage>()

    const expected = {
      pages: [
        {
          path: '/en/page',
          component: '',
          context: { pageId: '/page', language: 'en' },
        },
        {
          path: '/page',
          component: REDIRECT_TEMPLATE_FILE,
          context: { redirectTo: '/en/page' },
        },
      ],
      redirects: [
        {
          fromPath: '/page',
          isPermanent: true,
          toPath: '/en/page',
        },
      ],
      errors: [],
      removeOriginalPage: true,
    }

    expect(generatePages(page, pages, options)).toStrictEqual(expected)
  })
})
