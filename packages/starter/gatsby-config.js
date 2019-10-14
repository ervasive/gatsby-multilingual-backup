/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  plugins: [
    {
      resolve: "gatsby-plugin-multilingual",
      options: {
        defaultLanguage: "en",
        availableLanguages: ["en", "😀"],
        customSlugs: {
            '/page-2': {
                en: '/en/page-two-slug',
                "😀": '/😀/page-two-😀'
            }
        }
      },
    },
    {
      resolve: "@gatsby-plugin-multilingual/translations-loader",
      options: {
        path: "translations",
      },
    },
  ],
}
