import test from 'node:test';
import assert from 'node:assert/strict';
import { answerGeographyQuestion, continentGroup, flagEmoji, geographyContinents, localizedGeographyContinents, makeGeographyQuestion } from './geography-quiz.mjs';
import { geographyMapFeatures } from './geography-quiz-data.mjs';

const constantRandom = (value) => () => value;

test('country map uses unique stable codes and includes Norway and Switzerland', () => {
  const ids = geographyMapFeatures.map(({ id }) => id);
  assert.ok(geographyMapFeatures.length >= 240);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(geographyMapFeatures.some(({ iso2 }) => iso2 === 'NO'));
  assert.ok(geographyMapFeatures.some(({ iso2 }) => iso2 === 'CH'));
});

test('continent grouping gives both American continents a clear shared practice region', () => {
  assert.equal(continentGroup('North America'), 'Americas');
  assert.equal(continentGroup('South America'), 'Americas');
  assert.equal(continentGroup('Europe'), 'Europe');
  assert.equal(continentGroup('Seven seas (open ocean)'), null);
});

test('localized continent labels come from translated copy, never raw numeric region codes', () => {
  const labels = localizedGeographyContinents({ continentAfrica: 'África', continentAmericas: 'Américas', continentAsia: 'Asia', continentEurope: 'Europa', continentOceania: 'Oceanía' });
  assert.equal(labels.Africa, 'África');
  assert.equal(labels.Americas, 'Américas');
  assert.deepEqual(Object.keys(labels).sort(), geographyContinents.slice().sort());
  assert.ok(Object.values(labels).every((label) => !/^\d{3}$/u.test(label)));
});

test('country questions choose one target and three distinct, locally answerable options in scope', () => {
  const question = makeGeographyQuestion({ features: geographyMapFeatures, mode: 'country', scope: 'Europe', random: constantRandom(0.13) });
  assert.equal(question.scope, 'Europe');
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.ok(question.options.includes(question.target.id));
  assert.equal(continentGroup(question.target.continent), 'Europe');
  assert.equal(answerGeographyQuestion(question, question.target.id), true);
  assert.equal(answerGeographyQuestion(question, 'wrong'), false);
});

test('flag mode excludes Antarctica and continent mode has five global choices', () => {
  const flag = makeGeographyQuestion({ features: geographyMapFeatures, mode: 'flag', random: constantRandom(0.22) });
  assert.ok(flag.target.iso2 && flag.target.continent !== 'Antarctica');
  const region = makeGeographyQuestion({ features: geographyMapFeatures, mode: 'continent', random: constantRandom(0.6) });
  assert.deepEqual(region.options.slice().sort(), geographyContinents.slice().sort());
  assert.ok(answerGeographyQuestion(region, region.correctValue));
});

test('question generator validates unsupported modes, scopes, and random values', () => {
  assert.throws(() => makeGeographyQuestion({ features: geographyMapFeatures, mode: 'capitals' }), /Unknown geography quiz mode/u);
  assert.throws(() => makeGeographyQuestion({ features: geographyMapFeatures, scope: 'Norway' }), /Unknown geography scope/u);
  assert.throws(() => makeGeographyQuestion({ features: geographyMapFeatures, random: constantRandom(1) }), /Random source/u);
});

test('flag emojis use two-letter region codes and reject unsupported shapes', () => {
  assert.equal(flagEmoji('NO'), '🇳🇴');
  assert.equal(flagEmoji('CH'), '🇨🇭');
  assert.equal(flagEmoji('AQ'), '');
  assert.equal(flagEmoji('-9'), '');
});
