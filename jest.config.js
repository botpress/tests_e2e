/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'jest-puppeteer',
  testEnvironment: 'node',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
      isolatedModules: true
    }
  },
  globalSetup: 'jest-environment-puppeteer/setup',
  setupFilesAfterEnv: ['expect-puppeteer', './jest.setup.js'],
  collectCoverage: false,
  resetModules: true,
  //modulePaths: ['<rootDir>/src/bp/'],
  //moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx'],
  transform: {
    '^.+\\.(ts|tsx|js)$': 'ts-jest'
  },
  testMatch: ['**/tests/**/*.test.(ts|js)'],
  testPathIgnorePatterns: ['node_modules', 'borrar', 'proves', 'results', 'TheyWork'],
  testEnvironment: '<rootDir>/tests/customEnvironment.js',
  rootDir: '.',
  testResultsProcessor: '<rootDir>/node_modules/jest-html-reporter',
  testRunner: 'jest-circus/runner'

  //globalSetup: './jest.global-setup.ts', // will be called once before all tests are executed
  // globalTeardown: './jest.global-teardown.ts' // will be called once after all tests are executed
}
