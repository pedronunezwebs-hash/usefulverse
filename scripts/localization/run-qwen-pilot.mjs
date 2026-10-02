import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const inputPath = process.argv[2];
const modelPath = process.argv[3];
const outputPath = process.argv[4];

if (!inputPath || !modelPath || !outputPath) {
  throw new Error('Usage: node run-qwen-pilot.mjs <input.jsonl> <model.gguf> <output.jsonl>');
}

const executable = '/tmp/usefulverse-local-translation-20261001/llama.cpp/build/bin/llama-completion';
const locales = {
  it: 'Italian',
  zh_tw: 'Traditional Chinese as used in Taiwan',
  bg: 'Bulgarian',
  ca: 'Catalan',
  nl: 'Dutch',
  el: 'Greek',
  ms: 'Malay',
  pl: 'Polish',
  sv: 'Swedish',
  th: 'Thai',
  uk: 'Ukrainian',
  sw: 'Swahili',
};

const rows = readFileSync(inputPath, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
const selected = [];

function closest(candidates, targetLength) {
  return [...candidates].sort((a, b) => Math.abs(a.source.length - targetLength) - Math.abs(b.source.length - targetLength))[0];
}

for (const language of Object.keys(locales)) {
  const candidates = rows.filter((row) => row.language === language);
  const unprotected = candidates.filter((row) => row.protected.length === 0 && row.source.trim().length > 5);
  const protectedRows = candidates.filter((row) => row.protected.length > 0 && row.source.length < 180);
  const picks = [
    closest(unprotected.filter((row) => row.source.length >= 10 && row.source.length <= 45), 24),
    closest(unprotected.filter((row) => row.source.length > 45 && row.source.length <= 180), 110),
    closest(unprotected.filter((row) => row.source.length >= 300), 500),
    closest(protectedRows, 70),
  ].filter(Boolean);
  for (const row of new Map(picks.map((row) => [row.id, row])).values()) selected.push(row);
}

const output = [];
for (const row of selected) {
  let markerIndex = 0;
  const markers = [];
  const text = row.parts.map((part) => {
    if (part.type !== 'protected') return part.value;
    const token = `QZXKEEP${String(markerIndex).padStart(3, '0')}QXZ`;
    markers.push({ token, value: part.value });
    markerIndex += 1;
    return token;
  }).join('');

  const prompt = `<|im_start|>system\nTranslate the user's entire text faithfully into natural ${locales[row.language]}. It is for a clear, friendly browser utility website. Preserve all meaning, numbers, brand names, and QZXKEEP tokens exactly. Return only the translated text, with no heading, explanation, alternatives, or reasoning.<|im_end|>\n<|im_start|>user\n/no_think\n${text}<|im_end|>\n<|im_start|>assistant\n`;
  const result = spawnSync(executable, [
    '-m', modelPath,
    '-ngl', 'all',
    '-c', '2048',
    '-p', prompt,
    '--no-display-prompt',
    '-n', String(Math.max(100, Math.min(650, Math.ceil(text.length * 1.8)))),
    '--no-conversation',
    '--reasoning', 'off',
    '--temp', '0.1',
    '--seed', '42',
    '--simple-io',
  ], { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024, timeout: 180_000 });

  let translation = result.stdout ?? '';
  const thinkEnd = translation.lastIndexOf('</think>');
  if (thinkEnd >= 0) translation = translation.slice(thinkEnd + '</think>'.length);
  translation = translation
    .replace(/\[end of text\]/g, '')
    .replace(/<\|[^|]+\|>/g, '')
    .trim();

  let markerCheck = true;
  for (const marker of markers) {
    const occurrences = translation.split(marker.token).length - 1;
    if (occurrences !== 1) markerCheck = false;
    translation = translation.split(marker.token).join(marker.value);
  }

  output.push({
    language: row.language,
    languageName: locales[row.language],
    id: row.id,
    source: row.source,
    translation,
    markerCheck,
    exitCode: result.status,
    error: result.error?.message ?? null,
    stderrTail: (result.stderr ?? '').slice(-800),
  });
  process.stderr.write(`${row.language} ${row.id}: ${result.status === 0 ? 'ok' : 'FAILED'}; markers=${markerCheck}\n`);
}

writeFileSync(outputPath, `${output.map((row) => JSON.stringify(row)).join('\n')}\n`);
process.stderr.write(`Wrote ${output.length} pilot translations to ${outputPath}\n`);
