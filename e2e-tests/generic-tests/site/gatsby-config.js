module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-page-creator`,
      options: {
        path: `${__dirname}/specs-targets`,
      },
    },
    'e2e-generic-test-theme',
    {
      resolve: 'gatsby-plugin-multilingual',
      options: {
        defaultLanguage: 'en',
        availableLanguages: ['en', 'ru'],
        includeDefaultLanguageInURL: true,
      },
    },
    {
      resolve: '@gatsby-plugin-multilingual/translations-loader',
      options: { path: 'translations/priority-auto-one' },
    },
    {
      resolve: '@gatsby-plugin-multilingual/translations-loader',
      options: { path: 'translations/priority-auto-two' },
    },
    {
      resolve: '@gatsby-plugin-multilingual/translations-loader',
      options: { path: 'translations/priority-custom', priority: 5 },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: 'non-translations-files',
      },
    },
  ],
}
