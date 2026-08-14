import { access, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const sass = join(root, 'node_modules/.bin/sass');
const required = [
  'foundation.css',
  'default.css',
  'docs.css',
  'foundation.sass',
  'default.sass',
  'docs.sass',
  'tokens.sass'
];

for (const file of required) await access(join(root, file), constants.F_OK);

const fixture = await mkdtemp(join(tmpdir(), 'acrolls-styles-check-'));
try {
  const source = join(fixture, 'consumer.sass');
  await writeFile(source, "@use 'default'\n@use 'docs'\n@use 'tokens'\n", 'utf8');
  execFileSync(sass, ['--load-path', root, source, join(fixture, 'consumer.css'), '--no-source-map'], {
    stdio: 'inherit'
  });
} finally {
  await rm(fixture, { recursive: true, force: true });
}
