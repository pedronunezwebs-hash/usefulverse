import test from 'node:test';
import assert from 'node:assert/strict';
import {
  acrostic, braSize, carCosts, colorPalette, decisionTree, eventBudget,
  imageHistogram, moonEvents, orgChart, packingBox, persianDate,
  radarChart, riskMatrix, sankey, shiftSchedule, solarEvents, subscriptions,
  summarize, wordFrequency, writingPrompt,
} from './logic.mjs';

test('sunrise calculator is close to the Madrid summer-solstice reference and handles polar day', () => {
  const result = solarEvents({ date: '2026-06-21', latitude: 40.4168, longitude: -3.7038, timeZone: 'Europe/Madrid' });
  assert.match(result.events.sunrise, /^06:4\d/);
  assert.match(result.events.sunset, /^21:4\d|^21:5\d/);
  const polar = solarEvents({ date: '2026-06-21', latitude: 69.6492, longitude: 18.9553, timeZone: 'Europe/Oslo' });
  assert.equal(polar.events.sunrise, null);
  assert.equal(polar.events.sunset, null);
});

test('moonrise calculator is deterministic and validates coordinates/time zones', () => {
  const input = { date: '2026-10-15', latitude: 40.7, longitude: -74, timeZone: 'America/New_York' };
  assert.deepEqual(moonEvents(input), moonEvents(input));
  assert.throws(() => moonEvents({ ...input, timeZone: 'Mars/Olympus' }), RangeError);
});

test('Persian calendar conversion works both ways and rejects invalid leap-day input', () => {
  const persian = persianDate({ mode: 'to-persian', date: '2024-03-20' });
  assert.equal(persian.persian, '1403-01-01');
  assert.equal(persianDate({ mode: 'to-gregorian', persianYear: 1403, persianMonth: 1, persianDay: 1 }).gregorian, '2024-03-20');
  assert.throws(() => persianDate({ mode: 'to-gregorian', persianYear: 1402, persianMonth: 12, persianDay: 30 }), RangeError);
});

test('risk matrix scores, sorts neither nor hides duplicate risk names, and bounds ratings', () => {
  assert.deepEqual(riskMatrix({ rows: 'A | 3 | 4\nB | 1 | 2' }).map(({ score, level }) => [score, level]), [[12, 'Medium'], [2, 'Low']]);
  assert.throws(() => riskMatrix({ rows: 'A | 6 | 3' }), RangeError);
});

test('organization chart enforces one connected root and valid reporting lines', () => {
  assert.equal(orgChart({ rows: 'CEO |\nSales | CEO' }).reports[0].name, 'Sales');
  assert.throws(() => orgChart({ rows: 'A | B\nB | A' }), RangeError);
  assert.throws(() => orgChart({ rows: 'A |\nB |' }), RangeError);
});

test('Sankey input is bounded, non-negative and totals the entered flow', () => {
  assert.equal(sankey({ rows: 'Income | Rent | 25\nIncome | Savings | 75' }).total, 100);
  assert.throws(() => sankey({ rows: 'A | A | 2' }), RangeError);
  assert.throws(() => sankey({ rows: 'A | B | -1' }), RangeError);
});

test('event budget totals planned and actual amounts and gives signed variance', () => {
  assert.deepEqual(eventBudget({ rows: 'Venue | 100 | 90\nFood | 50 | 60' }), { entries: [{ category: 'Venue', planned: 100, actual: 90 }, { category: 'Food', planned: 50, actual: 60 }], planned: 150, actual: 150, variance: 0 });
  assert.throws(() => eventBudget({ rows: 'Venue | 10 |' }), RangeError);
});

test('decision tree keeps both explicit branches for every question', () => {
  const result = decisionTree({ rows: 'Fast? | Use A | Within budget?\nWithin budget? | Use A | Find another option' });
  assert.equal(result.paths.length, 3);
  assert.equal(result.root.no.question, 'Within budget?');
  assert.throws(() => decisionTree({ rows: 'Fast? | Use A |' }), RangeError);
  assert.throws(() => decisionTree({ rows: 'A? | A? | Stop' }), /cycle/u);
});

test('shift scheduler supports numeric weekday codes and rejects overlaps', () => {
  assert.equal(shiftSchedule({ rows: 'Alex | 1 | 09:00 | 13:30' }).totalHours, 4.5);
  assert.throws(() => shiftSchedule({ rows: 'Alex | 1 | 09:00 | 13:00\nAlex | Mon | 12:00 | 14:00' }), /overlapping/u);
});

test('subscription tracker normalizes all supported periods to annualized totals', () => {
  const result = subscriptions({ rows: 'Weekly | 12 | weekly\nMonthly | 10 | monthly\nQuarterly | 30 | quarterly\nYearly | 120 | yearly' });
  assert.equal(result.monthly, 12 * 52 / 12 + 10 + 30 / 3 + 120 / 12);
  assert.equal(result.yearly, result.monthly * 12);
  assert.throws(() => subscriptions({ rows: 'A | 5 | daily' }), RangeError);
});

test('radar chart accepts 3–12 labels and scores in range', () => {
  assert.equal(radarChart({ rows: 'A | 10\nB | 30\nC | 90' }).length, 3);
  assert.throws(() => radarChart({ rows: 'A | 1\nB | 2' }), RangeError);
});

test('packing calculator examines rotations and returns a safe grid count', () => {
  const result = packingBox({ boxLength: 6, boxWidth: 4, boxHeight: 2, itemLength: 2, itemWidth: 3, itemHeight: 2 });
  assert.equal(result.perBox, 4);
  assert.equal(result.testedOrientations, 6);
  assert.equal(packingBox({ boxLength: 1, boxWidth: 1, boxHeight: 1, itemLength: 2, itemWidth: 2, itemHeight: 2 }).fits, false);
});

test('car running cost uses fuel per 100 distance units, maintenance rate, and fixed costs', () => {
  const result = carCosts({ distance: 1000, fuelEfficiency: 8, fuelPrice: 2, maintenancePerDistance: 0.1, insurancePerYear: 300, taxPerYear: 100 });
  assert.equal(result.fuel, 160);
  assert.equal(result.maintenance, 100);
  assert.equal(result.annualTotal, 660);
});

test('bra size converts inches, validates measurement order and returns an estimate', () => {
  assert.match(braSize({ underbust: 30, bust: 36, unit: 'in', system: 'US' }).estimate, /^US /u);
  assert.throws(() => braSize({ underbust: 80, bust: 70 }), RangeError);
});

test('logo-maker input is constrained to safe enumerated appearance options', async () => {
  const { calculatePendingTool } = await import('./logic.mjs');
  const result = calculatePendingTool('logo-maker', { text: 'A'.repeat(60), shape: 'script', layout: 'grid' });
  assert.equal((await result).text.length, 40);
  assert.equal((await calculatePendingTool('logo-maker', {})).shape, 'round');
});

test('writing prompts are deterministic for a seed and stay inside selected genre', () => {
  assert.deepEqual(writingPrompt({ genre: 'fantasy', seed: 'test' }), writingPrompt({ genre: 'fantasy', seed: 'test' }));
  assert.equal(writingPrompt({ genre: 'unknown', seed: 'test' }).genre, 'any');
});

test('color palette samples opaque pixels and returns stable hex swatches', () => {
  const result = colorPalette({ pixels: { data: new Uint8ClampedArray([255, 0, 0, 255, 255, 0, 0, 255, 0, 0, 255, 255]), width: 3, height: 1 }, colors: 2 });
  assert.equal(result[0].hex, '#FF0000');
  assert.equal(result[0].count, 2);
});

test('text summarizer returns original sentences in source order and bounds input', () => {
  const text = 'Cats sleep often. Cats enjoy warm places. Dogs enjoy walks. Cats need fresh water.';
  const result = summarize({ text, maxSentences: 2 });
  const outputOrder = ['Cats sleep often.', 'Cats enjoy warm places.', 'Dogs enjoy walks.', 'Cats need fresh water.'].map((sentence) => result.summary.indexOf(sentence)).filter((index) => index >= 0);
  assert.deepEqual(outputOrder, [...outputOrder].sort((a,b) => a-b));
  assert.throws(() => summarize({ text: 'short' }), RangeError);
});

test('speed reading statistics use the entered word count and speed', async () => {
  const { calculatePendingTool } = await import('./logic.mjs');
  assert.deepEqual(await calculatePendingTool('speed-reading-app', { text: 'one two three', wpm: 60 }), { words: 3, minutes: 0.05 });
  await assert.rejects(calculatePendingTool('speed-reading-app', { text: 'one', wpm: 10 }), RangeError);
});

test('mockup generator validates required local file and exposes no remote operation', async () => {
  const { calculatePendingTool } = await import('./logic.mjs');
  assert.deepEqual(await calculatePendingTool('mockup-generator', { file: null, frame: 'phone' }), { ready: false, width: undefined, frame: 'phone' });
});

test('acrostic preserves Unicode code points and matches optional line starters', () => {
  assert.deepEqual(acrostic({ keyword: 'Árbol', words: 'Árido\nRío' }).map(({ suggestion }) => suggestion), ['Árido', 'Río', '', '', '']);
  assert.throws(() => acrostic({ keyword: '' }), RangeError);
});

test('word frequency counts Unicode words, ranks results and limits row count', () => {
  const result = wordFrequency({ text: 'café café niño tree', limit: 1 });
  assert.equal(result.totalWords, 4);
  assert.equal(result.entries[0].word, 'café');
  assert.equal(result.entries[0].count, 2);
});

test('image histogram validates dimensions, ignores transparent pixels and clamps bin 255', () => {
  const result = imageHistogram({ pixels: { data: new Uint8ClampedArray([255, 255, 255, 255, 1, 2, 3, 0]), width: 2, height: 1 } });
  assert.equal(result.total, 1);
  assert.equal(result.channels.red[15], 1);
  assert.throws(() => imageHistogram({ pixels: { data: [], width: 0, height: 1 } }), TypeError);
});
