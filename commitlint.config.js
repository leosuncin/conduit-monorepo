import { readdir } from 'node:fs/promises';
import { basename } from 'node:path';

const DEFAULT_SCOPES = ['repo', 'changeset'];
const apps = (await readdir('apps', { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => basename(entry.name));
const packages = (await readdir('packages', { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => basename(entry.name));
const scopes = [...DEFAULT_SCOPES, ...apps, ...packages];

export default {
  extends: ['@commitlint/config-conventional', 'monorepo'],
  rules: {
    'scope-enum': [2, 'always', scopes],
  },
};
