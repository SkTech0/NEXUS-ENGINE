export default {
  displayName: 'engine-validation',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: '../../coverage/engine-validation',
  moduleNameMapper: {
    '^@nexus/engine-core$': '<rootDir>/../../engine-core/src/index.ts',
    '^@nexus/engine-validation$': '<rootDir>/src/index.ts',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
