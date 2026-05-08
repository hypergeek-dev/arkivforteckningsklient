import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  verbose: true,
  moduleNameMapper: {
    '^Store/(.*)$': '<rootDir>/src/store/$1',
    '^Services/(.*)$': '<rootDir>/src/services/$1',
    '^Components/(.*)$': '<rootDir>/src/components/$1',
    '^Common/(.*)$': '<rootDir>/src/common/$1',
    '^Config/(.*)$': '<rootDir>/src/config/$1',
    '^Models/(.*)$': '<rootDir>/src/models/$1',
    '^Scenarios/(.*)$': '<rootDir>/src/scenarios/$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

export default config;
