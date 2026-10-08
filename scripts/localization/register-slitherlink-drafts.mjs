// Install the translated Slitherlink extension in the canonical English locale source;
// the other 35 static locale modules materialize and merge it automatically.
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const path = resolve(root, 'src/growth600/locales/en.mjs');
let source = await readFile(path, 'utf8');
if (source.includes("registerGrowthLocaleExtension(source, 'slitherlink'")) {
  console.log('Slitherlink is already registered in the canonical locale source.');
} else {
  const importAnchor = "import workOrderCopies from './work-order-generator.mjs';";
  const exportAnchor = 'export default Object.freeze(source);';
  if (!source.includes(importAnchor) || !source.includes(exportAnchor)) throw new Error('Unexpected canonical static locale format.');
  source = source.replace(importAnchor, `${importAnchor}\nimport slitherlinkCopies from './slitherlink.mjs';\nimport { slitherlinkEnglishCopy } from './slitherlink.en.mjs';`);
  source = source.replace(exportAnchor, `registerGrowthLocaleExtension(source, 'slitherlink', { ...slitherlinkCopies, en: slitherlinkEnglishCopy }, 'nurikabe');\n\n${exportAnchor}`);
  await writeFile(path, source);
  console.log('Registered Slitherlink copy in the canonical locale source for all materialized languages.');
}
