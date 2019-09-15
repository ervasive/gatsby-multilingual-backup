module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  testPathIgnorePatterns: ['/node_modules/'],
  setupFiles: [`<rootDir>/jest/loadershim.js`],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.base.json',
    },
    __PATH_PREFIX__: ``,
  },
  collectCoverage: true,
}
