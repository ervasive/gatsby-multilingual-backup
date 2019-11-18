module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/.cache/'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.base.json',
      diagnostics: {
        ignoreCodes: [2345],
      },
    },
  },
  collectCoverage: true,
}
