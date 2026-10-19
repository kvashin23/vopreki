// Сборка через Node.js (18+): node tools/build.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages } from '../src/render.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
for (const { path, html } of pages()) {
  const file = join(root, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html, 'utf8');
  console.log('✓', path);
}
