import { readFile, writeFile } from 'node:fs/promises';

const directory = process.env.USEFULVERSE_TRANSLATION_DIR ?? '/tmp/usefulverse-local-translation-20261001';
const stem = process.env.USEFULVERSE_MADLAD_STEM ?? 'madlad';
const parseLines = async (path) => (await readFile(path, 'utf8')).split(/\r?\n/u).filter(Boolean).map((line) => JSON.parse(line));
const inputs = await parseLines(`${directory}/${stem}-input.jsonl`);
const outputs = await parseLines(`${directory}/${stem}-output.jsonl`);
const outputById = new Map(outputs.map((row) => [row.id, row]));
if (outputById.size !== inputs.length) throw new Error(`Expected ${inputs.length} first-pass outputs, found ${outputById.size}`);

const mainTranslations = {};
const fallbackPlans = {};
const fallbackPrompts = [];
function recoverOrderedMarkers(translation, protectedSpans) {
  const tags = [...translation.matchAll(/<([^<>]+)>/gu)];
  if (tags.length !== protectedSpans.length) return null;
  const indexes = tags.map(([, tag]) => /(?:ph|\p{L}+)(\d+)$/iu.exec(tag)?.[1]);
  if (indexes.some((index, position) => index !== String(position))) return null;
  let result = '';
  let cursor = 0;
  tags.forEach((match, position) => {
    result += translation.slice(cursor, match.index) + protectedSpans[position][1];
    cursor = match.index + match[0].length;
  });
  return result + translation.slice(cursor);
}

for (const row of inputs) {
  const output = outputById.get(row.id);
  if (typeof output?.translation !== 'string') throw new Error(`Missing first-pass translation ${row.id}`);
  const translation = output.translation;
  const markersIntact = row.protected.every(([marker]) => translation.split(marker).length - 1 === 1);
  if (markersIntact && output.complete !== false && translation.trim()) {
    mainTranslations[row.id] = row.protected.reduce((text, [marker, value]) => text.replace(marker, value), translation).trim();
    continue;
  }
  const recovered = recoverOrderedMarkers(translation, row.protected);
  if (!markersIntact && recovered !== null && output.complete !== false && recovered.trim()) {
    mainTranslations[row.id] = recovered.trim();
    continue;
  }

  const plan = [];
  for (const [partIndex, part] of row.parts.entries()) {
    if (part.type === 'protected') {
      plan.push({ type: 'literal', value: part.value });
    } else if (/\p{L}/u.test(part.value)) {
      const id = `${row.id}-part-${partIndex}`;
      plan.push({ type: 'translation', id });
      fallbackPrompts.push({
        language: row.language,
        id,
        sourceId: row.id,
        partIndex,
        prompt: `<2${row.language === 'zh_tw' ? 'zh' : row.language}> ${part.value}`,
      });
    } else {
      plan.push({ type: 'literal', value: part.value });
    }
  }
  fallbackPlans[row.id] = plan;
}

await writeFile(`${directory}/${stem}-fallback-input.jsonl`, fallbackPrompts.map((row) => JSON.stringify(row)).join('\n') + (fallbackPrompts.length ? '\n' : ''));
await writeFile(`${directory}/${stem}-intermediate.json`, JSON.stringify({ mainTranslations, fallbackPlans }, null, 2) + '\n');
console.log(`${Object.keys(mainTranslations).length} rows retained first pass; ${Object.keys(fallbackPlans).length} rows require protected-text fallback (${fallbackPrompts.length} text fragments).`);
