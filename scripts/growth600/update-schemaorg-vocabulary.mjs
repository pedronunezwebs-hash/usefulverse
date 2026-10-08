import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const VERSION = '30.1';
const SOURCE = 'https://schema.org/version/' + VERSION + '/schemaorg-current-https.jsonld';
const OUTPUT = resolve(dirname(fileURLToPath(import.meta.url)), '../../src/growth600/data/schemaorg-v30.1.json');

const response = await fetch(SOURCE, { headers: { accept: 'application/ld+json' } });
if (!response.ok) throw new Error('Schema.org vocabulary download failed: HTTP ' + response.status + '.');
const source = await response.json();
const graph = source && source['@graph'];
if (!Array.isArray(graph)) throw new TypeError('Schema.org release did not contain an @graph.');
const terms = graph.filter((entry) => typeof entry?.['@id'] === 'string' && entry['@id'].startsWith('schema:'));
const types = terms.filter((entry) => entry['@type'] === 'rdfs:Class').map((entry) => entry['@id'].slice('schema:'.length)).sort();
const properties = terms.filter((entry) => entry['@type'] === 'rdf:Property').map((entry) => entry['@id'].slice('schema:'.length)).sort();
if (types.length < 800 || properties.length < 1_400 || !types.includes('Thing') || !properties.includes('name')) {
  throw new Error('Unexpected Schema.org vocabulary contents (' + types.length + ' types, ' + properties.length + ' properties).');
}
const compact = JSON.stringify({
  version: VERSION,
  source: SOURCE,
  attribution: 'Schema.org vocabulary, version 30.1. Copyright Schema.org. Licensed under Creative Commons Attribution-ShareAlike 3.0 (CC BY-SA 3.0). https://schema.org/docs/terms.html',
  license: 'CC BY-SA 3.0',
  types,
  properties,
});
await mkdir(dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, compact + '\n');
console.log('Updated ' + OUTPUT + ': ' + types.length + ' types, ' + properties.length + ' properties, ' + Buffer.byteLength(compact) + ' bytes.');
