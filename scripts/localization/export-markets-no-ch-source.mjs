import { writeFile } from 'node:fs/promises';
import { english } from '../../src/markets-no-ch/copy-en.mjs';
import { marketTools } from '../../src/markets-no-ch/catalog.mjs';

function flatten(value, path = '', output = {}) {
  for (const [key, child] of Object.entries(value)) {
    const name = path ? `${path}.${key}` : key;
    if (typeof child === 'string') output[name] = child;
    else if (Array.isArray(child)) child.forEach((item, index) => flatten(item, `${name}.${index}`, output));
    else if (child && typeof child === 'object') flatten(child, name, output);
  }
  return output;
}

const modes = new Set(marketTools.map(({ mode }) => mode));
const common = Object.fromEntries(Object.entries(english).filter(([key]) => !modes.has(key)));
const sourceByTool = Object.fromEntries(marketTools.map(({ mode }) => [mode, flatten({ ...common, ...english[mode] })]));
const units = [...new Set(Object.values(sourceByTool).flatMap(Object.values))];
const payload = { units, sourceByTool, localeKeys: ['es', 'fr', 'pt', 'de', 'ja', 'ko', 'id', 'hi', 'ar', 'zh', 'bn', 'ru', 'ur', 'tr', 'vi', 'it', 'zh_tw', 'bg', 'ca', 'nl', 'el', 'ms', 'pl', 'sv', 'th', 'uk', 'sw', 'mr', 'te', 'ha', 'tl', 'ta', 'fa', 'am', 'gu', 'nb'] };
if (process.argv[2]) await writeFile(process.argv[2], JSON.stringify(payload));
else process.stdout.write(JSON.stringify(payload));
