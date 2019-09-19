import generatePages from '../generate-pages'
import getValidatedOptions from '../get-validated-options'

describe('generatePages', () => {
  it(`should produce empty values for a non "multilingual" page`, () => {
    const { pages, redirects, error, removeOriginalPage } = generatePages(
      {
        path: '/non-multilingual-page-path-value',
        component: '',
        context: {},
      },
      getValidatedOptions(),
    )

    expect(pages.length).toBe(0)
    expect(redirects.length).toBe(0)
    expect(error).toBeUndefined()
    expect(removeOriginalPage).toBeUndefined()
  })

  describe(`"removeInvalidPages" flag`, () => {
    it(`should produce a warning and set "removeOriginalPage" if the flag=true`, () => {
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
        getValidatedOptions({ removeInvalidPages: true }),
      )

      expect(pages.length).toBe(0)
      expect(redirects.length).toBe(0)
      expect((error as any).type).toMatch('warn')
      expect((error as any).message).toMatch(
        /"languages" property.*"skip" property/is,
      )
      expect(removeOriginalPage).toBe(true)
    })

    it(`should produce a warning and not set "removeOriginalPage" if the flag=false`, () => {
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
        getValidatedOptions({ removeInvalidPages: false }),
      )

      expect(pages.length).toBe(0)
      expect(redirects.length).toBe(0)
      expect((error as any).type).toMatch('warn')
      expect((error as any).message).toMatch(
        /"languages" property.*"skip" property/is,
      )
      expect(removeOriginalPage).toBe(false)
    })
  })

  describe(`"removeSkippedPages" flag`, () => {
    it(`should not set "removeOriginalPage" if the flag=false`, () => {
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
        getValidatedOptions({
          availableLanguages: ['en', 'ru'],
          removeSkippedPages: false,
        }),
      )

      expect(pages.length).toBe(0)
      expect(redirects.length).toBe(0)
      expect(error).toBeUndefined()
      expect(removeOriginalPage).toBe(false)
    })

    it(`should set "removeOriginalPage" if the flag=true`, () => {
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
        getValidatedOptions({
          availableLanguages: ['en', 'ru'],
          removeSkippedPages: true,
        }),
      )

      expect(pages.length).toBe(0)
      expect(redirects.length).toBe(0)
      expect(error).toBeUndefined()
      expect(removeOriginalPage).toBe(true)
    })
  })

  describe(`with invalid input page shape`, () => {
    it(`should produce a warning and on invalid languages array item value type`, () => {
      const { pages, redirects, error, removeOriginalPage } = generatePages(
        {
          path: '/non-multilingual-page-path-value',
          component: '',
          context: {
            multilingual: {
              languages: [NaN],
            },
          },
        },
        getValidatedOptions(),
      )

      expect(pages.length).toBe(0)
      expect(redirects.length).toBe(0)
      expect((error as any).type).toMatch('warn')
      expect((error as any).message).toMatch(/"languages" property/is)
      expect(removeOriginalPage).toBe(true)
    })

    it(`should produce a warning on invalid language as an object value`, () => {
      const { pages, redirects, error, removeOriginalPage } = generatePages(
        {
          path: '/non-multilingual-page-path-value',
          component: '',
          context: {
            multilingual: {
              languages: [{ wrongLanguagePropertyName: 'en' }],
            },
          },
        },
        getValidatedOptions(),
      )

      expect(pages.length).toBe(0)
      expect(redirects.length).toBe(0)
      expect((error as any).type).toMatch('warn')
      expect((error as any).message).toMatch(/"languages" property/is)
      expect(removeOriginalPage).toBe(true)
    })
  })

  it(`should produce a warning and set "removeOriginalPage" to false on no allowed languages`, () => {
    const { pages, redirects, error, removeOriginalPage } = generatePages(
      {
        path: '/non-multilingual-page-path-value',
        component: '',
        context: {
          multilingual: {
            languages: ['de', { language: 'es' }],
          },
        },
      },
      getValidatedOptions({ availableLanguages: ['en', 'ru'] }),
    )

    expect(pages.length).toBe(0)
    expect(redirects.length).toBe(0)
    expect((error as any).type).toMatch('warn')
    expect((error as any).message).toMatch(/has no valid languages/is)
    expect(removeOriginalPage).toBe(false)
  })

  describe(`"includeDefaultLanguageInURL" flag`, () => {
    it(`should generate pages for a input page without redirects if the flag=false`, () => {
      const { pages, redirects, error, removeOriginalPage } = generatePages(
        {
          path: '/non-multilingual-page-path-value',
          component: '',
          context: {
            arbitraryContextProperty: true,
            multilingual: {
              languages: ['en', { language: 'ru', slug: 'путь-страницы' }],
            },
          },
        },
        getValidatedOptions({
          defaultLanguage: 'en',
          availableLanguages: ['en', 'ru'],
          includeDefaultLanguageInURL: false,
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
        path: `/ru/путь-страницы`,
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
    })

    it(
      `should generate pages for a input page based on the "path" property ` +
        `without redirects if the flag=false`,
      () => {
        const { pages, redirects, error, removeOriginalPage } = generatePages(
          {
            path: '/multilingual-page-path-value.en,ru',
            component: '',
            context: {
              arbitraryContextProperty: true,
            },
          },
          getValidatedOptions({
            defaultLanguage: 'en',
            availableLanguages: ['en', 'ru'],
            includeDefaultLanguageInURL: false,
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

    it(`should generate pages for a input page with redirects if the flag=true`, () => {
      const { pages, redirects, error, removeOriginalPage } = generatePages(
        {
          path: '/non-multilingual-page-path-value',
          component: '',
          context: {
            arbitraryContextProperty: true,
            multilingual: {
              languages: ['en', { language: 'ru', slug: 'путь-страницы' }],
            },
          },
        },
        getValidatedOptions({
          defaultLanguage: 'en',
          availableLanguages: ['en', 'ru'],
          includeDefaultLanguageInURL: true,
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
        path: `/ru/путь-страницы`,
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
    })

    it(
      `should generate pages for a input page based on the "path" property ` +
        `with redirects if the flag=true`,
      () => {
        const { pages, redirects, error, removeOriginalPage } = generatePages(
          {
            path: '/multilingual-page-path-value.en,ru',
            component: '',
            context: {
              arbitraryContextProperty: true,
            },
          },
          getValidatedOptions({
            defaultLanguage: 'en',
            availableLanguages: ['en', 'ru'],
            includeDefaultLanguageInURL: true,
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
  })

  describe(`"all" keyword`, () => {
    it(
      `should generate pages for all available languages if the keyword ` +
        `present in languages array as a string`,
      () => {
        const { pages, redirects, error, removeOriginalPage } = generatePages(
          {
            path: '/non-multilingual-page-path-value',
            component: '',
            context: {
              multilingual: {
                languages: ['all', { language: 'ru', slug: 'путь-страницы' }],
              },
              arbitraryContextProperty: true,
            },
          },
          getValidatedOptions({
            availableLanguages: ['en', 'ru', 'de'],
            includeDefaultLanguageInURL: false,
          }),
        )

        expect(pages.length).toBe(3)

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
          path: `/ru/путь-страницы`,
          component: '',
          context: {
            language: 'ru',
            genericPath: '/non-multilingual-page-path-value',
            arbitraryContextProperty: true,
          },
        })

        expect(pages[2]).toEqual({
          path: `/de/non-multilingual-page-path-value`,
          component: '',
          context: {
            language: 'de',
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
      `should generate pages for all available languages if the keyword ` +
        `present in languages array as an object language property`,
      () => {
        const { pages, redirects, error, removeOriginalPage } = generatePages(
          {
            path: '/non-multilingual-page-path-value',
            component: '',
            context: {
              multilingual: {
                languages: [
                  { language: 'all' },
                  { language: 'ru', slug: 'путь-страницы' },
                ],
              },
              arbitraryContextProperty: true,
            },
          },
          getValidatedOptions({
            availableLanguages: ['en', 'ru', 'de'],
            includeDefaultLanguageInURL: false,
          }),
        )

        expect(pages.length).toBe(3)

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
          path: `/ru/путь-страницы`,
          component: '',
          context: {
            language: 'ru',
            genericPath: '/non-multilingual-page-path-value',
            arbitraryContextProperty: true,
          },
        })

        expect(pages[2]).toEqual({
          path: `/de/non-multilingual-page-path-value`,
          component: '',
          context: {
            language: 'de',
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
      `should generate pages for all available languages if the keyword ` +
        `present in the form of a path suffix`,
      () => {
        const { pages, redirects, error, removeOriginalPage } = generatePages(
          {
            path: '/multilingual-page-path-value.all',
            component: '',
            context: {
              arbitraryContextProperty: true,
            },
          },
          getValidatedOptions({
            availableLanguages: ['en', 'ru', 'de'],
            includeDefaultLanguageInURL: false,
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

  describe('custom global slugs', () => {
    it(`should be assigned to pages`, () => {
      const { pages, redirects, error, removeOriginalPage } = generatePages(
        {
          path: '/page-example.all',
          component: '',
          context: {
            arbitraryContextProperty: true,
          },
        },
        getValidatedOptions({
          defaultLanguage: 'en',
          availableLanguages: ['en', 'ru', 'de'],
          includeDefaultLanguageInURL: true,
          customSlugs: {
            '/page-example': {
              en: 'example-global-slug',
              ru: 'пример-глобального-пути-страницы',
              de: 'beispiel-globaler-seitenpfad',
            },
          },
        }),
      )

      expect(pages.length).toBe(4)

      expect(pages[0]).toEqual({
        path: `/en/example-global-slug`,
        component: '',
        context: {
          language: 'en',
          genericPath: '/page-example',
          arbitraryContextProperty: true,
        },
      })

      expect(pages[1]).toMatchObject({
        path: `/example-global-slug`,
        context: {
          redirectTo: '/en/example-global-slug',
          arbitraryContextProperty: true,
        },
      })

      expect(pages[2]).toEqual({
        path: `/ru/пример-глобального-пути-страницы`,
        component: '',
        context: {
          language: 'ru',
          genericPath: '/page-example',
          arbitraryContextProperty: true,
        },
      })

      expect(pages[3]).toEqual({
        path: `/de/beispiel-globaler-seitenpfad`,
        component: '',
        context: {
          language: 'de',
          genericPath: '/page-example',
          arbitraryContextProperty: true,
        },
      })

      expect(redirects.length).toBe(1)
      expect(redirects[0]).toEqual({
        fromPath: `/example-global-slug`,
        toPath: '/en/example-global-slug',
        isPermanent: true,
      })

      expect(error).toBeUndefined()
      expect(removeOriginalPage).toBe(true)
    })
  })

  it(`should take precedence over local page slugs`, () => {
    const { pages, redirects, error, removeOriginalPage } = generatePages(
      {
        path: '/page-example',
        component: '',
        context: {
          arbitraryContextProperty: true,
          multilingual: {
            languages: [
              { language: 'en', slug: 'page-local-slug' },
              { language: 'ru', slug: 'пример-локального-пути-страницы' },
              { language: 'de', slug: 'beispiel-lokaler-seitenpfad' },
            ],
          },
        },
      },
      getValidatedOptions({
        defaultLanguage: 'en',
        availableLanguages: ['en', 'ru', 'de'],
        includeDefaultLanguageInURL: true,
        customSlugs: {
          '/page-example': {
            en: 'example-global-slug',
            ru: 'пример-глобального-пути-страницы',
            de: 'beispiel-globaler-seitenpfad',
          },
        },
      }),
    )

    expect(pages.length).toBe(4)

    expect(pages[0]).toEqual({
      path: `/en/example-global-slug`,
      component: '',
      context: {
        language: 'en',
        genericPath: '/page-example',
        arbitraryContextProperty: true,
      },
    })

    expect(pages[1]).toMatchObject({
      path: `/example-global-slug`,
      context: {
        redirectTo: '/en/example-global-slug',
        arbitraryContextProperty: true,
      },
    })

    expect(pages[2]).toEqual({
      path: `/ru/пример-глобального-пути-страницы`,
      component: '',
      context: {
        language: 'ru',
        genericPath: '/page-example',
        arbitraryContextProperty: true,
      },
    })

    expect(pages[3]).toEqual({
      path: `/de/beispiel-globaler-seitenpfad`,
      component: '',
      context: {
        language: 'de',
        genericPath: '/page-example',
        arbitraryContextProperty: true,
      },
    })

    expect(redirects.length).toBe(1)
    expect(redirects[0]).toEqual({
      fromPath: `/example-global-slug`,
      toPath: '/en/example-global-slug',
      isPermanent: true,
    })

    expect(error).toBeUndefined()
    expect(removeOriginalPage).toBe(true)
  })
})
