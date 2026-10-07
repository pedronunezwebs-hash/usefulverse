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
    'random-team-generator': ['names', 'teamCount', 'separations', 'separationsHint', 'seed', 'seedHint', 'privacyNote'],
  'mulch-calculator': ['shape', 'dimensionUnit', 'length', 'width', 'diameter', 'bedCount', 'depth', 'depthUnit', 'bagVolume', 'bagUnit', 'wastePercent', 'pricePerBag', 'currency', 'currencyNote', 'accuracyNote', 'relatedGravelCalculator', 'relatedSoilCalculator'],
    'paver-calculator': ['length', 'width', 'surfaceUnit', 'moduleLength', 'moduleWidth', 'moduleUnit', 'paversPerModule', 'paverWastePercent', 'baseDepth', 'baseDepthUnit', 'baseWastePercent', 'pricePerPaver', 'basePricePerM3', 'currency', 'unitsNote', 'accuracyNote', 'relatedTileCalculator', 'relatedGravelCalculator'],
    'solar-panel-calculator': ['mode', 'dailyTargetKwh', 'panelCount', 'panelWatts', 'peakSunHours', 'lossPercent', 'panelLengthM', 'panelWidthM', 'electricityRate', 'systemCost', 'currency', 'assumptionNote'],
    'btu-calculator': ['length', 'width', 'ceilingHeight', 'dimensionUnit', 'insulationAdjustment', 'sunExposure', 'occupants', 'kitchen', 'accuracyNote'],
    'brick-calculator': ['wallLength', 'wallHeight', 'wallUnit', 'brickLength', 'brickHeight', 'brickDepth', 'brickUnit', 'joint', 'jointUnit', 'openingWidth', 'openingHeight', 'openingCount', 'wythes', 'wastePercent', 'bagYieldLiters', 'accuracyNote'],
    'rafter-calculator': ['unit', 'span', 'rise', 'pitch', 'ridgeThickness', 'ridgeUnit', 'overhang', 'accuracyNote'],
    'carpet-calculator': ['roomLength', 'roomWidth', 'rollWidth', 'rooms', 'pileDirection', 'wastePercent', 'accuracyNote'],
    'aquarium-calculator': ['length', 'width', 'height', 'dimensionUnit', 'substrateDepth', 'substrateSolidPercent', 'airGap', 'accuracyNote'],
    'grass-seed-calculator': ['area', 'areaUnit', 'seedingRate', 'rateUnit', 'wastePercent', 'varietyA', 'percentA', 'varietyB', 'percentB', 'bagSize', 'bagUnit', 'accuracyNote'],
    'insulation-calculator': ['unit', 'layerName1', 'layerResistance1', 'layerQuantity1', 'layerName2', 'layerResistance2', 'layerQuantity2', 'layerName3', 'layerResistance3', 'layerQuantity3', 'layerName4', 'layerResistance4', 'layerQuantity4', 'accuracyNote'],
    'wall-framing-calculator': ['wallLength', 'wallHeight', 'wallUnit', 'spacing', 'spacingUnit', 'openingStart1', 'openingWidth1', 'breakBottomPlate1', 'openingStart2', 'openingWidth2', 'breakBottomPlate2', 'openingStart3', 'openingWidth3', 'breakBottomPlate3', 'topPlateRows', 'bottomPlateRows', 'accuracyNote'],
    'electricity-cost-calculator': ['ratePerKwh', 'billingDays', 'fixedCharge', 'currency', 'appliance1', 'applianceName1', 'power1', 'powerUnit1', 'quantity1', 'hours1', 'activeDays1', 'appliance2', 'applianceName2', 'power2', 'powerUnit2', 'quantity2', 'hours2', 'activeDays2', 'appliance3', 'applianceName3', 'power3', 'powerUnit3', 'quantity3', 'hours3', 'activeDays3', 'appliance4', 'applianceName4', 'power4', 'powerUnit4', 'quantity4', 'hours4', 'activeDays4', 'accuracyNote'],
    'compost-calculator': ['massUnit', 'targetMoisture', 'material1', 'name1', 'wetMass1', 'moisture1', 'carbon1', 'ratio1', 'material2', 'name2', 'wetMass2', 'moisture2', 'carbon2', 'ratio2', 'material3', 'name3', 'wetMass3', 'moisture3', 'carbon3', 'ratio3', 'material4', 'name4', 'wetMass4', 'moisture4', 'carbon4', 'ratio4', 'accuracyNote'],
    'pond-volume-calculator': ['shape', 'length', 'width', 'diameter', 'dimensionUnit', 'averageDepth', 'maximumDepth', 'edgeOverlap', 'fillPercent', 'accuracyNote'],
    'fertilizer-calculator': ['mode', 'productMode', 'areaMode', 'productMass', 'massUnit', 'area', 'areaUnit', 'productRate', 'rateUnit', 'nitrogenPercent', 'phosphatePercent', 'potashPercent', 'accuracyNote'],
    'baluster-spacing-calculator': ['mode', 'maxGapMode', 'countMode', 'openingWidth', 'balusterWidth', 'unit', 'maximumGap', 'balusterCount', 'accuracyNote'],
    'retaining-wall-calculator': ['wallLength', 'wallHeight', 'wallUnit', 'blockLength', 'blockHeight', 'blockDepth', 'blockUnit', 'joint', 'baseWidth', 'baseDepth', 'backfillThickness', 'wastePercent', 'accuracyNote'],
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
  'random-team-generator': ['generateTeams', 'reset', 'example', 'copy', 'download', 'result', 'team', 'participant', 'seedLabel'],
  'mulch-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'rectangle', 'circle', 'meters', 'feet', 'centimeters', 'millimeters', 'inches', 'liters', 'cubicFeet', 'squareMeters', 'squareFeet'],
    'paver-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'feet', 'centimeters', 'inches', 'millimeters', 'squareMeters', 'squareFeet'],
    'solar-panel-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'productionMode', 'sizingMode', 'years'],
    'btu-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'feet', 'meters', 'inches', 'shaded', 'typical', 'sunny', 'no', 'yes'],
    'brick-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'feet', 'centimeters', 'inches'],
    'rafter-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'feet', 'centimeters', 'inches', 'riseMode', 'pitchMode'],
    'carpet-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'feet', 'eitherDirection', 'alongRoomLength', 'alongRoomWidth'],
    'aquarium-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'centimeters', 'feet', 'inches', 'liters', 'usGallons', 'imperialGallons'],
    'grass-seed-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'm2', 'ft2', 'acre', 'gM2', 'lb1000ft2', 'kg', 'lb'],
    'insulation-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'R', 'RSI'],
    'wall-framing-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'feet', 'centimeters', 'millimeters', 'inches'],
    'electricity-cost-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'watts', 'kilowatts'],
    'compost-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'kilograms', 'pounds'],
    'pond-volume-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'rectangle', 'circle', 'oval', 'meters', 'feet'],
    'fertilizer-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'kilograms', 'pounds', 'squareMeters', 'hectares', 'squareFeet', 'acres', 'kg100m2', 'kgHa', 'lb1000ft2', 'lbAcre'],
    'baluster-spacing-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'millimeters', 'centimeters', 'meters', 'inches', 'feet'],
    'retaining-wall-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'centimeters', 'feet', 'inches'],
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

  if (toolId === 'random-team-generator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('team-names', fields.names, '<textarea id="team-names" name="names" rows="8" maxlength="5000" required></textarea>')}
    ${label('team-count', fields.teamCount, '<input id="team-count" name="teamCount" type="number" min="2" max="12" step="1" value="2" inputmode="numeric" required>')}
    ${label('team-separations', fields.separations, '<textarea id="team-separations" name="separations" rows="3" maxlength="12000"></textarea>')}
    <p class="hint">${escapeGrowthHtml(fields.separationsHint)}</p>
    ${label('team-seed', fields.seed, '<input id="team-seed" name="seed" type="text" maxlength="80" autocomplete="off">')}
    <p class="hint">${escapeGrowthHtml(fields.seedHint)}</p><p class="hint">${escapeGrowthHtml(fields.privacyNote)}</p>
    <div class="actions"><button type="button" data-action="example" class="button button--secondary">${escapeGrowthHtml(labels.example)}</button><button type="submit" data-action="generateTeams" class="button button--primary">${escapeGrowthHtml(labels.generateTeams)}</button><button type="reset" data-action="reset" class="button button--secondary">${escapeGrowthHtml(labels.reset)}</button></div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div><p class="hint" data-team-seed-output></p><div class="actions"><button type="button" data-action="copy" class="button button--secondary" disabled>${escapeGrowthHtml(labels.copy)}</button><button type="button" data-action="download" class="button button--secondary" disabled>${escapeGrowthHtml(labels.download)}</button></div></section>
  </form>`, copy);

  if (toolId === 'mulch-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('shape', fields.shape, `<select id="shape" name="shape"><option value="rectangle">${escapeGrowthHtml(labels.rectangle)}</option><option value="circle">${escapeGrowthHtml(labels.circle)}</option></select>`)}
    ${label('dimension-unit', fields.dimensionUnit, `<select id="dimension-unit" name="dimensionUnit"><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option></select>`)}
    <div data-mulch-dimensions="rectangle">${label('length', fields.length, '<input id="length" name="length" type="number" min="0.01" max="100000" step="any" inputmode="decimal" value="5">')}${label('width', fields.width, '<input id="width" name="width" type="number" min="0.01" max="100000" step="any" inputmode="decimal" value="4">')}</div>
    <div data-mulch-dimensions="circle" hidden>${label('diameter', fields.diameter, '<input id="diameter" name="diameter" type="number" min="0.01" max="100000" step="any" inputmode="decimal" value="10">')}</div>
    ${label('bed-count', fields.bedCount, '<input id="bed-count" name="bedCount" type="number" min="1" max="1000" step="1" inputmode="numeric" value="1">')}
    ${label('depth', fields.depth, '<input id="depth" name="depth" type="number" min="0.1" max="100" step="any" inputmode="decimal" value="5">')}
    ${label('depth-unit', fields.depthUnit, `<select id="depth-unit" name="depthUnit"><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="in">${escapeGrowthHtml(labels.inches)}</option><option value="mm">${escapeGrowthHtml(labels.millimeters)}</option></select>`)}
    ${label('bag-volume', fields.bagVolume, '<input id="bag-volume" name="bagVolume" type="number" min="0.1" max="1000000" step="any" inputmode="decimal" value="50">')}
    ${label('bag-unit', fields.bagUnit, `<select id="bag-unit" name="bagUnit"><option value="L">${escapeGrowthHtml(labels.liters)}</option><option value="ft3">${escapeGrowthHtml(labels.cubicFeet)}</option></select>`)}
    ${label('waste-percent', fields.wastePercent, '<input id="waste-percent" name="wastePercent" type="number" min="0" max="50" step="any" inputmode="decimal" value="0">')}
    ${label('price-per-bag', fields.pricePerBag, '<input id="price-per-bag" name="pricePerBag" type="number" min="0" max="1000000" step="any" inputmode="decimal">')}
    ${label('currency', fields.currency, '<select id="currency" name="currency"><option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option><option>AUD</option><option>BRL</option><option>INR</option></select>')}
    <p class="hint">${escapeGrowthHtml(fields.currencyNote)}</p><p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${button('calculate', labels.calculate)}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'paver-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('paver-length', fields.length, '<input id="paver-length" name="length" type="number" min="0.01" max="100000" step="any" inputmode="decimal" value="10">')}
    ${label('paver-width', fields.width, '<input id="paver-width" name="width" type="number" min="0.01" max="100000" step="any" inputmode="decimal" value="10">')}
    ${label('surface-unit', fields.surfaceUnit, `<select id="surface-unit" name="surfaceUnit"><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option></select>`)}
    ${label('module-length', fields.moduleLength, '<input id="module-length" name="moduleLength" type="number" min="1" max="100000" step="any" inputmode="decimal" value="40">')}
    ${label('module-width', fields.moduleWidth, '<input id="module-width" name="moduleWidth" type="number" min="1" max="100000" step="any" inputmode="decimal" value="40">')}
    ${label('module-unit', fields.moduleUnit, `<select id="module-unit" name="moduleUnit"><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="in">${escapeGrowthHtml(labels.inches)}</option></select>`)}
    ${label('pavers-per-module', fields.paversPerModule, '<input id="pavers-per-module" name="paversPerModule" type="number" min="1" max="1000" step="1" inputmode="numeric" value="1">')}
    <p class="hint">${escapeGrowthHtml(fields.unitsNote)}</p>
    ${label('paver-waste-percent', fields.paverWastePercent, '<input id="paver-waste-percent" name="paverWastePercent" type="number" min="0" max="50" step="any" inputmode="decimal" value="0">')}
    ${label('base-depth', fields.baseDepth, '<input id="base-depth" name="baseDepth" type="number" min="0" max="100" step="any" inputmode="decimal" value="0">')}
    ${label('base-depth-unit', fields.baseDepthUnit, `<select id="base-depth-unit" name="baseDepthUnit"><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="in">${escapeGrowthHtml(labels.inches)}</option><option value="mm">${escapeGrowthHtml(labels.millimeters)}</option></select>`)}
    ${label('base-waste-percent', fields.baseWastePercent, '<input id="base-waste-percent" name="baseWastePercent" type="number" min="0" max="50" step="any" inputmode="decimal" value="0">')}
    ${label('price-per-paver', fields.pricePerPaver, '<input id="price-per-paver" name="pricePerPaver" type="number" min="0" max="1000000" step="any" inputmode="decimal">')}
    ${label('base-price-per-m3', fields.basePricePerM3, '<input id="base-price-per-m3" name="basePricePerM3" type="number" min="0" max="1000000" step="any" inputmode="decimal">')}
    ${label('currency', fields.currency, '<select id="currency" name="currency"><option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option><option>AUD</option><option>BRL</option><option>INR</option></select>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${button('calculate', labels.calculate)}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'solar-panel-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('solar-mode', fields.mode, `<select id="solar-mode" name="mode"><option value="production">${escapeGrowthHtml(labels.productionMode)}</option><option value="sizing">${escapeGrowthHtml(labels.sizingMode)}</option></select>`)}
    <div data-solar-target hidden>${label('daily-target-kwh', fields.dailyTargetKwh, '<input id="daily-target-kwh" name="dailyTargetKwh" type="number" min="0.1" max="1000" step="any" inputmode="decimal" value="20">')}</div>
    <div data-solar-count>${label('solar-panel-count', fields.panelCount, '<input id="solar-panel-count" name="panelCount" type="number" min="1" max="10000" step="1" inputmode="numeric" value="10">')}</div>
    ${label('panel-watts', fields.panelWatts, '<input id="panel-watts" name="panelWatts" type="number" min="50" max="2000" step="any" inputmode="decimal" value="400">')}
    ${label('peak-sun-hours', fields.peakSunHours, '<input id="peak-sun-hours" name="peakSunHours" type="number" min="0.1" max="14" step="any" inputmode="decimal" value="5">')}
    ${label('solar-loss-percent', fields.lossPercent, '<input id="solar-loss-percent" name="lossPercent" type="number" min="0" max="60" step="any" inputmode="decimal" value="20">')}
    <p class="hint">${escapeGrowthHtml(fields.assumptionNote)}</p>
    ${label('panel-length-m', fields.panelLengthM, '<input id="panel-length-m" name="panelLengthM" type="number" min="0.2" max="5" step="any" inputmode="decimal" placeholder="">')}
    ${label('panel-width-m', fields.panelWidthM, '<input id="panel-width-m" name="panelWidthM" type="number" min="0.2" max="5" step="any" inputmode="decimal" placeholder="">')}
    ${label('electricity-rate', fields.electricityRate, '<input id="electricity-rate" name="electricityRate" type="number" min="0" max="100" step="any" inputmode="decimal" placeholder="">')}
    ${label('system-cost', fields.systemCost, '<input id="system-cost" name="systemCost" type="number" min="0" max="1000000000" step="any" inputmode="decimal" placeholder="">')}
    ${label('solar-currency', fields.currency, '<select id="solar-currency" name="currency"><option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option><option>AUD</option><option>BRL</option><option>INR</option></select>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${button('calculate', labels.calculate)}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'btu-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('btu-dimension-unit', fields.dimensionUnit, `<select id="btu-dimension-unit" name="dimensionUnit"><option value="ft">${escapeGrowthHtml(labels.feet)}</option><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="in">${escapeGrowthHtml(labels.inches)}</option></select>`)}
    ${label('btu-room-length', fields.length, '<input id="btu-room-length" name="length" type="number" min="0" max="1000" step="any" inputmode="decimal" value="12" required>')}
    ${label('btu-room-width', fields.width, '<input id="btu-room-width" name="width" type="number" min="0" max="1000" step="any" inputmode="decimal" value="12" required>')}
    ${label('btu-ceiling-height', fields.ceilingHeight, '<input id="btu-ceiling-height" name="ceilingHeight" type="number" min="0.1" max="40" step="any" inputmode="decimal" value="8" required>')}
    ${label('btu-insulation-adjustment', fields.insulationAdjustment, '<input id="btu-insulation-adjustment" name="insulationAdjustment" type="number" min="-30" max="50" step="1" value="0" required>')}
    ${label('btu-sun-exposure', fields.sunExposure, `<select id="btu-sun-exposure" name="sunExposure"><option value="shaded">${escapeGrowthHtml(labels.shaded)}</option><option value="typical" selected>${escapeGrowthHtml(labels.typical)}</option><option value="sunny">${escapeGrowthHtml(labels.sunny)}</option></select>`)}
    ${label('btu-occupants', fields.occupants, '<input id="btu-occupants" name="occupants" type="number" min="0" max="50" step="1" value="2" required>')}
    ${label('btu-kitchen', fields.kitchen, `<select id="btu-kitchen" name="kitchen"><option value="no" selected>${escapeGrowthHtml(labels.no)}</option><option value="yes">${escapeGrowthHtml(labels.yes)}</option></select>`)}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'brick-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('brick-wall-unit', fields.wallUnit, `<select id="brick-wall-unit" name="wallUnit"><option value="ft">${escapeGrowthHtml(labels.feet)}</option><option value="m">${escapeGrowthHtml(labels.meters)}</option></select>`)}
    ${label('brick-wall-length', fields.wallLength, '<input id="brick-wall-length" name="wallLength" type="number" min="0.01" max="10000" step="any" inputmode="decimal" value="10">')}
    ${label('brick-wall-height', fields.wallHeight, '<input id="brick-wall-height" name="wallHeight" type="number" min="0.01" max="10000" step="any" inputmode="decimal" value="8">')}
    ${label('brick-size-unit', fields.brickUnit, `<select id="brick-size-unit" name="brickUnit"><option value="in">${escapeGrowthHtml(labels.inches)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option></select>`)}
    ${label('brick-length', fields.brickLength, '<input id="brick-length" name="brickLength" type="number" min="1" max="100000" step="any" inputmode="decimal" value="7.625">')}
    ${label('brick-height', fields.brickHeight, '<input id="brick-height" name="brickHeight" type="number" min="1" max="100000" step="any" inputmode="decimal" value="2.25">')}
    ${label('brick-depth', fields.brickDepth, '<input id="brick-depth" name="brickDepth" type="number" min="1" max="100000" step="any" inputmode="decimal" value="3.625">')}
    ${label('brick-joint-unit', fields.jointUnit, `<select id="brick-joint-unit" name="jointUnit"><option value="in">${escapeGrowthHtml(labels.inches)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option></select>`)}
    ${label('brick-joint', fields.joint, '<input id="brick-joint" name="joint" type="number" min="0" max="1000" step="any" inputmode="decimal" value="0.375">')}
    ${label('brick-opening-width', fields.openingWidth, '<input id="brick-opening-width" name="openingWidth" type="number" min="0" max="100000" step="any" inputmode="decimal" value="3">')}
    ${label('brick-opening-height', fields.openingHeight, '<input id="brick-opening-height" name="openingHeight" type="number" min="0" max="100000" step="any" inputmode="decimal" value="7">')}
    ${label('brick-opening-count', fields.openingCount, '<input id="brick-opening-count" name="openingCount" type="number" min="0" max="1000" step="1" inputmode="numeric" value="1">')}
    ${label('brick-wythes', fields.wythes, '<input id="brick-wythes" name="wythes" type="number" min="1" max="4" step="1" inputmode="numeric" value="1">')}
    ${label('brick-waste-percent', fields.wastePercent, '<input id="brick-waste-percent" name="wastePercent" type="number" min="0" max="50" step="any" inputmode="decimal" value="5">')}
    ${label('brick-bag-yield', fields.bagYieldLiters, '<input id="brick-bag-yield" name="bagYieldLiters" type="number" min="0.1" max="100000" step="any" inputmode="decimal" placeholder="">')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${button('calculate', labels.calculate)}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'rafter-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('rafter-unit', fields.unit, `<select id="rafter-unit" name="unit"><option value="ft">${escapeGrowthHtml(labels.feet)}</option><option value="m">${escapeGrowthHtml(labels.meters)}</option></select>`)}
    <div class="field"><label for="rafter-mode">${escapeGrowthHtml(fields.mode)}</label><select id="rafter-mode" name="mode"><option value="rise">${escapeGrowthHtml(labels.riseMode)}</option><option value="pitch">${escapeGrowthHtml(labels.pitchMode)}</option></select></div>
    ${label('rafter-span', fields.span, '<input id="rafter-span" name="span" type="number" min="0.01" max="100000" step="any" inputmode="decimal" value="20" required>')}
    ${label('rafter-rise', fields.rise, '<input id="rafter-rise" name="rise" type="number" min="0.01" max="100000" step="any" inputmode="decimal" value="6" required>')}
    ${label('rafter-pitch', fields.pitch, '<input id="rafter-pitch" name="pitch" type="number" min="0.01" max="100" step="any" inputmode="decimal" value="3" hidden>')}
    ${label('rafter-ridge', fields.ridgeThickness, '<input id="rafter-ridge" name="ridgeThickness" type="number" min="0" max="10000" step="any" inputmode="decimal" value="1.5" required>')}
    ${label('rafter-ridge-unit', fields.ridgeUnit, `<select id="rafter-ridge-unit" name="ridgeUnit"><option value="in">${escapeGrowthHtml(labels.inches)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option></select>`)}
    ${label('rafter-overhang', fields.overhang, '<input id="rafter-overhang" name="overhang" type="number" min="0" max="100000" step="any" inputmode="decimal" value="0" required>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div><figure class="rafter-diagram" data-rafter-diagram hidden></figure>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'carpet-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('carpet-unit', fields.unit, `<select id="carpet-unit" name="unit"><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option></select>`)}
    ${label('carpet-room-length', fields.roomLength, '<input id="carpet-room-length" name="roomLength" type="number" min="0.01" max="100000" step="any" inputmode="decimal" value="4" required>')}
    ${label('carpet-room-width', fields.roomWidth, '<input id="carpet-room-width" name="roomWidth" type="number" min="0.01" max="100000" step="any" inputmode="decimal" value="5" required>')}
    ${label('carpet-roll-width', fields.rollWidth, '<input id="carpet-roll-width" name="rollWidth" type="number" min="0.1" max="20" step="any" inputmode="decimal" value="3" required>')}
    ${label('carpet-rooms', fields.rooms, '<input id="carpet-rooms" name="rooms" type="number" min="1" max="100" step="1" inputmode="numeric" value="1" required>')}
    <div class="field"><label for="carpet-pile-direction">${escapeGrowthHtml(fields.pileDirection)}</label><select id="carpet-pile-direction" name="pileDirection"><option value="either">${escapeGrowthHtml(labels.eitherDirection)}</option><option value="length">${escapeGrowthHtml(labels.alongRoomLength)}</option><option value="width">${escapeGrowthHtml(labels.alongRoomWidth)}</option></select></div>
    ${label('carpet-waste', fields.wastePercent, '<input id="carpet-waste" name="wastePercent" type="number" min="0" max="50" step="any" inputmode="decimal" value="10" required>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'aquarium-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('dimension-unit', fields.dimensionUnit, `<select id="dimension-unit" name="dimensionUnit"><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="in">${escapeGrowthHtml(labels.inches)}</option><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option></select>`)}
    ${label('length', fields.length, '<input id="length" name="length" type="number" min="0.01" max="100000" step="any" value="60" inputmode="decimal" required>')}
    ${label('width', fields.width, '<input id="width" name="width" type="number" min="0.01" max="100000" step="any" value="30" inputmode="decimal" required>')}
    ${label('height', fields.height, '<input id="height" name="height" type="number" min="0.01" max="100000" step="any" value="36" inputmode="decimal" required>')}
    ${label('substrate-depth', fields.substrateDepth, '<input id="substrate-depth" name="substrateDepth" type="number" min="0" max="100000" step="any" value="5" inputmode="decimal">')}
    ${label('substrate-solid-percent', fields.substrateSolidPercent, '<input id="substrate-solid-percent" name="substrateSolidPercent" type="number" min="0" max="100" step="any" value="50" inputmode="decimal">')}
    ${label('air-gap', fields.airGap, '<input id="air-gap" name="airGap" type="number" min="0" max="100000" step="any" value="3" inputmode="decimal">')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'grass-seed-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('grass-area', fields.area, '<input id="grass-area" name="area" type="number" min="0.01" max="100000000" step="any" inputmode="decimal" value="100" required>')}
    ${label('grass-area-unit', fields.areaUnit, `<select id="grass-area-unit" name="areaUnit"><option value="m2">${escapeGrowthHtml(labels.m2)}</option><option value="ft2">${escapeGrowthHtml(labels.ft2)}</option><option value="acre">${escapeGrowthHtml(labels.acre)}</option></select>`)}
    ${label('grass-rate', fields.seedingRate, '<input id="grass-rate" name="seedingRate" type="number" min="0" max="1000000" step="any" inputmode="decimal" value="30" required>')}
    ${label('grass-rate-unit', fields.rateUnit, `<select id="grass-rate-unit" name="rateUnit"><option value="g-m2">${escapeGrowthHtml(labels.gM2)}</option><option value="lb-1000ft2">${escapeGrowthHtml(labels.lb1000ft2)}</option></select>`)}
    ${label('grass-extra', fields.wastePercent, '<input id="grass-extra" name="wastePercent" type="number" min="0" max="50" step="any" inputmode="decimal" value="0" required>')}
    <fieldset><legend>${escapeGrowthHtml(fields.varietyA)}</legend>
      ${label('grass-variety-a', fields.varietyA, '<input id="grass-variety-a" name="varietyA" type="text" maxlength="50" value="Seed A">')}
      ${label('grass-share-a', fields.percentA, '<input id="grass-share-a" name="percentA" type="number" min="0" max="100" step="any" inputmode="decimal" value="100" required>')}
      ${label('grass-variety-b', fields.varietyB, '<input id="grass-variety-b" name="varietyB" type="text" maxlength="50" value="Seed B">')}
      ${label('grass-share-b', fields.percentB, '<input id="grass-share-b" name="percentB" type="number" min="0" max="100" step="any" inputmode="decimal" value="0" required>')}
    </fieldset>
    <fieldset><legend>${escapeGrowthHtml(fields.bagSize)}</legend>
      ${label('grass-bag-size', fields.bagSize, '<input id="grass-bag-size" name="bagSize" type="number" min="0" max="1000000" step="any" inputmode="decimal" value="0" required>')}
      ${label('grass-bag-unit', fields.bagUnit, `<select id="grass-bag-unit" name="bagUnit"><option value="kg">${escapeGrowthHtml(labels.kg)}</option><option value="lb">${escapeGrowthHtml(labels.lb)}</option></select>`)}
    </fieldset>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'insulation-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('insulation-unit', fields.unit, `<select id="insulation-unit" name="unit"><option value="R">${escapeGrowthHtml(labels.R)}</option><option value="RSI">${escapeGrowthHtml(labels.RSI)}</option></select>`)}
    ${[1, 2, 3, 4].map((index) => `<fieldset><legend>${escapeGrowthHtml(fields[`layerName${index}`])}</legend>
      ${label(`insulation-name-${index}`, fields[`layerName${index}`], `<input id="insulation-name-${index}" name="layerName${index}" type="text" maxlength="50">`)}
      ${label(`insulation-value-${index}`, fields[`layerResistance${index}`], `<input id="insulation-value-${index}" name="layerResistance${index}" type="number" min="0" max="1000" step="any" inputmode="decimal" ${index <= 2 ? `value="${index}"` : ''}>`)}
      ${label(`insulation-quantity-${index}`, fields[`layerQuantity${index}`], `<input id="insulation-quantity-${index}" name="layerQuantity${index}" type="number" min="1" max="100" step="1" inputmode="numeric" value="1" required>`)}
    </fieldset>`).join('')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'wall-framing-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('wall-length', fields.wallLength, '<input id="wall-length" name="wallLength" type="number" min="0.1" max="100000" step="any" inputmode="decimal" value="8" required>')}
    ${label('wall-height', fields.wallHeight, '<input id="wall-height" name="wallHeight" type="number" min="0.1" max="100" step="any" inputmode="decimal" value="8" required>')}
    ${label('wall-unit', fields.wallUnit, `<select id="wall-unit" name="wallUnit"><option value="ft">${escapeGrowthHtml(labels.feet)}</option><option value="m">${escapeGrowthHtml(labels.meters)}</option></select>`)}
    ${label('stud-spacing', fields.spacing, '<input id="stud-spacing" name="spacing" type="number" min="0.01" max="100000" step="any" inputmode="decimal" value="16" required>')}
    ${label('stud-spacing-unit', fields.spacingUnit, `<select id="stud-spacing-unit" name="spacingUnit"><option value="in">${escapeGrowthHtml(labels.inches)}</option><option value="mm">${escapeGrowthHtml(labels.millimeters)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option><option value="m">${escapeGrowthHtml(labels.meters)}</option></select>`)}
    ${[1, 2, 3].map((index) => `<fieldset><legend>${escapeGrowthHtml(fields[`openingStart${index}`])}</legend>
      ${label(`opening-start-${index}`, fields[`openingStart${index}`], `<input id="opening-start-${index}" name="openingStart${index}" type="number" min="0" max="100000" step="any" inputmode="decimal">`)}
      ${label(`opening-width-${index}`, fields[`openingWidth${index}`], `<input id="opening-width-${index}" name="openingWidth${index}" type="number" min="0.01" max="100000" step="any" inputmode="decimal">`)}
      <label><input name="breakBottomPlate${index}" type="checkbox"> ${escapeGrowthHtml(fields[`breakBottomPlate${index}`])}</label>
    </fieldset>`).join('')}
    ${label('top-plate-rows', fields.topPlateRows, '<input id="top-plate-rows" name="topPlateRows" type="number" min="1" max="5" step="1" inputmode="numeric" value="2" required>')}
    ${label('bottom-plate-rows', fields.bottomPlateRows, '<input id="bottom-plate-rows" name="bottomPlateRows" type="number" min="0" max="3" step="1" inputmode="numeric" value="1" required>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'electricity-cost-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('electricity-rate', fields.ratePerKwh, '<input id="electricity-rate" name="ratePerKwh" type="number" min="0" max="1000000" step="any" inputmode="decimal" required>')}
    ${label('billing-days', fields.billingDays, '<input id="billing-days" name="billingDays" type="number" min="1" max="31" step="1" inputmode="numeric" value="30" required>')}
    ${label('fixed-charge', fields.fixedCharge, '<input id="fixed-charge" name="fixedCharge" type="number" min="0" max="1000000" step="any" inputmode="decimal" value="0">')}
    ${label('currency-code', fields.currency, '<input id="currency-code" name="currency" type="text" minlength="3" maxlength="3" pattern="[A-Za-z]{3}" value="USD" autocomplete="off" required>')}
    ${[1, 2, 3, 4].map((index) => `<fieldset><legend>${escapeGrowthHtml(fields[`appliance${index}`])}</legend>
      ${label(`appliance-name-${index}`, fields[`applianceName${index}`], `<input id="appliance-name-${index}" name="applianceName${index}" type="text" maxlength="60" autocomplete="off">`)}
      ${label(`appliance-power-${index}`, fields[`power${index}`], `<input id="appliance-power-${index}" name="power${index}" type="number" min="0.01" max="10000000" step="any" inputmode="decimal">`)}
      ${label(`appliance-power-unit-${index}`, fields[`powerUnit${index}`], `<select id="appliance-power-unit-${index}" name="powerUnit${index}"><option value="W">${escapeGrowthHtml(labels.watts)}</option><option value="kW">${escapeGrowthHtml(labels.kilowatts)}</option></select>`)}
      ${label(`appliance-quantity-${index}`, fields[`quantity${index}`], `<input id="appliance-quantity-${index}" name="quantity${index}" type="number" min="1" max="10000" step="1" inputmode="numeric">`)}
      ${label(`appliance-hours-${index}`, fields[`hours${index}`], `<input id="appliance-hours-${index}" name="hours${index}" type="number" min="0" max="24" step="any" inputmode="decimal">`)}
      ${label(`appliance-days-${index}`, fields[`activeDays${index}`], `<input id="appliance-days-${index}" name="activeDays${index}" type="number" min="0" max="31" step="1" inputmode="numeric">`)}
    </fieldset>`).join('')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'compost-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('mass-unit', fields.massUnit, `<select id="mass-unit" name="massUnit"><option value="kg">${escapeGrowthHtml(labels.kilograms)}</option><option value="lb">${escapeGrowthHtml(labels.pounds)}</option></select>`)}
    ${label('target-moisture', fields.targetMoisture, '<input id="target-moisture" name="targetMoisturePercent" type="number" min="0" max="90" step="any" inputmode="decimal">')}
    ${[1, 2, 3, 4].map((index) => `<fieldset><legend>${escapeGrowthHtml(fields[`material${index}`])}</legend>
      ${label(`material-name-${index}`, fields[`name${index}`], `<input id="material-name-${index}" name="name${index}" type="text" maxlength="60" autocomplete="off">`)}
      ${label(`material-mass-${index}`, fields[`wetMass${index}`], `<input id="material-mass-${index}" name="wetMass${index}" type="number" min="0.001" max="1000000" step="any" inputmode="decimal">`)}
      ${label(`material-moisture-${index}`, fields[`moisture${index}`], `<input id="material-moisture-${index}" name="moisture${index}" type="number" min="0" max="99.9" step="any" inputmode="decimal">`)}
      ${label(`material-carbon-${index}`, fields[`carbon${index}`], `<input id="material-carbon-${index}" name="carbon${index}" type="number" min="0.01" max="100" step="any" inputmode="decimal">`)}
      ${label(`material-ratio-${index}`, fields[`ratio${index}`], `<input id="material-ratio-${index}" name="ratio${index}" type="number" min="0.1" max="1000" step="any" inputmode="decimal">`)}
    </fieldset>`).join('')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'pond-volume-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('pond-shape', fields.shape, `<select id="pond-shape" name="shape" data-pond-shape><option value="rectangle">${escapeGrowthHtml(labels.rectangle)}</option><option value="circle">${escapeGrowthHtml(labels.circle)}</option><option value="oval">${escapeGrowthHtml(labels.oval)}</option></select>`)}
    ${label('pond-unit', fields.dimensionUnit, `<select id="pond-unit" name="dimensionUnit"><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option></select>`)}
    <div data-pond-dimensions="rectangle">${label('pond-length', fields.length, '<input id="pond-length" name="length" type="number" min="0.1" max="100000" step="any" inputmode="decimal">')}${label('pond-width', fields.width, '<input id="pond-width" name="width" type="number" min="0.1" max="100000" step="any" inputmode="decimal">')}</div>
    <div data-pond-dimensions="oval" hidden>${label('pond-oval-length', fields.length, '<input id="pond-oval-length" name="ovalLength" type="number" min="0.1" max="100000" step="any" inputmode="decimal">')}${label('pond-oval-width', fields.width, '<input id="pond-oval-width" name="ovalWidth" type="number" min="0.1" max="100000" step="any" inputmode="decimal">')}</div>
    <div data-pond-dimensions="circle" hidden>${label('pond-diameter', fields.diameter, '<input id="pond-diameter" name="diameter" type="number" min="0.1" max="100000" step="any" inputmode="decimal">')}</div>
    ${label('pond-average-depth', fields.averageDepth, '<input id="pond-average-depth" name="averageDepth" type="number" min="0.01" max="100000" step="any" inputmode="decimal">')}
    ${label('pond-maximum-depth', fields.maximumDepth, '<input id="pond-maximum-depth" name="maximumDepth" type="number" min="0.01" max="100000" step="any" inputmode="decimal">')}
    ${label('pond-overlap', fields.edgeOverlap, '<input id="pond-overlap" name="edgeOverlap" type="number" min="0" max="100000" step="any" inputmode="decimal">')}
    ${label('pond-fill', fields.fillPercent, '<input id="pond-fill" name="fillPercent" type="number" min="1" max="100" step="any" inputmode="decimal" value="100">')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'fertilizer-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('fertilizer-mode', fields.mode, `<select id="fertilizer-mode" name="mode" data-fertilizer-mode><option value="product">${escapeGrowthHtml(fields.productMode)}</option><option value="area">${escapeGrowthHtml(fields.areaMode)}</option></select>`)}
    <div data-fertilizer-input="product">${label('product-mass', fields.productMass, '<input id="product-mass" name="productMass" type="number" min="0.001" max="1000000" step="any" inputmode="decimal">')}</div>
    <div data-fertilizer-input="area" hidden>
      ${label('fertilizer-area', fields.area, '<input id="fertilizer-area" name="area" type="number" min="0.01" max="1000000000" step="any" inputmode="decimal">')}
      ${label('fertilizer-area-unit', fields.areaUnit, `<select id="fertilizer-area-unit" name="areaUnit"><option value="m2">${escapeGrowthHtml(labels.squareMeters)}</option><option value="ha">${escapeGrowthHtml(labels.hectares)}</option><option value="ft2">${escapeGrowthHtml(labels.squareFeet)}</option><option value="acre">${escapeGrowthHtml(labels.acres)}</option></select>`)}
      ${label('product-rate', fields.productRate, '<input id="product-rate" name="productRate" type="number" min="0.000001" max="1000000" step="any" inputmode="decimal">')}
      ${label('product-rate-unit', fields.rateUnit, `<select id="product-rate-unit" name="rateUnit"><option value="kg100m2">${escapeGrowthHtml(labels.kg100m2)}</option><option value="kgHa">${escapeGrowthHtml(labels.kgHa)}</option><option value="lb1000ft2">${escapeGrowthHtml(labels.lb1000ft2)}</option><option value="lbAcre">${escapeGrowthHtml(labels.lbAcre)}</option></select>`)}
    </div>
    ${label('fertilizer-mass-unit', fields.massUnit, `<select id="fertilizer-mass-unit" name="massUnit"><option value="kg">${escapeGrowthHtml(labels.kilograms)}</option><option value="lb">${escapeGrowthHtml(labels.pounds)}</option></select>`)}
    ${label('nitrogen-percent', fields.nitrogenPercent, '<input id="nitrogen-percent" name="nitrogenPercent" type="number" min="0" max="100" step="any" inputmode="decimal">')}
    ${label('phosphate-percent', fields.phosphatePercent, '<input id="phosphate-percent" name="phosphatePercent" type="number" min="0" max="100" step="any" inputmode="decimal" value="0">')}
    ${label('potash-percent', fields.potashPercent, '<input id="potash-percent" name="potashPercent" type="number" min="0" max="100" step="any" inputmode="decimal" value="0">')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'baluster-spacing-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('baluster-mode', fields.mode, `<select id="baluster-mode" name="mode"><option value="max-gap">${escapeGrowthHtml(fields.maxGapMode)}</option><option value="count">${escapeGrowthHtml(fields.countMode)}</option></select>`)}
    ${label('opening-width', fields.openingWidth, '<input id="opening-width" name="openingWidth" type="number" min="0.1" max="1000000" step="any" inputmode="decimal" required>')}
    ${label('baluster-width', fields.balusterWidth, '<input id="baluster-width" name="balusterWidth" type="number" min="0.01" max="100000" step="any" inputmode="decimal" required>')}
    ${label('baluster-unit', fields.unit, `<select id="baluster-unit" name="unit"><option value="mm">${escapeGrowthHtml(labels.millimeters)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="in">${escapeGrowthHtml(labels.inches)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option></select>`)}
    <div data-baluster-input="max-gap">${label('maximum-gap', fields.maximumGap, '<input id="maximum-gap" name="maximumGap" type="number" min="0.01" max="1000000" step="any" inputmode="decimal" required>')}</div>
    <div data-baluster-input="count" hidden>${label('baluster-count', fields.balusterCount, '<input id="baluster-count" name="balusterCount" type="number" min="1" max="1000" step="1" inputmode="numeric" required>')}</div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'retaining-wall-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('wall-unit', fields.wallUnit, `<select id="wall-unit" name="wallUnit"><option value="ft">${escapeGrowthHtml(labels.feet)}</option><option value="m">${escapeGrowthHtml(labels.meters)}</option></select>`)}
    ${label('wall-length', fields.wallLength, '<input id="wall-length" name="wallLength" type="number" min="0.01" max="100000" step="any" inputmode="decimal" required>')}
    ${label('wall-height', fields.wallHeight, '<input id="wall-height" name="wallHeight" type="number" min="0" max="10000" step="any" inputmode="decimal" required>')}
    ${label('block-unit', fields.blockUnit, `<select id="block-unit" name="blockUnit"><option value="in">${escapeGrowthHtml(labels.inches)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option></select>`)}
    ${label('block-length', fields.blockLength, '<input id="block-length" name="blockLength" type="number" min="0.1" max="100000" step="any" inputmode="decimal" required>')}
    ${label('block-height', fields.blockHeight, '<input id="block-height" name="blockHeight" type="number" min="0.1" max="100000" step="any" inputmode="decimal" required>')}
    ${label('block-depth', fields.blockDepth, '<input id="block-depth" name="blockDepth" type="number" min="0.1" max="100000" step="any" inputmode="decimal" required>')}
    ${label('block-joint', fields.joint, '<input id="block-joint" name="joint" type="number" min="0" max="1000" step="any" inputmode="decimal" value="0.25" required>')}
    ${label('base-width', fields.baseWidth, '<input id="base-width" name="baseWidth" type="number" min="0" max="10000" step="any" inputmode="decimal" value="2" required>')}
    ${label('base-depth', fields.baseDepth, '<input id="base-depth" name="baseDepth" type="number" min="0" max="10000" step="any" inputmode="decimal" value="0.5" required>')}
    ${label('backfill-thickness', fields.backfillThickness, '<input id="backfill-thickness" name="backfillThickness" type="number" min="0" max="10000" step="any" inputmode="decimal" value="1" required>')}
    ${label('material-waste', fields.wastePercent, '<input id="material-waste" name="wastePercent" type="number" min="0" max="50" step="any" inputmode="decimal" value="5" required>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  return attachCopy(`<section class="game" aria-label="${escapeGrowthHtml(copy.name)}"><div class="game-toolbar"><label for="mancala-mode">${escapeGrowthHtml(fields.mode)}</label><select id="mancala-mode" data-mode><option value="computer">${escapeGrowthHtml(labels.computer)}</option><option value="two-player">${escapeGrowthHtml(labels.twoPlayers)}</option></select>${button('new-game', labels.newGame, 'primary')}</div><p class="status" role="status" aria-live="polite" data-status></p><div class="mancala-board" data-board aria-label="${escapeGrowthHtml(fields.board)}"></div><section class="result" data-result hidden><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div></section><details class="rules"><summary>${escapeGrowthHtml(labels.rules)}</summary><p>${escapeGrowthHtml(fields.rules ?? '')}</p></details></section>`, copy);
}
