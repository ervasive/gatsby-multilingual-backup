import generatePages from '../generate-pages'
import getOptions from '../get-options'

describe('generatePages', () => {
  it(`should produce empty values for a non "multilingual" page`, () => {
    const { pages, redirects, error, removeOriginalPage } = generatePages(
      {
        path: '/non-multilingual-page-path-value',
        component: '',
        context: {},
      },
      getOptions(),
    )

    expect(pages.length).toBe(0)
    expect(redirects.length).toBe(0)
    expect(error).toBeUndefined()
    expect(removeOriginalPage).toBeUndefined()
  })

  it(
    `should produce a warning on invalid MultilingualPage shape and ` +
      `set "removeOriginalPage" to false if "removeInvalidPages" is not set`,
    () => {
      const { pages, redirects, error, removeOriginalPage } = generatePages(
        {
          path: '/non-multilingual-page-path-value',
          component: '',
          context: {
            multilingual: {
              languages: 'non-valid-value',
              skip: 'non-valid-value',
            },
          },
        },
        getOptions({ removeInvalidPages: false, plugins: [] }),
      )

      expect(pages.length).toBe(0)
      expect(redirects.length).toBe(0)
      expect((error as any).type).toMatch('warn')
      expect((error as any).message).toMatch(
        /"languages" property.*"skip" property/is,
      )
      expect(removeOriginalPage).toBe(false)
    },
  )

  it(
    `should produce a warning on invalid MultilingualPage shape and ` +
      `set "removeOriginalPage" to true if "removeInvalidPages" is set`,
    () => {
      const { pages, redirects, error, removeOriginalPage } = generatePages(
        {
          path: '/non-multilingual-page-path-value',
          component: '',
          context: {
            multilingual: {
              languages: 'non-valid-value',
              skip: 'non-valid-value',
            },
          },
        },
        getOptions({ removeInvalidPages: true, plugins: [] }),
      )

      expect(pages.length).toBe(0)
      expect(redirects.length).toBe(0)
      expect((error as any).type).toMatch('warn')
      expect((error as any).message).toMatch(
        /"languages" property.*"skip" property/is,
      )
      expect(removeOriginalPage).toBe(true)
    },
  )

  it(
    `should produce empty values for a "skipped" page and set ` +
      `"removeOriginalPage" to false if "removeSkippedPages" is not set`,
    () => {
      const { pages, redirects, error, removeOriginalPage } = generatePages(
        {
          path: '/non-multilingual-page-path-value',
          component: '',
          context: {
            multilingual: {
              languages: ['en', 'ru'],
              skip: true,
            },
          },
        },
        getOptions({
          availableLanguages: ['en', 'ru'],
          removeSkippedPages: false,
          plugins: [],
        }),
      )

      expect(pages.length).toBe(0)
      expect(redirects.length).toBe(0)
      expect(error).toBeUndefined()
      expect(removeOriginalPage).toBe(false)
    },
  )

  it(
    `should produce empty values for a "skipped" page and set ` +
      `"removeOriginalPage" to true if "removeSkippedPages" is set`,
    () => {
      const { pages, redirects, error, removeOriginalPage } = generatePages(
        {
          path: '/non-multilingual-page-path-value',
          component: '',
          context: {
            multilingual: {
              languages: ['en', 'ru'],
              skip: true,
            },
          },
        },
        getOptions({
          availableLanguages: ['en', 'ru'],
          removeSkippedPages: true,
          plugins: [],
        }),
      )

      expect(pages.length).toBe(0)
      expect(redirects.length).toBe(0)
      expect(error).toBeUndefined()
      expect(removeOriginalPage).toBe(true)
    },
  )

  it(
    `should produce a warning if the MultilingualPage page does not ` +
      `specify any valid language and set "removeOriginalPage" to false`,
    () => {
      const { pages, redirects, error, removeOriginalPage } = generatePages(
        {
          path: '/non-multilingual-page-path-value',
          component: '',
          context: {
            multilingual: {
              languages: ['de', 'es'],
            },
          },
        },
        getOptions({ availableLanguages: ['en', 'ru'], plugins: [] }),
      )

      expect(pages.length).toBe(0)
      expect(redirects.length).toBe(0)
      expect((error as any).type).toMatch('warn')
      expect((error as any).message).toMatch(/has no valid languages/is)
      expect(removeOriginalPage).toBe(false)
    },
  )

  it(
    `should produce all required values for a valid MultilingualPage page ` +
      `without any redirects if "includeDefaultLanguageInURL" set to false`,
    () => {
      const { pages, redirects, error, removeOriginalPage } = generatePages(
        {
          path: '/non-multilingual-page-path-value',
          component: '',
          context: {
            arbitraryContextProperty: true,
            multilingual: {
              languages: ['en', 'ru'],
            },
          },
        },
        getOptions({
          availableLanguages: ['en', 'ru'],
          includeDefaultLanguageInURL: false,
          plugins: [],
        }),
      )

      expect(pages.length).toBe(2)
      expect(pages[0]).toEqual({
        path: `/non-multilingual-page-path-value`,
        component: '',
        context: {
          language: 'en',
          genericPath: '/non-multilingual-page-path-value',
          arbitraryContextProperty: true,
        },
      })
      expect(pages[1]).toEqual({
        path: `/ru/non-multilingual-page-path-value`,
        component: '',
        context: {
          language: 'ru',
          genericPath: '/non-multilingual-page-path-value',
          arbitraryContextProperty: true,
        },
      })
      expect(redirects.length).toBe(0)
      expect(error).toBeUndefined()
      expect(removeOriginalPage).toBe(true)
    },
  )

  it(
    `should produce all required values for a valid MultilingualPage page ` +
      `with required redirects if "includeDefaultLanguageInURL" set to true`,
    () => {
      const { pages, redirects, error, removeOriginalPage } = generatePages(
        {
          path: '/non-multilingual-page-path-value',
          component: '',
          context: {
            arbitraryContextProperty: true,
            multilingual: {
              languages: ['en', 'ru'],
            },
          },
        },
        getOptions({
          availableLanguages: ['en', 'ru'],
          includeDefaultLanguageInURL: true,
          plugins: [],
        }),
      )

      expect(pages.length).toBe(3)

      expect(pages[0]).toEqual({
        path: `/en/non-multilingual-page-path-value`,
        component: '',
        context: {
          language: 'en',
          genericPath: '/non-multilingual-page-path-value',
          arbitraryContextProperty: true,
        },
      })

      expect(pages[1]).toMatchObject({
        path: `/non-multilingual-page-path-value`,
        context: {
          redirectTo: '/en/non-multilingual-page-path-value',
          arbitraryContextProperty: true,
        },
      })
      expect(pages[1].component).toMatch(/RedirectTemplate/)

      expect(pages[2]).toEqual({
        path: `/ru/non-multilingual-page-path-value`,
        component: '',
        context: {
          language: 'ru',
          genericPath: '/non-multilingual-page-path-value',
          arbitraryContextProperty: true,
        },
      })

      expect(redirects.length).toBe(1)

      expect(redirects[0]).toEqual({
        fromPath: '/non-multilingual-page-path-value',
        toPath: '/en/non-multilingual-page-path-value',
        isPermanent: true,
      })

      expect(error).toBeUndefined()
      expect(removeOriginalPage).toBe(true)
    },
  )

  it(
    `should produce all required values for a page with "multilingual" path ` +
      `without any redirects if "includeDefaultLanguageInURL" set to false`,
    () => {
      const { pages, redirects, error, removeOriginalPage } = generatePages(
        {
          path: '/multilingual-page-path-value.en,ru',
          component: '',
          context: {
            arbitraryContextProperty: true,
          },
        },
        getOptions({
          availableLanguages: ['en', 'ru'],
          includeDefaultLanguageInURL: false,
          plugins: [],
        }),
      )

      expect(pages.length).toBe(2)

      expect(pages[0]).toEqual({
        path: `/multilingual-page-path-value`,
        component: '',
        context: {
          language: 'en',
          genericPath: '/multilingual-page-path-value',
          arbitraryContextProperty: true,
        },
      })

      expect(pages[1]).toEqual({
        path: `/ru/multilingual-page-path-value`,
        component: '',
        context: {
          language: 'ru',
          genericPath: '/multilingual-page-path-value',
          arbitraryContextProperty: true,
        },
      })

      expect(redirects.length).toBe(0)
      expect(error).toBeUndefined()
      expect(removeOriginalPage).toBe(true)
    },
  )

  it(
    `should produce all required values for a page with "multilingual" path ` +
      `with all required redirects if "includeDefaultLanguageInURL" set to true`,
    () => {
      const { pages, redirects, error, removeOriginalPage } = generatePages(
        {
          path: '/multilingual-page-path-value.en,ru',
          component: '',
          context: {
            arbitraryContextProperty: true,
          },
        },
        getOptions({
          availableLanguages: ['en', 'ru'],
          includeDefaultLanguageInURL: true,
          plugins: [],
        }),
      )

      expect(pages.length).toBe(3)

      expect(pages[0]).toEqual({
        path: `/en/multilingual-page-path-value`,
        component: '',
        context: {
          language: 'en',
          genericPath: '/multilingual-page-path-value',
          arbitraryContextProperty: true,
        },
      })

      expect(pages[1]).toMatchObject({
        path: `/multilingual-page-path-value`,
        context: {
          redirectTo: '/en/multilingual-page-path-value',
          arbitraryContextProperty: true,
        },
      })
      expect(pages[1].component).toMatch(/RedirectTemplate/)

      expect(pages[2]).toEqual({
        path: `/ru/multilingual-page-path-value`,
        component: '',
        context: {
          language: 'ru',
          genericPath: '/multilingual-page-path-value',
          arbitraryContextProperty: true,
        },
      })

      expect(redirects.length).toBe(1)

      expect(redirects[0]).toEqual({
        fromPath: '/multilingual-page-path-value',
        toPath: '/en/multilingual-page-path-value',
        isPermanent: true,
      })

      expect(error).toBeUndefined()
      expect(removeOriginalPage).toBe(true)
    },
  )

  it(
    `should translate "all" keyword for languages value into the list of ` +
      `pages for all available languages`,
    () => {
      const { pages, redirects, error, removeOriginalPage } = generatePages(
        {
          path: '/multilingual-page-path-value.all',
          component: '',
          context: {
            arbitraryContextProperty: true,
          },
        },
        getOptions({
          availableLanguages: ['en', 'ru', 'de'],
          includeDefaultLanguageInURL: false,
          plugins: [],
        }),
      )

      expect(pages.length).toBe(3)

      expect(pages[0]).toEqual({
        path: `/multilingual-page-path-value`,
        component: '',
        context: {
          language: 'en',
          genericPath: '/multilingual-page-path-value',
          arbitraryContextProperty: true,
        },
      })

      expect(pages[1]).toEqual({
        path: `/ru/multilingual-page-path-value`,
        component: '',
        context: {
          language: 'ru',
          genericPath: '/multilingual-page-path-value',
          arbitraryContextProperty: true,
        },
      })

      expect(pages[2]).toEqual({
        path: `/de/multilingual-page-path-value`,
        component: '',
        context: {
          language: 'de',
          genericPath: '/multilingual-page-path-value',
          arbitraryContextProperty: true,
        },
      })

      expect(redirects.length).toBe(0)
      expect(error).toBeUndefined()
      expect(removeOriginalPage).toBe(true)
    },
  )
})
