module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
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
  collectCoverage: true,
  coverageDirectory: 'reports/coverage',
}
