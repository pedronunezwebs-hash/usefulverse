import assert from 'node:assert/strict';
import test from 'node:test';
import { tools } from '../catalog.mjs';
import { assertGrowthCatalogIsAdditive, growthPilotTools } from './catalog.mjs';
import { checkLogicGridMarks, createLogicGridPuzzle, solveLogicGrid } from './tools/logic-grid-puzzle/logic.mjs';
import { countMarkdown, insertMarkdown } from './tools/markdown-editor/logic.mjs';
import { createPurchaseOrder } from './tools/purchase-order-generator/logic.mjs';
import { calculateEigenpairs } from './tools/eigenvalue-calculator/logic.mjs';
import { calculateWaistHipRatio } from './tools/waist-to-hip-ratio-calculator/logic.mjs';
import { buildBondYieldCurve, calculateBondPrice, solveBondYield } from './tools/bond-calculator/logic.mjs';
import { gregorianToHebrew, hebrewToGregorian, isHebrewLeapYear } from './tools/hebrew-calendar-converter/logic.mjs';
import { calculateAbsoluteValue } from './tools/absolute-value-calculator/logic.mjs';
import { calculateSpecificHeat } from './tools/specific-heat-calculator/logic.mjs';
import { calculateRcTimeConstant, calculateRcTransient } from './tools/rc-time-constant-calculator/logic.mjs';
import { calculateReverseMortgage } from './tools/reverse-mortgage-calculator/logic.mjs';
import { calculateCarDepreciation } from './tools/car-depreciation-calculator/logic.mjs';
import { calculateCpiInflation, calculateCustomInflation } from './tools/inflation-calculator/logic.mjs';
import { calculateRetirementProjection } from './tools/retirement-calculator/logic.mjs';
import { calculateStockProfit } from './tools/stock-profit-calculator/logic.mjs';
import { calculatePension } from './tools/pension-calculator/logic.mjs';
import { calculateLifetimeValue } from './tools/lifetime-value-calculator/logic.mjs';
import { calculatePolarGraph } from './tools/polar-graphing-calculator/logic.mjs';
import { calculateBooleanAlgebra } from './tools/boolean-algebra-calculator/logic.mjs';
import { alarmStateAt, parseLocalAlarmDateTime, snoozedAlarmTarget } from './tools/alarm-clock/logic.mjs';
import { calculateDividendProjection } from './tools/dividend-calculator/logic.mjs';
import { addNetWorthSnapshot, calculateNetWorth } from './tools/net-worth-calculator/logic.mjs';
import { calculateBodySurfaceArea } from './tools/body-surface-area-calculator/logic.mjs';
import { addWeeklyBlock, findWeeklyOverlaps } from './tools/weekly-planner/logic.mjs';
import { calculateOvertime } from './tools/overtime-calculator/logic.mjs';
import { createMeetingMinutes, renderMeetingMinutesMarkdown } from './tools/meeting-minutes-template/logic.mjs';
import { createDotsAndBoxesGame, playDotsAndBoxesEdge } from './tools/dots-and-boxes/logic.mjs';
import { mixColors } from './tools/color-mixer/logic.mjs';
import { createBlackjackGame, scoreBlackjackHand, splitBlackjackHand } from './tools/blackjack-game/logic.mjs';
import { calculateDebtToIncome } from './tools/debt-to-income-ratio-calculator/logic.mjs';
import { calculateCarLease } from './tools/car-lease-calculator/logic.mjs';
import { calculateFireTarget } from './tools/fire-calculator/logic.mjs';
import { createEmailSignature } from './tools/email-signature-generator/logic.mjs';
import { traceRasterToSvg } from './tools/image-vectorizer/logic.mjs';
import { estimateCooperVo2Max, estimateRockportVo2Max } from './tools/vo2-max-calculator/logic.mjs';

test('the current growth IDs are unique and additive to the protected catalog', () => {
  assert.equal(growthPilotTools.length, 206);
  assert.equal(new Set(growthPilotTools.map(({ id }) => id)).size, 206);
  assert.ok(growthPilotTools.some(({ id }) => id === 'inductor-calculator'));
  assert.ok(growthPilotTools.some(({ id }) => id === 'centripetal-force-calculator'));
  assert.ok(growthPilotTools.some(({ id }) => id === 'writing-tracker'));
  assert.ok(growthPilotTools.some(({ id }) => id === 'aes-encryption-tool'));
  assert.ok(growthPilotTools.some(({ id }) => id === 'jwt-encoder'));
  assert.ok(growthPilotTools.some(({ id }) => id === 'graphql-formatter'));
  assert.ok(growthPilotTools.some(({ id }) => id === 'rsa-key-generator'));
  assert.ok(growthPilotTools.some(({ id }) => id === 'log-analyzer'));
  assert.ok(growthPilotTools.some(({ id }) => id === 'inflation-calculator'));
  assert.ok(growthPilotTools.some(({ id }) => id === 'retirement-calculator'));
  assert.ok(growthPilotTools.some(({ id }) => id === 'text-to-speech'));
  assert.ok(growthPilotTools.some(({ id }) => id === 'world-clock'));
  assert.ok(growthPilotTools.some(({ id }) => id === 'breathing-exercise'));
  assert.ok(growthPilotTools.some(({ id }) => id === 'name-generator'));
  assert.ok(growthPilotTools.some(({ id }) => id === 'cribbage'));
  assert.ok(growthPilotTools.some(({ id }) => id === 'gin-rummy'));
  assert.equal(assertGrowthCatalogIsAdditive(tools), true);
});

test('Weekly Planner catalog acceptance covers overnight and adjacent blocks', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'weekly-planner');
  assert.ok(tool);
  const blocks = addWeeklyBlock(addWeeklyBlock([], { day: 0, title: 'Night shift', start: '23:00', end: '01:00' }), { day: 1, title: 'Early appointment', start: '00:30', end: '02:00' });
  assert.equal(findWeeklyOverlaps(blocks).length, 1);
  assert.equal(tool.relatedExistingIds.includes('goal-planner'), true);
});

test('Overtime Calculator catalog acceptance uses only the entered overtime threshold and multiplier', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'overtime-calculator');
  assert.ok(tool);
  const result = calculateOvertime({ totalHours: 45, hourlyRate: 20, thresholdHours: 40, overtimeMultiplier: 1.5 });
  assert.equal(result.totalPay, 950);
  assert.match(tool.boundary, /no jurisdiction/u);
});

test('Meeting Minutes Template catalog acceptance exports an action with its owner and date', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'meeting-minutes-template');
  assert.ok(tool);
  const minutes = createMeetingMinutes({ title: 'Review', actions: 'Review draft | Sam | 2026-10-16' });
  assert.match(renderMeetingMinutesMarkdown(minutes), /Review draft — Owner: Sam — Due: 2026-10-16/u);
});

test('Dots and Boxes catalog acceptance awards one completed box and keeps the scoring player', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'dots-and-boxes');
  assert.ok(tool);
  let game = createDotsAndBoxesGame(2, 'two-player');
  for (const move of [['h', 0, 0], ['v', 0, 0], ['h', 1, 0]]) game = playDotsAndBoxesEdge(game, ...move);
  game = playDotsAndBoxesEdge(game, 'v', 0, 1);
  assert.deepEqual([...game.scores], [0, 1]);
  assert.equal(game.currentPlayer, 1);
  assert.deepEqual(tool.relatedExistingIds, []);
});

test('Color Mixer catalog acceptance separates sRGB and linear light from physical paint mixing', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'color-mixer');
  assert.ok(tool);
  assert.equal(mixColors([{ hex: '#ff0000', weight: 50 }, { hex: '#0000ff', weight: 50 }], 'srgb').hex, '#800080');
  assert.equal(mixColors([{ hex: '#ff0000', weight: 50 }, { hex: '#0000ff', weight: 50 }], 'linear').hex, '#BC00BC');
  assert.match(tool.boundary, /not a physical paint\/pigment prediction/u);
  assert.deepEqual(tool.relatedExistingIds, ['color-palette-generator', 'color-converter']);
});

test('Blackjack catalog acceptance is practice-only and correctly values an ace', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'blackjack-game');
  assert.ok(tool);
  assert.match(tool.boundary, /no gambling advice, bets, deposits, cash, prizes/u);
  assert.equal(scoreBlackjackHand([{ rank: 1, suit: 'spades' }, { rank: 13, suit: 'clubs' }]).blackjack, true);
  const game = createBlackjackGame({ decks: 1, random: () => 0.5 });
  assert.ok(['player', 'complete'].includes(game.phase));
  assert.deepEqual(tool.relatedExistingIds, ['solitaire']);
});

test('Debt-to-Income catalog acceptance distinguishes DTI math from a loan payment estimate', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'debt-to-income-ratio-calculator');
  assert.ok(tool);
  assert.equal(calculateDebtToIncome({ grossMonthlyIncome: 5000, monthlyDebts: [2000] }).totalRatio, 40);
  assert.deepEqual(tool.relatedExistingIds, ['loan-calculator']);
  assert.match(tool.boundary, /does not assess creditworthiness, predict approval/u);
});

test('Car Lease Calculator separates depreciation from rent charge and loan amortization', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'car-lease-calculator');
  assert.ok(tool);
  assert.equal(calculateCarLease({ capitalizedCost: 12000, residualValue: 0, termMonths: 36, moneyFactor: 0 }).monthlyDepreciation.toFixed(2), '333.33');
  assert.deepEqual(tool.relatedExistingIds, ['loan-calculator', 'auto-loan-refinance-calculator', 'car-depreciation-calculator']);
  assert.match(tool.boundary, /not a lender quote or affordability recommendation/u);
});

test('FIRE calculator shows the spending/withdrawal target without presenting it as a forecast guarantee', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'fire-calculator');
  assert.ok(tool);
  assert.equal(calculateFireTarget({ annualSpending: 40000, withdrawalRatePercent: 4 }).targetAmount, 1_000_000);
  assert.deepEqual(tool.relatedExistingIds, ['retirement-calculator', 'savings-goal-calculator']);
  assert.match(tool.boundary, /not a safe withdrawal recommendation, investment forecast/u);
});

test('Email Signature Generator escapes content and rejects executable links', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'email-signature-generator');
  assert.ok(tool);
  assert.deepEqual(tool.relatedExistingIds, ['html-email-builder']);
  assert.match(createEmailSignature({ fullName: '<script>alert(1)</script>', website: 'usefulverse.com' }).html, /&lt;script&gt;/u);
  assert.throws(() => createEmailSignature({ fullName: 'Name', website: 'javascript:alert(1)' }), RangeError);
  assert.match(tool.boundary, /Email apps handle HTML and embedded images differently/u);
});

test('Image Vectorizer emits local SVG path geometry without wrapping the bitmap', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'image-vectorizer');
  const result = traceRasterToSvg({ width: 2, height: 2, data: new Uint8ClampedArray([255, 0, 0, 255, 255, 0, 0, 255, 0, 0, 255, 255, 0, 0, 255, 255]), colorCount: 2 });
  assert.ok(tool);
  assert.deepEqual(tool.relatedExistingIds, ['image-format-converter', 'image-sharpener', 'photo-to-sketch']);
  assert.match(result.svg, /<path/u);
  assert.doesNotMatch(result.svg, /<image|data:image/iu);
  assert.match(tool.boundary, /not smooth Bézier tracing/u);
});

test('VO2 Max calculator keeps two field-test equations distinct and labels their limits', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'vo2-max-calculator');
  assert.ok(tool);
  assert.match(tool.boundary, /not direct laboratory VO2 measurement/u);
  assert.match(tool.boundary, /ages 30–69/u);
  assert.ok(Math.abs(estimateCooperVo2Max({ distance: 2.4, unit: 'km' }).vo2Max - 42.3544) < 0.001);
  assert.ok(Math.abs(estimateRockportVo2Max({ age: 30, weight: 70, sexCoefficient: 'male', minutes: 15, finishHeartRate: 150 }).vo2Max - 43.2215) < 0.01);
});

test('Boolean algebra minimizes expressions and adds Karnaugh views beyond truth-table enumeration', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'boolean-algebra-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'boolean algebra calculator');
  assert.deepEqual(tool.relatedExistingIds, ['truth-table-generator']);
  assert.match(tool.boundary, /never evaluates JavaScript/u);
  const tautology = calculateBooleanAlgebra({ expression: 'A OR NOT A' });
  assert.equal(tautology.sop, '1');
  assert.equal(tautology.pos, '1');
  assert.ok(tautology.rows.every(({ result }) => result));
  assert.equal(calculateBooleanAlgebra({ expression: '!(A & B)' }).pos, '(!A | !B)');
  assert.deepEqual(calculateBooleanAlgebra({ expression: '(A & B) | (A & !B)' }).sop, 'A');
});

test('week number calculator is additive and distinguishes ISO week-year from custom calendar weeks', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'week-number-calculator');
  assert.ok(tool);
  assert.deepEqual(tool.relatedExistingIds, ['date-calculator', 'julian-date-converter']);
  assert.match(tool.boundary, /does not convert time zones or fiscal weeks/u);
});

test('name generator groups high-intent variants without claiming name or domain availability', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'name-generator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'fantasy name generator');
  assert.ok(tool.secondaryIntents.includes('business name generator'));
  assert.ok(tool.secondaryIntents.includes('random username generator'));
  assert.deepEqual(tool.relatedExistingIds, ['random-name-picker']);
  assert.match(tool.boundary, /does not search the web/u);
  assert.match(tool.boundary, /does not .*guarantee uniqueness/u);
});

test('cribbage match and scorer have a distinct card-game intent and disclose their local-opponent boundary', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'cribbage');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'cribbage');
  assert.deepEqual(tool.relatedExistingIds, []);
  assert.match(tool.boundary, /local match against a simple deterministic browser opponent/u);
  assert.ok(tool.functions.some((feature) => feature.includes('peg legal cards up to 31')));
});

test('pension calculator is distinct from the existing retirement projection', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'pension-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'pension calculator');
  assert.deepEqual(tool.relatedExistingIds, []);
  assert.match(tool.boundary, /not an entitlement/u);
  assert.equal(calculatePension({ finalSalary: 50000, yearsOfService: 30, accrualPercent: 2, commutationPercent: 0, commutationFactor: 12 }).annualPension, 30000);
});

test('retirement calculator compares accumulation, inflation-adjusted withdrawals, and explicit assumptions', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'retirement-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'retirement calculator');
  assert.deepEqual(tool.relatedExistingIds, ['pension-calculator', 'compound-interest-calculator', 'savings-goal-calculator']);
  assert.match(tool.boundary, /sequence-of-returns risk/u);
  const result = calculateRetirementProjection({ currentAge: 35, retirementAge: 65, planThroughAge: 90, currentSavings: 10000, monthlyContribution: 500, annualReturnPercent: 6, conservativeReturnPercent: 3, annualWithdrawal: 30000, annualInflationPercent: 2 });
  assert.equal(result.totalContributions, 190000);
  assert.ok(result.base.balanceAtRetirement > result.conservative.balanceAtRetirement);
  assert.ok(result.base.balanceAtRetirementInTodayMoney < result.base.balanceAtRetirement);
  const empty = calculateRetirementProjection({ currentAge: 35, retirementAge: 65, planThroughAge: 90, currentSavings: 0, monthlyContribution: 0, annualReturnPercent: 0, conservativeReturnPercent: 0, annualWithdrawal: 12000, annualInflationPercent: 0 });
  assert.equal(empty.base.depletedAtAge, 65);
});

test('401(k) calculator separates user-entered match and vesting from retirement forecasting', () => {
  const tool = growthPilotTools.find(({ id }) => id === '401k-calculator');
  assert.ok(tool);
  assert.equal(tool.acceptance.includes('a 50% employer match on that eligible contribution is $2,000'), true);
  assert.match(tool.boundary, /not an IRS contribution-limit check/u);
  assert.deepEqual(tool.relatedExistingIds, ['retirement-calculator', 'compound-interest-calculator']);
});

test('Gin Rummy adds a local no-layoff card game distinct from Cribbage scoring', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'gin-rummy');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'gin rummy');
  assert.equal(tool.relatedExistingIds.includes('cribbage'), false);
  assert.match(tool.boundary, /no-layoff knock variant/u);
  assert.match(tool.acceptance, /undercut by an opponent/u);
});

test('customer LTV uses monthly gross profit and churn, separate from company valuation', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'lifetime-value-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'customer lifetime value calculator');
  assert.deepEqual(tool.relatedExistingIds, []);
  assert.match(tool.boundary, /not a valuation, forecast/u);
  const result = calculateLifetimeValue({ monthlyRevenue: 100, grossMarginPercent: 50, monthlyChurnPercent: 5, customerAcquisitionCost: 100 });
  assert.equal(result.lifetimeValue, 1000);
  assert.equal(result.lifetimeValueToCac, 10);
});

test('RSA key generator is distinct from AES and certificate decoding with a clear short-message boundary', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'rsa-key-generator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'rsa key generator');
  assert.deepEqual(tool.relatedExistingIds, ['aes-encryption-tool', 'certificate-decoder']);
  assert.match(tool.boundary, /short-message demonstration/u);
  assert.match(tool.boundary, /not .*digital signature/u);
});

test('Log Analyzer targets access logs rather than HAR archives or generic CSV files', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'log-analyzer');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'log analyzer');
  assert.deepEqual(tool.relatedExistingIds, ['har-viewer', 'csv-viewer']);
  assert.match(tool.boundary, /NCSA Common\/Combined access logs/u);
  assert.match(tool.boundary, /not server error logs, JSON logs, HAR archives/u);
  assert.match(tool.acceptance, /over-20,000-line inputs are rejected/u);
});

test('polar graphing is a dedicated r(theta) view distinct from general parametric plotting', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'polar-graphing-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'polar graphing calculator');
  assert.deepEqual(tool.relatedExistingIds, ['parametric-equation-calculator']);
  assert.match(tool.boundary, /safe expression parser/u);
  const graph = calculatePolarGraph({ radiusExpression: '1', angleMin: 0, angleMax: 360, angleUnit: 'degrees', samples: 361 });
  assert.equal(graph.validCount, 361);
  assert.ok(Math.abs(graph.points[90].x) < 1e-12 && Math.abs(graph.points[90].y - 1) < 1e-12);
});

test('stock profit calculator estimates a distinct one-sale realized result with fees and lot methods', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'stock-profit-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'stock profit calculator');
  assert.deepEqual(tool.relatedExistingIds, ['roi-cagr-calculator']);
  assert.match(tool.boundary, /not investment, tax or accounting advice/u);
  const result = calculateStockProfit({ lots: [{ quantity: 10, price: 20 }], sharesSold: 10, salePrice: 30 });
  assert.equal(result.profit, 100);
  assert.throws(() => calculateStockProfit({ lots: [{ quantity: 10, price: 20 }], sharesSold: 11, salePrice: 30 }), /Shares to sell/u);
});

test('bond calculator has a distinct fixed-coupon intent and matches the par-yield acceptance case', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'bond-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'bond calculator');
  assert.deepEqual(tool.relatedExistingIds, ['compound-interest-calculator']);
  assert.match(tool.boundary, /not investment advice/u);
  assert.match(tool.boundary, /accrued interest/u);
  const terms = { faceValue: '1000', couponPercent: '5', years: '5', frequency: 'annual' };
  const parYield = solveBondYield({ ...terms, marketPrice: '1000' });
  assert.ok(Math.abs(parYield.yieldPercent - 5) < 1e-9);
  assert.ok(Math.abs(calculateBondPrice({ ...terms, yieldPercent: '5' }).price - 1000) < 1e-9);
  assert.ok(calculateBondPrice({ ...terms, yieldPercent: '6' }).price < 1000);
  assert.ok(calculateBondPrice({ ...terms, yieldPercent: '4' }).price > 1000);
  assert.equal(buildBondYieldCurve(terms, 5).length, 41);
});

test('waist-to-hip ratio is a unitless arithmetic tool, distinct from body-fat estimation and health diagnosis', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'waist-to-hip-ratio-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'waist to hip ratio calculator');
  assert.deepEqual(tool.relatedExistingIds, ['body-fat-calculator']);
  assert.match(tool.boundary, /does not.*assess health risk or diagnose/u);
  assert.equal(calculateWaistHipRatio({ waist: 80, hip: 100, unit: 'cm' }).ratio, 0.8);
});

test('Hebrew calendar converter handles Adar II, round-trips dates and states its sunset boundary', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'hebrew-calendar-converter');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'hebrew calendar converter');
  assert.deepEqual(tool.relatedExistingIds, ['hijri-calendar-converter']);
  assert.match(tool.boundary, /Intl\.DateTimeFormat/u);
  assert.match(tool.boundary, /sunset/u);
  const purimDate = gregorianToHebrew({ year: 2024, month: 3, day: 11 });
  assert.deepEqual(purimDate, { year: 5784, month: 7, day: 1, monthKey: 'adarII', leapYear: true });
  assert.deepEqual(hebrewToGregorian({ year: 5784, month: 7, day: 1 }), { year: 2024, month: 3, day: 11 });
  assert.equal(isHebrewLeapYear(5783), false);
});

test('absolute value calculator solves bounded linear equations and inequalities, distinct from a general algebra solver', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'absolute-value-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'absolute value calculator');
  assert.deepEqual(tool.relatedExistingIds, ['scientific-calculator', 'number-line-graphing-tool']);
  assert.match(tool.boundary, /not a general symbolic algebra system/u);
  assert.deepEqual(calculateAbsoluteValue({ mode: 'equation', a: 1, b: 0, relation: '=', c: 3 }).solution, { kind: 'points', points: [-3, 3] });
  assert.deepEqual(calculateAbsoluteValue({ mode: 'inequality', a: 2, b: -4, relation: '<=', c: 6 }).solution.intervals[0], { lower: -1, upper: 5, lowerInclusive: true, upperInclusive: true });
  assert.deepEqual(calculateAbsoluteValue({ mode: 'inequality', a: 1, b: 0, relation: '>', c: 3 }).solution.intervals[1], { lower: 3, upper: Infinity, lowerInclusive: false, upperInclusive: false });
});

test('specific heat calculator solves sensible heat and ideal mixing without duplicating building heat loss', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'specific-heat-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'specific heat calculator');
  assert.deepEqual(tool.relatedExistingIds, ['heat-loss-calculator', 'thermal-expansion-calculator']);
  assert.match(tool.boundary, /constant specific heat.*phase change/u);
  assert.equal(calculateSpecificHeat({ mass: 1, specificHeat: 1000, temperatureChange: 10 }).value, 10000);
  assert.equal(calculateSpecificHeat({ mode: 'mixing', mass1: 1, specificHeat1: 1000, temperature1: 80, mass2: 1, specificHeat2: 1000, temperature2: 20 }).finalTemperatureC, 50);
});

test('RC time constant calculator models a first-order response distinct from equivalent capacitor networks', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'rc-time-constant-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'rc time constant calculator');
  assert.deepEqual(tool.relatedExistingIds, ['capacitor-calculator', '555-timer-calculator', 'rlc-circuit-calculator']);
  assert.match(tool.boundary, /single-pole.*RC step response/u);
  assert.ok(Math.abs(calculateRcTimeConstant({ resistance: 1000, capacitance: 100, capacitanceUnit: 'uF' }).tauSeconds - 0.1) < 1e-14);
  assert.ok(Math.abs(calculateRcTransient({ resistance: 1000, capacitance: 100, capacitanceUnit: 'uF', finalVoltage: 5, time: 0.1 }).voltage - 3.1606027941) < 1e-9);
  assert.ok(Math.abs(calculateRcTransient({ resistance: 1000, capacitance: 100, capacitanceUnit: 'uF', initialVoltage: 10, targetVoltage: 1 }).timeSeconds - 0.1 * Math.log(10)) < 1e-14);
});

test('reverse mortgage calculator models a rising balance without overlapping ordinary loan payment intent', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'reverse-mortgage-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'reverse mortgage calculator');
  assert.deepEqual(tool.relatedExistingIds, ['loan-calculator', 'mortgage-points-calculator', 'compound-interest-calculator']);
  assert.match(tool.boundary, /not a lender quote.*financial advice/u);
  assert.equal(calculateReverseMortgage({ startingBalance: 10000, years: 10 }).endingBalance, 10000);
  const projection = calculateReverseMortgage({ startingBalance: 10000, annualRatePercent: 12, years: 1, monthlyAdvance: 100, monthlyFee: 10 });
  assert.ok(Math.abs(projection.endingBalance - (10000 * (1.01 ** 12) + (110 * ((1.01 ** 12 - 1) / 0.01)))) < 1e-8);
  assert.equal(projection.totalAdvances, 1200);
  assert.equal(projection.totalMonthlyFees, 120);
});

test('car depreciation is a user-assumption scenario distinct from loan payoff and fuel cost', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'car-depreciation-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'car depreciation calculator');
  assert.deepEqual(tool.relatedExistingIds, ['fuel-cost-calculator', 'loan-calculator', 'tire-size-calculator']);
  assert.match(tool.boundary, /not a market valuation.*financial advice/u);
  assert.equal(calculateCarDepreciation({ purchasePrice: 10000, yearsOwned: 0, currentDistance: 0, annualDistance: 0, annualDepreciationPercent: 10, distanceDepreciationPercent: 0, projectionYears: 1 }).projectedValue, 9000);
});

test('inflation calculator uses historical price indexes rather than investment returns', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'inflation-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'inflation calculator');
  assert.deepEqual(tool.relatedExistingIds, ['roi-cagr-calculator', 'compound-interest-calculator']);
  assert.match(tool.boundary, /not a personal budget.*purchasing basket/u);
  assert.ok(Math.abs(calculateCpiInflation({ amount: 100, startYear: 2020, endYear: 2025 }).adjustedAmount - 124.393) < 0.001);
  assert.ok(Math.abs(calculateCustomInflation({ amount: 100, annualRatePercent: 10, years: 2 }).adjustedAmount - 121) < 1e-12);
});

test('eigenvalue calculator is additive and validates symmetric eigenpairs', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'eigenvalue-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'eigenvalue calculator');
  assert.deepEqual(tool.relatedExistingIds, ['matrix-calculator']);
  assert.match(tool.boundary, /real symmetric matrices only/u);
  const report = calculateEigenpairs('2 1\n1 2');
  assert.ok(Math.abs(report.eigenpairs[0].eigenvalue - 1) < 1e-10);
  assert.ok(Math.abs(report.eigenpairs[1].eigenvalue - 3) < 1e-10);
  assert.ok(report.eigenpairs.every(({ residual }) => residual < 1e-10));
});

test('purchase order generator has a distinct pre-purchase intent and correct acceptance total', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'purchase-order-generator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'purchase order template');
  assert.deepEqual(tool.relatedExistingIds, ['invoice-generator', 'work-order-generator']);
  const order = createPurchaseOrder({ issuedDate: '2026-10-11', currency: 'USD', buyer: 'Buyer', supplier: 'Supplier', taxPercent: '8', shipping: '4.50', lines: [{ description: 'Paper', quantity: '2', unitPrice: '12.50' }, { description: 'Ink', quantity: '3', unitPrice: '7.25' }] }, { locale: 'en-US' });
  assert.equal(order.subtotalMinor, 4675);
  assert.equal(order.totalMinor, 5499);
});

test('Markdown editor adds a local, bounded editing workflow rather than a duplicate format converter', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'markdown-editor');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'markdown editor');
  assert.deepEqual(tool.relatedExistingIds, ['markdown-html-converter']);
  assert.match(tool.boundary, /500,000 characters.*optional and local/u);
  assert.match(tool.acceptance, /script.*inert text/u);
  assert.deepEqual(countMarkdown('# Hello\n\nworld 123'), { words: 3, characters: 18 });
  const inserted = insertMarkdown('start end', 6, 9, 'bold');
  assert.equal(inserted.value, 'start **end**');
  assert.equal(inserted.value.slice(inserted.selectionStart, inserted.selectionEnd), 'end');
  assert.match(insertMarkdown('', 0, 0, 'table').value, /^\|  \|  \|\n\| --- \| --- \|\n\|  \|  \|\n$/u);
  assert.throws(() => insertMarkdown('x', 0, 1, 'invalid'), /Unsupported Markdown/u);
});

test('interval timer adds work/rest rounds and sound without duplicating Pomodoro or a plain countdown', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'interval-timer');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'interval timer');
  assert.deepEqual(tool.relatedExistingIds, ['online-timer']);
  assert.match(tool.acceptance, /8-round 20-second work \/ 10-second rest.*230 seconds/u);
  assert.match(tool.boundary, /sleeping devices may delay.*Sound starts only after the user presses Start/u);
  assert.match(tool.boundary, /no account, upload, API, storage or usage charge/u);
});

test('breathing exercise guides paced breaths without duplicating a generic timer or claiming treatment', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'breathing-exercise');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'breathing exercise');
  assert.ok(tool.secondaryIntents.includes('box breathing timer'));
  assert.ok(tool.relatedExistingIds.includes('interval-timer'));
  assert.match(tool.boundary, /not medical advice/u);
  assert.match(tool.acceptance, /partial cycle/u);
});

test('online alarm clock stays a one-shot local alarm and does not claim reliable background notifications', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'alarm-clock');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'online alarm clock');
  assert.deepEqual(tool.relatedExistingIds, ['online-timer', 'interval-timer']);
  assert.match(tool.acceptance, /exactly five minutes/u);
  assert.match(tool.boundary, /not a guaranteed system alarm/u);
  const now = new Date(2030, 0, 1, 9).getTime();
  const target = parseLocalAlarmDateTime('2030-01-01T10:00', now);
  assert.equal(alarmStateAt(target, target).phase, 'ringing');
  assert.equal(snoozedAlarmTarget(now), now + 300_000);
});

test('dividend calculator owns share-income and DRIP intent without market data or investment promises', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'dividend-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'dividend calculator');
  assert.ok(tool.secondaryIntents.includes('dividend reinvestment calculator'));
  assert.deepEqual(tool.relatedExistingIds, ['compound-interest-calculator', 'stock-profit-calculator']);
  assert.match(tool.acceptance, /100 shares paying an annual dividend of \$2 per share produce \$200/u);
  assert.match(tool.boundary, /no live stock prices/u);
  const projection = calculateDividendProjection({ shares: 100, sharePrice: 40, annualDividendPerShare: 2, paymentsPerYear: 4, years: 10 });
  assert.equal(projection.currentAnnualIncome, 200);
  assert.equal(projection.currentIncomePerPayment, 50);
  assert.equal(projection.projectedAnnualIncome, 200);
});

test('family tree maker is a manual private genealogy chart, separate from a mind map', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'family-tree-maker');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'family tree maker');
  assert.deepEqual(tool.relatedExistingIds, ['mind-map-maker']);
  assert.match(tool.acceptance, /linking B → A is rejected as a cycle/u);
  assert.match(tool.boundary, /not a genealogy database/u);
});

test('net worth calculator stays a user-entered private balance sheet and compares same-currency snapshots only', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'net-worth-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'net worth calculator');
  assert.match(tool.acceptance, /net worth 60,000 and a debt-to-asset ratio of 40%/u);
  assert.match(tool.boundary, /no account, bank sync, market data, upload or server processing/u);
  const items = [{ type: 'asset', category: 'Cash', amount: 100_000 }, { type: 'liability', category: 'Debt', amount: 40_000 }];
  assert.equal(calculateNetWorth(items).netWorth, 60_000);
  assert.equal(addNetWorthSnapshot([], { date: '2026-01-01', currency: 'USD', items })[0].netWorth, 60_000);
});

test('body surface area calculator compares published adult estimates without turning them into dosing advice', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'body-surface-area-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'body surface area calculator');
  assert.deepEqual(tool.relatedExistingIds, ['adult-bmi-calculator', 'body-water-calculator', 'body-fat-calculator']);
  assert.match(tool.functions.join(' '), /Mosteller and Du Bois/u);
  assert.match(tool.boundary, /Not for medication dosing/u);
  assert.ok(Math.abs(calculateBodySurfaceArea({ height: 170, weight: 70 }).mosteller - 1.818) < 0.001);
});

test('logic grid is an original locally solved matching puzzle, distinct from number-placement and island puzzles', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'logic-grid-puzzle');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'logic grid puzzle');
  assert.deepEqual(tool.relatedExistingIds, ['nurikabe', 'hitori', 'sudoku']);
  assert.match(tool.functions.join(' '), /exhaustively verify a single assignment/u);
  assert.match(tool.acceptance, /exactly one valid assignment/u);
  assert.match(tool.boundary, /No model download, account, upload, network call or stored play history/u);
  const puzzle = createLogicGridPuzzle({ random: () => 0.43 });
  assert.equal(solveLogicGrid(puzzle.clues).length, 1);
  assert.equal(checkLogicGridMarks(puzzle, []).status, 'incomplete');
});

test('frequency and wavelength calculator solves the wave relation, distinct from unit conversion and antenna geometry', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'frequency-wavelength-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'wavelength calculator');
  assert.deepEqual(tool.relatedExistingIds, ['unit-converter']);
  assert.match(tool.acceptance, /100 MHz.*3 m/u);
  assert.match(tool.boundary, /approximate.*custom speed/u);
  assert.match(tool.boundary, /No upload, API, storage or server processing/u);
});

test('pulley calculator covers belt geometry and shaft speed separately from toothed gear trains', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'pulley-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'pulley calculator');
  assert.deepEqual(tool.relatedExistingIds, ['gear-ratio-calculator']);
  assert.match(tool.functions.join(' '), /open two-pulley belt pitch length/u);
  assert.match(tool.acceptance, /100 mm.*200 mm.*1,476 mm.*750 output RPM/u);
  assert.match(tool.boundary, /does not select a catalog belt.*not uploaded/u);
});

test('RLC calculator covers resonant response and impedance separately from RC time constants', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'rlc-circuit-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'resonant frequency calculator');
  assert.deepEqual(tool.relatedExistingIds, ['frequency-wavelength-calculator']);
  assert.match(tool.functions.join(' '), /quality factor Q and bandwidth/u);
  assert.match(tool.acceptance, /1,591\.55 Hz.*Q=10/u);
  assert.match(tool.boundary, /parallel model uses R in parallel with L and C.*not uploaded|inputs stay in this browser/u);
});

test('antenna calculator adds element geometry beyond frequency/wavelength conversion', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'antenna-length-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'dipole antenna calculator');
  assert.deepEqual(tool.relatedExistingIds, ['frequency-wavelength-calculator']);
  assert.match(tool.acceptance, /100 MHz.*1\.5 m total.*0\.75 m per leg/u);
  assert.match(tool.functions.join(' '), /shortening factor/u);
  assert.match(tool.boundary, /not a universal correction.*no values uploaded/u);
});

test('ideal gas law calculator solves one blank from PV=nRT and discloses model limits', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'ideal-gas-law-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'ideal gas law calculator');
  assert.deepEqual(tool.relatedExistingIds, ['molarity-calculator', 'molar-mass-calculator', 'density-calculator']);
  assert.match(tool.acceptance, /1 atm.*22\.41397 L/u);
  assert.match(tool.boundary, /absolute temperature above 0 K/u);
  assert.match(tool.boundary, /no inputs are uploaded/u);
});

test('momentum calculator models a signed one-dimensional collision without duplicating kinetic-energy intent', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'momentum-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'momentum calculator');
  assert.deepEqual(tool.relatedExistingIds, ['kinetic-energy-calculator']);
  assert.match(tool.acceptance, /exchange velocities.*momentum is 1/u);
  assert.match(tool.functions.join(' '), /coefficient of restitution/u);
  assert.match(tool.boundary, /One-dimensional classical.*no net external impulse/u);
});

test('stoichiometry calculator estimates limiting reactants and yield without duplicating equation balancing or molar mass', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'stoichiometry-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'stoichiometry calculator');
  assert.deepEqual(tool.relatedExistingIds, ['chemical-equation-balancer', 'molar-mass-calculator']);
  assert.match(tool.functions.join(' '), /limiting reactant/u);
  assert.match(tool.functions.join(' '), /percent yield/u);
  assert.match(tool.acceptance, /2 mol H2.*1 mol O2.*2 mol.*36\.03 g/u);
  assert.match(tool.boundary, /ionic\/electron balance.*hazards/u);
});

test('pressure calculator separates average force over area from static-fluid gauge pressure', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'pressure-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'pressure calculator');
  assert.deepEqual(tool.relatedExistingIds, ['force-calculator', 'flow-rate-calculator']);
  assert.match(tool.acceptance, /100 N.*2 m².*50 Pa/u);
  assert.match(tool.functions.join(' '), /hydrostatic gauge pressure/u);
  assert.match(tool.boundary, /atmospheric pressure.*not uploaded/u);
});

test('projectile calculator is distinct from graphing and energy tools and discloses its ideal model', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'projectile-motion-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'projectile motion calculator');
  assert.deepEqual(tool.relatedExistingIds, ['kinetic-energy-calculator', 'function-grapher']);
  assert.match(tool.functions.join(' '), /initial height.*constant gravity/u);
  assert.match(tool.functions.join(' '), /reduced-motion/u);
  assert.match(tool.acceptance, /90-degree vertical launch.*zero horizontal.*range/u);
  assert.match(tool.boundary, /no air resistance.*wind.*spin/u);
});

test('PCB trace width calculator estimates copper capacity without duplicating cable voltage-drop intent', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'pcb-trace-width-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'pcb trace width calculator');
  assert.deepEqual(tool.relatedExistingIds, ['voltage-drop-calculator', 'ohms-law-calculator']);
  assert.match(tool.acceptance, /zero current.*not dimensionable/u);
  assert.match(tool.functions.join(' '), /internal or external layer/u);
  assert.match(tool.boundary, /Legacy IPC-2221.*Not IPC certification/u);
});

test('torque calculator separates force moments from shaft-power calculations', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'torque-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'torque calculator');
  assert.deepEqual(tool.relatedExistingIds, ['force-calculator', 'horsepower-calculator']);
  assert.match(tool.acceptance, /10 N.*2 m.*20 N·m/u);
  assert.match(tool.functions.join(' '), /lever arm.*angle/u);
  assert.match(tool.boundary, /not a structural.*safety design tool/u);
  assert.match(tool.boundary, /calculations stay in the browser/u);
});

test('beam deflection calculator covers four elastic textbook cases without claiming structural approval', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'beam-deflection-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'beam deflection calculator');
  assert.deepEqual(tool.relatedExistingIds, ['force-calculator', 'section-modulus-calculator']);
  assert.match(tool.acceptance, /4 m.*1,000 N.*0\.8333 mm/u);
  assert.match(tool.functions.join(' '), /uniform load.*deflection curve/u);
  assert.match(tool.boundary, /Euler–Bernoulli.*qualified structural engineer/u);
  assert.match(tool.boundary, /no upload/u);
});

test('LED resistor calculator is distinct from general Ohm and resistor color-code tools', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'led-resistor-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'led resistor calculator');
  assert.deepEqual(tool.relatedExistingIds, ['ohms-law-calculator', 'resistor-color-code-calculator']);
  assert.match(tool.acceptance, /12 V.*500 Ω.*560 Ω/u);
  assert.match(tool.functions.join(' '), /round upward.*E12 or E24/u);
  assert.match(tool.boundary, /2× estimate.*not a safety certification/u);
});

test('flow rate calculator solves area, velocity, flow and tank fill time without duplicating pressure or volume tools', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'flow-rate-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'flow rate calculator');
  assert.match(tool.acceptance, /2 m².*3 m\/s.*6 m³\/s/u);
  assert.match(tool.boundary, /pressure loss.*pump performance/u);
  assert.deepEqual(tool.relatedExistingIds, ['pool-volume-calculator', 'rainwater-harvesting-calculator']);
});

test('Reynolds number calculator distinguishes viscosity formulas and limits pipe regimes to internal flow', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'reynolds-number-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'reynolds number calculator');
  assert.match(tool.acceptance, /Re ≈ 49,810.*zero velocity gives Re = 0/u);
  assert.match(tool.boundary, /not guarantees.*no universal regime/u);
  assert.deepEqual(tool.relatedExistingIds, ['flow-rate-calculator', 'density-calculator']);
});

test('three-phase power calculator covers AC power magnitudes and is distinct from DC Ohm law', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'three-phase-power-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'three phase power calculator');
  assert.match(tool.acceptance, /√3 × 400 × 10 × 0\.8/u);
  assert.match(tool.boundary, /balanced three-phase load.*reactive power is reported unsigned/u);
  assert.deepEqual(tool.relatedExistingIds, ['ohms-law-calculator', 'voltage-drop-calculator']);
});

test('JSON to Excel is distinct from CSV and spreadsheet conversion and keeps imports local', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'json-to-excel');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'json to excel');
  assert.deepEqual(tool.relatedExistingIds, ['json-to-csv', 'spreadsheet-converter']);
  assert.match(tool.acceptance, /"001" remains "001"/u);
  assert.match(tool.boundary, /no upload, API, fetch/u);
});

test('binary Base64 encodes selected file bytes rather than duplicating text Base64 conversion', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'binary-base64-tool');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'base64 image encoder');
  assert.deepEqual(tool.relatedExistingIds, ['base64-encoder-decoder']);
  assert.match(tool.acceptance, /decoding its Base64 portion returns the exact original bytes/u);
  assert.match(tool.boundary, /does not encode text, fetch remote URLs, decode Base64/u);
  assert.match(tool.boundary, /2 MiB/u);
});

test('JSON model generator drafts typed models without duplicating schema validation or spreadsheet export', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'json-model-generator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'json to csharp');
  assert.deepEqual(tool.relatedExistingIds, ['json-schema-validator', 'json-to-excel', 'json-to-csv']);
  assert.match(tool.acceptance, /string \| null/u);
  assert.match(tool.boundary, /does not validate JSON against a schema/u);
  assert.match(tool.boundary, /no dependencies, upload, API/iu);
});

test('CSV editor adds editable rows and cells without duplicating the read-only CSV viewer', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'csv-editor');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'csv editor');
  assert.deepEqual(tool.relatedExistingIds, ['csv-viewer', 'csv-to-pdf']);
  assert.match(tool.functions.join(' '), /undo or redo/u);
  assert.match(tool.acceptance, /embedded newline.*reproduces the edited table/u);
  assert.match(tool.boundary, /does not upload, autosave/u);
  assert.match(tool.boundary, /5 MiB.*5,000 data rows.*80 columns.*80,000 cells/u);
});

test('pH calculator has a distinct acid-base equilibrium intent and states its ideal-solution scope', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'ph-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'ph calculator');
  assert.deepEqual(tool.relatedExistingIds, ['molarity-calculator', 'molar-mass-calculator']);
  assert.match(tool.functions.join(' '), /weak acid\/base equilibrium/u);
  assert.match(tool.acceptance, /1 × 10⁻⁷ mol\/L returns pH 7/u);
  assert.match(tool.boundary, /25 °C/u);
});

test('Hashi is a distinct no-crossing connected-island puzzle, not a duplicate Futoshiki or Kakuro page', () => {
  const hashi = growthPilotTools.find(({ id }) => id === 'hashi-puzzle');
  assert.ok(hashi);
  assert.equal(hashi.primaryIntent, 'hashi puzzle');
  assert.match(hashi.functions.join(' '), /one or two bridges/iu);
  assert.match(hashi.acceptance, /connected graph/u);
  assert.deepEqual(hashi.relatedExistingIds, ['futoshiki', 'kakuro']);
});

test('chess opening trainer adds repertoire practice rather than another free-play or tactics page', () => {
  const trainer = growthPilotTools.find(({ id }) => id === 'chess-opening-trainer');
  assert.ok(trainer);
  assert.equal(trainer.primaryIntent, 'chess openings practice');
  assert.match(trainer.acceptance, /standard starting position/u);
  assert.deepEqual(trainer.relatedExistingIds, ['chess-game', 'chess-clock']);
});

test('decibel calculator does logarithmic ratios and incoherent-level sums, not SPL measurement', () => {
  const calculator = growthPilotTools.find(({ id }) => id === 'decibel-calculator');
  assert.ok(calculator);
  assert.equal(calculator.primaryIntent, 'decibel calculator');
  assert.match(calculator.boundary, /does not measure SPL/u);
  assert.match(calculator.functions.join(' '), /sum 2 to 20 incoherent sound levels/u);
});

test('Spearman calculator handles rank ties and stays distinct from Pearson linear regression', () => {
  const calculator = growthPilotTools.find(({ id }) => id === 'spearman-correlation-calculator');
  assert.ok(calculator);
  assert.equal(calculator.primaryIntent, 'spearman correlation calculator');
  assert.deepEqual(calculator.relatedExistingIds, ['linear-regression-calculator']);
  assert.match(calculator.functions.join(' '), /tied values by assigning their average ranks/u);
  assert.match(calculator.boundary, /does not calculate a p-value/u);
});

test('Wilcoxon signed-rank calculator handles paired differences, zeros, ties and exact/approximate thresholds', () => {
  const calculator = growthPilotTools.find(({ id }) => id === 'wilcoxon-signed-rank-test-calculator');
  assert.equal(calculator.primaryIntent, 'wilcoxon signed rank test calculator');
  assert.match(calculator.acceptance, /every before\/after pair is identical/u);
  assert.match(calculator.boundary, /after minus before/u);
  assert.match(calculator.boundary, /symmetric differences/u);
  assert.deepEqual(calculator.relatedExistingIds, []);
});

test('JSON Diff compares structure rather than source lines and stays distinct from text diff', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'json-diff');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'json diff');
  assert.deepEqual(tool.relatedExistingIds, ['text-diff-checker', 'json-formatter']);
  assert.match(tool.acceptance, /key order/u);
  assert.match(tool.functions.join(' '), /match object records/u);
  assert.match(tool.boundary, /array indexes/u);
});

test('text/binary conversion preserves UTF-8 and stays distinct from numeric base conversion', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'text-to-binary-converter');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'binary to text converter');
  assert.deepEqual(tool.relatedExistingIds, ['binary-converter', 'base64-encoder-decoder', 'text-diff-checker']);
  assert.match(tool.acceptance, /ñ produces UTF-8 bytes/u);
  assert.match(tool.boundary, /not integers between numeric bases/u);
  assert.match(tool.boundary, /strictly valid UTF-8/u);
});

test('X.509 decoder reads local PEM/DER fields without claiming trust verification', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'certificate-decoder');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'certificate decoder');
  assert.deepEqual(tool.relatedExistingIds, ['jwt-decoder', 'json-ld-generator']);
  assert.match(tool.functions.join(' '), /subject alternative names/u);
  assert.match(tool.acceptance, /fixture.example.invalid/u);
  assert.match(tool.boundary, /does not verify/u);
});

test('JSON/XML converter is bidirectional with explicit lossy mappings and blocked DTDs', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'json-to-xml-converter');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'xml to json converter');
  assert.deepEqual(tool.relatedExistingIds, ['json-yaml-converter', 'xml-formatter']);
  assert.match(tool.acceptance, /repeated item elements/u);
  assert.match(tool.boundary, /DTD and entity declarations are blocked/u);
  assert.match(tool.boundary, /not guaranteed to round-trip/u);
});

test('HAR viewer analyzes local captures while redacting query values and withholding request data', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'har-viewer');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'har analyzer');
  assert.match(tool.functions.join(' '), /without uploading/u);
  assert.match(tool.boundary, /No network import, upload/u);
  assert.match(tool.boundary, /Sensitive query values/u);
  assert.deepEqual(tool.relatedExistingIds, ['url-parser']);
});

test('robots tester previews local rules without claiming crawler equivalence or duplicating the generator', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'robots-txt-tester');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'robots txt tester');
  assert.deepEqual(tool.relatedExistingIds, ['robots-txt-generator']);
  assert.match(tool.functions.join(' '), /winning Allow or Disallow rule/u);
  assert.match(tool.boundary, /not a complete emulator/u);
  assert.match(tool.boundary, /does not guarantee crawling/u);
  assert.match(tool.boundary, /Does not fetch robots\.txt or URLs/u);
});

test('OpenAPI editor stays a local contract editor and does not duplicate request-builder intent', () => {
  const editor = growthPilotTools.find(({ id }) => id === 'openapi-editor');
  assert.ok(editor);
  assert.equal(editor.primaryIntent, 'swagger editor online');
  assert.match(editor.boundary, /never fetched/u);
  assert.match(editor.functions.join(' '), /without making API requests/u);
  assert.deepEqual(editor.relatedExistingIds, ['api-request-builder', 'json-yaml-converter', 'schema-markup-validator']);
});

test('font pairing compares type hierarchy without duplicating single-file font testing', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'font-pairing-tool');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'font pair generator');
  assert.match(tool.boundary, /not a font-file tester/u);
  assert.match(tool.acceptance, /initial page makes no font requests/u);
  assert.deepEqual(tool.relatedExistingIds, ['font-tester', 'color-palette-generator']);
});

test('polygon calculator covers regular N-gons without competing with the triangle calculator', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'polygon-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'polygon calculator');
  assert.deepEqual(tool.relatedExistingIds, ['triangle-calculator']);
  assert.match(tool.boundary, /4–1,000 sides/u);
  assert.match(tool.acceptance, /perimeter 6/u);
});

test('friction calculator models Coulomb friction and incline motion without duplicating net-force calculations', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'friction-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'friction calculator');
  assert.deepEqual(tool.relatedExistingIds, ['force-calculator']);
  assert.match(tool.acceptance, /μs=0.*friction force is 0/u);
  assert.match(tool.boundary, /Coulomb/u);
});

test('thermal expansion calculator requires dimension-matched coefficients and has a zero-temperature acceptance case', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'thermal-expansion-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'thermal expansion calculator');
  assert.match(tool.functions.join(' '), /linear, area, or volume/u);
  assert.match(tool.acceptance, /zero temperature change preserves/u);
  assert.match(tool.boundary, /does not infer material properties/u);
  assert.deepEqual(tool.relatedExistingIds, ['unit-converter', 'heat-loss-calculator']);
});

test('Hijri calendar converter declares its fixed tabular method and distinction from observation', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'hijri-calendar-converter');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'hijri calendar converter');
  assert.match(tool.boundary, /not Umm al-Qura or a local moon-sighting decision/u);
  assert.match(tool.acceptance, /same tabular method/u);
  assert.deepEqual(tool.relatedExistingIds, ['date-calculator']);
});

test('capacitor calculator combines ideal capacitor networks and distinguishes component energy from resistor tools', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'capacitor-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'capacitor calculator');
  assert.deepEqual(tool.relatedExistingIds, ['ohms-law-calculator']);
  assert.match(tool.functions.join(' '), /stored energy/u);
  assert.match(tool.boundary, /no voltage-rating, tolerance, leakage or ESR model/u);
  assert.match(tool.acceptance, /200 μF/u);
});

test('body-water estimate names its adult source model and avoids hydration advice', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'body-water-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'body water calculator');
  assert.match(tool.functions.join(' '), /Watson equation/u);
  assert.match(tool.boundary, /does not measure hydration/u);
  assert.match(tool.boundary, /No minors/u);
  assert.match(tool.acceptance, /41\.9212 L/u);
});

test('555 timer calculator keeps astable and monostable circuit timing distinct from a user timer', () => {
  const tool = growthPilotTools.find(({ id }) => id === '555-timer-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, '555 timer calculator');
  assert.match(tool.functions.join(' '), /astable high time, low time, period, frequency/u);
  assert.match(tool.boundary, /does not simulate a specific manufacturer/u);
  assert.deepEqual(tool.relatedExistingIds, ['online-timer']);
});

test('Fourier series calculator uses sampled periodic data, not audio uploads or symbolic expressions', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'fourier-series-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'fourier series calculator');
  assert.match(tool.functions.join(' '), /4–128 equally spaced numeric samples/u);
  assert.match(tool.acceptance, /constant input.*DC = 5/su);
  assert.match(tool.boundary, /not an audio player/u);
  assert.deepEqual(tool.relatedExistingIds, ['audio-spectrogram', 'function-grapher']);
});

test('modular inverse calculator distinguishes inverse existence from modulo remainder', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'modular-inverse-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'modular inverse calculator');
  assert.match(tool.acceptance, /inverse of 3 modulo 7 is 5/u);
  assert.match(tool.functions.join(' '), /greatest common divisor/u);
  assert.match(tool.boundary, /not a remainder calculator/u);
  assert.deepEqual(tool.relatedExistingIds, ['gcd-lcm-calculator']);
});

test('A/B test calculator estimates between-group evidence, not a single conversion rate', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'a-b-test-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'a b test calculator');
  assert.ok(tool.functions.some((entry) => entry.includes('Newcombe')));
  assert.match(tool.boundary, /false positives|false-positive|sequential/iu);
  assert.deepEqual(tool.relatedExistingIds, ['percentage-calculator']);
});

test('investment allocation calculator applies user-set targets without recommending securities', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'investment-allocation-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'portfolio allocation calculator');
  assert.match(tool.acceptance, /6,000 and 4,000/u);
  assert.match(tool.boundary, /does not recommend an allocation/u);
  assert.deepEqual(tool.relatedExistingIds, ['compound-interest-calculator']);
});

test('repeating decimal converter handles periodic notation without competing with finite fraction arithmetic', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'repeating-decimal-to-fraction');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'repeating decimal to fraction calculator');
  assert.match(tool.acceptance, /0\.\(3\).*1\/3/u);
  assert.match(tool.boundary, /not finite decimals/u);
  assert.deepEqual(tool.relatedExistingIds, ['fraction-calculator']);
});

test('SVD calculator handles compact rectangular reconstruction, distinct from basic matrix operations', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'singular-value-decomposition-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'svd calculator');
  assert.match(tool.acceptance, /diagonal matrix.*3 and 2/su);
  assert.match(tool.functions.join(' '), /rectangular matrix/u);
  assert.match(tool.boundary, /floating-point tolerance/u);
  assert.deepEqual(tool.relatedExistingIds, ['matrix-calculator']);
});

test('Roth vs traditional compares user-entered tax scenarios without giving tax or account advice', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'roth-vs-traditional-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'roth ira vs traditional ira calculator');
  assert.match(tool.boundary, /not tax, investment, eligibility or account advice/u);
  assert.match(tool.acceptance, /equal pretax budgets produce equal after-tax balances/u);
  assert.deepEqual(tool.relatedExistingIds, ['compound-interest-calculator']);
});

test('the additive catalog rejects protected-ID collisions, duplicate IDs and incomplete contracts', () => {
  const base = growthPilotTools[0];
  assert.throws(() => assertGrowthCatalogIsAdditive(tools, [{ ...base, id: tools[0].id }]), /protected UsefulVerse ID/);
  assert.throws(() => assertGrowthCatalogIsAdditive(tools, [base, base]), /Duplicate new tool ID/);
  assert.throws(() => assertGrowthCatalogIsAdditive(tools, [{ ...base, acceptance: '' }]), /Incomplete product contract/);
  assert.throws(() => assertGrowthCatalogIsAdditive(tools, [{ ...base, relatedExistingIds: ['not-real'] }]), /missing related tool/);
});
