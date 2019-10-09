const path = require('path')

// Followng cases
// {
//   defaultLanguage: 'en
//   availableLanguages: ['en', 'ru']
//   convertAllPages: true
//   missingLanguagePages: 'ignore'
//   includeDefaultLanguageInURL: false
// }

// { path: '/used-as-a-slug' } -> { path: '/used-as-a-slug'}

// {
//   defaultLanguage: 'en
//   availableLanguages: ['en', 'ru']
//   convertAllPages: true
//   missingLanguagePages: 'generate'
//   includeDefaultLanguageInURL: false
// }

// { path: '/used-as-a-slug' } -> [{ path: '/used-as-a-slug'}, { path: '/ru/used-as-a-slug'}]

// {
//   defaultLanguage: 'en
//   availableLanguages: ['en', 'ru']
//   convertAllPages: true
//   missingLanguagePages: 'generate'
//   includeDefaultLanguageInURL: false
// }

// { path: '/used-as-a-slug' } -> [{ path: '/used-as-a-slug'}, { path: '/ru/used-as-a-slug'}]

exports.createPages = ({ actions, store }) => {
  console.log('creating pages in site')
  const template = path.resolve(`./src/templates/DynamicPage.js`)
  ;[
    {
      path: 'all-languages-dynamic',
      component: template,
      context: {
        multilingual: {
          pageId: 'all-languages-dynamic',
          missingLanguages: 'generate',
        },
      },
    },
    // {
    //   path: 'nested/all-languages-dynamic',
    //   component: template,
    //   context: {
    //     multilingual: {
    //       pageId: 'nested/all-languages-dynamic',
    //       languages: ['ru'],
    //     },
    //   },
    // },
    // {
    //   path: 'multiple-languages-dynamic',
    //   component: template,
    //   context: {
    //     multilingual: {
    //       pageId: 'multiple-languages-dynamic',
    //       languages: [
    //         { language: 'en', path: 'multiple-languages-dynamic-en' },
    //         { language: 'ru', path: 'multiple-languages-dynamic-ru' },
    //       ],
    //     },
    //   },
    // },
    // {
    //   path: 'nested/multiple-languages-dynamic',
    //   component: template,
    //   context: {
    //     multilingual: {
    //       pageId: 'nested/multiple-languages-dynamic',
    //       languages: ['en', 'ru'],
    //     },
    //   },
    // },
    // {
    //   path: 'single-language-dynamic',
    //   component: template,
    //   context: {
    //     multilingual: {
    //       pageId: 'single-language-dynamic',
    //       languages: ['en'],
    //     },
    //   },
    // },
    // {
    //   path: 'nested/single-language-dynamic',
    //   component: template,
    //   context: {
    //     multilingual: {
    //       pageId: 'nested/single-language-dynamic',
    //       languages: ['en'],
    //     },
    //   },
    // },
    // {
    //   path: 'skipped-dynamic',
    //   component: template,
    //   context: {
    //     multilingual: {
    //       pageId: 'skipped-dynamic',
    //       languages: ['en'],
    //     },
    //   },
    // },
    // {
    //   path: 'nested/skipped-dynamic',
    //   component: template,
    //   context: {
    //     multilingual: {
    //       pageId: 'nested/skipped-dynamic',
    //       languages: ['en'],
    //     },
    //   },
    // },
    // {
    //   path: 'invalid-dynamic',
    //   component: template,
    //   context: {
    //     multilingual: {
    //       pageId: 'invalid-dynamic',
    //       languages: 'invalid-value',
    //     },
    //   },
    // },
    // {
    //   path: 'nested/invalid-dynamic',
    //   component: template,
    //   context: {
    //     multilingual: {
    //       pageId: 'nested/invalid-dynamic',
    //       languages: [0],
    //     },
    //   },
    // },
    // {
    //   path: 'not-allowed-language-dynamic',
    //   component: template,
    //   context: {
    //     multilingual: {
    //       pageId: 'not-allowed-language-dynamic',
    //       languages: ['de'],
    //     },
    //   },
    // },
    // {
    //   path: 'nested/not-allowed-language-dynamic',
    //   component: template,
    //   context: {
    //     multilingual: {
    //       pageId: 'nested/not-allowed-language-dynamic',
    //       languages: ['de'],
    //     },
    //   },
    // },
  ].forEach(page => actions.createPage(page))

  // actions.createPage(1)

  // We are going to create multilingual nodes instead of pages because
  // 1. we would need to pass the language and pageId to handle pages registry
  // creation anyway so there is not much sense to have a createMultilingualPage helper
  // 2. we will have to validate it in the plugin so no double work here as well
  // 3. we won't be needing to pass the store and actions
  // 4. we can probably specify graphql type for our node

  // [/en/english-path, /ru/russian-path]
  const test = {
    pageId: 'page-id',
    component: template,
    context: {
      someStuff: true,
    },
    languages: [
      { language: 'en', path: '/english-path' },
      { language: 'ru', path: '/russian-path' },
    ],
  }

  // /en/some-path
  // createMultilingualPage(
  //   {
  //     path: '/some-path',
  //     component: template,
  //   },
  //   'en',
  //   store,
  //   actions,
  // )

  // createMultilingualPage(page, 'ru', store, actions)
}
