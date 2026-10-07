import { escapeGrowthHtml } from './render.mjs';

function attachCopy(html, copy) {
  const safeJson = JSON.stringify(copy).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('&', '\\u0026');
  return `<script type="application/json" data-tool-copy>${safeJson}</script>${html}`;
}

function label(id, text, control) {
  return `<div class="field"><label for="${id}">${escapeGrowthHtml(text)}</label>${control}</div>`;
}

function button(action, text, kind = 'primary') {
  const type = action === 'reset' ? 'reset' : ['calculate', 'generate'].includes(action) ? 'submit' : 'button';
  return `<button type="${type}" data-action="${action}" class="button button--${kind}">${escapeGrowthHtml(text)}</button>`;
}

export function renderGrowthForm(toolId, copy) {
  const fields = copy?.fields ?? {};
  const actions = copy?.actions ?? {};
  const fieldNames = {
    'gravel-calculator': ['shape', 'depth', 'length', 'width', 'diameter', 'base', 'triangleHeight', 'dimensionUnit', 'depthUnit', 'density', 'densityUnit', 'waste', 'bagSize', 'bagUnit'],
    'molar-mass-calculator': ['formula'],
    'auto-loan-refinance-calculator': ['balance', 'currentApr', 'currentMonths', 'newApr', 'newMonths', 'fees', 'feeTreatment'],
    'secret-santa-generator': ['names', 'exclusions'],
    mancala: ['mode'],
  }[toolId];
  if (!fieldNames || fieldNames.some((key) => !fields[key])) throw new Error(`Missing localized form fields for ${toolId}.`);
  const actionNames = {
    'gravel-calculator': ['calculate', 'reset', 'copy', 'result', 'rectangle', 'circle', 'triangle', 'meters', 'centimeters', 'feet', 'inches', 'kgPerCubicMeter', 'lbPerCubicFoot', 'kilograms', 'pounds'],
    'molar-mass-calculator': ['calculate', 'reset', 'example', 'copy', 'result'],
    'auto-loan-refinance-calculator': ['calculate', 'reset', 'copy', 'result'],
    'secret-santa-generator': ['generate', 'reset', 'copy', 'download', 'result', 'reveal', 'next', 'privacyNote'],
    mancala: ['newGame', 'rules', 'result', 'computer', 'twoPlayers'],
  }[toolId];
  const missing = actionNames.filter((key) => !actions[key]?.trim());
  if (missing.length) throw new Error(`Missing localized form actions for ${toolId}: ${missing.join(', ')}.`);
  const labels = Object.fromEntries([...new Set([...actionNames, 'calculate', 'generate', 'reset', 'example', 'newGame', 'rules', 'reveal', 'next', 'copy', 'download', 'result', 'progress', 'perPerson', 'metric', 'imperial', 'rectangle', 'circle', 'triangle', 'meters', 'centimeters', 'feet', 'inches', 'kgPerCubicMeter', 'lbPerCubicFoot', 'kilograms', 'pounds', 'twoPlayers', 'computer', 'human', 'currentPlayer', 'opponent', 'privacyNote'])].map((key) => [key, actions[key] ?? '']));
  const submit = (name) => button(name === 'calculate' ? 'calculate' : 'generate', labels[name]);
  const reset = button('reset', labels.reset, 'secondary');

  if (toolId === 'gravel-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('shape', fields.shape, `<select id="shape" name="shape" data-shape><option value="rectangle">${escapeGrowthHtml(labels.rectangle)}</option><option value="circle">${escapeGrowthHtml(labels.circle)}</option><option value="triangle">${escapeGrowthHtml(labels.triangle)}</option></select>`)}
    ${label('dimension-unit', fields.dimensionUnit, `<select id="dimension-unit" name="dimensionUnit"><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option><option value="in">${escapeGrowthHtml(labels.inches)}</option></select>`)}
    <div data-shape-dimensions="rectangle">${label('length', fields.length, '<input id="length" name="length" type="number" min="0" step="any" inputmode="decimal">')}${label('width', fields.width, '<input id="width" name="width" type="number" min="0" step="any" inputmode="decimal">')}</div>
    <div data-shape-dimensions="circle" hidden>${label('diameter', fields.diameter, '<input id="diameter" name="diameter" type="number" min="0" step="any" inputmode="decimal">')}</div>
    <div data-shape-dimensions="triangle" hidden>${label('base', fields.base, '<input id="base" name="base" type="number" min="0" step="any" inputmode="decimal">')}${label('triangle-height', fields.triangleHeight, '<input id="triangle-height" name="triangleHeight" type="number" min="0" step="any" inputmode="decimal">')}</div>
    ${label('depth-unit', fields.depthUnit, `<select id="depth-unit" name="depthUnit"><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option><option value="in">${escapeGrowthHtml(labels.inches)}</option></select>`)}
    ${label('depth', fields.depth, '<input id="depth" name="depth" type="number" min="0" step="any" inputmode="decimal" required>')}
    ${label('density', fields.density, '<input id="density" name="density" type="number" min="0" step="any" inputmode="decimal">')}
    ${label('density-unit', fields.densityUnit, `<select id="density-unit" name="densityUnit"><option value="kgm3">${escapeGrowthHtml(labels.kgPerCubicMeter)}</option><option value="lbft3">${escapeGrowthHtml(labels.lbPerCubicFoot)}</option></select>`)}
    ${label('waste', fields.waste, '<input id="waste" name="waste" type="number" min="0" max="100" step="any" inputmode="decimal" value="0">')}
    ${label('bag-size', fields.bagSize, '<input id="bag-size" name="bagSize" type="number" min="0" step="any" inputmode="decimal">')}
    ${label('bag-unit', fields.bagUnit, `<select id="bag-unit" name="bagUnit"><option value="kg">${escapeGrowthHtml(labels.kilograms)}</option><option value="lb">${escapeGrowthHtml(labels.pounds)}</option></select>`)}
    <div class="actions">${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'molar-mass-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('formula', fields.formula, '<input id="formula" name="formula" type="text" maxlength="160" autocomplete="off" spellcheck="false" required placeholder="H2O">')}
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="hint">${escapeGrowthHtml(fields.supportedHint ?? '')}</p><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'auto-loan-refinance-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('balance', fields.balance, '<input id="balance" name="balance" type="number" min="0" step="any" inputmode="decimal" required>')}
    ${label('current-apr', fields.currentApr, '<input id="current-apr" name="currentApr" type="number" min="0" max="100" step="any" inputmode="decimal" required>')}
    ${label('current-months', fields.currentMonths, '<input id="current-months" name="currentMonths" type="number" min="1" max="1200" step="1" inputmode="numeric" required>')}
    ${label('new-apr', fields.newApr, '<input id="new-apr" name="newApr" type="number" min="0" max="100" step="any" inputmode="decimal" required>')}
    ${label('new-months', fields.newMonths, '<input id="new-months" name="newMonths" type="number" min="1" max="1200" step="1" inputmode="numeric" required>')}
    ${label('fees', fields.fees, '<input id="fees" name="fees" type="number" min="0" step="any" inputmode="decimal" value="0">')}
    ${label('fee-treatment', fields.feeTreatment, `<select id="fee-treatment" name="feeTreatment"><option value="upfront">${escapeGrowthHtml(fields.upfront)}</option><option value="rolled-in">${escapeGrowthHtml(fields.rolledIn)}</option></select>`)}
    <p class="hint">${escapeGrowthHtml(fields.currencyNote)}</p><div class="actions">${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'secret-santa-generator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('names', fields.names, '<textarea id="names" name="names" rows="7" maxlength="2500" required></textarea>')}
    ${label('exclusions', fields.exclusions, '<textarea id="exclusions" name="exclusions" rows="4" maxlength="2500"></textarea>')}
    <p class="hint">${escapeGrowthHtml(fields.exclusionsHint ?? '')}</p>
    <div class="actions">${submit('generate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><p data-reveal-name></p>${button('reveal', labels.reveal)}${button('next', labels.next, 'secondary')}<ul data-pair-list hidden></ul><div class="actions">${button('copy', labels.copy, 'secondary')}${button('download', labels.download, 'secondary')}</div></section>
  </form><p class="hint">${escapeGrowthHtml(labels.privacyNote)}</p>`, copy);

  return attachCopy(`<section class="game" aria-label="${escapeGrowthHtml(copy.name)}"><div class="game-toolbar"><label for="mancala-mode">${escapeGrowthHtml(fields.mode)}</label><select id="mancala-mode" data-mode><option value="computer">${escapeGrowthHtml(labels.computer)}</option><option value="two-player">${escapeGrowthHtml(labels.twoPlayers)}</option></select>${button('new-game', labels.newGame, 'primary')}</div><p class="status" role="status" aria-live="polite" data-status></p><div class="mancala-board" data-board aria-label="${escapeGrowthHtml(fields.board)}"></div><section class="result" data-result hidden><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div></section><details class="rules"><summary>${escapeGrowthHtml(labels.rules)}</summary><p>${escapeGrowthHtml(fields.rules ?? '')}</p></details></section>`, copy);
}
