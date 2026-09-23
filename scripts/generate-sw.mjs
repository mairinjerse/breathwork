// Writes dist/sw.js after `expo export --platform web`.
//
// Every exported file is precached under a version derived from the build's
// contents, so the installed app opens and runs fully offline. A new deploy
// produces a new version; the old cache is dropped when the new worker activates.

import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

// Router internals and non-page duplicates (route groups, dynamic placeholders) aren't needed offline.
const skip = (path) =>
  path === 'sw.js' ||
  path.endsWith('.map') ||
  path.startsWith('_expo/.') ||
  /(^|\/)(\(|\[|\+|_sitemap)/.test(path);

const files = walk(DIST)
  .map((f) => relative(DIST, f).split(sep).join('/'))
  .filter((f) => !skip(f))
  .sort();

const hash = createHash('sha256');
for (const f of files) hash.update(f).update(readFileSync(join(DIST, f)));
const version = hash.digest('hex').slice(0, 12);

// Pages are cached under their clean URL (/curriculum, not /curriculum.html).
const pageUrl = (f) => {
  const clean = '/' + f.replace(/\.html$/, '').replace(/(^|\/)index$/, '');
  return clean === '/' ? '/' : clean.replace(/\/$/, '');
};
const pages = files.filter((f) => f.endsWith('.html')).map((f) => ({ url: pageUrl(f), file: '/' + f }));
const assets = files.filter((f) => !f.endsWith('.html')).map((f) => '/' + f);

const template = readFileSync(new URL('./sw-template.js', import.meta.url), 'utf8');
const sw = template
  .replace('__VERSION__', version)
  .replace('__PAGES__', JSON.stringify(pages))
  .replace('__ASSETS__', JSON.stringify(assets));
writeFileSync(join(DIST, 'sw.js'), sw);

console.log(`sw.js: version ${version}, ${pages.length} pages, ${assets.length} assets precached`);
