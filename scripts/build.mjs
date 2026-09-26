import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const client = resolve(dist, 'client');
const server = resolve(dist, 'server');

const publicFiles = [
  'index.html',
  'style.css',
  'script.js',
  'favicon.svg',
  'photo.jpeg',
  'og.png',
  'leetcode-logo.png',
  'hackerrank-logo.png',
  'certificates'
];

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });

for (const entry of publicFiles) {
  await cp(resolve(root, entry), resolve(client, entry), { recursive: true });
}

await cp(resolve(root, 'worker/index.js'), resolve(server, 'index.js'));
console.log('Built static portfolio for deployment.');
