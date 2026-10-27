import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { tools } from '../../src/catalog.mjs';
import { seo } from '../../src/seo.mjs';
import { runtimeMessages, runtimeTemplates, ui } from '../../src/locales.mjs';
import { pendingToolEnglishCopy } from '../../src/growth600/locales/pending-tools.en.mjs';
import growthEnglish from '../../src/growth600/locales/en.mjs';
import { marketTools } from '../../src/markets-no-ch/catalog.mjs';
import { english as marketEnglish } from '../../src/markets-no-ch/copy-en.mjs';
import { extractToolCopyUnits } from './extract-tool-copy-units.mjs';
import { createCandidateSourceDocuments } from './prepare-candidate-sources.mjs';

const sha = value => createHash('sha256').update(value).digest('hex');
const technical = /^(?:UsefulVerse|PDF|PNG|SVG|JPEG|JPG|WAV|MP3|JSON|CSV|XML|HTML|UTF-8|ASCII|cm|mm|kg|px|Hz|ms|KB|MB|GB)$/iu;
export function isProse(source) {
  return /\p{L}/u.test(source) && source.length > 1 && !technical.test(source) && !/^https?:\/\/\S+$/u.test(source) && !/^`[^`]*`$/u.test(source);
}

export async function createSources() {
  const documents = new Map();
  const add = (id, copy, coverage = 'centralized-copy') => {
    if (documents.has(id)) return;
    const document = extractToolCopyUnits(copy, id);
    document.coverage = coverage;
    document.units = document.units.filter(unit => isProse(unit.source)).map(unit => ({ ...unit, source_hash: sha(unit.source) }));
    if (!document.units.length) throw Error(`Missing English prose: ${id}`);
    documents.set(id, document);
  };
  for (const document of await createCandidateSourceDocuments()) add(document.toolId, document.sourceCopy);
  for (const tool of tools) add(tool.id, {
    title: tool.title, shortTitle: tool.shortTitle, description: tool.description,
    intro: tool.intro, body: tool.body, seo: seo[tool.id] ?? {},
  });
  const growthDirectory = new URL('../../src/growth600/locales/', import.meta.url);
  const growthCopies = { ...pendingToolEnglishCopy, ...growthEnglish };
  for (const file of (await readdir(growthDirectory)).filter(name => name.endsWith('.en.mjs'))) {
    const id = file.slice(0, -7);
    if (growthCopies[id]) continue;
    const module = await import(new URL(file, growthDirectory));
    const copies = Object.entries(module).filter(([name, value]) => /EnglishCopy$/u.test(name) && value && typeof value === 'object');
    if (copies.length === 1) growthCopies[id] = copies[0][1];
  }
  for (const [id, copy] of Object.entries(growthCopies)) {
    if (!id.startsWith('_') && /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(id)) add(id, copy);
  }
  const modes = new Set(marketTools.map(tool => tool.mode));
  const modeCopies = new Map(Object.entries(marketEnglish).filter(([key]) => modes.has(key)));
  const marketDirectory = new URL('../../src/markets-no-ch/', import.meta.url);
  for (const file of (await readdir(marketDirectory)).filter(name => name.endsWith('-copy-en.mjs'))) {
    const module = await import(new URL(file, marketDirectory));
    for (const [name, copy] of Object.entries(module)) {
      const mode = name.replace(/(?:EnglishCopy|English)$/u, '');
      if (modes.has(mode) && copy && typeof copy === 'object') modeCopies.set(mode, copy);
    }
  }
  add('market-shared', Object.fromEntries(Object.entries(marketEnglish).filter(([key]) => !modes.has(key))), 'shared-copy');
  for (const tool of marketTools) {
    const copy = modeCopies.get(tool.mode);
    add(tool.id, copy ?? { name: tool.name, title: tool.title, description: tool.description }, copy ? 'centralized-copy' : 'catalog-metadata-only');
  }
  const recovered = JSON.parse(await readFile(new URL('../../src/growth600/live-only-106.manifest.json', import.meta.url)));
  for (const tool of recovered.tools) add(tool.id, { name: tool.h1, title: tool.title, description: tool.description }, 'recovered-metadata-only');
  const phrases = new Set([...Object.keys(runtimeMessages.en ?? {}), ...Object.values(runtimeMessages.en ?? {}).filter(v => typeof v === 'string'), ...Object.keys(runtimeTemplates.es ?? {})]);
  add('site-shared', { ui: ui.en, runtime: Object.fromEntries([...phrases].filter(isProse).map(source => [sha(source).slice(0,24), source])) }, 'shared-copy');
  const extra = resolve('translation-sources');
  if (existsSync(extra)) for (const file of (await readdir(extra)).filter(name => name.endsWith('.json')).sort()) {
    const document = JSON.parse(await readFile(resolve(extra, file), 'utf8'));
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(document.toolId)) throw Error('Invalid source owner');
    // An improved English source deliberately replaces its previous extraction.
    documents.delete(document.toolId); add(document.toolId, document.sourceCopy, 'improved-source');
  }
  const rows = (await readFile(new URL('../../docs/quality/progress.csv', import.meta.url), 'utf8')).split('\n').slice(1).filter(Boolean);
  const expected = rows.map(line => line.split(',')[1]).filter(id => id !== 'fase-0');
  const sourceAliases = { 'iching-cast': 'i-ching-oracle' };
  const missing = expected.filter(id => !documents.has(sourceAliases[id] ?? id));
  if (expected.length !== 1000 || missing.length) throw Error(`Missing catalog English sources: ${missing.join(',')}`);
  const result = [...documents.values()].sort((a,b) => a.toolId.localeCompare(b.toolId));
  const units = result.flatMap(document => document.units);
  return {
    schemaVersion: 2, sourceAliases, sourceLocale: 'en', tools: expected.length, sourceUnits: units.length,
    destinationLocales: units[0].locales, units,
    sourceDigest: sha(JSON.stringify(units.map(({key,source_hash,context}) => [key,source_hash,context]))),
    documents: result.map(({ toolId, coverage, sourceCopy }) => ({ toolId, coverage, sourceCopy })),
    coverage: { catalogTools: expected.length, metadataOnly: result.filter(d => d.coverage.endsWith('metadata-only')).map(d => d.toolId),
      recoveredMetadataOnly: result.filter(d => d.coverage === 'recovered-metadata-only').map(d => d.toolId),
      note: 'Catalog and centralized English copy are connected. Literal UI in legacy JS still needs extraction while each tool is improved.' },
  };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const corpus = await createSources();
  await writeFile(process.argv[2], JSON.stringify(corpus));
  console.log(JSON.stringify({ tools: corpus.tools, sourceUnits: corpus.sourceUnits, metadataOnly: corpus.coverage.metadataOnly.length,
    memoryUnits: new Set(corpus.units.map(u => JSON.stringify([u.source_hash,u.context]))).size, sourceDigest: corpus.sourceDigest }));
}
