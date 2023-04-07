module.exports = {
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  restoreMocks: true,
  coveragePathIgnorePatterns: ['node_modules', 'server/config', 'server/app.ts', 'tests'],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  transform: { '\\.ts$': ['ts-jest'] },
};
