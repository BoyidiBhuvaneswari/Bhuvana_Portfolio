import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const css = readFileSync(resolve(root, 'style.css'), 'utf8');
const script = readFileSync(resolve(root, 'script.js'), 'utf8');
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)]
      .slice(1)
      .map(match => [match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? ''])
  );
}

check(!/\sonclick\s*=/.test(html), 'Inline onclick handlers must not be used.');
check(/<main\s+id="main-content">/.test(html), 'A main landmark is required.');
check(/class="skip-link"\s+href="#main-content"/.test(html), 'A skip link is required.');
check(/class="nav-toggle"[^>]+aria-controls="primary-navigation"[^>]+aria-expanded="false"/.test(html), 'The mobile navigation button must expose its controlled menu and state.');
check(/id="stat-panel"[^>]+role="dialog"[^>]+aria-modal="true"[^>]+aria-labelledby="sp-title"/.test(html), 'The details panel must be an accessible modal dialog.');
check((html.match(/class="stat-card"/g) ?? []).length === 3, 'All three statistic cards must be present.');
check((html.match(/class="proj-name-bar proj-toggle"/g) ?? []).length === 6, 'All six project drawers must have buttons.');
check(/ps-card cc[\s\S]*?ps-stat-lbl">Rating</.test(html), 'CodeChef currentRating must be labelled Rating.');

for (const tag of html.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? []) {
  const attrs = attributes(tag);
  const rel = new Set((attrs.rel ?? '').split(/\s+/));
  check(rel.has('noopener') && rel.has('noreferrer'), `External new-tab link is missing rel="noopener noreferrer": ${attrs.href ?? tag}`);
}

for (const tag of html.match(/<img\b[^>]*>/g) ?? []) {
  const attrs = attributes(tag);
  check('alt' in attrs, `Image is missing alt text: ${attrs.src ?? tag}`);
  check(Boolean(attrs.width) && Boolean(attrs.height), `Image is missing width/height: ${attrs.src ?? tag}`);
  check(attrs.decoding === 'async', `Image should use asynchronous decoding: ${attrs.src ?? tag}`);
  if (attrs.src !== 'photo.jpeg') check(attrs.loading === 'lazy', `Below-fold image should be lazy-loaded: ${attrs.src ?? tag}`);
}

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
check(duplicates.length === 0, `Duplicate IDs found: ${[...new Set(duplicates)].join(', ')}`);

const idSet = new Set(ids);
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  check(idSet.has(match[1]), `Internal link points to missing ID: #${match[1]}`);
}

for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const value = match[1];
  if (/^(?:https?:|mailto:|#)/.test(value)) continue;
  const path = resolve(root, decodeURIComponent(value.split(/[?#]/)[0]));
  check(existsSync(path), `Referenced local asset does not exist: ${value}`);
}

check(css.includes('@media (prefers-reduced-motion: reduce)'), 'Reduced-motion CSS is required.');
check(css.includes(':focus-visible'), 'Visible keyboard focus styling is required.');
check(script.includes("setAttribute('aria-expanded'"), 'Navigation and drawer state must update aria-expanded.');
check(css.includes('.projects-grid .proj-card-inner { display: flex'), 'Project cards must share uniform flex sizing without clipping content.');
check(!html.includes('id="c-orb"') && !html.includes('id="c-trail"'), 'The glowing custom cursor must remain removed.');
check(!html.includes('class="prof-section"'), 'The proficiency-lines section must remain removed.');
check(html.includes('id="math-bg"'), 'The floating formulas background container is required.');
check(!html.includes('id="sparkle-cursor"') && !html.includes('id="particle-network"') && !html.includes('class="hero-grid"'), 'Retired background effects must not remain active.');
check(!css.includes('.hero-grid') && !css.includes('.particle-network'), 'Grid and particle-network styling must remain inactive.');
check(script.includes('const symbols') && script.includes("getElementById('math-bg')"), 'Floating formulas background script is required.');
check(script.includes('createSymbol') && script.includes('math-symbol'), 'Formula symbols must be created and animated.');
check(css.includes('.math-symbol') && css.includes('@keyframes formula-flow'), 'Formula styling must remain active.');
check(script.includes("setAttribute('aria-expanded'"), 'Navigation and drawer state must update aria-expanded.');
check(script.includes('openStatPanel') && script.includes('closeStatPanel'), 'Stat panel modal logic is required.');
check(script.includes("classList.add('visible')") && script.includes('IntersectionObserver'), 'Reveal-on-scroll animation logic is required.');
check(/body\s*\{[^}]*background:\s*#000/.test(css), 'The plain deep-black background is required.');

for (const archivedEffect of [
  'effects-archive/README.md',
  'effects-archive/cursor-sparkles.js',
  'effects-archive/cursor-sparkles.css',
  'effects-archive/floating-formulas.js',
  'effects-archive/floating-formulas.css'
]) {
  check(existsSync(resolve(root, archivedEffect)), `Archived effect is missing: ${archivedEffect}`);
}

if (failures.length) {
  console.error(`Verification failed with ${failures.length} issue(s):`);
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Verification passed: JavaScript, local links, images, accessibility, and motion safeguards are valid.');
