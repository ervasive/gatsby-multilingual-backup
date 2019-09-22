module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/.cache/', '/generic-tests/'],
  setupFiles: [`<rootDir>/jest/loadershim.js`],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.base.json',
    },
    __PATH_PREFIX__: ``,
  },
  collectCoverage: true,
}
