import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { pendingToolEnglishCopy } from '../../src/growth600/locales/pending-tools.en.mjs';
import { extractToolCopyUnits } from './extract-tool-copy-units.mjs';

const hash = (value) => createHash('sha256').update(value).digest('hex');
export async function createCandidateSourceDocuments() {
  const { tools } = JSON.parse(await readFile(new URL('../../docs/planning/usefulverse-1000-2026-10-19/implementation-progress.json', import.meta.url), 'utf8'));
  const ids = tools.map(({ slug }) => slug).sort();
  if (ids.length !== 300 || new Set(ids).size !== 300) throw new Error('Expected exactly 300 unique candidate IDs');
  return ids.map((id) => extractToolCopyUnits(pendingToolEnglishCopy[id], id));
}

export function summarizeCandidateSources(documents) {
  const units = documents.flatMap(({ units }) => units);
  return {
    schemaVersion: 1, sourceLocale: 'en', destinationLocales: units[0].locales,
    status: 'source-extracted-not-approved', tools: documents.length, sourceUnits: units.length,
    uniqueSourceStrings: new Set(units.map(({ source }) => source)).size,
    memoryUnitsWithContext: new Set(units.map(({ source, context }) => JSON.stringify([source, context]))).size,
    sourceCharacters: units.reduce((total, { source }) => total + source.length, 0),
    sourceDigest: hash(JSON.stringify(units.map(({ key, source, context }) => [key, hash(source), context]))),
    packages: documents.map(({ toolId, units }) => ({ toolId, sourceUnits: units.length,
      sourceDigest: hash(JSON.stringify(units.map(({ key, source, context }) => [key, hash(source), context]))) })),
  };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  if (!process.argv[2]) throw new Error('Usage: node prepare-candidate-sources.mjs OUTPUT_DIRECTORY');
  const directory = resolve(process.argv[2]);
  await mkdir(directory, { recursive: true });
  const documents = await createCandidateSourceDocuments();
  for (const document of documents) await writeFile(resolve(directory, `${document.toolId}.json`), `${JSON.stringify(document)}\n`);
  const manifest = summarizeCandidateSources(documents);
  await writeFile(resolve(directory, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(JSON.stringify({ ...manifest, packages: undefined, directory }));
}
