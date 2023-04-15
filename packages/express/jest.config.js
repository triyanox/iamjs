module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.test.(ts|js|tsx)'],
  moduleNameMapper: {
    '^@iamjs/(.*)$': '<rootDir>/../../packages/$1/lib'
  },
  collectCoverageFrom: ['src/**/*.{ts,js,tsx}', '!src/**/*.d.{ts,js,tsx}'],
  coverageReporters: ['json', 'lcov', 'text', 'clover']
};
