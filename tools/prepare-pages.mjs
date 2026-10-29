import { cp, readdir, readFile, writeFile } from 'node:fs/promises';
// GitHub Pages is a preview. The production sources remain indexable.
await cp('public_html', '.pages-site', { recursive: true });
for (const name of await readdir('.pages-site')) {
  if (!name.endsWith('.html')) continue;
  const path = `.pages-site/${name}`;
  const html = (await readFile(path, 'utf8')).replace(/<meta\b[^>]*name=["']robots["'][^>]*>/gi, '');
  await writeFile(path, html.replace('</head>', '<meta name="robots" content="noindex, follow">\n</head>'));
}
await writeFile('.pages-site/robots.txt', 'User-agent: *\nAllow: /\n');
