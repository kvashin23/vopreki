// Сборка через Node.js (18+):
//   node tools/build.mjs             — страницы в корень проекта (как tools/build.html)
//   node tools/build.mjs --out dist  — отдельная папка для хостинга: страницы + assets/ (так собирает Vercel)
import { mkdir, writeFile, cp, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages } from '../src/render.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const i = process.argv.indexOf('--out');
const out = i > -1 ? resolve(root, process.argv[i + 1]) : root;

if (out !== root) {
  await rm(out, { recursive: true, force: true });
  await cp(join(root, 'assets'), join(out, 'assets'), { recursive: true });
}
for (const { path, html } of pages()) {
  const file = join(out, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html, 'utf8');
  console.log('✓', path);
}
if (out !== root) console.log('Готово:', out);
