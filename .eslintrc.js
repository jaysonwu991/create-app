module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  extends: ['eslint:recommended', 'prettier/prettier'],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 0,
    semi: [2, 'always'],
    quotes: [2, 'single'],
    'consistent-return': 2,
    'object-curly-spacing': [2, 'always'],
    'array-callback-return': 2,
    'array-bracket-spacing': [2, 'never'],
    'comma-spacing': [2, { before: false, after: true }],
    'comma-dangle': [
      2,
      {
        arrays: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
        imports: 'always-multiline',
        objects: 'always-multiline',
      },
    ],
    'no-unused-vars': [
      1,
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
  },
};
