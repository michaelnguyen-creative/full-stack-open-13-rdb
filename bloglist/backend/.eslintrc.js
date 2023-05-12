module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    semi: [
      'error',
      'never',
    ],
    indent: [
      'error',
      2,
    ],
    'no-console': 0,
    'no-undef': 0,
    'no-trailing-spaces': 'error',
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'object-curly-newline': 0,
  },
}
