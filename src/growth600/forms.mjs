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
    'image-color-picker': ['imageFile', 'accuracyNote', 'previewHint', 'zoom', 'currentColor', 'paletteLabel'],
    'image-region-redactor': ['imageFile', 'mode', 'strength', 'regionX', 'regionY', 'regionWidth', 'regionHeight', 'accuracyNote', 'dragHint', 'regionsLabel'],
    'image-sharpener': ['imageFile', 'amount', 'radius', 'threshold', 'compare', 'accuracyNote', 'previewHint', 'format', 'relatedRedactor', 'relatedCropper'],
    'image-upscaler': ['imageFile', 'accuracyNote', 'progressHint', 'sourcePreview', 'resultPreview'],
    'wallpaper-calculator': ['unit', 'perimeter', 'wallHeight', 'openingsArea', 'rollWidth', 'rollLength', 'patternRepeat', 'wastePercent', 'accuracyNote', 'relatedPaintCalculator'],
    'pool-salt-calculator': ['volume', 'volumeUnit', 'currentSalinityPpm', 'targetSalinityPpm', 'saltPurityPercent', 'bagSize', 'bagUnit', 'accuracyNote'],
    'fence-calculator': ['unit', 'length', 'gateCount', 'gateWidth', 'materialUnit', 'postSpacing', 'panelWidth', 'picketWidth', 'maxPicketGap', 'picketHeight', 'wastePercent', 'pricePerPost', 'pricePerGate', 'pricePerPanel', 'pricePerPicket', 'accuracyNote'],
    'deck-calculator': ['unit', 'length', 'width', 'boardUnit', 'boardWidth', 'gap', 'stockBoardLength', 'joistSpacing', 'wastePercent', 'fastenersPerIntersection', 'pricePerBoard', 'safetyNote'],
    'roofing-calculator': ['projectedArea', 'areaUnit', 'rise', 'run', 'pitchUnit', 'wastePercent', 'bundlesPerSquare', 'pricePerBundle', 'safetyNote'],
    'drywall-calculator': ['roomLength', 'roomWidth', 'wallHeight', 'openingArea', 'roomCount', 'unit', 'includeCeiling', 'boardWidth', 'boardHeight', 'wastePercent', 'screwsPerBoard', 'pricePerBoard', 'accuracyNote'],
    'roof-pitch-calculator': ['rise', 'run', 'overhang', 'unit', 'safetyNote'],
    'pool-volume-calculator': ['shape', 'length', 'width', 'ovalLength', 'ovalWidth', 'diameter', 'floor', 'shallowDepth', 'deepDepth', 'dimensionUnit', 'accuracyNote'],
    'soil-calculator': ['shape', 'length', 'width', 'diameter', 'depth', 'dimensionUnit', 'containerCount', 'wastePercent', 'bagVolume', 'bagUnit', 'accuracyNote'],
    'gravel-calculator': ['shape', 'depth', 'length', 'width', 'diameter', 'base', 'triangleHeight', 'dimensionUnit', 'depthUnit', 'density', 'densityUnit', 'waste', 'bagSize', 'bagUnit'],
    'molar-mass-calculator': ['formula'],
    'auto-loan-refinance-calculator': ['balance', 'currentApr', 'currentMonths', 'newApr', 'newMonths', 'fees', 'feeTreatment'],
    'secret-santa-generator': ['names', 'exclusions'],
    'tire-size-calculator': ['originalSize', 'replacementSize', 'indicatedSpeed', 'speedUnit', 'fitmentNote'],
    'stair-calculator': ['totalRise', 'riserCount', 'treadDepth', 'unit', 'codeNote', 'relatedUnitConverter'],
    'asphalt-calculator': ['area', 'areaUnit', 'compactedThickness', 'thicknessUnit', 'density', 'densityUnit', 'wastePercent', 'pricePerTonne', 'accuracyNote', 'relatedConcreteCalculator'],
    mancala: ['mode'],
    'dominoes-game': ['mode', 'variant', 'board', 'stock', 'hand', 'opponentHand', 'accuracyNote'],
  'weight-loss-calculator': ['currentWeight', 'targetWeight', 'dailyDeficit', 'unit', 'methodNote', 'healthNote', 'sourceNiddk', 'sourceCdc'],
  'heloc-calculator': ['creditLimit', 'balance', 'annualApr', 'drawMonths', 'repaymentMonths', 'currency', 'accuracyNote', 'relatedLoanCalculator'],
  }[toolId];
  if (!fieldNames || fieldNames.some((key) => !fields[key])) throw new Error(`Missing localized form fields for ${toolId}.`);
  const actionNames = {
    'image-color-picker': ['load', 'addSample', 'copyColor', 'copyPalette', 'remove', 'clear', 'reset'],
    'image-region-redactor': ['load', 'addRegion', 'undo', 'clear', 'export', 'example', 'download', 'removeRegion', 'black', 'pixelate', 'blur', 'png', 'jpeg'],
    'image-sharpener': ['load', 'export', 'download', 'original', 'sharpened', 'png', 'jpeg'],
    'image-upscaler': ['upscale', 'cancel', 'download', 'reset'],
    'wallpaper-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'feet'],
    'pool-salt-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'liters', 'usGallons', 'imperialGallons', 'kilograms', 'pounds'],
    'fence-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'centimeters', 'millimeters', 'feet', 'inches'],
    'deck-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'centimeters', 'millimeters', 'feet', 'inches'],
    'roofing-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'squareMeters', 'squareFeet', 'meters', 'centimeters', 'millimeters', 'feet', 'inches'],
    'drywall-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'centimeters', 'millimeters', 'feet', 'inches', 'withCeiling', 'wallsOnly'],
    'roof-pitch-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'centimeters', 'millimeters', 'feet', 'inches'],
    'pool-volume-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'rectangle', 'circle', 'oval', 'flat', 'sloped', 'meters', 'centimeters', 'feet', 'inches'],
    'soil-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'rectangle', 'circle', 'meters', 'centimeters', 'feet', 'inches', 'liters', 'cubicFeet'],
    'gravel-calculator': ['calculate', 'reset', 'copy', 'result', 'rectangle', 'circle', 'triangle', 'meters', 'centimeters', 'feet', 'inches', 'kgPerCubicMeter', 'lbPerCubicFoot', 'kilograms', 'pounds'],
    'molar-mass-calculator': ['calculate', 'reset', 'example', 'copy', 'result'],
    'auto-loan-refinance-calculator': ['calculate', 'reset', 'copy', 'result'],
    'secret-santa-generator': ['generate', 'reset', 'copy', 'download', 'result', 'reveal', 'next', 'privacyNote'],
    'tire-size-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'kmh', 'mph'],
    'stair-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'centimeters', 'feet', 'inches'],
    'asphalt-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
    mancala: ['newGame', 'rules', 'result', 'computer', 'twoPlayers'],
    'dominoes-game': ['newGame', 'draw', 'pass', 'playLeft', 'playRight', 'computer', 'twoPlayers', 'drawRule', 'blockRule'],
  'weight-loss-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'kilograms', 'pounds', 'dayUnit', 'weekUnit', 'kilocalories', 'perWeek'],
  'heloc-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
  }[toolId];
  const missing = actionNames.filter((key) => !actions[key]?.trim());
  if (missing.length) throw new Error(`Missing localized form actions for ${toolId}: ${missing.join(', ')}.`);
  const labels = Object.fromEntries([...new Set([...actionNames, 'calculate', 'generate', 'reset', 'example', 'newGame', 'rules', 'reveal', 'next', 'copy', 'download', 'result', 'progress', 'perPerson', 'metric', 'imperial', 'rectangle', 'circle', 'triangle', 'meters', 'centimeters', 'feet', 'inches', 'kgPerCubicMeter', 'lbPerCubicFoot', 'kilograms', 'pounds', 'twoPlayers', 'computer', 'human', 'currentPlayer', 'opponent', 'privacyNote', 'kmh', 'mph'])].map((key) => [key, actions[key] ?? '']));
  const submit = (name) => button(name === 'calculate' ? 'calculate' : 'generate', labels[name]);
  const reset = button('reset', labels.reset, 'secondary');

  if (toolId === 'image-color-picker') return attachCopy(`<form id="tool-form" novalidate>
    ${label('color-picker-file', fields.imageFile, '<input id="color-picker-file" name="imageFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/bmp" required>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div data-color-picker-workbench hidden>
      <p class="hint">${escapeGrowthHtml(fields.previewHint)}</p>
      <div class="color-picker-preview-wrap"><canvas data-color-picker-preview tabindex="0" role="button" aria-label="${escapeGrowthHtml(fields.previewHint)}"></canvas><span data-color-picker-marker aria-hidden="true" hidden></span></div>
      ${label('color-picker-zoom', fields.zoom, '<select id="color-picker-zoom" name="zoom"><option value="1">1×</option><option value="2">2×</option><option value="4">4×</option><option value="8">8×</option></select>')}
      <div class="color-picker-current" data-color-picker-current hidden><span data-current-swatch aria-hidden="true"></span><p data-current-value></p></div>
      <div class="actions"><button type="button" data-action="add-sample" class="button button--primary" disabled>${escapeGrowthHtml(labels.addSample)}</button></div>
      <section aria-labelledby="color-picker-palette-heading"><h2 id="color-picker-palette-heading">${escapeGrowthHtml(fields.paletteLabel)}</h2><ol data-color-picker-palette></ol><div class="actions"><button type="button" data-action="copy-palette" class="button button--secondary" disabled>${escapeGrowthHtml(labels.copyPalette)}</button><button type="button" data-action="clear" class="button button--secondary" disabled>${escapeGrowthHtml(labels.clear)}</button></div></section>
    </div>
    <div class="actions">${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
  </form>`, copy);

  if (toolId === 'image-region-redactor') return attachCopy(`<form id="tool-form" novalidate>
    ${label('image-file', fields.imageFile, '<input id="image-file" name="imageFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/bmp" required>')}
    <div class="field"><label for="redaction-mode">${escapeGrowthHtml(fields.mode)}</label><select id="redaction-mode" name="mode"><option value="black">${escapeGrowthHtml(labels.black)}</option><option value="pixelate">${escapeGrowthHtml(labels.pixelate)}</option><option value="blur">${escapeGrowthHtml(labels.blur)}</option></select></div>
    ${label('redaction-strength', fields.strength, '<input id="redaction-strength" name="strength" type="range" min="4" max="32" step="1" value="12">')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div data-workbench hidden>
      <p class="hint">${escapeGrowthHtml(fields.dragHint)}</p>
      <canvas data-preview tabindex="0" role="img" aria-label="${escapeGrowthHtml(fields.dragHint)}"></canvas>
      <fieldset class="redaction-coordinates"><legend>${escapeGrowthHtml(fields.regionsLabel)}</legend>
        ${label('region-x', fields.regionX, '<input id="region-x" name="regionX" type="number" min="0" step="1" value="0" required>')}
        ${label('region-y', fields.regionY, '<input id="region-y" name="regionY" type="number" min="0" step="1" value="0" required>')}
        ${label('region-width', fields.regionWidth, '<input id="region-width" name="regionWidth" type="number" min="1" step="1" value="100" required>')}
        ${label('region-height', fields.regionHeight, '<input id="region-height" name="regionHeight" type="number" min="1" step="1" value="100" required>')}
        <div class="actions"><button type="submit" data-action="add-region" class="button button--primary">${escapeGrowthHtml(labels.addRegion)}</button></div>
      </fieldset>
      <h2>${escapeGrowthHtml(fields.regionsLabel)}</h2><ol data-region-list></ol>
    </div>
    <div class="actions"><button type="button" data-action="example" class="button button--secondary">${escapeGrowthHtml(labels.load)}</button><button type="button" data-action="undo" class="button button--secondary">${escapeGrowthHtml(labels.undo)}</button><button type="button" data-action="clear" class="button button--secondary">${escapeGrowthHtml(labels.clear)}</button><button type="button" data-action="export" class="button button--primary">${escapeGrowthHtml(labels.export)}</button>${reset}</div>
    <div class="field"><label for="image-format">${escapeGrowthHtml(fields.format)}</label><select id="image-format" name="format"><option value="image/png">${escapeGrowthHtml(labels.png)}</option><option value="image/jpeg">${escapeGrowthHtml(labels.jpeg)}</option></select></div>
    <p class="status" role="status" aria-live="polite" data-status></p><a class="button button--primary" data-export hidden></a>
  </form>`, copy);

  if (toolId === 'image-sharpener') return attachCopy(`<form id="tool-form" novalidate>
    ${label('sharpener-file', fields.imageFile, '<input id="sharpener-file" name="imageFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/bmp" required>')}
    <div class="sharpener-controls">
      ${label('sharpener-amount', fields.amount, '<input id="sharpener-amount" name="amount" type="range" min="0" max="3" step="0.1" value="1">')}
      ${label('sharpener-radius', fields.radius, '<input id="sharpener-radius" name="radius" type="range" min="1" max="8" step="1" value="2">')}
      ${label('sharpener-threshold', fields.threshold, '<input id="sharpener-threshold" name="threshold" type="range" min="0" max="64" step="1" value="0">')}
    </div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div data-sharpener-workbench hidden>
      <p class="hint">${escapeGrowthHtml(fields.previewHint)}</p>
      <label class="sharpener-compare"><input type="checkbox" name="compare"> ${escapeGrowthHtml(labels.original)}</label>
      <canvas data-sharpener-preview tabindex="0" role="img" aria-label="${escapeGrowthHtml(fields.previewHint)}"></canvas>
    </div>
    <div class="field"><label for="sharpener-format">${escapeGrowthHtml(fields.format)}</label><select id="sharpener-format" name="format"><option value="image/png">${escapeGrowthHtml(labels.png)}</option><option value="image/jpeg">${escapeGrowthHtml(labels.jpeg)}</option></select></div>
    <div class="actions"><button type="button" data-action="export" class="button button--primary" disabled>${escapeGrowthHtml(labels.export)}</button>${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><a class="button button--primary" data-export hidden></a>
  </form>`, copy);

  if (toolId === 'image-upscaler') return attachCopy(`<form id="tool-form" data-worker-src="__WORKER_IMAGE_UPSCALER_WORKER__" novalidate>
    ${label('upscaler-file', fields.imageFile, '<input id="upscaler-file" name="imageFile" type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/bmp" required>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div data-upscaler-workbench hidden>
      <div class="upscaler-previews"><figure><figcaption>${escapeGrowthHtml(fields.sourcePreview)}</figcaption><canvas data-upscaler-source hidden></canvas></figure><figure><figcaption>${escapeGrowthHtml(fields.resultPreview)}</figcaption><canvas data-upscaler-result hidden></canvas></figure></div>
      <label class="field" data-progress-label><span>${escapeGrowthHtml(fields.progressHint)}</span><progress data-progress max="100" value="0" hidden></progress></label>
      <div class="actions"><button type="button" data-action="upscale" class="button button--primary" disabled>${escapeGrowthHtml(labels.upscale)}</button><button type="button" data-action="cancel" class="button button--secondary" hidden disabled>${escapeGrowthHtml(labels.cancel)}</button>${reset}</div>
      <a class="button button--primary" data-export hidden></a>
    </div>
    <p class="status" role="status" aria-live="polite" data-status></p>
  </form>`, copy);

  if (toolId === 'wallpaper-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('unit', fields.unit, `<select id="unit" name="unit"><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option></select>`)}
    ${label('perimeter', fields.perimeter, '<input id="perimeter" name="perimeter" type="number" min="0.1" max="100000" step="any" inputmode="decimal" value="12" required>')}
    ${label('wall-height', fields.wallHeight, '<input id="wall-height" name="wallHeight" type="number" min="0.1" max="100" step="any" inputmode="decimal" value="2.4" required>')}
    ${label('openings-area', fields.openingsArea, '<input id="openings-area" name="openingsArea" type="number" min="0" max="1000000" step="any" inputmode="decimal" value="0">')}
    ${label('roll-width', fields.rollWidth, '<input id="roll-width" name="rollWidth" type="number" min="0.05" max="20" step="any" inputmode="decimal" value="0.53" required>')}
    ${label('roll-length', fields.rollLength, '<input id="roll-length" name="rollLength" type="number" min="0.1" max="200" step="any" inputmode="decimal" value="10.05" required>')}
    ${label('pattern-repeat', fields.patternRepeat, '<input id="pattern-repeat" name="patternRepeat" type="number" min="0" max="10" step="any" inputmode="decimal" value="0">')}
    ${label('waste-percent', fields.wastePercent, '<input id="waste-percent" name="wastePercent" type="number" min="0" max="50" step="any" inputmode="decimal" value="10" required>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'pool-salt-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('volume-unit', fields.volumeUnit, `<select id="volume-unit" name="volumeUnit"><option value="us-gal">${escapeGrowthHtml(labels.usGallons)}</option><option value="l">${escapeGrowthHtml(labels.liters)}</option><option value="imp-gal">${escapeGrowthHtml(labels.imperialGallons)}</option></select>`)}
    ${label('pool-volume', fields.volume, '<input id="pool-volume" name="volume" type="number" min="0.01" max="100000000" step="any" inputmode="decimal" value="1000" required>')}
    ${label('current-salinity', fields.currentSalinityPpm, '<input id="current-salinity" name="currentSalinityPpm" type="number" min="0" max="10000" step="any" inputmode="decimal" value="0" required>')}
    ${label('target-salinity', fields.targetSalinityPpm, '<input id="target-salinity" name="targetSalinityPpm" type="number" min="0" max="10000" step="any" inputmode="decimal" value="1000" required>')}
    ${label('salt-purity', fields.saltPurityPercent, '<input id="salt-purity" name="saltPurityPercent" type="number" min="1" max="100" step="any" inputmode="decimal" value="100" required>')}
    ${label('bag-unit', fields.bagUnit, `<select id="bag-unit" name="bagUnit"><option value="lb">${escapeGrowthHtml(labels.pounds)}</option><option value="kg">${escapeGrowthHtml(labels.kilograms)}</option></select>`)}
    ${label('bag-size', fields.bagSize, '<input id="bag-size" name="bagSize" type="number" min="0.01" max="10000" step="any" inputmode="decimal" value="40">')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'fence-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('unit', fields.unit, `<select id="unit" name="unit"><option value="ft">${escapeGrowthHtml(labels.feet)}</option><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="in">${escapeGrowthHtml(labels.inches)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="mm">${escapeGrowthHtml(labels.millimeters)}</option></select>`)}
    ${label('length', fields.length, '<input id="length" name="length" type="number" min="0.1" max="1000000" step="any" inputmode="decimal" value="100" required>')}
    ${label('gate-count', fields.gateCount, '<input id="gate-count" name="gateCount" type="number" min="0" max="20" step="1" inputmode="numeric" value="1" required>')}
    ${label('material-unit', fields.materialUnit, `<select id="material-unit" name="materialUnit"><option value="in">${escapeGrowthHtml(labels.inches)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="mm">${escapeGrowthHtml(labels.millimeters)}</option></select>`)}
    ${label('gate-width', fields.gateWidth, '<input id="gate-width" name="gateWidth" type="number" min="0.1" max="1000" step="any" inputmode="decimal" value="48" required>')}
    ${label('post-spacing', fields.postSpacing, '<input id="post-spacing" name="postSpacing" type="number" min="0.1" max="1000" step="any" inputmode="decimal" value="96" required>')}
    ${label('panel-width', fields.panelWidth, '<input id="panel-width" name="panelWidth" type="number" min="0.1" max="1000" step="any" inputmode="decimal" value="96" required>')}
    ${label('picket-width', fields.picketWidth, '<input id="picket-width" name="picketWidth" type="number" min="0.01" max="1000" step="any" inputmode="decimal" value="5.5" required>')}
    ${label('max-picket-gap', fields.maxPicketGap, '<input id="max-picket-gap" name="maxPicketGap" type="number" min="0" max="100" step="any" inputmode="decimal" value="2" required>')}
    ${label('picket-height', fields.picketHeight, '<input id="picket-height" name="picketHeight" type="number" min="0.1" max="1000" step="any" inputmode="decimal" value="72" required>')}
    ${label('waste-percent', fields.wastePercent, '<input id="waste-percent" name="wastePercent" type="number" min="0" max="30" step="any" inputmode="decimal" value="10" required>')}
    ${label('price-per-post', fields.pricePerPost, '<input id="price-per-post" name="pricePerPost" type="number" min="0" max="1000000" step="any" inputmode="decimal">')}
    ${label('price-per-gate', fields.pricePerGate, '<input id="price-per-gate" name="pricePerGate" type="number" min="0" max="1000000" step="any" inputmode="decimal">')}
    ${label('price-per-panel', fields.pricePerPanel, '<input id="price-per-panel" name="pricePerPanel" type="number" min="0" max="1000000" step="any" inputmode="decimal">')}
    ${label('price-per-picket', fields.pricePerPicket, '<input id="price-per-picket" name="pricePerPicket" type="number" min="0" max="1000000" step="any" inputmode="decimal">')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'roofing-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('area-unit', fields.areaUnit, `<select id="area-unit" name="areaUnit"><option value="ft2">${escapeGrowthHtml(labels.squareFeet)}</option><option value="m2">${escapeGrowthHtml(labels.squareMeters)}</option></select>`)}
    ${label('projected-area', fields.projectedArea, '<input id="projected-area" name="projectedArea" type="number" min="0.1" max="100000000" step="any" inputmode="decimal" value="1200" required>')}
    ${label('pitch-unit', fields.pitchUnit, `<select id="pitch-unit" name="pitchUnit"><option value="in">${escapeGrowthHtml(labels.inches)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="mm">${escapeGrowthHtml(labels.millimeters)}</option></select>`)}
    ${label('rise', fields.rise, '<input id="rise" name="rise" type="number" min="0" max="100000" step="any" inputmode="decimal" value="6" required>')}
    ${label('run', fields.run, '<input id="run" name="run" type="number" min="0.001" max="100000" step="any" inputmode="decimal" value="12" required>')}
    ${label('waste-percent', fields.wastePercent, '<input id="waste-percent" name="wastePercent" type="number" min="0" max="30" step="any" inputmode="decimal" value="10" required>')}
    ${label('bundles-per-square', fields.bundlesPerSquare, '<input id="bundles-per-square" name="bundlesPerSquare" type="number" min="0.1" max="20" step="any" inputmode="decimal" value="3" required>')}
    ${label('price-per-bundle', fields.pricePerBundle, '<input id="price-per-bundle" name="pricePerBundle" type="number" min="0" max="1000000" step="any" inputmode="decimal">')}
    <p class="hint">${escapeGrowthHtml(fields.safetyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'deck-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('unit', fields.unit, `<select id="unit" name="unit"><option value="ft">${escapeGrowthHtml(labels.feet)}</option><option value="in">${escapeGrowthHtml(labels.inches)}</option><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="mm">${escapeGrowthHtml(labels.millimeters)}</option></select>`)}
    ${label('length', fields.length, '<input id="length" name="length" type="number" min="0.1" max="100000" step="any" inputmode="decimal" value="16" required>')}
    ${label('width', fields.width, '<input id="width" name="width" type="number" min="0.1" max="100000" step="any" inputmode="decimal" value="12" required>')}
    ${label('board-unit', fields.boardUnit, `<select id="board-unit" name="boardUnit"><option value="in">${escapeGrowthHtml(labels.inches)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="mm">${escapeGrowthHtml(labels.millimeters)}</option></select>`)}
    ${label('board-width', fields.boardWidth, '<input id="board-width" name="boardWidth" type="number" min="0.0001" max="100000" step="any" inputmode="decimal" value="5.5" required>')}
    ${label('gap', fields.gap, '<input id="gap" name="gap" type="number" min="0" max="100000" step="any" inputmode="decimal" value="0.25" required>')}
    ${label('stock-board-length', fields.stockBoardLength, '<input id="stock-board-length" name="stockBoardLength" type="number" min="0.1" max="25000" step="any" inputmode="decimal" value="16" required>')}
    ${label('joist-spacing', fields.joistSpacing, '<input id="joist-spacing" name="joistSpacing" type="number" min="0.0001" max="100000" step="any" inputmode="decimal" value="16" required>')}
    ${label('waste-percent', fields.wastePercent, '<input id="waste-percent" name="wastePercent" type="number" min="0" max="30" step="any" inputmode="decimal" value="10" required>')}
    ${label('fasteners-per-intersection', fields.fastenersPerIntersection, '<input id="fasteners-per-intersection" name="fastenersPerIntersection" type="number" min="1" max="20" step="1" inputmode="numeric" value="2" required>')}
    ${label('price-per-board', fields.pricePerBoard, '<input id="price-per-board" name="pricePerBoard" type="number" min="0" max="1000000" step="any" inputmode="decimal">')}
    <p class="hint">${escapeGrowthHtml(fields.safetyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'drywall-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('unit', fields.unit, `<select id="unit" name="unit"><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="mm">${escapeGrowthHtml(labels.millimeters)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option><option value="in">${escapeGrowthHtml(labels.inches)}</option></select>`)}
    ${label('room-length', fields.roomLength, '<input id="room-length" name="roomLength" type="number" min="0.1" max="10000" step="any" inputmode="decimal" value="4" required>')}
    ${label('room-width', fields.roomWidth, '<input id="room-width" name="roomWidth" type="number" min="0.1" max="10000" step="any" inputmode="decimal" value="3" required>')}
    ${label('wall-height', fields.wallHeight, '<input id="wall-height" name="wallHeight" type="number" min="0.1" max="10000" step="any" inputmode="decimal" value="2.5" required>')}
    ${label('room-count', fields.roomCount, '<input id="room-count" name="roomCount" type="number" min="1" max="100" step="1" inputmode="numeric" value="1" required>')}
    ${label('opening-area', fields.openingArea, '<input id="opening-area" name="openingArea" type="number" min="0" max="100000000" step="any" inputmode="decimal" value="0">')}
    ${label('include-ceiling', fields.includeCeiling, `<select id="include-ceiling" name="includeCeiling"><option value="true">${escapeGrowthHtml(labels.withCeiling)}</option><option value="false">${escapeGrowthHtml(labels.wallsOnly)}</option></select>`)}
    ${label('board-width', fields.boardWidth, '<input id="board-width" name="boardWidth" type="number" min="0.1" max="100" step="any" inputmode="decimal" value="1.2" required>')}
    ${label('board-height', fields.boardHeight, '<input id="board-height" name="boardHeight" type="number" min="0.1" max="100" step="any" inputmode="decimal" value="2.4" required>')}
    ${label('waste-percent', fields.wastePercent, '<input id="waste-percent" name="wastePercent" type="number" min="0" max="30" step="any" inputmode="decimal" value="10" required>')}
    ${label('screws-per-board', fields.screwsPerBoard, '<input id="screws-per-board" name="screwsPerBoard" type="number" min="1" max="200" step="1" inputmode="numeric" value="32" required>')}
    ${label('price-per-board', fields.pricePerBoard, '<input id="price-per-board" name="pricePerBoard" type="number" min="0" max="1000000" step="any" inputmode="decimal">')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'roof-pitch-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('unit', fields.unit, `<select id="unit" name="unit"><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="mm">${escapeGrowthHtml(labels.millimeters)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option><option value="in">${escapeGrowthHtml(labels.inches)}</option></select>`)}
    ${label('rise', fields.rise, '<input id="rise" name="rise" type="number" min="0.001" max="100000" step="any" inputmode="decimal" required>')}
    ${label('run', fields.run, '<input id="run" name="run" type="number" min="0.001" max="100000" step="any" inputmode="decimal" required>')}
    ${label('overhang', fields.overhang, '<input id="overhang" name="overhang" type="number" min="0" max="100000" step="any" inputmode="decimal" value="0">')}
    <p class="hint">${escapeGrowthHtml(fields.safetyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'pool-volume-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('shape', fields.shape, `<select id="shape" name="shape" data-pool-shape><option value="rectangle">${escapeGrowthHtml(labels.rectangle)}</option><option value="circle">${escapeGrowthHtml(labels.circle)}</option><option value="oval">${escapeGrowthHtml(labels.oval)}</option></select>`)}
    ${label('dimension-unit', fields.dimensionUnit, `<select id="dimension-unit" name="dimensionUnit"><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option><option value="in">${escapeGrowthHtml(labels.inches)}</option></select>`)}
    <div data-pool-dimensions="rectangle">${label('length', fields.length, '<input id="length" name="length" type="number" min="0.01" max="100000" step="any" inputmode="decimal" required>')}${label('width', fields.width, '<input id="width" name="width" type="number" min="0.01" max="100000" step="any" inputmode="decimal" required>')}</div>
    <div data-pool-dimensions="circle" hidden>${label('diameter', fields.diameter, '<input id="diameter" name="diameter" type="number" min="0.01" max="100000" step="any" inputmode="decimal" required>')}</div>
    <div data-pool-dimensions="oval" hidden>${label('oval-length', fields.ovalLength, '<input id="oval-length" name="ovalLength" type="number" min="0.01" max="100000" step="any" inputmode="decimal" required>')}${label('oval-width', fields.ovalWidth, '<input id="oval-width" name="ovalWidth" type="number" min="0.01" max="100000" step="any" inputmode="decimal" required>')}</div>
    ${label('floor', fields.floor, `<select id="floor" name="floor"><option value="flat">${escapeGrowthHtml(labels.flat)}</option><option value="sloped">${escapeGrowthHtml(labels.sloped)}</option></select>`)}
    ${label('shallow-depth', fields.shallowDepth, '<input id="shallow-depth" name="shallowDepth" type="number" min="0.01" max="100000" step="any" inputmode="decimal" required>')}
    <div data-pool-deep-depth hidden>${label('deep-depth', fields.deepDepth, '<input id="deep-depth" name="deepDepth" type="number" min="0.01" max="100000" step="any" inputmode="decimal" required>')}</div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'soil-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('shape', fields.shape, `<select id="shape" name="shape" data-soil-shape><option value="rectangle">${escapeGrowthHtml(labels.rectangle)}</option><option value="circle">${escapeGrowthHtml(labels.circle)}</option></select>`)}
    ${label('dimension-unit', fields.dimensionUnit, `<select id="dimension-unit" name="dimensionUnit"><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option><option value="in">${escapeGrowthHtml(labels.inches)}</option></select>`)}
    <div data-soil-dimensions="rectangle">${label('length', fields.length, '<input id="length" name="length" type="number" min="0" step="any" inputmode="decimal" required>')}${label('width', fields.width, '<input id="width" name="width" type="number" min="0" step="any" inputmode="decimal" required>')}</div>
    <div data-soil-dimensions="circle" hidden>${label('diameter', fields.diameter, '<input id="diameter" name="diameter" type="number" min="0" step="any" inputmode="decimal" required>')}</div>
    ${label('depth', fields.depth, '<input id="depth" name="depth" type="number" min="0" step="any" inputmode="decimal" required>')}
    ${label('container-count', fields.containerCount, '<input id="container-count" name="containerCount" type="number" min="1" max="10000" step="1" inputmode="numeric" value="1" required>')}
    ${label('waste-percent', fields.wastePercent, '<input id="waste-percent" name="wastePercent" type="number" min="0" max="50" step="any" inputmode="decimal" value="0">')}
    ${label('bag-volume', fields.bagVolume, '<input id="bag-volume" name="bagVolume" type="number" min="0" step="any" inputmode="decimal">')}
    ${label('bag-unit', fields.bagUnit, `<select id="bag-unit" name="bagUnit"><option value="l">${escapeGrowthHtml(labels.liters)}</option><option value="ft3">${escapeGrowthHtml(labels.cubicFeet)}</option></select>`)}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

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

  if (toolId === 'tire-size-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('original-size', fields.originalSize, '<input id="original-size" name="originalSize" type="text" maxlength="12" autocomplete="off" autocapitalize="characters" spellcheck="false" required placeholder="205/55R16">')}
    ${label('replacement-size', fields.replacementSize, '<input id="replacement-size" name="replacementSize" type="text" maxlength="12" autocomplete="off" autocapitalize="characters" spellcheck="false" required placeholder="225/45R17">')}
    ${label('indicated-speed', fields.indicatedSpeed, '<input id="indicated-speed" name="indicatedSpeed" type="number" min="1" max="300" step="any" inputmode="decimal" value="100" required>')}
    ${label('speed-unit', fields.speedUnit, `<select id="speed-unit" name="speedUnit"><option value="km/h">${escapeGrowthHtml(labels.kmh)}</option><option value="mph">${escapeGrowthHtml(labels.mph)}</option></select>`)}
    <p class="hint">${escapeGrowthHtml(fields.fitmentNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'stair-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('total-rise', fields.totalRise, '<input id="total-rise" name="totalRise" type="number" min="0" step="any" inputmode="decimal" required>')}
    ${label('riser-count', fields.riserCount, '<input id="riser-count" name="riserCount" type="number" min="2" max="100" step="1" inputmode="numeric" required>')}
    ${label('tread-depth', fields.treadDepth, '<input id="tread-depth" name="treadDepth" type="number" min="0" step="any" inputmode="decimal" required>')}
    ${label('unit', fields.unit, `<select id="unit" name="unit"><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option><option value="in">${escapeGrowthHtml(labels.inches)}</option></select>`)}
    <p class="hint">${escapeGrowthHtml(fields.codeNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div><svg data-stair-diagram role="img" aria-label="${escapeGrowthHtml(copy.messages.diagram)}"></svg>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'asphalt-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('area', fields.area, '<input id="area" name="area" type="number" min="0.1" max="100000000" step="any" inputmode="decimal" required>')}
    ${label('area-unit', fields.areaUnit, '<select id="area-unit" name="areaUnit"><option value="m2">m²</option><option value="ft2">ft²</option></select>')}
    ${label('compacted-thickness', fields.compactedThickness, '<input id="compacted-thickness" name="compactedThickness" type="number" min="1" max="1000" step="any" inputmode="decimal" required>')}
    ${label('thickness-unit', fields.thicknessUnit, '<select id="thickness-unit" name="thicknessUnit"><option value="mm">mm</option><option value="cm">cm</option><option value="in">in</option></select>')}
    ${label('density', fields.density, '<input id="density" name="density" type="number" min="0" max="4000" step="any" inputmode="decimal" value="2400" required>')}
    ${label('density-unit', fields.densityUnit, '<select id="density-unit" name="densityUnit"><option value="kgm3">kg/m³</option><option value="lbft3">lb/ft³</option></select>')}
    ${label('waste-percent', fields.wastePercent, '<input id="waste-percent" name="wastePercent" type="number" min="0" max="30" step="any" inputmode="decimal" value="0" required>')}
    ${label('price-per-tonne', fields.pricePerTonne, '<input id="price-per-tonne" name="pricePerTonne" type="number" min="0" max="1000000" step="any" inputmode="decimal">')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'dominoes-game') return attachCopy(`<section class="game domino-game" aria-label="${escapeGrowthHtml(copy.name)}">
    <div class="game-toolbar"><div class="field"><label for="domino-mode">${escapeGrowthHtml(fields.mode)}</label><select id="domino-mode" data-mode><option value="computer">${escapeGrowthHtml(labels.computer)}</option><option value="two-player">${escapeGrowthHtml(labels.twoPlayers)}</option></select></div>
      <div class="field"><label for="domino-variant">${escapeGrowthHtml(fields.variant)}</label><select id="domino-variant" data-variant><option value="draw">${escapeGrowthHtml(labels.drawRule)}</option><option value="block">${escapeGrowthHtml(labels.blockRule)}</option></select></div>
      <button type="button" data-action="new-game" class="button button--primary">${escapeGrowthHtml(labels.newGame)}</button></div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section aria-labelledby="domino-board-heading"><h2 id="domino-board-heading">${escapeGrowthHtml(fields.board)}</h2><p class="hint"><span>${escapeGrowthHtml(fields.stock)}: </span><strong data-stock-count></strong></p><div class="domino-board-scroll" tabindex="0" aria-label="${escapeGrowthHtml(fields.board)}"><ol class="domino-board" data-board></ol></div></section>
    <section aria-labelledby="domino-hand-heading"><h2 id="domino-hand-heading">${escapeGrowthHtml(fields.hand)}</h2><ul class="domino-hand" data-hand></ul></section><section data-opponent-hand hidden><h2>${escapeGrowthHtml(fields.opponentHand)}</h2><p data-opponent-count></p></section>
    <section class="result" data-result hidden><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div></section>
    <div class="actions"><button type="button" data-action="draw" class="button button--secondary">${escapeGrowthHtml(labels.draw)}</button><button type="button" data-action="pass" class="button button--secondary">${escapeGrowthHtml(labels.pass)}</button></div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p><details class="rules"><summary>${escapeGrowthHtml(labels.rules)}</summary><p>${escapeGrowthHtml(fields.rules ?? '')}</p></details></section>`, copy);

  if (toolId === 'weight-loss-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('current-weight', fields.currentWeight, '<input id="current-weight" name="currentWeight" type="number" min="0.1" max="1000" step="any" inputmode="decimal" required>')}
    ${label('target-weight', fields.targetWeight, '<input id="target-weight" name="targetWeight" type="number" min="0.1" max="1000" step="any" inputmode="decimal" required>')}
    ${label('weight-unit', fields.unit, `<select id="weight-unit" name="unit"><option value="kg">${escapeGrowthHtml(labels.kilograms)}</option><option value="lb">${escapeGrowthHtml(labels.pounds)}</option></select>`)}
    ${label('daily-deficit', fields.dailyDeficit, '<input id="daily-deficit" name="dailyDeficit" type="number" min="0" max="10000" step="any" inputmode="decimal" required>')}
    <p class="hint">${escapeGrowthHtml(fields.methodNote)}</p>
    <p class="hint">${escapeGrowthHtml(fields.healthNote)}</p>
    <p class="hint">${escapeGrowthHtml(fields.sourceNiddk)} <a href="https://www.niddk.nih.gov/research-funding/at-niddk/labs-branches/laboratory-biological-modeling/integrative-physiology-section/research/body-weight-planner" rel="noreferrer">NIDDK</a> · <a href="https://www.cdc.gov/healthy-weight-growth/losing-weight/index.html" rel="noreferrer">${escapeGrowthHtml(fields.sourceCdc)}</a></p>
    <div class="actions">${button('example', labels.example, 'secondary')}${button('calculate', labels.calculate)}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'heloc-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('heloc-currency', fields.currency, '<select id="heloc-currency" name="currency"><option value="USD">USD</option><option value="CAD">CAD</option><option value="AUD">AUD</option><option value="GBP">GBP</option><option value="EUR">EUR</option></select>')}
    ${label('heloc-limit', fields.creditLimit, '<input id="heloc-limit" name="creditLimit" type="number" min="0.01" max="100000000" step="any" inputmode="decimal" value="25000" required>')}
    ${label('heloc-balance', fields.balance, '<input id="heloc-balance" name="balance" type="number" min="0" max="100000000" step="any" inputmode="decimal" value="12000" required>')}
    ${label('heloc-apr', fields.annualApr, '<input id="heloc-apr" name="annualAprPercent" type="number" min="0" max="100" step="any" inputmode="decimal" value="10" required>')}
    ${label('heloc-draw-months', fields.drawMonths, '<input id="heloc-draw-months" name="drawMonths" type="number" min="1" max="360" step="1" inputmode="numeric" value="120" required>')}
    ${label('heloc-repayment-months', fields.repaymentMonths, '<input id="heloc-repayment-months" name="repaymentMonths" type="number" min="1" max="360" step="1" inputmode="numeric" value="240" required>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  return attachCopy(`<section class="game" aria-label="${escapeGrowthHtml(copy.name)}"><div class="game-toolbar"><label for="mancala-mode">${escapeGrowthHtml(fields.mode)}</label><select id="mancala-mode" data-mode><option value="computer">${escapeGrowthHtml(labels.computer)}</option><option value="two-player">${escapeGrowthHtml(labels.twoPlayers)}</option></select>${button('new-game', labels.newGame, 'primary')}</div><p class="status" role="status" aria-live="polite" data-status></p><div class="mancala-board" data-board aria-label="${escapeGrowthHtml(fields.board)}"></div><section class="result" data-result hidden><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div></section><details class="rules"><summary>${escapeGrowthHtml(labels.rules)}</summary><p>${escapeGrowthHtml(fields.rules ?? '')}</p></details></section>`, copy);
}
