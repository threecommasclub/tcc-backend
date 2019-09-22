const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],

  parserOptions: {
    // ecmaVersion: 2019, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },

  plugins: ['@typescript-eslint', 'prettier'],

  rules: {
    '@typescript-eslint/explicit-function-return-type': 0
  },
};
