import assert from 'node:assert/strict';
import test from 'node:test';
import { createSources } from '../../scripts/localization/autopilot-source.mjs';
import { remainingToolsEnglish } from './remaining-tools-copy-en.mjs';
import { canastaCardGameEnglish } from './canasta-card-game-copy-en.mjs';
import { currencyConverterEnglish } from './currency-converter-copy-en.mjs';
import { farkleEnglish } from './farkle-copy-en.mjs';
import { halmaGameEnglish } from './halma-game-copy-en.mjs';
import { shutTheBoxEnglish } from './shut-the-box-copy-en.mjs';
import { skatCardGameEnglish } from './skat-card-game-copy-en.mjs';

// These fourteen owners previously received just three catalog metadata fields,
// even though their forms already had centralized English copy.
const expected = {
  'bubble-shooter': remainingToolsEnglish.bubbleShooter,
  'canasta-card-game': canastaCardGameEnglish,
  'currency-converter': currencyConverterEnglish,
  'farkle-dice-game': farkleEnglish,
  'halma-game': halmaGameEnglish,
  'local-spell-checker': remainingToolsEnglish.spellcheck,
  'microphone-level-meter': remainingToolsEnglish.microphone,
  'shut-the-box': shutTheBoxEnglish,
  'skat-card-game': skatCardGameEnglish,
  'switzerland-child-support-budget-calculator': remainingToolsEnglish.swissChildBudget,
  'switzerland-inheritance-gift-tax-calculator': remainingToolsEnglish.swissInheritance,
  'switzerland-property-gains-tax-calculator': remainingToolsEnglish.swissPropertyGain,
  'switzerland-tenancy-notice-planner': remainingToolsEnglish.swissTenancy,
  'word-hyphenation-tool': remainingToolsEnglish.hyphenation,
};

test('all fourteen market UI owners expose their actual nested English copy', async t => {
  const corpus = await createSources();
  for (const [toolId, copy] of Object.entries(expected)) {
    await t.test(toolId, () => {
      const document = corpus.documents.find(d => d.toolId === toolId);
      assert.equal(document?.coverage, 'centralized-copy', `${toolId} must not fall back to metadata`);
      assert.deepEqual(document.sourceCopy, copy, 'use the form source, including fields and runtime messages');
      const units = corpus.units.filter(u => u.key.startsWith(`${toolId}.`));
      assert.ok(units.length > 10, `${toolId}: expected real interface text`);
      assert.ok(units.some(u => u.key.startsWith(`${toolId}.copy.fields.`)), 'form labels must be translated');
      assert.ok(!corpus.coverage.metadataOnly.includes(toolId));
    });
  }
  assert.deepEqual(corpus.coverage.metadataOnly, corpus.coverage.recoveredMetadataOnly,
    'the 106 recovered pages still need UI extraction; do not claim they are covered');
});
