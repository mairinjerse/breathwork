// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', '.expo/*'],
  },
  {
    // Service worker template: placeholders are substituted at build time.
    files: ['scripts/sw-template.js'],
    languageOptions: { globals: { __PAGES__: 'readonly', __ASSETS__: 'readonly' } },
  },
]);
