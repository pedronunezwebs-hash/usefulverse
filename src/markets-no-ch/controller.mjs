import { decodePhonetic, encodePhonetic, gradeFromPoints, graphPaperSvg, knittingGauge, natoAlphabet, norwayHolidayPay, radioDigits, validateBinaryGrid } from './logic.mjs';

const q = (root, selector) => root.querySelector(selector);
const n = (root, selector) => Number(q(root, selector)?.value);
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function saveFile(name, type, contents) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement('a'); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function show(root, text, kind = 'success') {
  const output = q(root, '[data-result]');
  if (!output) return;
  output.hidden = false; output.className = `result result--${kind}`; output.textContent = text;
}

function mountKnitting(root, copy) {
  const run = () => {
    const result = knittingGauge({ stitches: n(root, '#stitches'), rows: n(root, '#rows'), sampleWidthCm: n(root, '#sample-width'), sampleHeightCm: n(root, '#sample-height'), targetWidthCm: n(root, '#target-width'), targetHeightCm: n(root, '#target-height'), repeat: n(root, '#repeat'), symmetric: q(root, '#symmetric').checked });
    show(root, `${copy.resultStitches}: ${result.stitches} (${result.rawStitches.toFixed(1)} ${copy.beforeAdjustment}); ${copy.resultRows}: ${result.rows}. ${copy.resultWidth}: ${result.widthAfterAdjustmentCm.toFixed(2)} cm (${result.widthDifferenceCm >= 0 ? '+' : ''}${result.widthDifferenceCm.toFixed(2)} cm). ${copy.gauge}: ${result.stitchesPer10Cm.toFixed(1)} ${copy.stitchesPer10Cm}, ${result.rowsPer10Cm.toFixed(1)} ${copy.rowsPer10Cm}.`);
  };
  q(root, '[data-action="calculate"]').addEventListener('click', () => { try { run(); } catch { show(root, copy.messages.invalid, 'error'); } });
  q(root, '[data-action="print"]').addEventListener('click', () => window.print());
}

function csvValue(value) {
  const text = String(value);
  const neutral = /^[=+\-@\t\r]/u.test(text) ? `'${text}` : text;
  return `"${neutral.replaceAll('"', '""')}"`;
}
function mountGrades(root, copy) {
  let last = null;
  const bands = () => [
    { label: q(root, '#label-a').value, minimumPercent: n(root, '#threshold-a') },
    { label: q(root, '#label-b').value, minimumPercent: n(root, '#threshold-b') },
    { label: q(root, '#label-c').value, minimumPercent: n(root, '#threshold-c') },
  ];
  q(root, '[data-action="calculate"]').addEventListener('click', () => {
    try {
      last = gradeFromPoints({ score: n(root, '#score'), maximum: n(root, '#maximum'), bands: bands() });
      show(root, `${copy.resultGrade}: ${last.label} · ${last.percent.toFixed(2)}% · ${last.points}/${last.maximum}.`);
    } catch { last = null; show(root, copy.messages.invalid, 'error'); }
  });
  q(root, '[data-action="csv"]').addEventListener('click', () => {
    try {
      const items = bands().sort((a, b) => a.minimumPercent - b.minimumPercent);
      const rows = [[copy.fields.labelA, copy.fields.thresholdA], ...items.map((item) => [item.label, `${item.minimumPercent}%`])];
      saveFile('grade-scale.csv', 'text/csv;charset=utf-8', `\uFEFF${rows.map((row) => row.map(csvValue).join(',')).join('\r\n')}`);
    } catch { show(root, copy.messages.invalid, 'error'); }
  });
  q(root, '[data-action="print"]').addEventListener('click', () => window.print());
}

function mountGraph(root, copy) {
  const page = q(root, '#page-size');
  const custom = q(root, '[data-custom]');
  const output = q(root, '[data-print]');
  let latest = null;
  const updatePage = () => { custom.hidden = page.value !== 'custom'; };
  page.addEventListener('change', updatePage);
  updatePage();
  q(root, '[data-action="generate"]').addEventListener('click', () => {
    try {
      const [presetWidth, presetHeight] = page.value === 'letter' ? [215.9, 279.4] : page.value === 'a4' ? [210, 297] : [n(root, '#width-mm'), n(root, '#height-mm')];
      latest = graphPaperSvg({ widthMm: presetWidth, heightMm: presetHeight, spacingMm: n(root, '#spacing-mm'), marginMm: n(root, '#margin-mm'), style: q(root, '#pattern').value, color: q(root, '#grid-color').value, copies: n(root, '#copies') });
      output.replaceChildren();
      for (let i = 0; i < latest.pages; i += 1) { const holder = document.createElement('div'); holder.className = 'paper-page'; holder.innerHTML = latest.svg; output.append(holder); }
      show(root, `${copy.messages.generated} ${latest.widthMm} × ${latest.heightMm} mm · ${latest.spacingMm} mm.`);
    } catch { latest = null; output.replaceChildren(); show(root, copy.messages.invalid, 'error'); }
  });
  q(root, '[data-action="download"]').addEventListener('click', () => { if (!latest) { show(root, copy.generateFirst, 'error'); return; } saveFile('graph-paper.svg', 'image/svg+xml;charset=utf-8', latest.svg); });
  q(root, '[data-action="print"]').addEventListener('click', () => { if (!latest) { show(root, copy.generateFirst, 'error'); return; } window.print(); });
}

function mountBinary(root, copy) {
  const board = q(root, '[data-board]');
  const size = q(root, '#size');
  let puzzle = null; let values = [];
  let worker = null;
  const render = () => {
    board.style.setProperty('--board-size', puzzle.size);
    board.replaceChildren();
    for (let r = 0; r < puzzle.size; r += 1) for (let c = 0; c < puzzle.size; c += 1) {
      const clue = puzzle.puzzle[r][c] !== null;
      const button = document.createElement('button');
      button.type = 'button'; button.className = `binary-cell${clue ? ' is-clue' : ''}`;
      button.setAttribute('role', 'gridcell'); button.setAttribute('aria-label', `${r + 1}, ${c + 1}: ${values[r][c] ?? copy.emptyCell}`);
      button.textContent = values[r][c] === null ? '' : String(values[r][c]); button.disabled = clue;
      button.addEventListener('click', () => { values[r][c] = values[r][c] === null ? 0 : values[r][c] === 0 ? 1 : null; render(); });
      board.append(button);
    }
  };
  const fresh = () => {
    worker?.terminate();
    board.replaceChildren();
    show(root, copy.messages.generating, 'info');
    const seed = crypto.getRandomValues(new Uint32Array(1))[0] || Date.now();
    worker = new Worker(new URL('./binary-worker.mjs', import.meta.url), { type: 'module' });
    worker.addEventListener('message', ({ data }) => {
      worker?.terminate(); worker = null;
      if (!data.ok) { show(root, copy.messages.generationError, 'error'); return; }
      puzzle = data.puzzle; values = puzzle.puzzle.map((row) => [...row]); render(); show(root, copy.messages.generated);
    }, { once: true });
    worker.postMessage({ size: Number(size.value), seed });
  };
  size.addEventListener('change', fresh);
  q(root, '[data-action="new"]').addEventListener('click', fresh);
  q(root, '[data-action="check"]').addEventListener('click', () => {
    if (values.some((row) => row.some((cell) => cell === null))) { show(root, copy.fillAll, 'error'); return; }
    show(root, validateBinaryGrid(values) && values.every((row, r) => row.every((cell, c) => cell === puzzle.solution[r][c])) ? copy.messages.solved : copy.messages.notSolved, validateBinaryGrid(values) ? 'success' : 'error');
  });
  q(root, '[data-action="hint"]').addEventListener('click', () => {
    const blanks = [];
    values.forEach((row, r) => row.forEach((value, c) => { if (value === null) blanks.push([r, c]); }));
    if (!blanks.length) { show(root, copy.noBlanks, 'info'); return; }
    const [r, c] = blanks[crypto.getRandomValues(new Uint32Array(1))[0] % blanks.length]; values[r][c] = puzzle.solution[r][c]; render(); show(root, copy.messages.hint);
  });
  q(root, '[data-action="solution"]').addEventListener('click', () => { values = puzzle.solution.map((row) => [...row]); render(); show(root, copy.messages.solution); });
}

function mountPhonetic(root, copy) {
  const input = q(root, '#phonetic-input');
  const direction = q(root, '#phonetic-direction');
  const practiceField = q(root, '[data-practice]');
  let lastResult = '';
  let challenge = '';
  let challengeDirection = 'encode';
  const convert = () => {
    lastResult = direction.value === 'decode' ? decodePhonetic(input.value) : encodePhonetic(input.value).text;
    show(root, lastResult || copy.messages.invalid, lastResult ? 'success' : 'info');
    if (direction.value === 'encode') {
      const unsupported = encodePhonetic(input.value).unsupported;
      if (unsupported.length) show(root, `${lastResult}\n\n${copy.messages.unsupportedPrefix} ${unsupported.join(' ')}`, 'info');
    }
  };
  q(root, '[data-action="convert"]').addEventListener('click', convert);
  q(root, '[data-action="copy"]').addEventListener('click', async () => {
    if (!lastResult) convert();
    if (!lastResult) return;
    try { await navigator.clipboard.writeText(lastResult); show(root, copy.messages.copied); }
    catch { show(root, lastResult, 'info'); }
  });
  q(root, '[data-action="clear"]').addEventListener('click', () => { input.value = ''; lastResult = ''; show(root, ''); input.focus(); });
  q(root, '[data-action="speak"]').addEventListener('click', () => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) { show(root, copy.fields.noSpeech, 'error'); return; }
    if (!lastResult) convert();
    if (lastResult) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(lastResult)); }
  });
  q(root, '[data-action="practice"]').addEventListener('click', () => {
    const values = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'];
    challenge = values[crypto.getRandomValues(new Uint32Array(1))[0] % values.length];
    challengeDirection = direction.value;
    practiceField.hidden = false;
    q(root, '#practice-answer').value = '';
    const codeword = challenge <= 'Z' ? natoAlphabet[challenge.charCodeAt(0) - 65] : radioDigits[Number(challenge)];
    show(root, `${copy.messages.practicePrompt} ${challengeDirection === 'encode' ? codeword : challenge}.`,'info');
    q(root, '#practice-answer').focus();
  });
  q(root, '#practice-answer').addEventListener('input', (event) => {
    if (!challenge || !event.target.value) return;
    const answer = event.target.value.trim().toLocaleUpperCase('en');
    const expected = challengeDirection === 'encode' ? challenge : (challenge <= 'Z' ? natoAlphabet[challenge.charCodeAt(0) - 65] : radioDigits[Number(challenge)]).toLocaleUpperCase('en');
    const isCorrect = answer === expected;
    show(root, isCorrect ? copy.messages.practiceCorrect : `${copy.messages.practiceWrong} ${expected}.`, isCorrect ? 'success' : 'error');
  });
}

function mountHolidayPay(root, copy) {
  const run = () => {
    try {
      const result = norwayHolidayPay({ holidayPayBasis: n(root, '#holiday-basis'), age60Plus: q(root, '#holiday-age').checked, fiveWeekAgreement: q(root, '#holiday-five-week').checked });
      const amount = new Intl.NumberFormat(document.documentElement.lang, { style: 'currency', currency: 'NOK', maximumFractionDigits: 2 }).format(result.amount);
      const basis = new Intl.NumberFormat(document.documentElement.lang, { style: 'currency', currency: 'NOK', maximumFractionDigits: 2 }).format(result.basis);
      show(root, `${copy.fields.current}: ${amount} · ${copy.fields.rate}: ${result.rate}% · ${copy.fields.basisLabel}: ${basis}. ${copy.limits}`, 'info');
    } catch { show(root, copy.messages.invalid, 'error'); }
  };
  q(root, '[data-action="calculate"]').addEventListener('click', run);
  q(root, '[data-action="reset"]').addEventListener('click', () => { q(root, '#holiday-age').checked = false; q(root, '#holiday-five-week').checked = false; q(root, '#holiday-basis').value = '500000'; show(root, ''); });
}

for (const root of document.querySelectorAll('[data-market-tool]')) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
  if (root.dataset.marketTool === 'knitting') mountKnitting(root, copy);
  if (root.dataset.marketTool === 'grades') mountGrades(root, copy);
  if (root.dataset.marketTool === 'graph') mountGraph(root, copy);
  if (root.dataset.marketTool === 'binary') mountBinary(root, copy);
  if (root.dataset.marketTool === 'phonetic') mountPhonetic(root, copy);
  if (root.dataset.marketTool === 'holidayPay') mountHolidayPay(root, copy);
}

if (document.querySelector('[data-frequency-tone]')) {
  import('./frequency-tone-generator-controller.mjs').catch(() => {
    const status = document.querySelector('[data-tone-status]');
    if (status) {
      const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
      status.textContent = copy.fields?.unsupported ?? copy.fields?.invalid ?? '';
    }
  });
}

if (document.querySelector('[data-disability-tool]')) {
  import('./norway-disability-benefit-controller.mjs');
}

if (document.querySelector('[data-student-finance-tool]')) {
  import('./norway-student-finance-controller.mjs');
}

if (document.querySelector('[data-bsu-tool]')) {
  import('./norway-bsu-controller.mjs');
}

if (document.querySelector('[data-commuting-deduction-tool]')) {
  import('./norway-commuting-deduction-controller.mjs');
}

if (document.querySelector('[data-mileage-tool]')) {
  import('./norway-mileage-reimbursement-controller.mjs');
}

if (document.querySelector('[data-late-interest-tool]')) {
  import('./late-payment-interest-controller.mjs');
}

if (document.querySelector('[data-import-cost-tool]')) {
  import('./norway-import-cost-controller.mjs');
}

if (document.querySelector('[data-car-import-tool]')) {
  import('./norway-car-import-cost-controller.mjs');
}

if (document.querySelector('[data-norway-toll-tool]')) {
  import('./norway-toll-cost-controller.mjs');
}

if (document.querySelector('[data-property-transfer-tool]')) {
  import('./norway-property-transfer-controller.mjs');
}

if (document.querySelector('[data-electricity-support-tool]')) {
  import('./norway-electricity-support-controller.mjs');
}

if (document.querySelector('[data-bead-pattern-tool]')) {
  import('./bead-pattern-controller.mjs');
}

if (document.querySelector('[data-codebreaker-tool]')) {
  import('./codebreaker-controller.mjs');
}

if (document.querySelector('[data-shoe-size-tool]')) {
  import('./shoe-size-controller.mjs');
}

if (document.querySelector('[data-child-growth-tool]')) {
  import('./child-growth-controller.mjs');
}

if (document.querySelector('[data-ring-size-tool]')) {
  import('./ring-size-controller.mjs');
}

if (document.querySelector('[data-model3d-viewer]')) {
  import('./model3d-viewer-controller.mjs');
}

if (document.querySelector('[data-dxf-viewer]')) {
  import('./dxf-viewer-controller.mjs');
}

if (document.querySelector('[data-five-letter-game]')) {
  import('./five-letter-word-controller.mjs');
}

if (document.querySelector('[data-bridge-game]')) {
  import('./bridge-game-controller.mjs');
}

if (document.querySelector('[data-farkle-game]')) {
  import('./farkle-controller.mjs');
}

if (document.querySelector('[data-swiss-net-salary]')) {
  import('./swiss-net-salary-controller.mjs');
}

if (document.querySelector('[data-swiss-tax-compare]')) {
  import('./swiss-tax-compare-controller.mjs');
}

if (document.querySelector('[data-swiss-ahv-pension]')) {
  import('./swiss-ahv-pension-controller.mjs');
}

if (document.querySelector('[data-swiss-pillar-3a]')) {
  import('./swiss-pillar-3a-controller.mjs');
}
if (document.querySelector('[data-swiss-bvg-pension]')) {
  import('./swiss-bvg-pension-controller.mjs');
}
if (document.querySelector('[data-swiss-pension-withdrawal]')) {
  import('./swiss-pension-withdrawal-controller.mjs');
}
if (document.querySelector('[data-swiss-health-deductible]')) {
  import('./swiss-health-deductible-controller.mjs');
}
if (document.querySelector('[data-swiss-rent-adjustment]')) {
  import('./swiss-rent-adjustment-controller.mjs');
}
if (document.querySelector('[data-swiss-vacation-accrual]')) {
  import('./swiss-vacation-accrual-controller.mjs');
}
if (document.querySelector('[data-swiss-premium-reduction]')) {
  import('./swiss-premium-reduction-controller.mjs');
}

if (document.querySelector('[data-remaining-tool]')) {
  import('./remaining-tools-controller.mjs');
}
if (document.querySelector('[data-resume-checker]')) {
  import('./resume-structure-controller.mjs');
}
if (document.querySelector('[data-vocal-remover]')) {
  import('./vocal-remover-controller.mjs');
}
