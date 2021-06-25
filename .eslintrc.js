module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {},
  env: {
    node: true,
  },
  overrides: [
    {
      files: ['*.spec.ts', 'src/__specs__/**/*'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/no-empty-function': 'off',
      },
    },
  ],
};
