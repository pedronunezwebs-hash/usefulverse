import { mkdir, readFile, writeFile } from 'node:fs/promises';

const directory = process.env.USEFULVERSE_TRANSLATION_DIR ?? '/tmp/usefulverse-local-translation-20261001';
const parseLines = async (path) => (await readFile(path, 'utf8')).split(/\r?\n/u).filter(Boolean).map((line) => JSON.parse(line));
const [rows, intermediate] = await Promise.all([
  parseLines(`${directory}/madlad-input.jsonl`),
  readFile(`${directory}/madlad-intermediate.json`, 'utf8').then(JSON.parse),
]);
const rowById = new Map(rows.map((row) => [row.id, row]));
const retryIds = Object.keys(intermediate.fallbackPlans);
const retryRows = [];
const retryMeta = {};

for (const id of retryIds) {
  const row = rowById.get(id);
  if (!row) throw new Error(`No source row for marker retry ${id}`);
  const sentinels = row.protected.map(([, value], index) => [
    `QZXKEEP${String(index).padStart(3, '0')}QXZ`,
    value,
  ]);
  const parts = row.parts.map((part) => part.type === 'protected'
    ? sentinels[Number(/\d+/u.exec(part.marker)?.[0])][0]
    : part.value);
  retryRows.push({
    language: row.language,
    id: row.id,
    prompt: `<2${row.language === 'zh_tw' ? 'zh' : row.language}> ${parts.join('')}`,
  });
  retryMeta[id] = { language: row.language, sentinels };
}

const pilotRows = [];
for (const language of [...new Set(retryRows.map((row) => row.language))]) {
  const localized = retryRows
    .filter((row) => row.language === language)
    .sort((left, right) => left.prompt.length - right.prompt.length);
  const count = Math.min(8, localized.length);
  for (let index = 0; index < count; index += 1) {
    const position = count === 1 ? 0 : Math.round(index * (localized.length - 1) / (count - 1));
    pilotRows.push(localized[position]);
  }
}

await mkdir(directory, { recursive: true });
await writeFile(`${directory}/madlad-marker-retry-input.jsonl`, `${retryRows.map((row) => JSON.stringify(row)).join('\n')}\n`);
await writeFile(`${directory}/madlad-marker-retry-pilot-input.jsonl`, `${pilotRows.map((row) => JSON.stringify(row)).join('\n')}\n`);
await writeFile(`${directory}/madlad-marker-retry-meta.json`, `${JSON.stringify(retryMeta)}\n`);
console.log(`Prepared ${retryRows.length} full-string retries and a ${pilotRows.length}-row pilot (${new Set(pilotRows.map((row) => row.language)).size} locales).`);
