module.exports = {
  rootDir: './src',
  moduleNameMapper: {
    'nest-casl': '<rootDir>/index.ts',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  coveragePathIgnorePatterns: ['node_modules', 'src/__specs__'],
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            decorators: true,
            topLevelAwait: true,
          },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
          },
          target: 'es2018',
          externalHelpers: false,
          keepClassNames: true,
        },
        module: {
          type: 'commonjs',
        },
        sourceMaps: 'inline',
      },
    ],
  },
  testEnvironment: 'node',
  resetMocks: true,
};
