/**
 * Lint-staged configuration
 * This configuration will run ESLint and Prettier on staged files
 */

export default {
  // Run ESLint on JS, TS, and Vue files
  '*.{js,ts,mjs,cjs,vue}': [
    'eslint -c ./eslint.config.js --cache --fix',
  ],

  // Format all supported files with Prettier
  '*.{js,ts,vue,css,scss,html,md,json}': [
    'prettier --write',
  ],
};
