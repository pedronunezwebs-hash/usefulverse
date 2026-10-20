import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

test('translation extraction preserves routes, review identity and filenames as data', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'usefulverse-extract-test-'));
  try {
    const source = { title: 'Download your result', relatedTools: ['image-upscaler'], localizationReviewers: ['Original reviewer'],
      localizationLastReviewedAt: '2026-10-15', fields: { outputName: 'result.svg', save: 'Save result' } };
    const module = join(directory, 'copy.mjs'), output = join(directory, 'source.json');
    await writeFile(module, `export const english = ${JSON.stringify({ sample: source })};\n`);
    execFileSync(process.execPath, ['scripts/localization/extract-tool-copy-units.mjs', module, 'english', 'sample', output]);
    const extracted = JSON.parse(await readFile(output, 'utf8'));
    assert.deepEqual(extracted.sourceCopy, source);
    assert.deepEqual(extracted.units.map(({ key }) => key).sort(), ['sample.copy.fields.save', 'sample.copy.title']);
    assert.equal(extracted.units[0].locales.length, 36);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
