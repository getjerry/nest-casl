module.exports = {
  rootDir: './src',
  moduleNameMapper: {
    "nest-casl": "<rootDir>/index.ts"
  },
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'json', 'ts'],
  coveragePathIgnorePatterns: ['node_modules', 'src/__specs__'],
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  resetMocks: true,
  globals: {
    'ts-jest': {
      tsconfig: './src/__specs__/tsconfig.json'
    },
  },
};
