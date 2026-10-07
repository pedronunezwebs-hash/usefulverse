import assert from 'node:assert/strict';
import test from 'node:test';
import { assertGrowthLocaleCoverage } from './locale-contract.mjs';
import { growthPilotTools } from './catalog.mjs';
import englishGrowthCopy from './locales/en.mjs';

const tools = [{ id: 'one' }, { id: 'two' }];
const locales = [{ key: 'en' }, { key: 'es' }];
const sample = (name) => ({ name, title: `${name} free | UsefulVerse`, description: `${name} works in your browser.`, intro: `${name} intro`, howQuestion: 'How?', howAnswer: 'Use it.', privacyQuestion: 'Private?', privacyAnswer: 'Local.', copyLanguage: name, });

test('growth release gate demands separate copy for every tool and every published language', () => {
  assert.equal(assertGrowthLocaleCoverage(tools, locales, { en: { one: sample('en'), two: sample('en') }, es: { one: sample('es'), two: sample('es') } }), true);
  assert.throws(() => assertGrowthLocaleCoverage(tools, locales, { en: { one: sample('en') } }), /es: locale copy is missing/);
  assert.throws(() => assertGrowthLocaleCoverage(tools, locales, { en: { one: sample('en'), two: sample('en') }, es: { one: sample('es') } }), /es\/two: translation is missing/);
});

test('growth release gate enforces metadata limits and language-specific copy', () => {
  const overlong = { ...sample('en'), title: `${'x'.repeat(61)} | UsefulVerse` };
  assert.throws(() => assertGrowthLocaleCoverage([{ id: 'one' }], [{ key: 'en' }], { en: { one: overlong } }), /title is .*max 60/);
  assert.throws(() => assertGrowthLocaleCoverage([{ id: 'one' }], [{ key: 'en' }], { en: { one: { ...sample('es'), copyLanguage: 'es' } } }), /copy language does not match/);
});

test('the first real English pilot copy satisfies every field, message, placeholder and title budget', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.ok(Object.values(englishGrowthCopy).every((copy) => copy.title.length <= 60));
});
