import { writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createCandidateSourceDocuments, summarizeCandidateSources } from './prepare-candidate-sources.mjs';

// Extract real copy without changing the catalogs, source modules or published packs.
const documents = await createCandidateSourceDocuments();
const units = documents.flatMap(({ units }) => units).map(unit => ({
  ...unit, source_hash: createHash('sha256').update(unit.source).digest('hex'),
}));
await writeFile(process.argv[2], JSON.stringify({ ...summarizeCandidateSources(documents), units }));
console.log(JSON.stringify({ tools: documents.length, sourceUnits: units.length, destinations: units[0].locales.length }));
