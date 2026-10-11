// Repair the one translated helper where Google Translate dropped a required operator symbol.
import { rename, writeFile } from 'node:fs/promises';
import copies from '../../src/growth600/locales/boolean-algebra-calculator-final.mjs';

const repaired = structuredClone(copies);
repaired.hi.fields.expressionHint = 'चर अक्षर A–F, अचर 0 और 1, तथा प्रतीक !, &, ^ और | का उपयोग करें। कोष्ठक अभिव्यक्ति के भागों को समूहित करते हैं।';
const output = new URL('../../src/growth600/locales/boolean-algebra-calculator-final.mjs', import.meta.url);
const temporary = new URL(`${output.href}.tmp`);
await writeFile(temporary, `// Static machine-translation drafts; no runtime translation service.\nexport default Object.freeze(${JSON.stringify(repaired)});\n`);
await rename(temporary, output);
console.log('Repaired the Hindi operator-symbol hint.');
