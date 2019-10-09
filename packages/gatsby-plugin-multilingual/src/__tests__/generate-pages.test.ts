import { GatsbyPage } from '@gatsby-plugin-multilingual/shared'
import generatePages from '../generate-pages'
import getOptions from '../get-options'
import { MissingLanguagesStrategy } from '../types'

describe('generatePages', () => {
  it(
    `should return a page for only the default language based on` +
      `"missingLanguagesStrategy=ignore"`,
    () => {
      const options = getOptions({
        defaultLanguage: 'en',
        availableLanguages: ['en', 'ru'],
        includeDefaultLanguageInURL: false,
        missingLanguagesStrategy: MissingLanguagesStrategy.Ignore,
        overrides: [],
      })

      const result = {
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

      expect(
        generatePages(
          {
            path: '/page',
            component: '',
            context: {
              multilingual: true,
            },
          },
          [],
          options,
        ),
      ).toStrictEqual(result)

      expect(
        generatePages(
          {
            path: '/page',
            component: '',
            context: {
              multilingual: {
                pageId: '/page',
                languages: ['en'],
              },
            },
          },
          [],
          options,
        ),
      ).toStrictEqual(result)

      expect(
        generatePages(
          {
            path: '/page',
            component: '',
            context: {
              multilingual: {
                pageId: '/page',
                languages: [{ language: 'en' }],
              },
            },
          },
          [],
          options,
        ),
      ).toStrictEqual(result)
    },
  )

  it(
    `should return pages for all available languages based on` +
      `"missingLanguagesStrategy=generate"`,
    () => {
      const options = getOptions({
        defaultLanguage: 'en',
        availableLanguages: ['en', 'ru'],
        includeDefaultLanguageInURL: false,
        missingLanguagesStrategy: MissingLanguagesStrategy.Generate,
        overrides: [],
      })

      const result = {
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

      expect(
        generatePages(
          {
            path: '/page',
            component: '',
            context: {
              multilingual: true,
            },
          },
          [],
          options,
        ),
      ).toStrictEqual(result)

      expect(
        generatePages(
          {
            path: '/page',
            component: '',
            context: {
              multilingual: {
                pageId: '/page',
                languages: ['en'],
              },
            },
          },
          [],
          options,
        ),
      ).toStrictEqual(result)

      expect(
        generatePages(
          {
            path: '/page',
            component: '',
            context: {
              multilingual: {
                pageId: '/page',
                languages: [{ language: 'en' }],
              },
            },
          },
          [],
          options,
        ),
      ).toStrictEqual(result)
    },
  )

  it(
    `should return pages and redirects for all available languages based on` +
      `"missingLanguagesStrategy=redirect"`,
    () => {
      const options = getOptions({
        defaultLanguage: 'en',
        availableLanguages: ['en', 'ru'],
        includeDefaultLanguageInURL: false,
        missingLanguagesStrategy: MissingLanguagesStrategy.Redirect,
        overrides: [],
      })

      const result = {
        pages: [
          {
            path: '/page',
            context: { pageId: '/page', language: 'en' },
          },
          {
            path: '/ru/page',
            context: { redirectTo: '/page' },
          },
        ],
        redirects: [
          { fromPath: '/ru/page', toPath: '/page', isPermanent: true },
        ],
        errors: [],
        removeOriginalPage: true,
      }

      expect(
        generatePages(
          {
            path: '/page',
            component: '',
            context: {
              multilingual: true,
            },
          },
          [],
          options,
        ),
      ).toMatchObject(result)

      expect(
        generatePages(
          {
            path: '/page',
            component: '',
            context: {
              multilingual: {
                pageId: '/page',
                languages: ['en'],
              },
            },
          },
          [],
          options,
        ),
      ).toMatchObject(result)

      expect(
        generatePages(
          {
            path: '/page',
            component: '',
            context: {
              multilingual: {
                pageId: '/page',
                languages: [{ language: 'en' }],
              },
            },
          },
          [],
          options,
        ),
      ).toMatchObject(result)
    },
  )

  it(`should `, () => {
    const options = getOptions({
      defaultLanguage: 'en',
      availableLanguages: ['en', 'ru'],
      includeDefaultLanguageInURL: false,
      missingLanguagesStrategy: MissingLanguagesStrategy.Generate,
      overrides: [],
    })

    const result = {
      pages: [
        {
          path: '/page',
          context: { pageId: '/page', language: 'en' },
        },
        {
          path: '/ru/page',
          context: { redirectTo: '/page' },
        },
      ],
      redirects: [],
      errors: [],
      removeOriginalPage: true,
    }

    expect(
      generatePages(
        {
          path: '/page',
          component: '',
          context: {
            multilingual: true,
          },
        },
        [
          {
            path: '/ru/page-from-pages',
            component: '',
            context: { language: 'ru', pageId: '/page' },
          },
        ],
        options,
      ),
    ).toMatchObject(result)

    expect(
      generatePages(
        {
          path: '/page',
          component: '',
          context: {
            multilingual: {
              pageId: '/page',
              languages: ['en'],
            },
          },
        },
        [],
        options,
      ),
    ).toMatchObject(result)

    expect(
      generatePages(
        {
          path: '/page',
          component: '',
          context: {
            multilingual: {
              pageId: '/page',
              languages: [{ language: 'en' }],
            },
          },
        },
        [],
        options,
      ),
    ).toMatchObject(result)
  })

  it(`should return onle a page for the default language   xxx`, () => {
    const result = generatePages(
      {
        path: '/page',
        component: '',
        context: {
          multilingual: true,
          //  {
          //   pageId: '/page',
          //   languages: [
          //     { language: 'ru', path: '/page-path-ru' },
          //     { language: 'es', path: '/page-path-es' },
          //     { language: 'wrong', path: '/page-path-wrong' },
          //   ],
          // },
        },
      },
      [],
      getOptions({
        defaultLanguage: 'en',
        availableLanguages: ['en', 'ru', 'de', 'es', 'it'],
        includeDefaultLanguageInURL: true,
        missingLanguagesStrategy: MissingLanguagesStrategy.Ignore,
        overrides: [
          {
            path: '/page',
            languages: [
              { language: 'ru', path: '/page-path-ru-ov' },
              { language: 'de', path: '/page-path-de-ov' },
            ],
          },
        ],
      }),
    )

    expect(result).toBe(0)
  })
})
