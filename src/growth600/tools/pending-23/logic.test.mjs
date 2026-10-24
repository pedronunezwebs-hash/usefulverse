import test from 'node:test';
import assert from 'node:assert/strict';
import {
  acrostic, braSize, carCosts, colorPalette, decisionTree, eventBudget,
  imageHistogram, moonEvents, orgChart, packingBox, persianDate,
  buildStaticWebsite,
  calculatePendingTool,
  calculateIndiaGratuity,
  wouldYouRatherVote,
  basketballShot,
  pickCharadesPrompt,
  radarChart, riskMatrix, sankey, shiftSchedule, solarEvents, subscriptions,
  summarize, wordFrequency, writingPrompt,
  qiblaDirection, geographicDistance, gamepadSnapshot, scoreBigFive, estimateIndiaIncomeTax, neverHaveIEverVote, estimateBrazilTermination, createColorDifferenceRound,
} from './logic.mjs';
import { getColoringTemplate, coloringTemplateIds, isColoringColor } from '../coloring-studio/logic.mjs';
import { newPenaltyShootout, playPenaltyTurn } from './penalty.mjs';
import { compareTeenPattiHands, dealTeenPatti, rankTeenPattiHand, resolveTeenPattiShowdown } from './teen-patti.mjs';

test('Big Five questionnaire returns raw 10-item scores and reverses negative keys', () => {
  const neutral = Object.fromEntries(Array.from({ length: 50 }, (_, index) => [`q${String(index + 1).padStart(2, '0')}`, 3]));
  const baseline = scoreBigFive(neutral);
  assert.deepEqual(Object.values(baseline), [3, 30, 3, 30, 3, 30, 3, 30, 3, 30]);
  assert.deepEqual(scoreBigFive({ ...neutral, q01: 4 }).extraversionTotal, 31);
  assert.deepEqual(scoreBigFive({ ...neutral, q02: 4 }).agreeablenessTotal, 29);
  assert.throws(() => scoreBigFive({ ...neutral, q50: 6 }), RangeError);
  const missing = { ...neutral }; delete missing.q17;
  assert.throws(() => scoreBigFive(missing), RangeError);
});

test('penalty shootout alternates roles, ends a clinched match and validates direction', () => {
  let game = newPenaltyShootout();
  game = playPenaltyTurn(game, 'left', () => 0.5);
  assert.equal(game.playerGoals, 1);
  assert.equal(game.playerShots, 1);
  game = playPenaltyTurn(game, 'right', () => 0);
  assert.equal(game.cpuGoals, 1);
  assert.equal(game.cpuShots, 1);
  for (let index = 0; index < 4; index += 1) {
    game = playPenaltyTurn(game, 'left', () => 0.5);
    game = playPenaltyTurn(game, 'right', () => 0.5);
  }
  assert.equal(game.playerGoals, 5);
  assert.equal(game.cpuGoals, 5);
  assert.equal(game.complete, false);
  game = playPenaltyTurn(game, 'left', () => 0.5);
  game = playPenaltyTurn(game, 'left', () => 0);
  assert.equal(game.complete, true);
  assert.equal(game.winner, 'player');
  assert.equal(game.playerShots, 6);
  assert.throws(() => playPenaltyTurn(newPenaltyShootout(), 'top', () => 0.5), RangeError);
});

test('Teen Patti deal is unique and its stated sequence/category order is consistent', () => {
  const deal = dealTeenPatti(() => 0.5);
  const cards = deal.hands.flat();
  assert.equal(cards.length, 9);
  assert.equal(new Set(cards.map(({ rank, suit }) => `${rank}-${suit}`)).size, 9);
  assert.equal(deal.deckRemaining, 43);
  assert.throws(() => dealTeenPatti(() => 1), RangeError);

  const hand = (cards) => cards.map(([rank, suit]) => ({ rank, suit }));
  const trail = hand([['A','clubs'],['A','diamonds'],['A','hearts']]);
  const akq = hand([['A','spades'],['K','spades'],['Q','spades']]);
  const a23 = hand([['A','hearts'],['2','hearts'],['3','hearts']]);
  const kqj = hand([['K','clubs'],['Q','diamonds'],['J','hearts']]);
  const pairKings = hand([['K','clubs'],['K','diamonds'],['2','hearts']]);
  assert.equal(rankTeenPattiHand(trail).category, 'trail');
  assert.equal(compareTeenPattiHands(trail, akq), 1);
  assert.equal(compareTeenPattiHands(akq, a23), 1);
  assert.equal(compareTeenPattiHands(a23, kqj), 1);
  assert.equal(compareTeenPattiHands(akq, pairKings), 1);
  assert.throws(() => rankTeenPattiHand(hand([['A','clubs'],['A','clubs'],['A','clubs']])), RangeError);
});

test('Teen Patti fold does not reveal opponent cards and showdown resolves equal winners', () => {
  const { hands } = dealTeenPatti(() => 0.31);
  const folded = resolveTeenPattiShowdown(hands, 'fold');
  assert.deepEqual(folded.opponentHands, []);
  assert.deepEqual(folded.rankings, []);
  const shown = resolveTeenPattiShowdown(hands, 'showdown');
  assert.equal(shown.rankings.length, 3);
  assert.ok(shown.winners.length >= 1);
  assert.ok(['win', 'loss', 'tie'].includes(shown.outcome));
  assert.throws(() => resolveTeenPattiShowdown(hands, 'invalid'), RangeError);
});

test('India TY 2026–27 tax slabs, resident rebate, marginal relief and cess match the dated scope', () => {
  assert.equal(estimateIndiaIncomeTax({ taxableIncome: 0 }).estimatedTax, 0);
  assert.equal(estimateIndiaIncomeTax({ taxableIncome: 400_000 }).estimatedTax, 0);
  assert.equal(estimateIndiaIncomeTax({ taxableIncome: 400_001 }).baseTax, 0.05);
  const residentAtRebateLimit = estimateIndiaIncomeTax({ taxableIncome: 1_200_000 });
  assert.equal(residentAtRebateLimit.baseTax, 60_000);
  assert.equal(residentAtRebateLimit.rebate, 60_000);
  assert.equal(residentAtRebateLimit.estimatedTax, 0);
  const nonResident = estimateIndiaIncomeTax({ taxableIncome: 1_200_000, residency: 'non-resident' });
  assert.equal(nonResident.rebate, 0);
  assert.equal(nonResident.estimatedTax, 62_400);
  const marginalRelief = estimateIndiaIncomeTax({ taxableIncome: 1_200_001 });
  assert.equal(marginalRelief.taxAfterRebate, 1);
  assert.equal(marginalRelief.estimatedTax, 1.04);
  assert.equal(estimateIndiaIncomeTax({ taxableIncome: 5_000_000 }).estimatedTax, 1_123_200);
  assert.throws(() => estimateIndiaIncomeTax({ taxableIncome: 5_000_001 }), RangeError);
  assert.throws(() => estimateIndiaIncomeTax({ taxableIncome: 100, residency: 'unknown' }), RangeError);
});

test('India gratuity estimate applies service thresholds, rounding and the notified cap', () => {
  assert.equal(calculateIndiaGratuity({ monthlyWages: 26_000, years: 4, extraMonths: 6 }).eligible, false);
  const rounded = calculateIndiaGratuity({ monthlyWages: 26_000, years: 4, extraMonths: 7 });
  assert.equal(rounded.eligible, true);
  assert.equal(rounded.completedYears, 5);
  assert.equal(rounded.estimate, 75_000);
  assert.equal(calculateIndiaGratuity({ monthlyWages: 26_000, years: 0, employmentType: 'fixed-term' }).eligible, false);
  assert.equal(calculateIndiaGratuity({ monthlyWages: 26_000, years: 1, employmentType: 'fixed-term' }).eligible, true);
  assert.equal(calculateIndiaGratuity({ monthlyWages: 1_000_000, years: 10 }).capApplied, true);
  assert.equal(calculateIndiaGratuity({ monthlyWages: 26_000, years: 0, reason: 'death' }).eligible, true);
});

test('India gratuity rule snapshot stops before its effective date and when review is overdue', () => {
  const base = { monthlyWages: 26_000, years: 5 };
  assert.throws(() => calculateIndiaGratuity({ ...base, asOf: '2025-11-20' }), (error) => error.code === 'rules-not-effective');
  assert.equal(calculateIndiaGratuity({ ...base, asOf: '2026-11-19' }).eligible, true);
  assert.throws(() => calculateIndiaGratuity({ ...base, asOf: '2026-11-20' }), (error) => error.code === 'rules-expired');
  assert.throws(() => calculateIndiaGratuity({ ...base, asOf: '2026-02-30' }), RangeError);
});

test('Brazil termination estimate separates FGTS and applies dated notice and agreement rates', () => {
  const mutual = estimateBrazilTermination({
    monthlySalary: 3000, workedDays: 15, serviceYears: 10, terminationType: 'mutual-agreement',
    thirteenthMonths: 6, vacationMonths: 6, fgtsBase: 10_000, asOf: '2026-10-19',
  });
  assert.equal(mutual.noticeDays, 57);
  assert.equal(mutual.noticePay, 2850);
  assert.equal(mutual.salaryBalance, 1500);
  assert.equal(mutual.thirteenthSalary, 1500);
  assert.equal(mutual.proportionalVacation, 2000);
  assert.equal(mutual.fgtsPenalty, 2000);
  assert.equal(mutual.cashBeforeDeductions, 7850);
  assert.equal(mutual.totalIncludingFgtsPenalty, 9850);

  const dismissal = estimateBrazilTermination({ monthlySalary: 3000, workedDays: 30, serviceYears: 30, terminationType: 'employer-no-cause', thirteenthMonths: 0, vacationMonths: 0, fgtsBase: 10_000 });
  assert.equal(dismissal.noticeDays, 90);
  assert.equal(dismissal.noticePay, 9000);
  assert.equal(dismissal.fgtsPenalty, 4000);
  const resignation = estimateBrazilTermination({ monthlySalary: 3000, workedDays: 30, serviceYears: 1, terminationType: 'resignation', thirteenthMonths: 0, vacationMonths: 0, fgtsBase: 10_000 });
  assert.equal(resignation.noticePay, 0);
  assert.equal(resignation.fgtsPenalty, 0);
});

test('Brazil termination estimate rejects invalid dates and stops after its review deadline', () => {
  const base = { monthlySalary: 3000, workedDays: 30, serviceYears: 1, terminationType: 'employer-no-cause', thirteenthMonths: 0, vacationMonths: 0, fgtsBase: 10_000 };
  assert.throws(() => estimateBrazilTermination({ ...base, asOf: '2026-02-30' }), RangeError);
  assert.throws(() => estimateBrazilTermination({ ...base, asOf: '2017-11-10' }), (error) => error.code === 'rules-not-effective');
  assert.throws(() => estimateBrazilTermination({ ...base, asOf: '2026-11-20' }), (error) => error.code === 'rules-expired');
});

test('color vision exercise has exactly one matching option and deterministic test randomness', () => {
  for (const difficulty of ['clear', 'subtle']) {
    const round = createColorDifferenceRound({ difficulty, random: () => 0 });
    assert.equal(round.options.length, 4);
    assert.equal(new Set(round.options).size, 4);
    assert.equal(round.options.filter((option) => option === round.target).length, 1);
    assert.equal(round.options[round.answerIndex], round.target);
    assert.deepEqual(createColorDifferenceRound({ difficulty, random: () => 0 }), round);
  }
  assert.throws(() => createColorDifferenceRound({ difficulty: 'medical' }), RangeError);
  assert.throws(() => createColorDifferenceRound({ random: () => 1 }), RangeError);
  assert.throws(() => createColorDifferenceRound({ random: () => Number.NaN }), RangeError);
});

test('India TY 2026–27 rules are disabled before their effective date and after their review due date', () => {
  assert.throws(() => estimateIndiaIncomeTax({ taxableIncome: 100, asOf: '2026-03-31' }), (error) => error.code === 'rules-not-effective');
  assert.equal(estimateIndiaIncomeTax({ taxableIncome: 100, asOf: '2026-11-19' }).estimatedTax, 0);
  assert.throws(() => estimateIndiaIncomeTax({ taxableIncome: 100, asOf: '2026-11-20' }), (error) => error.code === 'rules-expired');
  assert.throws(() => estimateIndiaIncomeTax({ taxableIncome: 100, asOf: '2026-02-30' }), RangeError);
});

test('Never Have I Ever vote validates a printable shared prompt, group size and one answer', () => {
  assert.deepEqual(neverHaveIEverVote({ prompt: 'I have traveled by train.', participants: '4', answer: 'yes' }), { prompt: 'I have traveled by train.', participants: 4, answer: 'yes' });
  assert.throws(() => neverHaveIEverVote({ prompt: '   ', participants: 4, answer: 'yes' }), RangeError);
  assert.throws(() => neverHaveIEverVote({ prompt: `x${'a'.repeat(240)}`, participants: 4, answer: 'yes' }), RangeError);
  assert.throws(() => neverHaveIEverVote({ prompt: 'Good\nline', participants: 4, answer: 'no' }), RangeError);
  assert.throws(() => neverHaveIEverVote({ prompt: 'Valid', participants: 1, answer: 'yes' }), RangeError);
  assert.throws(() => neverHaveIEverVote({ prompt: 'Valid', participants: 3.5, answer: 'yes' }), RangeError);
  assert.throws(() => neverHaveIEverVote({ prompt: 'Valid', participants: 3, answer: 'maybe' }), RangeError);
});

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

test('fancy text maps supported Latin letters and digits while preserving unsupported code points', async () => {
  const { generateFancyText, fancyTextStyleIds } = await import('./fancy-text.mjs');
  const rows = generateFancyText('Abc 123 café 日本 🙂');
  assert.deepEqual(rows.map(({ id }) => id), fancyTextStyleIds);
  assert.equal(rows.find(({ id }) => id === 'bold').value, '𝐀𝐛𝐜 𝟏𝟐𝟑 𝐜𝐚𝐟é 日本 🙂');
  assert.equal(rows.find(({ id }) => id === 'script').value, '𝒜𝒷𝒸 123 𝒸𝒶𝒻é 日本 🙂');
  assert.equal(rows.find(({ id }) => id === 'circled').value, 'Ⓐⓑⓒ ①②③ ⓒⓐⓕé 日本 🙂');
  assert.throws(() => generateFancyText('   '), RangeError);
  assert.throws(() => generateFancyText('x'.repeat(3001)), RangeError);
});

test('qibla direction uses the shortest great-circle bearing from true north', () => {
  const madrid = qiblaDirection({ latitude: 40.4168, longitude: -3.7038 });
  assert.ok(Math.abs(madrid.bearingDegrees - 104) < 1);
  assert.ok(Math.abs(madrid.distanceKm - 4598) < 2);
  const atKaaba = qiblaDirection({ latitude: 21.4224779, longitude: 39.8251832 });
  assert.equal(atKaaba.bearingDegrees, null);
  assert.ok(atKaaba.distanceKm < 0.001);
  const atAntipode = qiblaDirection({ latitude: -21.4224779, longitude: -140.1748168 });
  assert.equal(atAntipode.bearingDegrees, null);
  assert.ok(Math.abs(atAntipode.distanceKm - Math.PI * 6371.0088) < 0.001);
  assert.throws(() => qiblaDirection({ latitude: 91, longitude: 0 }), RangeError);
  assert.throws(() => qiblaDirection({ latitude: 0, longitude: 181 }), RangeError);
});

test('gamepad snapshot bounds device values and applies the selected dead zone', () => {
  const result = gamepadSnapshot([
    { connected: false, index: 0, axes: [1], buttons: [{ pressed: true, value: 1 }] },
    { connected: true, index: 1, id: 'Test pad', mapping: 'standard', axes: [0.1, -0.2, 2], buttons: [{ pressed: true, value: 1 }, { pressed: false, value: 0.35 }] },
  ], 0.15);
  assert.equal(result.length, 1);
  assert.deepEqual(result[0].axes, [0, -0.2, 1]);
  assert.deepEqual(result[0].buttons, [{ pressed: true, value: 1 }, { pressed: false, value: 0.35 }]);
  assert.equal(result[0].id, 'Test pad');
  assert.throws(() => gamepadSnapshot([], 0.51), RangeError);
});

test('gamepad snapshot caps the number of devices and exposed input controls', () => {
  const devices = Array.from({ length: 10 }, (_, index) => ({
    connected: true, index, id: `Pad ${index}`,
    axes: Array(20).fill(0.75), buttons: Array.from({ length: 70 }, () => ({ pressed: true, value: 1.2 })),
  }));
  const result = gamepadSnapshot(devices);
  assert.equal(result.length, 8);
  assert.equal(result[0].buttons.length, 64);
  assert.equal(result[0].axes.length, 16);
  assert.ok(result[0].buttons.every(({ value }) => value === 1));
  assert.ok(result.every(Object.isFrozen));
});

test('geographic distance matches the Madrid to Paris great-circle reference and unit conversions', () => {
  const km = geographicDistance({ fromLatitude: 40.4168, fromLongitude: -3.7038, toLatitude: 48.8566, toLongitude: 2.3522 });
  const miles = geographicDistance({ fromLatitude: 40.4168, fromLongitude: -3.7038, toLatitude: 48.8566, toLongitude: 2.3522, unit: 'mi' });
  const nautical = geographicDistance({ fromLatitude: 40.4168, fromLongitude: -3.7038, toLatitude: 48.8566, toLongitude: 2.3522, unit: 'nmi' });
  assert.ok(Math.abs(km.distance - 1053) < 2);
  assert.ok(Math.abs(km.initialBearing - 25) < 1);
  assert.ok(Math.abs(miles.distance * 1.609344 - km.distance) < 1e-9);
  assert.ok(Math.abs(nautical.distance * 1.852 - km.distance) < 1e-9);
});

test('geographic distance sums waypoints, ignores duplicate segments and handles undefined bearings', () => {
  const direct = geographicDistance({ fromLatitude: 0, fromLongitude: 0, toLatitude: 0, toLongitude: 2 });
  const via = geographicDistance({ fromLatitude: 0, fromLongitude: 0, toLatitude: 0, toLongitude: 2, waypoints: [{ lat: 0, lon: 0 }, { lat: 0, lon: 1 }] });
  const same = geographicDistance({ fromLatitude: 5, fromLongitude: 6, toLatitude: 5, toLongitude: 6 });
  const antipodal = geographicDistance({ fromLatitude: 0, fromLongitude: 0, toLatitude: 0, toLongitude: 180 });
  assert.ok(Math.abs(via.distance - direct.distance) < 1e-9);
  assert.equal(via.segmentCount, 3);
  assert.equal(same.distance, 0);
  assert.equal(same.initialBearing, null);
  assert.ok(Math.abs(antipodal.distance - Math.PI * 6371.0088) < 1e-8);
  assert.equal(antipodal.initialBearing, null);
});

test('geographic distance validates coordinates, waypoint bounds, units and route size', () => {
  const base = { fromLatitude: 0, fromLongitude: 0, toLatitude: 1, toLongitude: 1 };
  assert.throws(() => geographicDistance({ ...base, fromLatitude: 90.1 }), RangeError);
  assert.throws(() => geographicDistance({ ...base, toLongitude: -180.1 }), RangeError);
  assert.throws(() => geographicDistance({ ...base, unit: 'ly' }), RangeError);
  assert.throws(() => geographicDistance({ ...base, waypoints: Array(101).fill({ lat: 0, lon: 0 }) }), RangeError);
});

test('static website builder normalizes safe inputs and preserves explicitly empty secondary sections', () => {
  const site = buildStaticWebsite({ siteTitle: '  My site ', siteLanguage: 'ar', direction: 'rtl', headline: 'Hello', intro: 'Intro', ctaLabel: 'Visit', ctaUrl: 'https://example.com/path', accentColor: '#12abEF', sectionOneTitle: 'About', sectionOneBody: 'Text', sectionTwoTitle: '', sectionTwoBody: '' });
  assert.equal(site.siteTitle, 'My site');
  assert.equal(site.siteLanguage, 'ar');
  assert.equal(site.direction, 'rtl');
  assert.equal(site.accentColor, '#12ABEF');
  assert.equal(site.sections.length, 1);
  assert.equal(site.ctaUrl, 'https://example.com/path');
});

test('static website builder rejects unsafe URL protocols, credentials, markup colors and incomplete sections', () => {
  const base = { siteTitle: 'Site', siteLanguage: 'en', direction: 'auto', headline: 'Headline', intro: 'Intro', ctaLabel: 'Visit', ctaUrl: 'https://example.com', accentColor: '#123456', sectionOneTitle: 'About', sectionOneBody: 'Text', sectionTwoTitle: '', sectionTwoBody: '' };
  assert.throws(() => buildStaticWebsite({ ...base, ctaUrl: 'javascript:alert(1)' }), RangeError);
  assert.throws(() => buildStaticWebsite({ ...base, ctaUrl: 'https://user:pass@example.com' }), RangeError);
  assert.throws(() => buildStaticWebsite({ ...base, accentColor: 'red' }), RangeError);
  assert.throws(() => buildStaticWebsite({ ...base, sectionTwoTitle: 'Incomplete' }), RangeError);
  assert.throws(() => buildStaticWebsite({ ...base, siteLanguage: 'invalid_tag' }), RangeError);
});

test('DNS lookup validates locally before fetch and bounds resolver data to 100 answers', async () => {
  const oldFetch = globalThis.fetch;
  let requests = 0;
  try {
    globalThis.fetch = async (url, options) => {
      requests += 1;
      assert.equal(new URL(url).origin, 'https://cloudflare-dns.com');
      assert.equal(new URL(url).searchParams.get('name'), 'example.com');
      assert.equal(new URL(url).searchParams.get('type'), 'A');
      assert.equal(options.credentials, 'omit');
      assert.equal(options.referrerPolicy, 'no-referrer');
      assert.ok(options.signal);
      return new Response(JSON.stringify({ Status: 0, AD: true, Answer: Array.from({ length: 105 }, (_, index) => ({ name: 'example.com', data: `192.0.2.${index}`, TTL: 60, type: 1 })) }), { status: 200 });
    };
    await assert.rejects(calculatePendingTool('dns-lookup', { domain: 'https://example.com/path', recordType: 'A' }), RangeError);
    await assert.rejects(calculatePendingTool('dns-lookup', { domain: 'example.com', recordType: 'ANY' }), RangeError);
    assert.equal(requests, 0);
    const result = await calculatePendingTool('dns-lookup', { domain: 'EXAMPLE.COM.', recordType: 'a' });
    assert.equal(result.name, 'example.com');
    assert.equal(result.dnssec, true);
    assert.equal(result.answers.length, 100);
    assert.equal(requests, 1);
  } finally { globalThis.fetch = oldFetch; }
});

test('Would You Rather tally validates printable group-authored content and returns exactly one local vote', () => {
  assert.deepEqual(wouldYouRatherVote({ question: '  Tea or coffee? ', optionA: 'Tea', optionB: 'Coffee', choice: 'b' }), {
    question: 'Tea or coffee?', optionA: 'Tea', optionB: 'Coffee', votesForA: 0, votesForB: 1, totalVotes: 1,
  });
  assert.throws(() => wouldYouRatherVote({ question: 'Pick', optionA: 'Same', optionB: 'same', choice: 'a' }), RangeError);
  assert.throws(() => wouldYouRatherVote({ question: 'Pick', optionA: 'Café', optionB: 'CAFE\u0301', choice: 'a' }), RangeError);
  assert.throws(() => wouldYouRatherVote({ question: 'Pick', optionA: 'Yes', optionB: 'No', choice: 'c' }), RangeError);
  assert.throws(() => wouldYouRatherVote({ question: 'Bad\nquestion', optionA: 'Yes', optionB: 'No', choice: 'a' }), RangeError);
});

test('basketball shot counts only a descending ball that reaches the hoop plane', () => {
  const gravity = 9.81;
  const radians = (degrees) => degrees * Math.PI / 180;
  const risingAngle = 25; const risingPower = 12;
  const risingVertical = risingPower * Math.sin(radians(risingAngle));
  const risingTime = (risingVertical - Math.sqrt(risingVertical ** 2 - 2 * gravity * 1.05)) / gravity;
  const risingDistance = risingPower * Math.cos(radians(risingAngle)) * risingTime;
  const rising = basketballShot({ angle: risingAngle, power: risingPower, distance: risingDistance });
  assert.ok(Math.abs(rising.verticalError) < 1e-9);
  assert.ok(rising.verticalVelocityAtTarget > 0);
  assert.equal(rising.made, false);

  const descendingAngle = 45; const descendingPower = 8;
  const descendingVertical = descendingPower * Math.sin(radians(descendingAngle));
  const descendingTime = (descendingVertical + Math.sqrt(descendingVertical ** 2 - 2 * gravity * 1.05)) / gravity;
  const descendingDistance = descendingPower * Math.cos(radians(descendingAngle)) * descendingTime;
  const descending = basketballShot({ angle: descendingAngle, power: descendingPower, distance: descendingDistance });
  assert.ok(Math.abs(descending.verticalError) < 1e-9);
  assert.ok(descending.verticalVelocityAtTarget < 0);
  assert.equal(descending.made, true);
  assert.equal(descending.trajectory.length, 25);
});

test('charades prompt picker ignores blank lines and selects only from the submitted local list', () => {
  const result = pickCharadesPrompt({ prompts: '  moon landing  \n\n café\n家庭旅行' });
  assert.equal(result.promptCount, 3);
  assert.ok(['moon landing', 'café', '家庭旅行'].includes(result.prompt));
  assert.throws(() => pickCharadesPrompt({ prompts: 'one\n' }), RangeError);
  assert.throws(() => pickCharadesPrompt({ prompts: `one\n${'x'.repeat(121)}` }), RangeError);
  assert.throws(() => pickCharadesPrompt({ prompts: 'one\ntwo\u0000three' }), RangeError);
  assert.throws(() => pickCharadesPrompt({ prompts: Array(501).fill('word').join('\n') }), RangeError);
});

test('coloring studio exposes only original safe vector templates and validates color values', () => {
  assert.deepEqual(coloringTemplateIds, ['butterfly', 'flower', 'rocket']);
  for (const id of coloringTemplateIds) {
    const template = getColoringTemplate(id);
    assert.match(template.viewBox, /^0 0 400 400$/u);
    assert.ok(template.regions.length >= 5);
    assert.ok(template.regions.every(({ d }) => typeof d === 'string' && d.length < 300));
  }
  assert.equal(isColoringColor('#a0B1c2'), true);
  assert.equal(isColoringColor('red'), false);
  assert.throws(() => getColoringTemplate('protected-character'), RangeError);
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
