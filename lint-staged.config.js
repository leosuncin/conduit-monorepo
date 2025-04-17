/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{js,mjs,cjs,ts,tsx,mts,mts,css,json,jsonc}': 'biome check --write',
  'package.json': (files) => [
    `syncpack format ${files.map((file) => `--source ${file}`).join(' ')}`,
    `sort-package-json ${files.join(' ')}`,
    `biome check --write ${files.join(' ')}`,
  ],
};
