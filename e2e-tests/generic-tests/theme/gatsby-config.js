const path = require('path')

module.exports = {
  plugins: [
    {
      resolve: '@gatsby-plugin-multilingual/translations-loader',
      options: {
        path: path.resolve(__dirname, 'translations', 'priority-auto'),
      },
    },
    {
      resolve: '@gatsby-plugin-multilingual/translations-loader',
      options: {
        path: path.resolve(__dirname, 'translations', 'priority-custom'),
        priority: 10,
      },
    },
  ],
}
