import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    env: {
      node: true,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
];
