#!/usr/bin/env node
/**
 * convert-md.js — Markdown → styled standalone HTML (mobile-first, Chinese-friendly)
 * Usage: node convert-md.js <input.md> <output.html> [title]
 */
const fs = require('fs');
const path = require('path');
const { marked } = require(path.join(__dirname, 'node_modules', 'marked'));

const src = process.argv[2];
const out = process.argv[3];
const title = process.argv[4] || path.basename(src, path.extname(src));

if (!src || !out) {
  console.error('usage: convert-md.js <input.md> <output.html> [title]');
  process.exit(2);
}

const md = fs.readFileSync(src, 'utf8');

// Wrap tables in a scrollable container so wide tables don't crush on mobile
const renderer = new marked.Renderer();
const origTable = renderer.table.bind(renderer);
renderer.table = (header, body) =>
  `<div class="table-wrap">${origTable(header, body)}</div>`;

const body = marked.parse(md, { gfm: true, breaks: false, renderer });

const html = `<!DOCTYPE html>
<html lang="zh"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title.replace(/</g, '&lt;')}</title>
<style>
:root{color-scheme:light dark}
*{box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif;max-width:900px;margin:0 auto;padding:24px 20px calc(80px + env(safe-area-inset-bottom));line-height:1.7;font-size:16px;word-wrap:break-word;overflow-wrap:break-word}
h1{border-bottom:2px solid #8884;padding-bottom:10px;font-size:1.5em;line-height:1.3}
h2{margin-top:2em;border-bottom:1px solid #8884;padding-bottom:6px;font-size:1.25em;line-height:1.3}
h3{margin-top:1.5em;font-size:1.1em;line-height:1.3}
h1,h2,h3,h4{overflow-wrap:break-word}
code{background:#8882;padding:2px 5px;border-radius:4px;font-size:.88em;overflow-wrap:break-word}
pre{background:#1e1e1e;color:#e6e6e6;padding:14px;border-radius:8px;overflow-x:auto;-webkit-overflow-scrolling:touch;max-width:100%}
pre code{background:none;padding:0;font-size:.9em;white-space:pre;word-break:normal;overflow-wrap:normal}
/* tables: scrollable wrapper, never squished */
.table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;max-width:100%;margin:1em 0;border-radius:6px}
table{border-collapse:collapse;width:100%;margin:0;font-size:.92em;min-width:0}
th,td{border:1px solid #8885;padding:7px 10px;text-align:left;vertical-align:top;overflow-wrap:break-word}
th{background:#8882;position:sticky;top:0}
blockquote{border-left:4px solid #8885;margin:1em 0;padding:4px 14px;color:#888}
a{color:#3b82f6;overflow-wrap:break-word}
img{max-width:100%;height:auto}
hr{border:none;border-top:1px solid #8884}
ul,ol{padding-left:1.4em}
/* mobile */
@media (max-width:640px){
  body{padding:16px 14px calc(60px + env(safe-area-inset-bottom));font-size:16px;line-height:1.75}
  h1{font-size:1.35em}
  h2{font-size:1.15em}
  pre{padding:12px;font-size:.85em}
  th,td{padding:6px 8px;font-size:.88em}
  .table-wrap{margin:.8em 0}
  code{font-size:.85em}
}
</style></head><body>
${body}
</body></html>`;

fs.writeFileSync(out, html);
console.log(out);
