/* ------------------------------------------------------------------
   Build the Artifact page out of index.html.

     node ordpatiens/tools/build-artifact.js out.html

   Takes everything between the ARTIFACT-START and ARTIFACT-END markers
   and drops the document scaffolding — the Artifact host supplies its
   own doctype, head and body, so the page must carry none of its own.
   index.html stays the single source; nothing generated lives in the
   repo.
------------------------------------------------------------------- */
"use strict";
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const a = src.indexOf('<!--ARTIFACT-START-->');
const b = src.indexOf('<!--ARTIFACT-END-->');
if (a < 0 || b < 0) throw new Error('index.html is missing its ARTIFACT markers');

const page = src.slice(a + '<!--ARTIFACT-START-->'.length, b)
  .replace(/^\s*<\/head>\s*$/m, '')
  .replace(/^\s*<body>\s*$/m, '')
  .replace(/^\s*<link rel="preconnect"[^>]*>\s*$/gm, '')
  .trim() + '\n';

for (const bad of ['<!doctype', '<html', '<head>', '</head>', '<body>', '</body>']){
  if (page.toLowerCase().includes(bad)) throw new Error('scaffolding left in the page: ' + bad);
}

const out = process.argv[2];
if (out){ fs.writeFileSync(out, page); console.error('wrote %s — %d bytes', out, Buffer.byteLength(page)); }
else process.stdout.write(page);
