/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'curly': ['error', 'all'],
    'indent': ['error', 2, { SwitchCase: 1 }],
    'max-len': ['error', { code: 120 }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-unreachable': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-undef': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
  },
}
