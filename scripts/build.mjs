import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools, categories } from '../src/catalog.mjs';
import { renderHome, renderToolPage } from '../src/template.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, 'assets'), { recursive: true });
await cp(join(root, 'src', 'styles.css'), join(dist, 'assets', 'styles.css'));
await cp(join(root, 'src', 'app.js'), join(dist, 'assets', 'app.js'));
await cp(join(root, 'public', 'favicon.svg'), join(dist, 'favicon.svg'));
await cp(join(root, 'public', '_headers'), join(dist, '_headers'));
await cp(join(root, 'public', 'BingSiteAuth.xml'), join(dist, 'BingSiteAuth.xml'));
await cp(join(root, 'public', 'yandex_f441658073fe7135.html'), join(dist, 'yandex_f441658073fe7135.html'));
const indexNowKeyFile = '4fe0d351af80cfb3bc08a274c1875a4dc73650fd479d11fe4a414e82b5f41e98.txt';
await cp(join(root, 'public', indexNowKeyFile), join(dist, indexNowKeyFile));

const assetVersion = createHash('sha256')
  .update(await readFile(join(dist, 'assets', 'styles.css')))
  .update(await readFile(join(dist, 'assets', 'app.js')))
  .digest('hex')
  .slice(0, 12);

await writeFile(join(dist, 'index.html'), renderHome(tools, categories, assetVersion));
for (const tool of tools) {
  const directory = join(dist, 'tools', tool.id);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, 'index.html'), renderToolPage(tool, assetVersion));
}

const urls = ['', ...tools.map((tool) => `tools/${tool.id}/`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>https://usefulverse.com/${url}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(join(dist, 'sitemap.xml'), sitemap);
await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: https://usefulverse.com/sitemap.xml\n`);
await writeFile(join(dist, 'llms.txt'), `# UsefulVerse\n\n> Fast, private browser tools for text, data, SEO and everyday tasks.\n\nUsefulVerse is a static website of small online tools. Browser-first tools process user input locally and do not require an account or upload.\n\n## Tools\n\n${tools.map((tool) => `- [${tool.title}](https://usefulverse.com/tools/${tool.id}/): ${tool.description}`).join('\n')}\n\n## Site\n\n- [Home](https://usefulverse.com/)\n- [Sitemap](https://usefulverse.com/sitemap.xml)\n`);
console.log(`Built ${urls.length} pages in dist/`);
