// Integration tests against a REAL MySQL server (see tests/integration/global-setup.js).
// Run with: RUN_DB_INTEGRATION=1 npm run test:integration
module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/integration/**/*.test.js'],
  globalSetup: '<rootDir>/tests/integration/global-setup.js',
  testTimeout: 20000,
};
