module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testRegex: 'packages/.*/src/.*/.*\\.test\\.(js|tsx?)$',
  testPathIgnorePatterns: ['/node_modules/'],
  setupFiles: [`<rootDir>/jest/loadershim.js`],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.base.json',
    },
    __PATH_PREFIX__: ``,
  },
  reporters: [
    'default',
    [
      'jest-junit',
      { outputDirectory: 'reports/unit-tests', outputName: 'results.xml' },
    ],
  ],
}
