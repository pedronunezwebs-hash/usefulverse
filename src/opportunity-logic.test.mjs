import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCommission, calculateConcrete, calculateCoordinateGeometry, calculateCreditPayoff,
  calculateProbability, calculateTax, calculateTiles, calculateZScore, compareUnitPrices,
  calculateCombinatorics, calculateDistribution, calculateLinearRegression, calculateMeanConfidenceInterval,
  calculateSampleSize, calculateSequence, calculateSolidVolume, createDocument, factorQuadratic,
  longDivision, roundNumber, solveEquation, solveLinearSystem, solveTriangleSSS, translateMorse,
  calculateBreakEven, calculateRoiCagr, calculateDepreciation, calculateDimensionalWeight,
  calculatePaint, calculateBoardFeet, scaleRecipe, validateIban,
  buildUtmUrl, buildRobotsTxt, buildSitemapXml, buildJsonLd, buildMetaTags,
  calculateColorContrast, generateColorPalette, generateCssGradient, generateCssShadow, generateCssLayout,
  differentiatePolynomial, integratePolynomial, calculateMatrix, buildTruthTable,
  calculateStatisticalTest, calculateCashFlows, calculateDebtPayoff, calculateRentVsBuy,
  createCitation, validateJsonSchema, queryJsonPath,
  makePrintableCalendar, makeFlashcards, makeWordSearch, makeBingoCard,
  calculateAdultBmi, calculateBmrTdee,
  calculateMacros, calculateRunningPace, estimateOneRepMax, buildCoverLetter, generateTestData,
  generateMathWorksheet,
  calculateOpportunity,
} from './opportunity-logic.mjs';

test('equation solver handles linear, quadratic, repeated and invalid real roots', () => {
  assert.match(solveEquation({ a: 0, b: 2, c: -4 }), /x = 2/u);
  assert.match(solveEquation({ a: 1, b: -3, c: 2 }), /x = 2, x = 1/u);
  assert.match(solveEquation({ a: 1, b: 2, c: 1 }), /Repeated root/u);
  assert.match(solveEquation({ a: 1, b: 0, c: 1 }), /No real roots/u);
});

test('linear systems classify unique, inconsistent and underdetermined systems', () => {
  assert.match(solveLinearSystem({ r1: '1,1,3', r2: '1,-1,1' }), /x = 2, y = 1/u);
  assert.match(solveLinearSystem({ r1: '1,1,2', r2: '2,2,5' }), /No solution/u);
  assert.match(solveLinearSystem({ r1: '1,1,2', r2: '2,2,4' }), /Infinitely many/u);
  assert.match(solveLinearSystem({ r1: '1,0,0,1', r2: '0,1,0,2', r3: '0,0,1,3' }), /x = 1, y = 2, z = 3/u);
  assert.throws(() => solveLinearSystem({ r1: '1,0,1', r2: '0,1,2', r3: '1,1,3,4' }), /same width/u);
});

test('integer factorization signs and domain are correct', () => {
  assert.match(factorQuadratic({ a: 1, b: -3, c: 2 }), /\(x − 2\)\(x − 1\)/u);
  assert.match(factorQuadratic({ a: 1, b: 1, c: -6 }), /\(x − 2\)\(x \+ 3\)/u);
  assert.throws(() => factorQuadratic({ a: 0, b: 1, c: 1 }), /not equal to zero/u);
});

test('probabilities enforce valid joint events and calculate conditional values', () => {
  assert.match(calculateProbability({ pa: 0.5, pb: 0.4, pab: 0.2 }), /P\(A or B\) = 0.7/u);
  assert.throws(() => calculateProbability({ pa: 0.2, pb: 0.2, pab: 0.3 }), /valid for both/u);
});

test('z-score uses a positive standard deviation', () => {
  assert.match(calculateZScore({ value: 1, mean: 0, sd: 1 }), /Z-score: 1/u);
  assert.throws(() => calculateZScore({ value: 1, mean: 0, sd: 0 }), /greater than zero/u);
});

test('coordinate geometry handles a vertical line and a regular line', () => {
  assert.match(calculateCoordinateGeometry({ x1: 2, y1: 1, x2: 2, y2: 5 }), /vertical line/u);
  assert.match(calculateCoordinateGeometry({ x1: 0, y1: 1, x2: 2, y2: 5 }), /Line: y = 2x \+ 1/u);
});

test('long division returns quotient and remainder and rejects zero divisor', () => {
  assert.match(longDivision({ dividend: 17, divisor: 5 }), /Quotient: 3\nRemainder: 2/u);
  assert.match(longDivision({ dividend: 17, divisor: 5 }), /17 − 15 = 2/u);
  assert.throws(() => longDivision({ dividend: 12, divisor: 0 }), /positive whole-number divisor/u);
});

test('decimal rounding supports half-up, half-even and significant figures', () => {
  assert.equal(roundNumber({ value: '2.5', digits: 0, mode: 'half-up' }), '3');
  assert.equal(roundNumber({ value: '2.5', digits: 0, mode: 'half-even' }), '2');
  assert.equal(roundNumber({ value: '1234', digits: 2, mode: 'half-up', precision: 'significant' }), '1.2e+3');
});

test('tax, forward and reverse commission, payoff modes and unit price work', () => {
  assert.match(calculateTax({ amount: 110, rate: 10, mode: 'included' }), /Net price: 100\nTax: 10/u);
  assert.match(calculateCommission({ sale: 100, rate: 5, fee: 2 }), /Commission: 7/u);
  assert.match(calculateCommission({ sale: 100, knownCommission: 7, fee: 2, mode: 'rate' }), /Commission rate: 5%/u);
  assert.throws(() => calculateCommission({ sale: 0, rate: 2 }), /greater than zero/u);
  assert.match(calculateCreditPayoff({ balance: 100, apr: 0, payment: 30 }), /Payments: 4/u);
  assert.match(calculateCreditPayoff({ balance: 100, apr: 0, mode: 'minimum', minimumPercent: 50, minimumFloor: 5 }), /Payments: 6/u);
  assert.throws(() => calculateCreditPayoff({ balance: 100, apr: 24, payment: 1 }), /does not cover/u);
  assert.match(compareUnitPrices({ price1: 4, quantity1: 8, price2: 3, quantity2: 4, unit: 'oz' }), /Package A has the lower/u);
});

test('construction estimators include entered waste and bag yield', () => {
  assert.match(calculateConcrete({ length: 10, width: 10, depth: 4 / 12, waste: 10, bagYield: 0.5 }), /Estimated bags at entered yield: 74/u);
  assert.match(calculateConcrete({ length: 2, width: 3, depth: 0.5, unit: 'm', waste: 0 }), /Slab volume: 3 m³/u);
  assert.match(calculateTiles({ roomLength: 120, roomWidth: 120, tileLength: 12, tileWidth: 12, waste: 10 }), /Tiles with 10% allowance: 110/u);
  assert.match(calculateTiles({ roomLength: 300, roomWidth: 300, tileLength: 30, tileWidth: 30, unit: 'cm', waste: 0 }), /Tiles before allowance: 100/u);
});

test('receipt and quotation are local text drafts with explicit caveats', () => {
  const inputs = { seller: 'Example shop', customer: 'A', items: 'Notebook, 2, 3.50', tax: 10, currency: 'USD', validUntil: '2026-12-31' };
  assert.match(createDocument(inputs, 'receipt'), /Total: USD 7\.70/u);
  assert.match(createDocument(inputs, 'receipt'), /does not confirm that a payment cleared/u);
  assert.match(createDocument(inputs, 'quotation'), /Valid until: 2026-12-31/u);
  assert.throws(() => createDocument({ ...inputs, items: 'bad line' }), /use description/u);
});

test('Morse conversion rejects unsupported characters and malformed groups', () => {
  assert.equal(translateMorse({ mode: 'text-morse', text: 'SOS 2' }), '... --- ... / ..---');
  assert.equal(translateMorse({ mode: 'morse-text', text: '... --- ... / ..---' }), 'SOS 2');
  assert.throws(() => translateMorse({ mode: 'text-morse', text: '¿' }), /not supported/u);
  assert.throws(() => translateMorse({ mode: 'morse-text', text: '......' }), /valid Morse/u);
});

test('combinatorics and probability distributions respect their domains', () => {
  assert.match(calculateCombinatorics({ n: 5, r: 2 }), /Combinations: 10/u);
  assert.match(calculateCombinatorics({ n: 5, r: 2, mode: 'permutation' }), /Permutations: 20/u);
  assert.match(calculateDistribution({ kind: 'normal', value: 0, mean: 0, sd: 1 }), /0\.5/u);
  assert.match(calculateDistribution({ kind: 'binomial', n: 2, p: 0.5, k: 1 }), /P\(X = 1\) = 0\.5/u);
  assert.match(calculateDistribution({ kind: 'poisson', lambda: 1, k: 0 }), /P\(X = 0\) = 0\.36787944/u);
  assert.throws(() => calculateCombinatorics({ n: 4, r: 5 }), /0 ≤ r ≤ n/u);
});

test('statistical estimates declare their methods and enforce inputs', () => {
  assert.match(calculateMeanConfidenceInterval({ mean: 100, sd: 10, n: 100 }), /98\.040036 to 101\.959964/u);
  assert.match(calculateMeanConfidenceInterval({ mean: 10, sd: 2, n: 25, confidence: 90 }), /known population standard deviation/u);
  assert.match(calculateSampleSize({ confidence: 95, margin: 5 }), /Required sample size: 385/u);
  assert.match(calculateSampleSize({ confidence: 95, margin: 5, population: 1000 }), /Required sample size: 278/u);
  assert.throws(() => calculateMeanConfidenceInterval({ mean: 1, sd: 0, n: 20 }), /greater than zero/u);
});

test('regression, SSS triangles, solid volume and sequences match reference values', () => {
  assert.match(calculateLinearRegression({ pairs: '0,1\n1,3\n2,5' }), /y = 2x \+ 1/u);
  assert.throws(() => calculateLinearRegression({ pairs: '1,2\n1,3' }), /x values/u);
  assert.match(solveTriangleSSS({ a: 3, b: 4, c: 5 }), /Area: 6/u);
  assert.throws(() => solveTriangleSSS({ a: 1, b: 2, c: 3 }), /do not form/u);
  assert.match(calculateSolidVolume({ shape: 'sphere', a: 1 }), /Sphere volume: 4\.18879/u);
  assert.match(calculateSolidVolume({ shape: 'box', a: 2, b: 3, h: 4 }), /Rectangular prism volume: 24/u);
  assert.match(calculateSequence({ first: 2, step: 3, count: 4 }), /Term 4: 11/u);
  assert.match(calculateSequence({ mode: 'geometric', first: 2, step: 3, count: 4 }), /Sum of first 4 terms: 80/u);
});

test('financial and practical estimates validate inputs and match sample results', () => {
  assert.match(calculateBreakEven({ fixed: 1000, price: 20, variable: 10 }), /Break-even units: 100/u);
  assert.throws(() => calculateBreakEven({ fixed: 1000, price: 10, variable: 10 }), /greater than variable/u);
  assert.match(calculateRoiCagr({ initial: 100, final: 121, years: 2 }), /Annualized CAGR: 10%/u);
  assert.match(calculateDepreciation({ cost: 1000, salvage: 100, life: 3 }), /ending book value 100\.00/u);
  assert.match(calculateDimensionalWeight({ length: 20, width: 10, height: 5, divisor: 5000, actual: 1 }), /Dimensional weight: 0\.2 kg/u);
  assert.match(calculatePaint({ length: 10, height: 2.5, openings: 2, coats: 2, coverage: 10 }), /Estimated paint: 4\.6 liters/u);
  assert.match(calculateBoardFeet({ thickness: 2, width: 6, length: 8, quantity: 2 }), /Total board feet: 16/u);
  assert.match(scaleRecipe({ from: 2, to: 4, items: '1 cup flour\n.5 tsp salt' }), /2 cup flour\n1 tsp salt/u);
  assert.match(validateIban({ iban: 'GB82 WEST 1234 5698 7654 32' }), /MOD-97 checksum: valid/u);
  assert.match(validateIban({ iban: 'GB81 WEST 1234 5698 7654 32' }), /checksum: invalid/u);
});

test('SEO generators produce escaped local output and reject unsafe or incomplete input', () => {
  assert.match(buildUtmUrl({ url: 'https://example.com/?q=1', source: 'newsletter', medium: 'email', campaign: 'spring sale' }), /utm_campaign=spring\+sale/u);
  assert.throws(() => buildUtmUrl({ url: 'javascript:alert(1)', source: 'x', medium: 'y', campaign: 'z' }), /http or https/u);
  assert.match(buildRobotsTxt({ agent: '*', allow: '/public', disallow: '/private', sitemap: 'https://example.com/sitemap.xml' }), /Disallow: \/private\n\nSitemap/u);
  assert.throws(() => buildRobotsTxt({ disallow: 'private' }), /start with \/ /u);
  assert.match(buildSitemapXml({ urls: 'https://example.com/a?x=1&y=2\nhttps://example.com/a?x=1&y=2' }), /&amp;y=2/u);
  assert.equal((buildSitemapXml({ urls: 'https://example.com/a\nhttps://example.com/a' }).match(/<loc>/gu) ?? []).length, 1);
  assert.match(buildJsonLd({ kind: 'Organization', name: 'A & B', url: 'https://example.com' }), /A & B/u);
  assert.throws(() => buildJsonLd({ kind: 'Article', name: 'Title', url: 'https://example.com', date: 'not a date' }), /valid publication date/u);
  assert.match(buildMetaTags({ title: 'Hello', description: 'A <small> page', url: 'https://example.com' }), /A &lt;small&gt; page/u);
  assert.throws(() => buildMetaTags({ title: '', description: 'x', url: 'https://example.com' }), /title up to/u);
});

test('CSS and color tools validate input and emit usable CSS or WCAG contrast results', () => {
  assert.match(calculateColorContrast({ foreground: '#000', background: '#fff' }), /21:1[\s\S]*normal text.*pass/u);
  assert.match(calculateColorContrast({ foreground: '#777', background: '#fff' }), /normal text \(4\.5:1\): not met/u);
  assert.throws(() => calculateColorContrast({ foreground: 'red;', background: '#fff' }), /hex color/u);
  assert.match(generateColorPalette({ color: '#0000ff' }), /#0000FF[\s\S]*#FFFF00/u);
  assert.match(generateCssGradient({ color1: '#fff', color2: '#000', angle: 90 }), /linear-gradient\(90deg, #FFFFFF, #000000\)/u);
  assert.throws(() => generateCssGradient({ color1: 'url(javascript:1)', color2: '#fff' }), /hex color/u);
  assert.match(generateCssShadow({ x: 0, y: 8, blur: 24, spread: 0, color: '#000', opacity: 20 }), /rgba\(0, 0, 0, 0\.2\)/u);
  assert.match(generateCssLayout({ kind: 'grid', columns: 3, gap: 16 }), /repeat\(3, minmax\(0, 1fr\)\)/u);
  assert.match(generateCssLayout({ kind: 'flex', columns: 2, gap: 12, alignment: 'center' }), /display: flex/u);
  assert.throws(() => generateCssLayout({ kind: 'grid', columns: 99 }), /1–12 columns/u);
});

test('polynomial calculus, matrices and truth tables match known results and reject malformed input', () => {
  assert.match(differentiatePolynomial({ coefficients: '1,0,3', x: 2 }), /f′\(x\) = 6x\nf′\(2\) = 12/u);
  assert.match(differentiatePolynomial({ coefficients: '5' }), /f′\(x\) = 0/u);
  assert.throws(() => differentiatePolynomial({ coefficients: '1,nope' }), /finite coefficients/u);
  assert.match(integratePolynomial({ coefficients: '0,1', lower: 0, upper: 1 }), /F\(x\) = 0\.5x\^2 \+ C\nDefinite integral from 0 to 1 = 0\.5/u);
  assert.throws(() => integratePolynomial({ coefficients: '1', lower: 0 }), /both lower and upper/u);
  assert.match(calculateMatrix({ matrix: '1,2\n3,4' }), /Determinant: -2/u);
  assert.match(calculateMatrix({ matrix: '1,2\n3,4', operation: 'inverse' }), /-2, 1\n1\.5, -0\.5/u);
  assert.equal(calculateMatrix({ matrix: '1,2,3\n4,5,6', operation: 'transpose' }), '1, 4\n2, 5\n3, 6');
  assert.throws(() => calculateMatrix({ matrix: '1,2\n2,4', operation: 'inverse' }), /singular/u);
  assert.match(buildTruthTable({ expression: 'A & !B' }), /A  B  \|  Result\n0  0  \|  0\n0  1  \|  0\n1  0  \|  1/u);
  assert.match(buildTruthTable({ expression: 'A -> B' }), /1  0  \|  0/u);
  assert.throws(() => buildTruthTable({ expression: 'A; alert(1)' }), /Use variables/u);
});

test('statistical tests report the selected method and reject invalid sample structure', () => {
  assert.match(calculateStatisticalTest({ test: 't', sample: '2,4,6', mu0: 0 }), /t statistic: 3\.464102[\s\S]*Degrees of freedom: 2[\s\S]*p-value: 0\.0741799/u);
  assert.match(calculateStatisticalTest({ test: 'chi', observed: '10,20', expected: '15,15' }), /χ² statistic: 3\.333333[\s\S]*p-value: 0\.06788915/u);
  assert.match(calculateStatisticalTest({ test: 'anova', groups: '1,2,3;4,5,6;7,8,9' }), /F statistic: 27[\s\S]*p-value: 0\.001/u);
  assert.throws(() => calculateStatisticalTest({ test: 'chi', observed: '3,4', expected: '0,7' }), /greater than zero/u);
  assert.throws(() => calculateStatisticalTest({ test: 'anova', groups: '1,1;2,2' }), /within-group variation/u);
});

test('cash flow, debt payoff and rent-buy estimators expose assumptions and match reference cases', () => {
  assert.match(calculateCashFlows({ flows: '-100,110', discountRate: 10 }), /NPV at 10%: 0[\s\S]*Estimated IRR: 10%/u);
  assert.throws(() => calculateCashFlows({ flows: '100,50', discountRate: 10 }), /at least one positive and one negative/u);
  const payoff = calculateDebtPayoff({ debts: 'Card A,1200,0,100', budget: 100 });
  assert.match(payoff, /Avalanche · 12 months · interest 0 ·/u);
  assert.match(payoff, /Snowball · 12 months/u);
  assert.throws(() => calculateDebtPayoff({ debts: 'Card,1000,18,50', budget: 40 }), /covers all minimum payments/u);
  assert.match(calculateRentVsBuy({ homePrice: 200000, downPaymentPercent: 20, mortgageRate: 0, years: 1, mortgageTermYears: 30, monthlyRent: 1000, rentIncrease: 0, appreciation: 0, propertyTax: 0, maintenance: 0, investmentReturn: 0 }), /Rent paid: 12000[\s\S]*Estimated remaining mortgage: 154666\.67/u);
});

test('citation styles format supported sources and require safe webpage URLs', () => {
  const base = { author: 'Lovelace, Ada', title: 'Notes', site: 'Example Press', date: '1843', kind: 'book', style: 'apa' };
  assert.equal(createCitation(base), 'Lovelace, Ada (1843). Notes. Example Press.');
  assert.match(createCitation({ ...base, style: 'mla' }), /Lovelace, Ada\. Notes\. Example Press, 1843\./u);
  assert.throws(() => createCitation({ ...base, kind: 'web', url: 'javascript:alert(1)' }), /http or https/u);
});

test('JSON Schema subset validates common types, required properties and constraints', () => {
  const schema = JSON.stringify({ type: 'object', required: ['name'], properties: { name: { type: 'string', minLength: 2 }, age: { type: 'integer', minimum: 0 } }, additionalProperties: false });
  assert.match(validateJsonSchema({ json: '{"name":"Ada","age":37}', schema }), /^Valid/u);
  assert.match(validateJsonSchema({ json: '{"name":"A","extra":1}', schema }), /minLength[\s\S]*additional property/u);
  assert.throws(() => validateJsonSchema({ json: '{', schema }), /JSON data/u);
});

test('JSONPath safe subset selects keys, indexes, wildcards and equality-filtered rows', () => {
  const json = '{"users":[{"name":"Ada","active":true},{"name":"Lin","active":false}]}';
  assert.equal(queryJsonPath({ json, path: '$.users[*].name' }), '[\n  "Ada",\n  "Lin"\n]');
  assert.equal(queryJsonPath({ json, path: '$.users[?(@.active == true)].name' }), '"Ada"');
  assert.equal(queryJsonPath({ json, path: '$.users[0].name' }), '"Ada"');
  assert.throws(() => queryJsonPath({ json, path: '$..name' }), /Recursive descent/u);
});

test('printable calendars handle leap years and week-start offsets', () => {
  const february = makePrintableCalendar({ year: 2024, month: 2, weekStart: 0 });
  assert.match(february, /2024-02/u);
  assert.match(february, /29/u);
  assert.throws(() => makePrintableCalendar({ year: 2023, month: 13 }), /month 1 to 12/u);
});

test('flashcards parse rows and reject missing backs', () => {
  assert.match(makeFlashcards({ cards: 'Term, Definition' }), /FRONT: Term\n   BACK: Definition/u);
  assert.throws(() => makeFlashcards({ cards: 'missing separator' }), /use term, definition/u);
});

test('word search is seeded, places all words and validates capacity', () => {
  const input = { words: 'PLANET, COMET, STAR', size: 10, seed: 'test' };
  const result = makeWordSearch(input);
  assert.equal(makeWordSearch(input), result);
  assert.match(result, /PLANET:[\s\S]*COMET:[\s\S]*STAR:/u);
  assert.throws(() => makeWordSearch({ ...input, words: 'ABCDEFGHIJK', size: 8 }), /no longer than the grid/u);
});

test('bingo cards are reproducible and require unique pool', () => {
  const entries = Array.from({ length: 24 }, (_, i) => `Entry ${i + 1}`).join('\n');
  const card = makeBingoCard({ entries, seed: 'same' });
  assert.equal(makeBingoCard({ entries, seed: 'same' }), card);
  assert.match(card, /B\s+I\s+N\s+G\s+O[\s\S]*FREE/u);
  assert.throws(() => makeBingoCard({ entries: 'one\ntwo' }), /24 to 500/u);
});

test('adult BMI supports metric and US units and states its limitation', () => {
  assert.match(calculateAdultBmi({ units: 'metric', heightCm: 175, weightKg: 70 }), /BMI: 22\.9[\s\S]*not a diagnosis/u);
  assert.match(calculateAdultBmi({ units: 'us', heightFt: 5, heightIn: 9, weightLb: 160 }), /BMI: 23\.6/u);
  assert.throws(() => calculateAdultBmi({ units: 'metric', heightCm: 0, weightKg: 70 }), /height/u);
});

test('BMR and TDEE use Mifflin–St Jeor plus selected activity and require adult inputs', () => {
  assert.match(calculateBmrTdee({ sex: 'female', age: 30, heightCm: 170, weightKg: 65, activity: 1.2 }), /resting energy \(Mifflin–St Jeor\): 1402 kcal\/day[\s\S]*1682 kcal\/day/u);
  assert.throws(() => calculateBmrTdee({ sex: 'male', age: 17, heightCm: 170, weightKg: 65, activity: 1.2 }), /adults aged 18/u);
});

test('macro calculator requires percentages totaling 100 and uses standard energy factors', () => {
  assert.match(calculateMacros({ calories: 2000, protein: 25, carbs: 50, fat: 25 }), /Protein: 125 g[\s\S]*Carbohydrate: 250 g[\s\S]*Fat: 56 g/u);
  assert.throws(() => calculateMacros({ calories: 2000, protein: 25, carbs: 50, fat: 20 }), /totaling exactly 100/u);
});

test('running pace converts units and formats time with validation', () => {
  assert.match(calculateRunningPace({ distance: 5, unit: 'km', hours: 0, minutes: 25, seconds: 0 }), /5:00 per km · 8:02 per mile/u);
  assert.throws(() => calculateRunningPace({ distance: 5, unit: 'km', hours: 0, minutes: 60, seconds: 0 }), /minutes\/seconds/u);
});

test('one-rep max returns two named estimates and limits repetitions', () => {
  assert.match(estimateOneRepMax({ weight: 100, unit: 'kg', reps: 5 }), /Epley: 116\.7 kg[\s\S]*Brzycki: 112\.5 kg/u);
  assert.throws(() => estimateOneRepMax({ weight: 100, reps: 16 }), /1 to 15/u);
});

test('cover letter builder uses supplied content without inventing claims', () => {
  const letter = buildCoverLetter({ name: 'Ada', company: 'Example', role: 'Engineer', experience: 'I built a test project.', motivation: 'I value the role.', closing: 'Thank you.' });
  assert.match(letter, /applying for the Engineer position at Example/u);
  assert.match(letter, /I built a test project\./u);
  assert.throws(() => buildCoverLetter({ name: 'Ada' }), /company, role/u);
});

test('test data generator produces deterministic safe fixtures', () => {
  const generated = generateTestData({ fields: 'id,name,email,active', rows: 2, seed: 'x' });
  assert.equal(generateTestData({ fields: 'id,name,email,active', rows: 2, seed: 'x' }), generated);
  assert.match(generated, /person1@example\.test/u);
  assert.throws(() => generateTestData({ fields: 'a,a', rows: 1 }), /unique field names/u);
});

test('math worksheet seed reproduces valid arithmetic and answer keys', () => {
  const input = { operation: 'divide', count: 10, max: 20, seed: 's1' };
  const output = generateMathWorksheet(input);
  assert.equal(generateMathWorksheet(input), output);
  assert.equal((output.match(/ = ______/gu) ?? []).length, 10);
  assert.match(output, /ANSWER KEY/u);
  assert.throws(() => generateMathWorksheet({ ...input, count: 51 }), /1 to 50/u);
});

test('diagram and chart engines validate bounded entries before visual SVG rendering', () => {
  assert.equal(calculateOpportunity('chart-maker', { csv: 'Month,Value\nJan,2\nFeb,5', type: 'bar' }), 'Jan,2\nFeb,5');
  assert.equal(calculateOpportunity('diagram-maker', { steps: 'Start\nReview\nFinish' }), 'Start\nReview\nFinish');
  assert.throws(() => calculateOpportunity('chart-maker', { csv: 'a,nope\nb,2' }), /number/u);
  assert.throws(() => calculateOpportunity('diagram-maker', { steps: 'only one' }), /2–12/u);
});

test('hex editor renders every row with the correct byte offset and printable column', () => {
  const result = calculateOpportunity('hex-editor', { hex: '41 42 00 7e' });
  assert.match(result, /^00000000\s+41 42 00 7e/u);
  assert.match(result, /AB.~/u);
  const longer = calculateOpportunity('hex-editor', { hex: Array.from({ length: 18 }, (_, i) => i.toString(16).padStart(2, '0')).join(' ') });
  assert.match(longer, /\n00000010\s+10/u);
});
