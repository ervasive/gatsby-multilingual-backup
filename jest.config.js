module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '/src/.*/.*\\.test\\.(js|ts)$',
  testPathIgnorePatterns: ['/node_modules/'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.base.json',
    },
  },
  reporters: [
    'default',
    [
      'jest-junit',
      { outputDirectory: 'reports/unit-tests', outputName: 'results.xml' },
    ],
  ],
}
