const path = require('path')

exports.createPages = ({ actions }) => {
  const template = path.resolve(`./src/templates/DynamicPage.js`)
  ;[
    {
      path: 'all-languages-dynamic',
      component: template,
      context: {
        multilingual: {
          languages: ['all'],
        },
      },
    },
    {
      path: 'nested/all-languages-dynamic',
      component: template,
      context: {
        multilingual: {
          languages: ['all'],
        },
      },
    },
    {
      path: 'multiple-languages-dynamic',
      component: template,
      context: {
        multilingual: {
          languages: ['en', 'ru'],
        },
      },
    },
    {
      path: 'nested/multiple-languages-dynamic',
      component: template,
      context: {
        multilingual: {
          languages: ['en', 'ru'],
        },
      },
    },
    {
      path: 'single-language-dynamic',
      component: template,
      context: {
        multilingual: {
          languages: ['en'],
        },
      },
    },
    {
      path: 'nested/single-language-dynamic',
      component: template,
      context: {
        multilingual: {
          languages: ['en'],
        },
      },
    },
    {
      path: 'skipped-dynamic',
      component: template,
      context: {
        multilingual: {
          languages: ['en'],
          skip: true,
        },
      },
    },
    {
      path: 'nested/skipped-dynamic',
      component: template,
      context: {
        multilingual: {
          languages: ['en'],
          skip: true,
        },
      },
    },
    {
      path: 'invalid-dynamic',
      component: template,
      context: {
        multilingual: {
          languages: 'invalid-value',
          skip: 'invlaid-value',
        },
      },
    },
    {
      path: 'nested/invalid-dynamic',
      component: template,
      context: {
        multilingual: {
          languages: [0],
          skip: 'invlaid-value',
        },
      },
    },
    {
      path: 'not-allowed-language-dynamic',
      component: template,
      context: {
        multilingual: {
          languages: ['de'],
        },
      },
    },
    {
      path: 'nested/not-allowed-language-dynamic',
      component: template,
      context: {
        multilingual: {
          languages: ['de'],
        },
      },
    },
  ].forEach(page => actions.createPage(page))
}
