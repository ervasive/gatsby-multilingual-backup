module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '/src/__tests__/.*\\.test\\.(js|ts)$',
  testPathIgnorePatterns: ['/node_modules/'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.base.json',
    },
  },
  reporters: ['default', 'jest-junit'],
}
