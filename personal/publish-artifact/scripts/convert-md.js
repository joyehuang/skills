#!/usr/bin/env node
/**
 * convert-md.js — Markdown → styled standalone HTML (Chinese-friendly)
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
const body = marked.parse(md, { gfm: true, breaks: false });

const html = `<!DOCTYPE html>
<html lang="zh"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title.replace(/</g, '&lt;')}</title>
<style>
:root{color-scheme:light dark}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif;max-width:900px;margin:0 auto;padding:24px 20px 80px;line-height:1.7;font-size:15px}
h1{border-bottom:2px solid #8884;padding-bottom:10px}
h2{margin-top:2em;border-bottom:1px solid #8884;padding-bottom:6px}
h3{margin-top:1.5em}
code{background:#8882;padding:2px 5px;border-radius:4px;font-size:.9em}
pre{background:#1e1e1e;color:#e6e6e6;padding:14px;border-radius:8px;overflow-x:auto}
pre code{background:none;padding:0}
table{border-collapse:collapse;width:100%;margin:1em 0;font-size:.92em}
th,td{border:1px solid #8885;padding:7px 10px;text-align:left;vertical-align:top}
th{background:#8882}
blockquote{border-left:4px solid #8885;margin:1em 0;padding:4px 14px;color:#888}
a{color:#3b82f6}
img{max-width:100%}
hr{border:none;border-top:1px solid #8884}
</style></head><body>
${body}
</body></html>`;

fs.writeFileSync(out, html);
console.log(out);
