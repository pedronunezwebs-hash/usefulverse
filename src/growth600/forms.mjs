import { escapeGrowthHtml } from './render.mjs';
import { FONT_PRESETS } from './tools/font-pairing-tool/logic.mjs';

function attachCopy(html, copy) {
  const safeJson = JSON.stringify(copy).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('&', '\\u0026');
  return `<script type="application/json" data-tool-copy>${safeJson}</script>${html}`;
}

function label(id, text, control) {
  return `<div class="field"><label for="${id}">${escapeGrowthHtml(text)}</label>${control}</div>`;
}

function button(action, text, kind = 'primary') {
  const type = action === 'reset' ? 'reset' : ['calculate', 'compare', 'generate', 'convert', 'preview'].includes(action) ? 'submit' : 'button';
  return `<button type="${type}" data-action="${action}" class="button button--${kind}">${escapeGrowthHtml(text)}</button>`;
}

export function renderGrowthForm(toolId, copy) {
  const fields = copy?.fields ?? {};
  const actions = copy?.actions ?? {};
  const fieldNames = {
    'image-color-picker': ['imageFile', 'accuracyNote', 'previewHint', 'zoom', 'currentColor', 'paletteLabel'],
    'image-region-redactor': ['imageFile', 'mode', 'strength', 'regionX', 'regionY', 'regionWidth', 'regionHeight', 'accuracyNote', 'dragHint', 'regionsLabel'],
    'image-sharpener': ['imageFile', 'amount', 'radius', 'threshold', 'compare', 'accuracyNote', 'previewHint', 'format', 'relatedRedactor', 'relatedCropper'],
    'photo-to-sketch': ['imageFile', 'intensity', 'detail', 'compare', 'accuracyNote', 'previewHint'],
    'schema-markup-validator': ['markup', 'accuracyNote', 'resultSummary', 'issues', 'googleNote'],
    'readability-checker': ['text', 'language', 'languageEn', 'languageEs', 'languageFr', 'languageDe', 'languageIt', 'accuracyNote', 'resultSummary', 'formula', 'wordCount', 'sentenceCount', 'characterCount', 'characterCountNoSpaces', 'letterCount', 'syllableEstimate', 'averageSentenceLength', 'averageWordLength', 'averageSyllablesPerWord', 'longWordCount'],
    'savings-goal-calculator': ['mode', 'startingBalance', 'targetAmount', 'annualRatePercent', 'months', 'monthlyContribution', 'contributionTiming', 'accuracyNote', 'resultSummary', 'monthlyResult', 'monthsResult', 'projectedBalance', 'totalContributions', 'estimatedInterest', 'currencyNote'],
    'severance-pay-calculator': ['mode', 'weeklyPay', 'yearsOfService', 'weeksPerYear', 'birthDate', 'employmentStartDate', 'redundancyDate', 'accuracyNote', 'customNote', 'ukNote', 'officialSource', 'estimate', 'appliedWeeklyPay', 'totalWeeks', 'rulesAsOf'],
    'divisibility-calculator': ['integer', 'divisors', 'accuracyNote', 'resultSummary', 'remainder', 'quotient', 'rule', 'rule1', 'rule2', 'rule3', 'rule4', 'rule5', 'rule6', 'rule7', 'rule8', 'rule9', 'rule10', 'rule11', 'rule12', 'rule13', 'rule25', 'rule100', 'rule1000', 'ruleGeneric'],
    'number-line-graphing-tool': ['intervals', 'intervalFormat', 'accuracyNote', 'chartDescription', 'exampleInput'],
    'laplace-transform-calculator': ['direction', 'forwardMode', 'inverseMode', 'expression', 'forwardHint', 'inverseHint', 'accuracyNote', 'resultSummary', 'region', 'forwardConvention', 'inverseConvention', 'forwardExample', 'inverseExample'],
    'vector-calculator': ['dimension', 'dimension2d', 'dimension3d', 'operation', 'vectorA', 'vectorB', 'ax', 'ay', 'az', 'bx', 'by', 'bz', 'accuracyNote', 'resultSummary', 'zComponent', 'magnitudeAResult', 'magnitudeBResult', 'dotProductResult', 'exampleHint'],
    'cubic-quartic-equation-calculator': ['degree', 'degree3', 'degree4', 'a4', 'a3', 'a2', 'a1', 'a0', 'accuracyNote', 'resultSummary', 'root', 'multiplicity', 'residual', 'noRealRoots', 'nonRealRootsNote', 'exampleHint'],
    'complex-number-calculator': ['operation', 'realA', 'imaginaryA', 'realB', 'imaginaryB', 'radius', 'angle', 'angleUnit', 'degrees', 'radians', 'degree', 'resultSummary', 'resultReal', 'resultImaginary', 'modulus', 'argument', 'polar', 'rootNumber', 'zeroArgumentNote', 'accuracyNote', 'exampleHint'],
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
    'molarity-calculator': ['mode', 'moles', 'molarity', 'volume', 'volumeUnit', 'molarMass', 'accuracyNote'],
    'dilution-calculator': ['mode', 'directMode', 'serialMode', 'stockConcentration', 'targetConcentration', 'finalVolume', 'volumeUnit', 'steps', 'accuracyNote'],
    'ohms-law-calculator': ['mode', 'solverMode', 'networkMode', 'voltage', 'current', 'resistance', 'power', 'topology', 'series', 'parallel', 'resistorValues', 'accuracyNote'],
    'chemical-equation-balancer': ['equation', 'formulaHint', 'accuracyNote'],
    'gear-ratio-calculator': ['stages', 'stagesHint', 'inputRpm', 'inputTorque', 'driveType', 'externalGears', 'chainDrive', 'efficiencyPercent', 'accuracyNote'],
    'density-calculator': ['mode', 'solveMode', 'mixtureMode', 'massKg', 'volumeM3', 'densityKgM3', 'components', 'componentsHint', 'accuracyNote'],
    'kinetic-energy-calculator': ['mode', 'energyMode', 'speedMode', 'massKg', 'velocityMps', 'kineticEnergyJ', 'heightM', 'gravityMps2', 'accuracyNote'],
    'resistor-color-code-calculator': ['mode', 'decodeMode', 'encodeMode', 'bands', 'fourBands', 'fiveBands', 'sixBands', 'resistanceOhms', 'tolerance', 'temperatureCoefficient', 'accuracyNote', 'band1', 'band2', 'band3', 'band4', 'band5', 'band6', 'black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white', 'gold', 'silver', 'none', 'ppm250', 'ppm100', 'ppm50', 'ppm25', 'ppm20', 'ppm15', 'ppm10', 'ppm5', 'ppm1', 'tolerance005', 'tolerance01', 'tolerance025', 'tolerance05', 'tolerance1', 'tolerance2', 'tolerance5', 'tolerance10', 'tolerance20'],
    'acceleration-calculator': ['mode', 'solveAcceleration', 'solveTime', 'solveFinalVelocity', 'solveDisplacement', 'units', 'metric', 'imperial', 'initialVelocity', 'finalVelocity', 'acceleration', 'timeSeconds', 'initialPosition', 'accuracyNote'],
    'force-calculator': ['mode', 'solveForce', 'solveMass', 'solveAcceleration', 'netMode', 'forceUnit', 'massUnit', 'accelerationUnit', 'force', 'mass', 'acceleration', 'forces', 'forcesHint', 'netMass', 'accuracyNote'],
    'friction-calculator': ['mode', 'normalForce', 'mass', 'massUnit', 'angle', 'gravity', 'staticCoefficient', 'kineticCoefficient', 'appliedForce', 'forceUnit', 'motionState', 'atRest', 'movingUp', 'movingDown', 'positiveSurfaceDirection', 'accuracyNote'],
    'thermal-expansion-calculator': ['mode', 'linearMode', 'areaMode', 'volumeMode', 'initialDimension', 'lengthUnit', 'areaUnit', 'volumeUnit', 'coefficient', 'coefficientTemperatureUnit', 'deltaTemperature', 'temperatureUnit', 'accuracyNote'],
    'horsepower-calculator': ['mode', 'solvePower', 'solveTorque', 'solveRpm', 'torque', 'torqueUnit', 'rpm', 'power', 'powerUnit', 'accuracyNote'],
    'rtf-converter': ['file', 'accuracyNote', 'limitNote', 'output'],
    'csv-to-pdf': ['file', 'separator', 'encoding', 'hasHeader', 'pageSize', 'orientation', 'margin', 'accuracyNote', 'limitNote', 'resultCount', 'tableLabel'],
    'round-robin-tournament-generator': ['participants', 'participantsHint', 'doubleRound', 'shuffle', 'scoringNote', 'limitNote', 'standingsLabel', 'rank', 'team', 'played', 'wins', 'draws', 'losses', 'goalsFor', 'goalsAgainst', 'goalDifference', 'points', 'round', 'leg', 'home', 'away', 'bye', 'homeScore', 'awayScore', 'fixtureTableLabel'],
    'work-order-generator': ['workOrderNumber', 'issuedDate', 'scheduledDate', 'completedDate', 'status', 'customer', 'contact', 'location', 'assignedTo', 'title', 'details', 'tasks', 'tasksHint', 'materials', 'materialsHint', 'materialsFormat', 'labor', 'laborHint', 'laborFormat', 'notes', 'limitNote', 'privacyNote', 'previewTitle', 'checklist', 'materialsLabel', 'laborLabel', 'description', 'quantity', 'unit', 'activity', 'hours', 'totalLaborHours'],
    slitherlink: ['size', 'board', 'rules', 'accuracyNote', 'row', 'column', 'horizontal', 'vertical'],
    'peg-solitaire': ['board', 'rules', 'accuracyNote', 'hole', 'row', 'column', 'peg', 'empty'],
    futoshiki: ['size', 'difficulty', 'board', 'rules', 'accuracyNote', 'cell', 'row', 'column'],
    'hashi-puzzle': ['difficulty', 'board', 'rules', 'accuracyNote', 'island', 'needs', 'current', 'bridge', 'to', 'toggleHint'],
    'chess-opening-trainer': ['opening', 'side', 'white', 'black', 'board', 'moves', 'progressLabel', 'square', 'empty', 'accuracyNote', 'rules', 'opening_italian', 'opening_sicilian', 'opening_ruy_lopez', 'opening_french', 'opening_caro_kann', 'opening_queens_gambit', 'opening_london', 'opening_scandinavian', 'opening_english', 'opening_kings_indian', 'piece_wp', 'piece_wn', 'piece_wb', 'piece_wr', 'piece_wq', 'piece_wk', 'piece_bp', 'piece_bn', 'piece_bb', 'piece_br', 'piece_bq', 'piece_bk'],
    'decibel-calculator': ['mode', 'powerMode', 'amplitudeMode', 'dbToPowerMode', 'dbToAmplitudeMode', 'sumMode', 'applyMode', 'ratio', 'inputDb', 'levels', 'inputLevel', 'gainDb', 'accuracyNote', 'assumptionsNote'],
    'hijri-calendar-converter': ['mode', 'gregorianToHijri', 'hijriToGregorian', 'gregorianDate', 'gregorianYear', 'gregorianMonth', 'gregorianDay', 'hijriYear', 'hijriMonth', 'hijriDay', 'hijriMonths', 'methodNote'],
    'capacitor-calculator': ['values', 'valuesHint', 'connection', 'series', 'parallel', 'unit', 'voltage', 'accuracyNote', 'resultEquivalent', 'resultCharge', 'resultEnergy', 'resultVoltage', 'capacitor', 'formulaNote'],
    'body-water-calculator': ['equation', 'watsonMale', 'watsonFemale', 'age', 'height', 'heightUnit', 'weight', 'weightUnit', 'centimeters', 'inches', 'kilograms', 'pounds', 'accuracyNote', 'resultLiters', 'resultPercent', 'equationNote'],
    '555-timer-calculator': ['mode', 'astable', 'monostable', 'resistanceA', 'resistanceB', 'resistance', 'resistanceUnit', 'ohms', 'kilohms', 'megohms', 'capacitance', 'capacitanceUnit', 'farads', 'millifarads', 'microfarads', 'nanofarads', 'picofarads', 'accuracyNote', 'frequencyNote', 'highFrequencyWarning', 'formulaNote', 'resultFrequency', 'resultPeriod', 'resultHigh', 'resultLow', 'resultWaveformDuty', 'resultDischargeDuty', 'resultPulse'],
    'fourier-series-calculator': ['samples', 'samplesHint', 'period', 'periodHint', 'harmonics', 'harmonicsHint', 'accuracyNote', 'formulaLabel', 'formula', 'resultDc', 'resultFrequency', 'resultHarmonics', 'resultRms', 'coefficient', 'coefficientA', 'coefficientB', 'coefficientAmplitude', 'phase', 'radians', 'frequencyUnit', 'chartLabel', 'samplesLegend', 'reconstructionLegend'],
    'modular-inverse-calculator': ['a', 'modulus', 'accuracyNote', 'formulaLabel', 'formula', 'resultStatus', 'resultGcd', 'resultResidue', 'resultInverse', 'bezout', 'step', 'quotient', 'remainder', 'coefficientA', 'coefficientModulus', 'existsLabel', 'missingLabel', 'verification'],
    'openapi-editor': ['format', 'autoFormat', 'jsonFormat', 'yamlFormat', 'document', 'upload', 'accuracyNote', 'previewTitle', 'operations', 'issues', 'yamlLicense'],
    'font-pairing-tool': ['preset', 'headingFont', 'bodyFont', 'fontFiles', 'accuracyNote', 'sampleHeading', 'sampleBody', 'hierarchyLabel', 'headingSize', 'bodySize', 'headingWeight', 'bodyWeight', 'lineHeight', 'familyGeorgia', 'familyTimes', 'familyArial', 'familyVerdana', 'familyTrebuchet', 'familyMono', 'familySystem', 'presetEditorial', 'presetModern', 'presetClassic', 'presetTechnical', 'presetFriendly', 'presetSystem'],
    'roth-vs-traditional-calculator': ['annualContribution', 'currentTaxRate', 'futureTaxRate', 'annualReturn', 'years', 'budgetNote', 'accuracyNote', 'resultSummary', 'rothAnnualDeposit', 'rothAfterTax', 'traditionalBeforeTax', 'traditionalAfterTax', 'traditionalTax', 'taxPaidNow', 'estimatedDifference', 'totalBudget', 'irsSource'],
    'polygon-calculator': ['sides', 'dimensionMode', 'sideLength', 'apothem', 'circumradius', 'dimension', 'unit', 'accuracyNote', 'resultSummary', 'perimeter', 'area', 'computedSide', 'computedApothem', 'computedCircumradius', 'interiorAngle', 'centralAngle', 'formulaNote'],
    'compression-ratio-calculator': ['unit', 'volumeUnit', 'millimeters', 'inches', 'cubicCentimeters', 'cubicInches', 'bore', 'stroke', 'chamberVolume', 'gasketBore', 'gasketThickness', 'deckClearance', 'pistonCrownVolume', 'cylinders', 'accuracyNote'],
    'goal-planner': ['title', 'outcome', 'metric', 'unit', 'startValue', 'targetValue', 'currentValue', 'startDate', 'currentDate', 'dueDate', 'milestones', 'milestoneHint', 'accuracyNote', 'privacyNote', 'progressLabel', 'milestonesLabel', 'backupFile', 'backupHint', 'relatedTaskList'],
    'mind-map-maker': ['centralTopic', 'newIdea', 'privacyNote', 'mapLabel', 'editIdea', 'moveTo', 'jsonFile', 'importHint'],
    'mood-tracker': ['date', 'mood', 'note', 'tags', 'saveConsent', 'privacyNote', 'consentHint', 'calendarLabel', 'monthLabel', 'selectedEntry', 'weekdaySun', 'weekdayMon', 'weekdayTue', 'weekdayWed', 'weekdayThu', 'weekdayFri', 'weekdaySat', 'mood1', 'mood2', 'mood3', 'mood4', 'mood5', 'tagCalm', 'tagAnxious', 'tagSad', 'tagHappy', 'tagTired', 'tagFocused', 'tagStressed', 'tagHopeful', 'tagGrateful', 'tagAngry', 'summaryLabel', 'averageLabel', 'countLabel', 'distributionLabel', 'noEntries', 'accuracyNote', 'importHint', 'sourceNote'],
    'journal-online': ['date', 'title', 'body', 'tags', 'search', 'dateFrom', 'dateTo', 'saveConsent', 'storageNote', 'encryptionNote', 'backupPassword', 'confirmPassword', 'entriesLabel', 'resultLabel', 'noEntries', 'countLabel', 'tagHint', 'importHint', 'passwordHint', 'exampleHint', 'exampleTitle', 'exampleBody', 'exampleTags', 'safetyNote'],
    'travel-itinerary-planner': ['tripName', 'tripStartDate', 'tripEndDate', 'bufferMinutes', 'saveConsent', 'storageNote', 'itemDate', 'startTime', 'endTime', 'itemTitle', 'category', 'categories', 'location', 'reservation', 'notes', 'itineraryLabel', 'noTrip', 'noItems', 'itemCount', 'overlapCount', 'bufferWarningCount', 'conflictsLabel', 'backupFile', 'backupHint', 'timeZoneNote', 'reservationPrivacyNote', 'exampleTrip', 'exampleActivity', 'exampleMeal', 'exampleLocation', 'exampleReservation'],
    'polynomial-long-division-calculator': ['dividend', 'divisor', 'accuracyNote'],
    'half-life-calculator': ['mode', 'solveRemaining', 'solveInitial', 'solveElapsed', 'solveHalfLife', 'initialAmount', 'remainingAmount', 'halfLife', 'elapsedTime', 'timeUnit', 'seconds', 'minutes', 'hours', 'days', 'years', 'accuracyNote'],
    'mortgage-points-calculator': ['principal', 'termMonths', 'rateWithoutPoints', 'rateWithPoints', 'pointsPercent', 'horizonMonths', 'monthsLabel', 'accuracyNote'],
    'trapezoid-calculator': ['baseA', 'baseB', 'height', 'topOffset', 'unit', 'millimeters', 'centimeters', 'meters', 'inches', 'feet', 'accuracyNote', 'diagramLabel'],
    'prayer-times-calculator': ['date', 'latitude', 'longitude', 'utcOffset', 'method', 'asrMethod', 'highLatitudeMethod', 'ramadan', 'accuracyNote'],
    'auto-loan-refinance-calculator': ['balance', 'currentApr', 'currentMonths', 'newApr', 'newMonths', 'fees', 'feeTreatment'],
    'secret-santa-generator': ['names', 'exclusions'],
    'tire-size-calculator': ['originalSize', 'replacementSize', 'indicatedSpeed', 'speedUnit', 'fitmentNote'],
    'stair-calculator': ['totalRise', 'riserCount', 'treadDepth', 'unit', 'codeNote', 'relatedUnitConverter'],
    'asphalt-calculator': ['area', 'areaUnit', 'compactedThickness', 'thicknessUnit', 'density', 'densityUnit', 'wastePercent', 'pricePerTonne', 'accuracyNote', 'relatedConcreteCalculator'],
    mancala: ['mode'],
    'dominoes-game': ['mode', 'variant', 'board', 'stock', 'hand', 'opponentHand', 'accuracyNote'],
    hitori: ['size', 'difficulty', 'board', 'rules', 'accuracyNote', 'cell', 'row', 'column', 'black', 'white'],
    nurikabe: ['difficulty', 'board', 'rules', 'accuracyNote', 'cell', 'row', 'column', 'sea', 'island'],
    slitherlink: ['size', 'board', 'rules', 'accuracyNote', 'row', 'column', 'horizontal', 'vertical'],
    'peg-solitaire': ['board', 'rules', 'accuracyNote', 'hole', 'row', 'column', 'peg', 'empty'],
    futoshiki: ['size', 'difficulty', 'board', 'rules', 'accuracyNote', 'cell', 'row', 'column'],
    'hashi-puzzle': ['difficulty', 'board', 'rules', 'accuracyNote', 'island', 'needs', 'current', 'bridge', 'to', 'toggleHint'],
    'chess-opening-trainer': ['opening', 'side', 'white', 'black', 'board', 'moves', 'progressLabel', 'square', 'empty', 'accuracyNote', 'rules', 'opening_italian', 'opening_sicilian', 'opening_ruy_lopez', 'opening_french', 'opening_caro_kann', 'opening_queens_gambit', 'opening_london', 'opening_scandinavian', 'opening_english', 'opening_kings_indian', 'piece_wp', 'piece_wn', 'piece_wb', 'piece_wr', 'piece_wq', 'piece_wk', 'piece_bp', 'piece_bn', 'piece_bb', 'piece_br', 'piece_bq', 'piece_bk'],
    'color-name-finder': ['hexColor', 'colorPreview', 'nearestNames', 'exactMatchNote', 'paletteNote'],
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
    'battery-runtime-calculator': ['capacityMode', 'energyMode', 'ampHourMode', 'capacityEnergy', 'energyUnit', 'capacityAh', 'voltage', 'loadWatts', 'depthOfDischargePercent', 'efficiencyPercent', 'accuracyNote'],
    'lumber-cut-calculator': ['unit', 'stockLength', 'kerf', 'cutList', 'accuracyNote'],
    'plant-spacing-calculator': ['bedLength', 'bedWidth', 'inRowSpacing', 'rowSpacing', 'unit', 'pattern', 'accuracyNote'],
    'ev-charging-calculator': ['batteryCapacityKwh', 'startSocPercent', 'targetSocPercent', 'chargerPowerKw', 'efficiencyPercent', 'electricityRatePerKwh', 'currency', 'accuracyNote'],
    'rainwater-harvesting-calculator': ['catchmentArea', 'areaUnit', 'rainfallUnit', 'rainfallValues', 'runoffPercent', 'tankCapacity', 'tankUnit', 'startingStorage', 'monthlyDemandValues', 'accuracyNote'],
    'ramp-calculator': ['rise', 'slopeRatioDenominator', 'landingCount', 'landingDepth', 'unit', 'safetyNote'],
    'heat-loss-calculator': ['areaUnit', 'temperatureUnit', 'volumeUnit', 'temperatureDifference', 'wallArea', 'wallUValue', 'roofArea', 'roofUValue', 'windowArea', 'windowUValue', 'floorArea', 'floorUValue', 'roomVolume', 'airChangesPerHour', 'accuracyNote'],
    'heat-pump-calculator': ['heatOutput', 'heatOutputUnit', 'cop', 'electricityRatePerKwh', 'hoursPerDay', 'currency', 'accuracyNote'],
    'miter-angle-calculator': ['mode', 'cornerAngle', 'springAngle', 'accuracyNote', 'diagramLabel', 'diagramCorner', 'diagramCut', 'diagramSpring'],
    'voltage-drop-calculator': ['circuit', 'dc', 'singlePhase', 'threePhase', 'material', 'copper', 'aluminum', 'oneWayLength', 'lengthUnit', 'currentA', 'crossSectionMm2', 'supplyVoltageV', 'powerFactor', 'accuracyNote'],
  }[toolId];
  if (!fieldNames || fieldNames.some((key) => !fields[key])) throw new Error(`Missing localized form fields for ${toolId}.`);
  const actionNames = {
    'image-color-picker': ['load', 'addSample', 'copyColor', 'copyPalette', 'remove', 'clear', 'reset'],
    'image-region-redactor': ['load', 'addRegion', 'undo', 'clear', 'export', 'example', 'download', 'removeRegion', 'black', 'pixelate', 'blur', 'png', 'jpeg'],
    'image-sharpener': ['load', 'export', 'download', 'original', 'sharpened', 'png', 'jpeg'],
    'photo-to-sketch': ['load', 'export', 'cancel', 'download', 'original'],
    'schema-markup-validator': ['validate', 'example', 'copySummary'],
    'readability-checker': ['calculate', 'example', 'copy', 'reset'],
    'savings-goal-calculator': ['calculate', 'example', 'copy', 'reset', 'requiredContribution', 'monthsToGoal', 'beginning', 'end'],
    'severance-pay-calculator': ['calculate', 'example', 'copy', 'reset', 'customMode', 'ukMode'],
    'divisibility-calculator': ['calculate', 'example', 'commonDivisors', 'copy', 'reset'],
    'number-line-graphing-tool': ['calculate', 'example', 'downloadSvg', 'reset'],
    'laplace-transform-calculator': ['calculate', 'example', 'reset'],
    'vector-calculator': ['calculate', 'example', 'reset', 'add', 'subtract', 'dot', 'cross', 'magnitudeA', 'magnitudeB', 'normalizeA', 'normalizeB', 'angle', 'projection'],
    'cubic-quartic-equation-calculator': ['calculate', 'example', 'reset'],
    'complex-number-calculator': ['calculate', 'example', 'reset', 'add', 'subtract', 'multiply', 'divide', 'magnitude', 'argument', 'rectangularToPolar', 'polarToRectangular', 'roots'],
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
    'molarity-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'liters', 'milliliters'],
    'dilution-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'liters', 'milliliters'],
    'ohms-law-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
    'chemical-equation-balancer': ['calculate', 'reset', 'copy', 'example', 'result'],
    'gear-ratio-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
    'density-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
    'kinetic-energy-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
    'resistor-color-code-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
    'acceleration-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
    'force-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
    'friction-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'normalMode', 'inclineMode', 'newtons', 'kilonewtons', 'poundsForce', 'kilograms', 'pounds'],
    'thermal-expansion-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'centimeters', 'millimeters', 'inches', 'feet', 'squareMeters', 'squareCentimeters', 'squareFeet', 'squareInches', 'cubicMeters', 'cubicCentimeters', 'liters', 'cubicFeet', 'cubicInches'],
    'horsepower-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
    'rtf-converter': ['convert', 'reset', 'copy', 'download', 'print', 'result'],
    'csv-to-pdf': ['preview', 'reset', 'example', 'print', 'result'],
    'round-robin-tournament-generator': ['generate', 'reset', 'example', 'downloadCsv', 'print', 'result'],
    'work-order-generator': ['generate', 'reset', 'example', 'downloadCsv', 'print', 'result', 'open', 'inProgress', 'completed'],
    slitherlink: ['newGame', 'checkBoard', 'hint', 'undo', 'clearMarks', 'rules', 'small', 'medium', 'large'],
    'peg-solitaire': ['newGame', 'hint', 'undo', 'rules', 'pegsRemaining'],
    futoshiki: ['newGame', 'checkBoard', 'hint', 'undo', 'rules', 'small', 'medium', 'large', 'easy', 'regular', 'hard'],
    'hashi-puzzle': ['newGame', 'checkBoard', 'hint', 'undo', 'clearBoard', 'rules', 'easy', 'regular', 'hard'],
    'chess-opening-trainer': ['newGame', 'hint', 'rules'],
    'decibel-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
    'hijri-calendar-converter': ['convert', 'reset', 'example', 'result'],
    'capacitor-calculator': ['calculate', 'reset', 'example', 'result'],
    'body-water-calculator': ['calculate', 'reset', 'example', 'result'],
    '555-timer-calculator': ['calculate', 'reset', 'example', 'result', 'copy'],
    'fourier-series-calculator': ['calculate', 'reset', 'example', 'constant', 'result', 'copy'],
    'modular-inverse-calculator': ['calculate', 'reset', 'example', 'result', 'copy'],
    'openapi-editor': ['validate', 'example', 'format', 'download', 'copyReport'],
    'font-pairing-tool': ['applyPreset', 'swap', 'copyCss', 'clearFonts', 'reset'],
    'roth-vs-traditional-calculator': ['compare', 'example', 'reset', 'result'],
    'polygon-calculator': ['calculate', 'example', 'reset', 'copy', 'result'],
    'compression-ratio-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
    'goal-planner': ['generate', 'reset', 'example', 'result', 'copy', 'download', 'updateProgress'],
    'mind-map-maker': ['generate', 'reset', 'example', 'result', 'addChild', 'removeNode', 'moveUp', 'moveDown', 'moveNode', 'collapse', 'expand', 'undo', 'redo', 'exportSvg', 'exportJson', 'importJson'],
  'mood-tracker': ['saveEntry', 'updateEntry', 'example', 'reset', 'removeEntry', 'clearHistory', 'previousMonth', 'nextMonth', 'export', 'import', 'result'],
    'journal-online': ['saveEntry', 'updateEntry', 'newEntry', 'example', 'reset', 'search', 'clearSearch', 'deleteEntry', 'clearAll', 'exportJson', 'importJson', 'saveBackup', 'result'],
    'travel-itinerary-planner': ['createTrip', 'saveItem', 'updateItem', 'newItem', 'deleteItem', 'deleteTrip', 'example', 'reset', 'exportIcs', 'exportJson', 'importJson', 'print', 'result'],
    'polynomial-long-division-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
    'half-life-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
    'mortgage-points-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
    'trapezoid-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
    'prayer-times-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
    'auto-loan-refinance-calculator': ['calculate', 'reset', 'copy', 'result'],
    'secret-santa-generator': ['generate', 'reset', 'copy', 'download', 'result', 'reveal', 'next', 'privacyNote'],
    'tire-size-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'kmh', 'mph'],
    'stair-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'centimeters', 'feet', 'inches'],
    'asphalt-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
    mancala: ['newGame', 'rules', 'result', 'computer', 'twoPlayers'],
    'dominoes-game': ['newGame', 'draw', 'pass', 'playLeft', 'playRight', 'computer', 'twoPlayers', 'drawRule', 'blockRule'],
    hitori: ['newGame', 'checkBoard', 'hint', 'clearMarks', 'easy', 'medium', 'hard'],
    nurikabe: ['newGame', 'checkBoard', 'hint', 'clearMarks', 'easy', 'medium', 'hard'],
    slitherlink: ['newGame', 'checkBoard', 'hint', 'undo', 'clearMarks', 'rules', 'small', 'medium', 'large'],
    'peg-solitaire': ['newGame', 'hint', 'undo', 'rules', 'pegsRemaining'],
    futoshiki: ['newGame', 'checkBoard', 'hint', 'undo', 'rules', 'small', 'medium', 'large', 'easy', 'regular', 'hard'],
    'hashi-puzzle': ['newGame', 'checkBoard', 'hint', 'undo', 'clearBoard', 'rules', 'easy', 'regular', 'hard'],
    'chess-opening-trainer': ['newGame', 'hint', 'rules'],
    'color-name-finder': ['findName', 'copyName', 'copyHex', 'result'],
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
    'battery-runtime-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'wh', 'kwh'],
    'lumber-cut-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'millimeters', 'centimeters', 'meters', 'inches', 'feet'],
    'plant-spacing-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'millimeters', 'centimeters', 'meters', 'inches', 'feet', 'grid', 'triangular', 'squareUnits'],
    'ev-charging-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'kwh', 'kw', 'percent'],
    'rainwater-harvesting-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'squareMeters', 'squareFeet', 'millimeters', 'inches', 'liters', 'usGallons'],
    'ramp-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'millimeters', 'centimeters', 'meters', 'inches', 'feet'],
    'heat-loss-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'squareMeters', 'squareFeet', 'cubicMeters', 'cubicFeet', 'kelvin', 'fahrenheit'],
    'heat-pump-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'kilowatts', 'btuPerHour'],
    'miter-angle-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'simpleMode', 'compoundMode'],
    'voltage-drop-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'feet'],
  }[toolId];
  const missing = actionNames.filter((key) => !(actions[key] ?? fields[key])?.trim());
  if (missing.length) throw new Error(`Missing localized form actions for ${toolId}: ${missing.join(', ')}.`);
  const labels = Object.fromEntries([...new Set([...actionNames, 'calculate', 'generate', 'reset', 'example', 'newGame', 'rules', 'reveal', 'next', 'copy', 'download', 'result', 'progress', 'perPerson', 'metric', 'imperial', 'rectangle', 'circle', 'triangle', 'meters', 'centimeters', 'millimeters', 'squareMeters', 'squareCentimeters', 'squareFeet', 'squareInches', 'cubicMeters', 'cubicCentimeters', 'liters', 'cubicFeet', 'cubicInches', 'inches', 'kgPerCubicMeter', 'lbPerCubicFoot', 'kilograms', 'pounds', 'twoPlayers', 'computer', 'human', 'currentPlayer', 'opponent', 'privacyNote', 'kmh', 'mph', 'notes'])].map((key) => [key, actions[key] ?? fields[key] ?? '']));
  const submit = (name) => button(name, labels[name]);
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

  if (toolId === 'openapi-editor') return attachCopy(`<form id="tool-form" class="openapi-editor" novalidate>
    ${label('openapi-format', fields.format, `<select id="openapi-format" name="format"><option value="auto">${escapeGrowthHtml(fields.autoFormat)}</option><option value="json">${escapeGrowthHtml(fields.jsonFormat)}</option><option value="yaml">${escapeGrowthHtml(fields.yamlFormat)}</option></select>`)}
    ${label('openapi-document', fields.document, '<textarea id="openapi-document" name="document" rows="20" maxlength="300000" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-describedby="openapi-accuracy" required></textarea>')}
    <p id="openapi-accuracy" class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <p class="hint"><label for="openapi-file">${escapeGrowthHtml(fields.upload)}</label> <input id="openapi-file" type="file" accept=".json,.yaml,.yml,application/json,text/yaml,application/yaml" data-openapi-file></p>
    <p class="hint"><a href="/assets/licenses/js-yaml-LICENSE.txt" target="_blank" rel="noopener noreferrer">${escapeGrowthHtml(fields.yamlLicense)}</a></p>
    <div class="actions"><button type="button" data-action="example" class="button button--secondary">${escapeGrowthHtml(actions.example)}</button><button type="button" data-action="format" class="button button--secondary">${escapeGrowthHtml(actions.format)}</button><button type="submit" data-action="validate" class="button button--primary">${escapeGrowthHtml(actions.validate)}</button><button type="button" data-action="download" class="button button--secondary">${escapeGrowthHtml(actions.download)}</button><button type="button" data-action="copy-report" class="button button--secondary">${escapeGrowthHtml(actions.copyReport)}</button></div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-openapi-result hidden aria-live="polite"><h2>${escapeGrowthHtml(fields.previewTitle)}</h2><p data-openapi-summary></p><ol data-openapi-operations></ol><h3>${escapeGrowthHtml(fields.issues)}</h3><ul data-openapi-issues></ul></section>
  </form>`, copy);

  if (toolId === 'font-pairing-tool') {
    const familyOptions = [
      ['Georgia, "Times New Roman", serif', fields.familyGeorgia],
      ['"Times New Roman", Times, serif', fields.familyTimes],
      ['Arial, Helvetica, sans-serif', fields.familyArial],
      ['Verdana, Geneva, sans-serif', fields.familyVerdana],
      ['Trebuchet MS, Arial, sans-serif', fields.familyTrebuchet],
      ['"Courier New", Courier, monospace', fields.familyMono],
      ['system-ui, sans-serif', fields.familySystem],
    ].map(([value, text]) => `<option value="${escapeGrowthHtml(value)}">${escapeGrowthHtml(text)}</option>`).join('');
    const presetOptions = FONT_PRESETS.map(({ id }, index) => `<option value="${id}">${escapeGrowthHtml(fields[`preset${['Editorial', 'Modern', 'Classic', 'Technical', 'Friendly', 'System'][index]}`])}</option>`).join('');
    return attachCopy(`<form id="tool-form" class="font-pairing-tool" novalidate>
    ${label('font-preset', fields.preset, `<select id="font-preset" name="preset">${presetOptions}</select>`)}
    <div class="font-pairing-families">
      ${label('font-heading-family', fields.headingFont, `<select id="font-heading-family" name="headingFont">${familyOptions}</select>`)}
      ${label('font-body-family', fields.bodyFont, `<select id="font-body-family" name="bodyFont">${familyOptions}</select>`)}
    </div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="font-pairing-controls">
      ${label('font-heading-size', fields.headingSize, '<input id="font-heading-size" name="headingSize" type="range" min="20" max="96" step="1" value="48">')}
      ${label('font-body-size', fields.bodySize, '<input id="font-body-size" name="bodySize" type="range" min="12" max="32" step="1" value="18">')}
      ${label('font-heading-weight', fields.headingWeight, '<input id="font-heading-weight" name="headingWeight" type="range" min="100" max="900" step="100" value="700">')}
      ${label('font-body-weight', fields.bodyWeight, '<input id="font-body-weight" name="bodyWeight" type="range" min="100" max="900" step="100" value="400">')}
      ${label('font-line-height', fields.lineHeight, '<input id="font-line-height" name="lineHeight" type="range" min="1" max="2.2" step="0.05" value="1.6">')}
    </div>
    <section class="font-pairing-preview" aria-labelledby="font-preview-label"><h2 id="font-preview-label">${escapeGrowthHtml(fields.hierarchyLabel)}</h2><h3 data-font-heading>${escapeGrowthHtml(fields.sampleHeading)}</h3><p data-font-body>${escapeGrowthHtml(fields.sampleBody)}</p></section>
    <div class="font-pairing-upload"><label for="font-pair-files">${escapeGrowthHtml(fields.fontFiles)}</label><input id="font-pair-files" type="file" accept=".woff,.woff2,.ttf,.otf,font/woff,font/woff2,font/ttf,font/otf" multiple data-font-files></div>
    <div class="actions"><button type="button" data-action="apply-preset" class="button button--secondary">${escapeGrowthHtml(actions.applyPreset)}</button><button type="button" data-action="swap" class="button button--secondary">${escapeGrowthHtml(actions.swap)}</button><button type="button" data-action="copy-css" class="button button--primary">${escapeGrowthHtml(actions.copyCss)}</button><button type="button" data-action="clear-fonts" class="button button--secondary">${escapeGrowthHtml(actions.clearFonts)}</button>${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
  </form>`, copy);
  }

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

  if (toolId === 'photo-to-sketch') return attachCopy(`<form id="tool-form" novalidate>
    ${label('photo-sketch-file', fields.imageFile, '<input id="photo-sketch-file" name="imageFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/bmp" required>')}
    <div class="sketch-controls">
      ${label('photo-sketch-intensity', fields.intensity, '<input id="photo-sketch-intensity" name="intensity" type="range" min="0.25" max="1.5" step="0.05" value="1">')}
      ${label('photo-sketch-detail', fields.detail, '<input id="photo-sketch-detail" name="detail" type="range" min="0" max="100" step="1" value="8">')}
    </div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div data-sketch-workbench hidden>
      <p class="hint">${escapeGrowthHtml(fields.previewHint)}</p>
      <label class="sharpener-compare"><input type="checkbox" name="compare"> ${escapeGrowthHtml(labels.original)}</label>
      <canvas data-sketch-preview tabindex="0" role="img" aria-label="${escapeGrowthHtml(fields.previewHint)}"></canvas>
    </div>
    <div class="actions"><button type="button" data-action="export" class="button button--primary" disabled>${escapeGrowthHtml(labels.export)}</button><button type="button" data-action="cancel" class="button button--secondary" hidden>${escapeGrowthHtml(labels.cancel)}</button>${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><a class="button button--primary" data-export hidden></a>
  </form>`, copy);

  if (toolId === 'schema-markup-validator') return attachCopy(`<form id="tool-form" class="schema-markup-validator" novalidate>
    ${label('schema-markup-input', fields.markup, '<textarea id="schema-markup-input" name="markup" rows="14" maxlength="300000" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" required></textarea>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <p class="hint">Schema.org vocabulary version 30.1, licensed under <a href="https://schema.org/docs/terms.html" rel="noopener noreferrer">CC BY-SA 3.0</a>.</p>
    <div class="actions"><button type="button" data-action="example" class="button button--secondary">${escapeGrowthHtml(actions.example)}</button><button type="submit" data-action="validate" class="button button--primary">${escapeGrowthHtml(actions.validate)}</button><button type="reset" data-action="reset" class="button button--secondary">${escapeGrowthHtml(actions.reset)}</button></div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-validation-result hidden aria-live="polite"><h2>${escapeGrowthHtml(fields.resultSummary)}</h2><p data-validation-summary></p><p class="hint">${escapeGrowthHtml(fields.googleNote)}</p><h3>${escapeGrowthHtml(fields.issues)}</h3><ul data-validation-issues></ul><button type="button" class="button button--secondary" data-action="copy-summary">${escapeGrowthHtml(actions.copySummary)}</button></section>
  </form>`, copy);

  if (toolId === 'readability-checker') return attachCopy(`<form id="tool-form" class="readability-checker" novalidate>
    ${label('readability-language', fields.language, `<select id="readability-language" name="language"><option value="en">${escapeGrowthHtml(fields.languageEn)}</option><option value="es">${escapeGrowthHtml(fields.languageEs)}</option><option value="fr">${escapeGrowthHtml(fields.languageFr)}</option><option value="de">${escapeGrowthHtml(fields.languageDe)}</option><option value="it">${escapeGrowthHtml(fields.languageIt)}</option></select>`)}
    ${label('readability-text', fields.text, '<textarea id="readability-text" name="text" rows="12" maxlength="100000" spellcheck="true" required></textarea>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('calculate', labels.calculate)}${button('example', labels.example, 'secondary')}${button('copy', labels.copy, 'secondary')}${reset}</div>
    <section class="result" data-readability-result hidden aria-labelledby="readability-result-title">
      <h2 id="readability-result-title">${escapeGrowthHtml(fields.resultSummary)}</h2>
      <p data-readability-score></p>
      <dl class="readability-metrics">
        <div><dt>${escapeGrowthHtml(fields.wordCount)}</dt><dd data-readability-words></dd></div>
        <div><dt>${escapeGrowthHtml(fields.sentenceCount)}</dt><dd data-readability-sentences></dd></div>
        <div><dt>${escapeGrowthHtml(fields.characterCount)}</dt><dd data-readability-characters></dd></div>
        <div><dt>${escapeGrowthHtml(fields.characterCountNoSpaces)}</dt><dd data-readability-characters-no-spaces></dd></div>
        <div><dt>${escapeGrowthHtml(fields.letterCount)}</dt><dd data-readability-letters></dd></div>
        <div><dt>${escapeGrowthHtml(fields.syllableEstimate)}</dt><dd data-readability-syllables></dd></div>
        <div><dt>${escapeGrowthHtml(fields.averageSentenceLength)}</dt><dd data-readability-average-sentence></dd></div>
        <div><dt>${escapeGrowthHtml(fields.averageWordLength)}</dt><dd data-readability-average-word></dd></div>
        <div><dt>${escapeGrowthHtml(fields.averageSyllablesPerWord)}</dt><dd data-readability-average-syllables></dd></div>
        <div><dt>${escapeGrowthHtml(fields.longWordCount)}</dt><dd data-readability-long-words></dd></div>
      </dl>
      <p class="hint" data-readability-formula></p>
    </section>
    <p class="status" role="status" aria-live="polite" data-status></p>
  </form>`, copy);

  if (toolId === 'savings-goal-calculator') return attachCopy(`<form id="tool-form" class="savings-goal-calculator" novalidate>
    ${label('savings-mode', fields.mode, `<select id="savings-mode" name="mode"><option value="required-contribution">${escapeGrowthHtml(labels.requiredContribution)}</option><option value="months-to-goal">${escapeGrowthHtml(labels.monthsToGoal)}</option></select>`)}
    ${label('savings-starting-balance', fields.startingBalance, '<input id="savings-starting-balance" name="startingBalance" type="number" min="0" max="1000000000000" step="any" inputmode="decimal" value="0" required>')}
    ${label('savings-target', fields.targetAmount, '<input id="savings-target" name="targetAmount" type="number" min="0.01" max="1000000000000" step="any" inputmode="decimal" value="1200" required>')}
    ${label('savings-apr', fields.annualRatePercent, '<input id="savings-apr" name="annualRatePercent" type="number" min="0" max="100" step="any" inputmode="decimal" value="0" required>')}
    ${label('savings-months', fields.months, '<input id="savings-months" name="months" type="number" min="1" max="1200" step="1" inputmode="numeric" value="12" required>')}
    ${label('savings-contribution', fields.monthlyContribution, '<input id="savings-contribution" name="monthlyContribution" type="number" min="0" max="1000000000000" step="any" inputmode="decimal" value="100" required disabled>')}
    ${label('savings-timing', fields.contributionTiming, `<select id="savings-timing" name="contributionTiming"><option value="end">${escapeGrowthHtml(labels.end)}</option><option value="beginning">${escapeGrowthHtml(labels.beginning)}</option></select>`)}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p><p class="hint">${escapeGrowthHtml(fields.currencyNote)}</p>
    <div class="actions">${button('calculate', labels.calculate)}${button('example', labels.example, 'secondary')}${button('copy', labels.copy, 'secondary')}${reset}</div>
    <section class="result" data-savings-result hidden aria-labelledby="savings-result-title"><h2 id="savings-result-title">${escapeGrowthHtml(fields.resultSummary)}</h2><p data-savings-primary></p><dl><div><dt>${escapeGrowthHtml(fields.projectedBalance)}</dt><dd data-savings-projected></dd></div><div><dt>${escapeGrowthHtml(fields.totalContributions)}</dt><dd data-savings-contributions></dd></div><div><dt>${escapeGrowthHtml(fields.estimatedInterest)}</dt><dd data-savings-interest></dd></div></dl></section>
    <p class="status" role="status" aria-live="polite" data-status></p>
  </form>`, copy);

  if (toolId === 'severance-pay-calculator') return attachCopy(`<form id="tool-form" class="severance-pay-calculator" novalidate>
    ${label('severance-mode', fields.mode, `<select id="severance-mode" name="mode"><option value="custom">${escapeGrowthHtml(labels.customMode)}</option><option value="uk-statutory">${escapeGrowthHtml(labels.ukMode)}</option></select>`)}
    ${label('severance-weekly-pay', fields.weeklyPay, '<input id="severance-weekly-pay" name="weeklyPay" type="number" min="0" max="1000000000" step="any" inputmode="decimal" value="500" required>')}
    ${label('severance-years', fields.yearsOfService, '<input id="severance-years" name="yearsOfService" type="number" min="0" max="80" step="any" inputmode="decimal" value="10" required>')}
    ${label('severance-weeks-per-year', fields.weeksPerYear, '<input id="severance-weeks-per-year" name="weeksPerYear" type="number" min="0" max="52" step="any" inputmode="decimal" value="2" required>')}
    ${label('severance-birth-date', fields.birthDate, '<input id="severance-birth-date" name="birthDate" type="date" disabled required>')}
    ${label('severance-start-date', fields.employmentStartDate, '<input id="severance-start-date" name="employmentStartDate" type="date" disabled required>')}
    ${label('severance-date', fields.redundancyDate, '<input id="severance-date" name="redundancyDate" type="date" min="2026-04-06" disabled required>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <p class="hint" data-severance-custom-note>${escapeGrowthHtml(fields.customNote)}</p>
    <p class="hint" data-severance-uk-note hidden>${escapeGrowthHtml(fields.ukNote)} <a href="https://www.gov.uk/redundancy-your-rights/redundancy-pay" rel="noopener noreferrer">${escapeGrowthHtml(fields.officialSource)}</a>.</p>
    <div class="actions">${button('calculate', labels.calculate)}${button('example', labels.example, 'secondary')}${button('copy', labels.copy, 'secondary')}${reset}</div>
    <section class="result" data-severance-result hidden aria-labelledby="severance-result-title"><h2 id="severance-result-title">${escapeGrowthHtml(fields.resultSummary)}</h2><dl><div><dt>${escapeGrowthHtml(fields.estimate)}</dt><dd data-severance-amount></dd></div><div><dt>${escapeGrowthHtml(fields.appliedWeeklyPay)}</dt><dd data-severance-weekly-pay></dd></div><div><dt>${escapeGrowthHtml(fields.yearsOfService)}</dt><dd data-severance-years></dd></div><div><dt>${escapeGrowthHtml(fields.totalWeeks)}</dt><dd data-severance-weeks></dd></div></dl><p class="hint" data-severance-details></p></section>
    <p class="status" role="status" aria-live="polite" data-status></p>
  </form>`, copy);

  if (toolId === 'divisibility-calculator') return attachCopy(`<form id="tool-form" class="divisibility-calculator" novalidate>
    ${label('divisibility-integer', fields.integer, '<input id="divisibility-integer" name="integer" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" maxlength="151" pattern="-?[0-9]{1,150}" value="123" required>')}
    ${label('divisibility-divisors', fields.divisors, '<input id="divisibility-divisors" name="divisors" type="text" autocomplete="off" spellcheck="false" maxlength="512" value="2, 3, 5, 7, 11" required>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('calculate', labels.calculate)}${button('example', labels.example, 'secondary')}${button('common-divisors', labels.commonDivisors, 'secondary')}${button('copy', labels.copy, 'secondary')}${reset}</div>
    <section class="result" data-divisibility-result hidden aria-labelledby="divisibility-result-title"><h2 id="divisibility-result-title">${escapeGrowthHtml(fields.resultSummary)}</h2><pre data-divisibility-summary></pre></section>
    <p class="status" role="status" aria-live="polite" data-status></p>
  </form>`, copy);

  if (toolId === 'number-line-graphing-tool') return attachCopy(`<form id="tool-form" class="number-line-graphing-tool" novalidate>
    ${label('number-line-intervals', fields.intervals, `<textarea id="number-line-intervals" name="intervals" rows="5" maxlength="3000" required>${escapeGrowthHtml(fields.exampleInput)}</textarea>`)}
    <p class="hint">${escapeGrowthHtml(fields.intervalFormat)}</p><p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('calculate', labels.calculate)}${button('example', labels.example, 'secondary')}<button type="button" data-action="download-svg" class="button button--secondary" disabled>${escapeGrowthHtml(labels.downloadSvg)}</button>${reset}</div>
    <section class="result" data-number-line-result hidden aria-labelledby="number-line-result-title"><h2 id="number-line-result-title">${escapeGrowthHtml(fields.chartDescription)}</h2><div data-number-line-chart></div></section>
    <p class="status" role="status" aria-live="polite" data-status></p>
  </form>`, copy);

  if (toolId === 'laplace-transform-calculator') return attachCopy(`<form id="tool-form" class="laplace-transform-calculator" novalidate>
    ${label('laplace-direction', fields.direction, `<select id="laplace-direction" name="direction"><option value="forward">${escapeGrowthHtml(fields.forwardMode)}</option><option value="inverse">${escapeGrowthHtml(fields.inverseMode)}</option></select>`)}
    ${label('laplace-expression', fields.expression, `<textarea id="laplace-expression" name="expression" rows="5" maxlength="500" spellcheck="false" autocapitalize="off" autocomplete="off" required>${escapeGrowthHtml(fields.forwardExample)}</textarea>`)}
    <p class="hint" data-laplace-forward-hint>${escapeGrowthHtml(fields.forwardHint)}</p>
    <p class="hint" data-laplace-inverse-hint hidden>${escapeGrowthHtml(fields.inverseHint)}</p>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('calculate', actions.calculate)}${button('example', actions.example, 'secondary')}${reset}</div>
    <section class="result" data-laplace-result hidden aria-labelledby="laplace-result-title"><h2 id="laplace-result-title">${escapeGrowthHtml(fields.resultSummary)}</h2><div data-laplace-output></div><p class="hint" data-laplace-region></p></section>
    <p class="status" role="status" aria-live="polite" data-status></p>
  </form>`, copy);

  if (toolId === 'vector-calculator') {
    const component = (axis, field, value, isZ = false) => {
      const id = `vector-${axis}-${field}`;
      const wrapper = isZ ? ` data-vector-z hidden` : '';
      const disabled = isZ ? ' disabled' : '';
      return `<div class="field"${wrapper}><label for="${id}">${escapeGrowthHtml(fields[field])}</label><input id="${id}" name="${field}" type="number" inputmode="decimal" step="any" min="-1000000000" max="1000000000" value="${value}" required${disabled}></div>`;
    };
    const operationOptions = ['add', 'subtract', 'dot', 'cross', 'magnitudeA', 'magnitudeB', 'normalizeA', 'normalizeB', 'angle', 'projection']
      .map((key) => `<option value="${key}"${key === 'dot' ? ' selected' : ''}>${escapeGrowthHtml(actions[key])}</option>`).join('');
    return attachCopy(`<form id="tool-form" class="vector-calculator" novalidate>
    ${label('vector-dimension', fields.dimension, `<select id="vector-dimension" name="dimension"><option value="2">${escapeGrowthHtml(fields.dimension2d)}</option><option value="3">${escapeGrowthHtml(fields.dimension3d)}</option></select>`)}
    ${label('vector-operation', fields.operation, `<select id="vector-operation" name="operation">${operationOptions}</select>`)}
    <fieldset><legend>${escapeGrowthHtml(fields.vectorA)}</legend><div class="fields">${component('a', 'ax', '1')}${component('a', 'ay', '2')}${component('a', 'az', '3', true)}</div></fieldset>
    <fieldset><legend>${escapeGrowthHtml(fields.vectorB)}</legend><div class="fields">${component('b', 'bx', '3')}${component('b', 'by', '4')}${component('b', 'bz', '5', true)}</div></fieldset>
    <p class="hint">${escapeGrowthHtml(fields.exampleHint)}</p><p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('calculate', actions.calculate)}${button('example', actions.example, 'secondary')}${reset}</div>
    <section class="result" data-vector-result hidden aria-labelledby="vector-result-title"><h2 id="vector-result-title">${escapeGrowthHtml(fields.resultSummary)}</h2><div data-vector-output></div></section>
    <p class="status" role="status" aria-live="polite" data-status></p>
  </form>`, copy);
  }

  if (toolId === 'cubic-quartic-equation-calculator') {
    const coefficient = (name, labelText, value, quarticOnly = false) => `<div class="field"${quarticOnly ? ' data-quartic-only hidden' : ''}><label for="equation-${name}">${escapeGrowthHtml(labelText)}</label><input id="equation-${name}" name="${name}" type="number" inputmode="decimal" step="any" min="-1000000" max="1000000" value="${value}" required${quarticOnly ? ' disabled' : ''}></div>`;
    return attachCopy(`<form id="tool-form" class="equation-calculator" novalidate>
    ${label('equation-degree', fields.degree, `<select id="equation-degree" name="degree"><option value="3" selected>${escapeGrowthHtml(fields.degree3)}</option><option value="4">${escapeGrowthHtml(fields.degree4)}</option></select>`)}
    <div class="fields">${coefficient('a4', fields.a4, '1', true)}${coefficient('a3', fields.a3, '1')}${coefficient('a2', fields.a2, '0')}${coefficient('a1', fields.a1, '0')}${coefficient('a0', fields.a0, '-1')}</div>
    <p class="hint">${escapeGrowthHtml(fields.exampleHint)}</p><p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('calculate', actions.calculate)}${button('example', actions.example, 'secondary')}${reset}</div>
    <section class="result" data-equation-result hidden aria-labelledby="equation-result-title"><h2 id="equation-result-title">${escapeGrowthHtml(fields.resultSummary)}</h2><div data-equation-output></div></section>
    <p class="status" role="status" aria-live="polite" data-status></p>
  </form>`, copy);
  }

  if (toolId === 'complex-number-calculator') {
    const numeric = (name, labelText, value = '0') => `<div class="field"><label for="complex-${name}">${escapeGrowthHtml(labelText)}</label><input id="complex-${name}" name="${name}" type="number" inputmode="decimal" step="any" min="-1000000000" max="1000000000" value="${value}" required></div>`;
    const operations = ['add', 'subtract', 'multiply', 'divide', 'magnitude', 'argument', 'rectangularToPolar', 'polarToRectangular', 'roots']
      .map((key) => `<option value="${key}"${key === 'multiply' ? ' selected' : ''}>${escapeGrowthHtml(actions[key])}</option>`).join('');
    return attachCopy(`<form id="tool-form" class="complex-number-calculator" novalidate>
    ${label('complex-operation', fields.operation, `<select id="complex-operation" name="operation">${operations}</select>`)}
    <div data-complex-rect>${numeric('realA', fields.realA, '0')}${numeric('imaginaryA', fields.imaginaryA, '1')}</div>
    <div data-complex-b hidden>${numeric('realB', fields.realB, '0')}${numeric('imaginaryB', fields.imaginaryB, '1')}</div>
    <div data-complex-polar hidden>${numeric('radius', fields.radius, '1')}<div class="field"><label for="complex-angle">${escapeGrowthHtml(fields.angle)}</label><input id="complex-angle" name="angle" type="number" inputmode="decimal" step="any" min="-1000000" max="1000000" value="90" required></div><div class="field"><label for="complex-angle-unit">${escapeGrowthHtml(fields.angleUnit)}</label><select id="complex-angle-unit" name="angleUnit"><option value="degrees">${escapeGrowthHtml(fields.degrees)}</option><option value="radians">${escapeGrowthHtml(fields.radians)}</option></select></div></div>
    <div data-complex-degree hidden>${label('complex-degree', fields.degree, '<input id="complex-degree" name="degree" type="number" inputmode="numeric" min="2" max="12" step="1" value="2" required>')}</div>
    <p class="hint">${escapeGrowthHtml(fields.exampleHint)}</p><p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('calculate', actions.calculate)}${button('example', actions.example, 'secondary')}${reset}</div>
    <section class="result" data-complex-result hidden aria-labelledby="complex-result-title"><h2 id="complex-result-title">${escapeGrowthHtml(fields.resultSummary)}</h2><div data-complex-output></div></section>
    <p class="status" role="status" aria-live="polite" data-status></p>
  </form>`, copy);
  }

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

  if (toolId === 'hitori') return attachCopy(`<section class="game hitori-game" aria-label="${escapeGrowthHtml(copy.name)}">
    <div class="game-toolbar"><div class="field"><label for="hitori-size">${escapeGrowthHtml(fields.size)}</label><select id="hitori-size" data-size><option value="5">5 × 5</option><option value="6">6 × 6</option><option value="7">7 × 7</option><option value="8">8 × 8</option></select></div>
      <div class="field"><label for="hitori-difficulty">${escapeGrowthHtml(fields.difficulty)}</label><select id="hitori-difficulty" data-difficulty><option value="easy">${escapeGrowthHtml(labels.easy)}</option><option value="medium">${escapeGrowthHtml(labels.medium)}</option><option value="hard">${escapeGrowthHtml(labels.hard)}</option></select></div>
      <button type="button" data-action="new-game" class="button button--primary">${escapeGrowthHtml(labels.newGame)}</button></div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section aria-labelledby="hitori-board-heading"><h2 id="hitori-board-heading">${escapeGrowthHtml(fields.board)}</h2><div class="hitori-grid" data-board role="grid" aria-label="${escapeGrowthHtml(fields.board)}"></div></section>
    <div class="actions"><button type="button" data-action="check-board" class="button button--primary">${escapeGrowthHtml(labels.checkBoard)}</button><button type="button" data-action="hint" class="button button--secondary">${escapeGrowthHtml(labels.hint)}</button><button type="button" data-action="clear-marks" class="button button--secondary">${escapeGrowthHtml(labels.clearMarks)}</button></div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p><details class="rules"><summary>${escapeGrowthHtml(labels.rules)}</summary><p>${escapeGrowthHtml(fields.rules ?? '')}</p></details></section>`, copy);

  if (toolId === 'nurikabe') return attachCopy(`<section class="game nurikabe-game" aria-label="${escapeGrowthHtml(copy.name)}">
    <div class="game-toolbar"><div class="field"><label for="nurikabe-difficulty">${escapeGrowthHtml(fields.difficulty)}</label><select id="nurikabe-difficulty" data-difficulty><option value="easy">${escapeGrowthHtml(labels.easy)}</option><option value="medium">${escapeGrowthHtml(labels.medium)}</option><option value="hard">${escapeGrowthHtml(labels.hard)}</option></select></div>
      <button type="button" data-action="new-game" class="button button--primary">${escapeGrowthHtml(labels.newGame)}</button></div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section aria-labelledby="nurikabe-board-heading"><h2 id="nurikabe-board-heading">${escapeGrowthHtml(fields.board)}</h2><div class="nurikabe-grid" data-board role="grid" aria-label="${escapeGrowthHtml(fields.board)}"></div></section>
    <div class="actions"><button type="button" data-action="check-board" class="button button--primary">${escapeGrowthHtml(labels.checkBoard)}</button><button type="button" data-action="hint" class="button button--secondary">${escapeGrowthHtml(labels.hint)}</button><button type="button" data-action="clear-marks" class="button button--secondary">${escapeGrowthHtml(labels.clearMarks)}</button></div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p><details class="rules"><summary>${escapeGrowthHtml(labels.rules)}</summary><p>${escapeGrowthHtml(fields.rules ?? '')}</p></details></section>`, copy);

  if (toolId === 'slitherlink') return attachCopy(`<section class="game slitherlink-game" aria-label="${escapeGrowthHtml(copy.name)}">
    <div class="game-toolbar"><div class="field"><label for="slitherlink-size">${escapeGrowthHtml(fields.size)}</label><select id="slitherlink-size" data-size><option value="4">4 × 4</option><option value="5" selected>5 × 5</option><option value="6">6 × 6</option></select></div>
      <button type="button" data-action="new-game" class="button button--primary">${escapeGrowthHtml(labels.newGame)}</button></div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section aria-labelledby="slitherlink-board-heading"><h2 id="slitherlink-board-heading">${escapeGrowthHtml(fields.board)}</h2><div class="slitherlink-board" data-board role="group" aria-label="${escapeGrowthHtml(fields.board)}"></div></section>
    <div class="actions"><button type="button" data-action="check-board" class="button button--primary">${escapeGrowthHtml(labels.checkBoard)}</button><button type="button" data-action="hint" class="button button--secondary">${escapeGrowthHtml(labels.hint)}</button><button type="button" data-action="undo" class="button button--secondary">${escapeGrowthHtml(labels.undo)}</button><button type="button" data-action="clear-marks" class="button button--secondary">${escapeGrowthHtml(labels.clearMarks)}</button></div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p><details class="rules"><summary>${escapeGrowthHtml(labels.rules)}</summary><p>${escapeGrowthHtml(fields.rules ?? '')}</p></details></section>`, copy);

  if (toolId === 'peg-solitaire') return attachCopy(`<section class="game peg-solitaire-game" aria-label="${escapeGrowthHtml(copy.name)}">
    <div class="game-toolbar"><button type="button" data-action="new-game" class="button button--primary">${escapeGrowthHtml(labels.newGame)}</button><p class="peg-count" aria-live="polite"><span>${escapeGrowthHtml(labels.pegsRemaining)}: </span><strong data-peg-count>32</strong></p></div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section aria-labelledby="peg-solitaire-board-heading"><h2 id="peg-solitaire-board-heading">${escapeGrowthHtml(fields.board)}</h2><div class="peg-solitaire-board" data-board role="group" aria-label="${escapeGrowthHtml(fields.board)}"></div></section>
    <div class="actions"><button type="button" data-action="hint" class="button button--secondary">${escapeGrowthHtml(labels.hint)}</button><button type="button" data-action="undo" class="button button--secondary">${escapeGrowthHtml(labels.undo)}</button></div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p><details class="rules"><summary>${escapeGrowthHtml(labels.rules)}</summary><p>${escapeGrowthHtml(fields.rules ?? '')}</p></details></section>`, copy);

  if (toolId === 'futoshiki') return attachCopy(`<section class="game futoshiki-game" aria-label="${escapeGrowthHtml(copy.name)}">
    <div class="game-toolbar"><div class="field"><label for="futoshiki-size">${escapeGrowthHtml(fields.size)}</label><select id="futoshiki-size" data-size><option value="4">${escapeGrowthHtml(labels.small)}</option><option value="5" selected>${escapeGrowthHtml(labels.medium)}</option><option value="6">${escapeGrowthHtml(labels.large)}</option></select></div><div class="field"><label for="futoshiki-difficulty">${escapeGrowthHtml(fields.difficulty)}</label><select id="futoshiki-difficulty" data-difficulty><option value="easy">${escapeGrowthHtml(labels.easy)}</option><option value="medium" selected>${escapeGrowthHtml(labels.regular)}</option><option value="hard">${escapeGrowthHtml(labels.hard)}</option></select></div><button type="button" data-action="new-game" class="button button--primary">${escapeGrowthHtml(labels.newGame)}</button></div>
    <p class="status" role="status" aria-live="polite" data-status></p><section aria-labelledby="futoshiki-board-heading"><h2 id="futoshiki-board-heading">${escapeGrowthHtml(fields.board)}</h2><div class="futoshiki-board" data-board role="group" aria-label="${escapeGrowthHtml(fields.board)}"></div></section>
    <div class="actions"><button type="button" data-action="notes" class="button button--secondary" aria-pressed="false">${escapeGrowthHtml(labels.notes)}</button><button type="button" data-action="check-board" class="button button--primary">${escapeGrowthHtml(labels.checkBoard)}</button><button type="button" data-action="hint" class="button button--secondary">${escapeGrowthHtml(labels.hint)}</button><button type="button" data-action="undo" class="button button--secondary">${escapeGrowthHtml(labels.undo)}</button></div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p><details class="rules"><summary>${escapeGrowthHtml(labels.rules)}</summary><p>${escapeGrowthHtml(fields.rules ?? '')}</p></details></section>`, copy);

  if (toolId === 'hashi-puzzle') return attachCopy(`<section class="game hashi-game" aria-label="${escapeGrowthHtml(copy.name)}">
    <div class="game-toolbar"><div class="field"><label for="hashi-difficulty">${escapeGrowthHtml(fields.difficulty)}</label><select id="hashi-difficulty" data-difficulty><option value="easy">${escapeGrowthHtml(labels.easy)}</option><option value="medium" selected>${escapeGrowthHtml(labels.regular)}</option><option value="hard">${escapeGrowthHtml(labels.hard)}</option></select></div><button type="button" data-action="new-game" class="button button--primary">${escapeGrowthHtml(labels.newGame)}</button></div>
    <p class="status" role="status" aria-live="polite" data-status></p><section aria-labelledby="hashi-board-heading"><h2 id="hashi-board-heading">${escapeGrowthHtml(fields.board)}</h2><div class="hashi-board" data-board role="group" aria-label="${escapeGrowthHtml(fields.board)}"></div></section>
    <div class="actions"><button type="button" data-action="check-board" class="button button--primary">${escapeGrowthHtml(labels.checkBoard)}</button><button type="button" data-action="hint" class="button button--secondary">${escapeGrowthHtml(labels.hint)}</button><button type="button" data-action="undo" class="button button--secondary">${escapeGrowthHtml(labels.undo)}</button><button type="button" data-action="clear-board" class="button button--secondary">${escapeGrowthHtml(labels.clearBoard)}</button></div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p><details class="rules"><summary>${escapeGrowthHtml(labels.rules)}</summary><p>${escapeGrowthHtml(fields.rules ?? '')}</p></details></section>`, copy);

  if (toolId === 'chess-opening-trainer') return attachCopy(`<section class="game chess-opening-game" aria-label="${escapeGrowthHtml(copy.name)}">
    <div class="chess-opening-controls"><div class="field"><label for="opening-line">${escapeGrowthHtml(fields.opening)}</label><select id="opening-line" data-opening>${[['italian','opening_italian'],['sicilian','opening_sicilian'],['ruy-lopez','opening_ruy_lopez'],['french','opening_french'],['caro-kann','opening_caro_kann'],['queens-gambit','opening_queens_gambit'],['london','opening_london'],['scandinavian','opening_scandinavian'],['english','opening_english'],['kings-indian','opening_kings_indian']].map(([id, key]) => `<option value="${id}">${escapeGrowthHtml(fields[key])}</option>`).join('')}</select></div><div class="field"><label for="opening-side">${escapeGrowthHtml(fields.side)}</label><select id="opening-side" data-side><option value="w">${escapeGrowthHtml(fields.white)}</option><option value="b">${escapeGrowthHtml(fields.black)}</option></select></div><button type="button" data-action="new-game" class="button button--primary">${escapeGrowthHtml(labels.newGame)}</button></div>
    <p class="status" role="status" aria-live="polite" data-status></p><p class="hint" data-progress aria-live="polite" aria-label="${escapeGrowthHtml(fields.progressLabel)}"></p><section aria-labelledby="opening-board-heading"><h2 id="opening-board-heading">${escapeGrowthHtml(fields.board)}</h2><div class="chess-opening-board" data-board role="group" aria-label="${escapeGrowthHtml(fields.board)}" dir="ltr"></div></section>
    <div class="actions"><button type="button" data-action="hint" class="button button--secondary">${escapeGrowthHtml(labels.hint)}</button><button type="button" data-action="rules" class="button button--secondary">${escapeGrowthHtml(labels.rules)}</button></div><label class="field" for="opening-moves">${escapeGrowthHtml(fields.moves)}<textarea class="chess-opening-moves" id="opening-moves" data-moves readonly rows="3"></textarea></label>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p><details class="rules" data-rules><summary>${escapeGrowthHtml(labels.rules)}</summary><p>${escapeGrowthHtml(fields.rules ?? '')}</p></details></section>`, copy);

  if (toolId === 'color-name-finder') return attachCopy(`<form id="tool-form" novalidate>
    ${label('color-name-hex', fields.hexColor, '<input id="color-name-hex" name="hexColor" type="text" inputmode="text" autocomplete="off" spellcheck="false" maxlength="7" pattern="#?[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?" placeholder="#6495ED" required>')}
    ${label('color-name-picker', fields.colorPreview, '<input id="color-name-picker" name="colorPicker" type="color" value="#6495ed">')}
    <p class="hint">${escapeGrowthHtml(fields.paletteNote)}</p>
    <div class="actions"><button type="submit" data-action="find-name" class="button button--primary">${escapeGrowthHtml(labels.findName)}</button></div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><p data-exact-match hidden>${escapeGrowthHtml(fields.exactMatchNote)}</p><div data-name-results></div><button type="button" data-action="copy-name" class="button button--secondary">${escapeGrowthHtml(labels.copyName)}</button><button type="button" data-action="copy-hex" class="button button--secondary">${escapeGrowthHtml(labels.copyHex)}</button></section>
  </form>`, copy);

  if (toolId === 'decibel-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('decibel-mode', fields.mode, `<select id="decibel-mode" name="mode"><option value="power-ratio">${escapeGrowthHtml(fields.powerMode)}</option><option value="amplitude-ratio">${escapeGrowthHtml(fields.amplitudeMode)}</option><option value="db-to-power">${escapeGrowthHtml(fields.dbToPowerMode)}</option><option value="db-to-amplitude">${escapeGrowthHtml(fields.dbToAmplitudeMode)}</option><option value="sum-levels">${escapeGrowthHtml(fields.sumMode)}</option><option value="apply-gain">${escapeGrowthHtml(fields.applyMode)}</option></select>`)}
    <div data-decibel-ratio>${label('decibel-ratio', fields.ratio, '<input id="decibel-ratio" name="ratio" type="number" min="1e-300" max="1e300" step="any" inputmode="decimal">')}</div>
    <div data-decibel-input hidden>${label('decibel-input', fields.inputDb, '<input id="decibel-input" name="inputDb" type="number" min="-3000" max="3000" step="any" inputmode="decimal">')}</div>
    <div data-decibel-levels hidden>${label('decibel-levels', fields.levels, '<textarea id="decibel-levels" name="levels" rows="5" maxlength="600" spellcheck="false"></textarea>')}<p class="hint">${escapeGrowthHtml(fields.levelsHint)}</p></div>
    <div data-decibel-gain hidden>${label('decibel-input-level', fields.inputLevel, '<input id="decibel-input-level" name="inputLevel" type="number" min="-3000" max="3000" step="any" inputmode="decimal">')}${label('decibel-gain', fields.gainDb, '<input id="decibel-gain" name="gainDb" type="number" min="-3000" max="3000" step="any" inputmode="decimal">')}</div>
    <p class="hint" data-decibel-ratio-note>${escapeGrowthHtml(fields.accuracyNote)}</p><p class="hint">${escapeGrowthHtml(fields.assumptionsNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'hijri-calendar-converter') return attachCopy(`<form id="tool-form" novalidate>
    ${label('hijri-mode', fields.mode, `<select id="hijri-mode" name="mode"><option value="gregorian-to-hijri">${escapeGrowthHtml(fields.gregorianToHijri)}</option><option value="hijri-to-gregorian">${escapeGrowthHtml(fields.hijriToGregorian)}</option></select>`)}
    <fieldset data-gregorian-fields><legend>${escapeGrowthHtml(fields.gregorianDate)}</legend>${label('gregorian-year', fields.gregorianYear, '<input id="gregorian-year" name="gregorianYear" type="number" min="622" max="9999" step="1" value="2024" inputmode="numeric" required>')}${label('gregorian-month', fields.gregorianMonth, '<input id="gregorian-month" name="gregorianMonth" type="number" min="1" max="12" step="1" value="3" inputmode="numeric" required>')}${label('gregorian-day', fields.gregorianDay, '<input id="gregorian-day" name="gregorianDay" type="number" min="1" max="31" step="1" value="11" inputmode="numeric" required>')}</fieldset>
    <fieldset data-hijri-fields hidden><legend>${escapeGrowthHtml(fields.hijriToGregorian)}</legend>${label('hijri-year', fields.hijriYear, '<input id="hijri-year" name="hijriYear" type="number" min="1" max="10000" step="1" value="1445" inputmode="numeric" required>')}${label('hijri-month', fields.hijriMonth, `<select id="hijri-month" name="hijriMonth" required>${fields.hijriMonths.map((month, index) => `<option value="${index + 1}">${escapeGrowthHtml(month)}</option>`).join('')}</select>`)}${label('hijri-day', fields.hijriDay, '<input id="hijri-day" name="hijriDay" type="number" min="1" max="30" step="1" value="1" inputmode="numeric" required>')}</fieldset>
    <p class="hint">${escapeGrowthHtml(fields.methodNote)}</p>
    <div class="actions">${button('example', actions.example, 'secondary')}${button('convert', actions.convert)}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(actions.result)}</h2><div data-result-content></div></section>
  </form>`, copy);

  if (toolId === 'capacitor-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('capacitor-values', fields.values, '<textarea id="capacitor-values" name="values" rows="5" maxlength="500" spellcheck="false" required></textarea>')}<p class="hint">${escapeGrowthHtml(fields.valuesHint)}</p>
    ${label('capacitor-unit', fields.unit, `<select id="capacitor-unit" name="unit"><option value="F">F</option><option value="mF">mF</option><option value="uF">μF</option><option value="nF">nF</option><option value="pF">pF</option></select>`)}
    ${label('capacitor-connection', fields.connection, `<select id="capacitor-connection" name="connection"><option value="series">${escapeGrowthHtml(fields.series)}</option><option value="parallel">${escapeGrowthHtml(fields.parallel)}</option></select>`)}
    ${label('capacitor-voltage', fields.voltage, '<input id="capacitor-voltage" name="voltage" type="text" inputmode="decimal" maxlength="40">')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p><p class="hint">${escapeGrowthHtml(fields.formulaNote)}</p>
    <div class="actions">${button('example', actions.example, 'secondary')}${button('calculate', actions.calculate)}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(actions.result)}</h2><div data-result-content></div></section>
  </form>`, copy);

  if (toolId === 'body-water-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('body-water-equation', fields.equation, `<select id="body-water-equation" name="equation"><option value="male">${escapeGrowthHtml(fields.watsonMale)}</option><option value="female">${escapeGrowthHtml(fields.watsonFemale)}</option></select>`)}
    ${label('body-water-age', fields.age, '<input id="body-water-age" name="age" type="text" inputmode="numeric" value="30" required>')}
    ${label('body-water-height', fields.height, '<input id="body-water-height" name="height" type="text" inputmode="decimal" value="175" required>')}
    ${label('body-water-height-unit', fields.heightUnit, `<select id="body-water-height-unit" name="heightUnit"><option value="cm">${escapeGrowthHtml(fields.centimeters)}</option><option value="in">${escapeGrowthHtml(fields.inches)}</option></select>`)}
    ${label('body-water-weight', fields.weight, '<input id="body-water-weight" name="weight" type="text" inputmode="decimal" value="70" required>')}
    ${label('body-water-weight-unit', fields.weightUnit, `<select id="body-water-weight-unit" name="weightUnit"><option value="kg">${escapeGrowthHtml(fields.kilograms)}</option><option value="lb">${escapeGrowthHtml(fields.pounds)}</option></select>`)}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <p class="hint">${escapeGrowthHtml(fields.equationNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === '555-timer-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('timer-555-mode', fields.mode, `<select id="timer-555-mode" name="mode"><option value="astable">${escapeGrowthHtml(fields.astable)}</option><option value="monostable">${escapeGrowthHtml(fields.monostable)}</option></select>`)}
    <div data-555-mode="astable">
      ${label('timer-555-r-a', fields.resistanceA, '<input id="timer-555-r-a" name="resistanceA" type="text" inputmode="decimal" value="10" required>')}
      ${label('timer-555-r-b', fields.resistanceB, '<input id="timer-555-r-b" name="resistanceB" type="text" inputmode="decimal" value="10" required>')}
    </div>
    <div data-555-mode="monostable" hidden>
      ${label('timer-555-r', fields.resistance, '<input id="timer-555-r" name="resistance" type="text" inputmode="decimal" value="100" required>')}
    </div>
    ${label('timer-555-resistance-unit', fields.resistanceUnit, `<select id="timer-555-resistance-unit" name="resistanceUnit"><option value="ohm">${escapeGrowthHtml(fields.ohms)}</option><option value="kohm" selected>${escapeGrowthHtml(fields.kilohms)}</option><option value="Mohm">${escapeGrowthHtml(fields.megohms)}</option></select>`)}
    ${label('timer-555-capacitance', fields.capacitance, '<input id="timer-555-capacitance" name="capacitance" type="text" inputmode="decimal" value="10" required>')}
    ${label('timer-555-capacitance-unit', fields.capacitanceUnit, `<select id="timer-555-capacitance-unit" name="capacitanceUnit"><option value="F">${escapeGrowthHtml(fields.farads)}</option><option value="mF">${escapeGrowthHtml(fields.millifarads)}</option><option value="uF" selected>${escapeGrowthHtml(fields.microfarads)}</option><option value="nF">${escapeGrowthHtml(fields.nanofarads)}</option><option value="pF">${escapeGrowthHtml(fields.picofarads)}</option></select>`)}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p><p class="hint">${escapeGrowthHtml(fields.formulaNote)} <a href="https://www.ti.com/lit/ds/symlink/ne555.pdf" rel="noreferrer">${escapeGrowthHtml(fields.sourceLink)}</a></p>
    <div class="actions">${button('example', actions.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(actions.result)}</h2><div data-result-content></div>${button('copy', actions.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'fourier-series-calculator') return attachCopy(`<form id="tool-form" class="fourier-series-calculator" novalidate>
    ${label('fourier-samples', fields.samples, '<textarea id="fourier-samples" name="samples" rows="8" maxlength="4096" spellcheck="false" required>0\n1\n0\n-1</textarea>')}
    <p class="hint">${escapeGrowthHtml(fields.samplesHint)}</p>
    <div class="calculator-grid">
      ${label('fourier-period', fields.period, '<input id="fourier-period" name="period" type="text" inputmode="decimal" value="1" maxlength="40" required>')}
      ${label('fourier-harmonics', fields.harmonics, '<input id="fourier-harmonics" name="harmonics" type="text" inputmode="numeric" value="1" maxlength="4" required>')}
    </div>
    <p class="hint">${escapeGrowthHtml(fields.periodHint)}</p><p class="hint">${escapeGrowthHtml(fields.harmonicsHint)}</p>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <p class="hint"><strong>${escapeGrowthHtml(fields.formulaLabel)}:</strong> <span data-fourier-formula>${escapeGrowthHtml(fields.formula)}</span></p>
    <div class="actions">${button('example', actions.example, 'secondary')}${button('constant', actions.constant, 'secondary')}${button('calculate', actions.calculate)}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(actions.result)}</h2><div data-result-content></div>${button('copy', actions.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'modular-inverse-calculator') return attachCopy(`<form id="tool-form" class="modular-inverse-calculator" novalidate>
    <div class="calculator-grid">
      ${label('modular-inverse-a', fields.a, '<input id="modular-inverse-a" name="a" type="text" inputmode="numeric" value="3" maxlength="16" required>')}
      ${label('modular-inverse-modulus', fields.modulus, '<input id="modular-inverse-modulus" name="modulus" type="text" inputmode="numeric" value="7" maxlength="16" required>')}
    </div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <p class="hint"><strong>${escapeGrowthHtml(fields.formulaLabel)}:</strong> <span>${escapeGrowthHtml(fields.formula)}</span></p>
    <div class="actions">${button('example', actions.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(actions.result)}</h2><div data-result-content></div>${button('copy', actions.copy, 'secondary')}</section>
  </form>`, copy);

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

  if (toolId === 'battery-runtime-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('battery-capacity-mode', fields.capacityMode, `<select id="battery-capacity-mode" name="capacityMode"><option value="energy">${escapeGrowthHtml(fields.energyMode)}</option><option value="ah">${escapeGrowthHtml(fields.ampHourMode)}</option></select>`)}
    <div data-battery-input="energy">${label('battery-energy', fields.capacityEnergy, '<input id="battery-energy" name="capacityEnergy" type="number" min="0.001" max="1000000000" step="any" inputmode="decimal" required>')}${label('battery-energy-unit', fields.energyUnit, `<select id="battery-energy-unit" name="energyUnit"><option value="Wh">${escapeGrowthHtml(labels.wh)}</option><option value="kWh">${escapeGrowthHtml(labels.kwh)}</option></select>`)}</div>
    <div data-battery-input="ah" hidden>${label('battery-capacity-ah', fields.capacityAh, '<input id="battery-capacity-ah" name="capacityAh" type="number" min="0.001" max="1000000000" step="any" inputmode="decimal" required>')}${label('battery-voltage', fields.voltage, '<input id="battery-voltage" name="voltage" type="number" min="0.01" max="1000000" step="any" inputmode="decimal" required>')}</div>
    ${label('load-watts', fields.loadWatts, '<input id="load-watts" name="loadWatts" type="number" min="0.001" max="100000000" step="any" inputmode="decimal" required>')}
    ${label('battery-depth', fields.depthOfDischargePercent, '<input id="battery-depth" name="depthOfDischargePercent" type="number" min="0" max="100" step="any" inputmode="decimal" value="100" required>')}
    ${label('battery-efficiency', fields.efficiencyPercent, '<input id="battery-efficiency" name="efficiencyPercent" type="number" min="0.1" max="100" step="any" inputmode="decimal" value="100" required>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'lumber-cut-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('cut-unit', fields.unit, `<select id="cut-unit" name="unit"><option value="mm">${escapeGrowthHtml(labels.millimeters)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="in">${escapeGrowthHtml(labels.inches)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option></select>`)}
    ${label('stock-length', fields.stockLength, '<input id="stock-length" name="stockLength" type="number" min="0.001" max="100000000" step="any" inputmode="decimal" required>')}
    ${label('saw-kerf', fields.kerf, '<input id="saw-kerf" name="kerf" type="number" min="0" max="100000000" step="any" inputmode="decimal" value="3" required>')}
    ${label('cut-list', fields.cutList, '<textarea id="cut-list" name="cutList" rows="7" spellcheck="false" required></textarea>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'plant-spacing-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('plant-length-unit', fields.unit, `<select id="plant-length-unit" name="unit"><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="mm">${escapeGrowthHtml(labels.millimeters)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option><option value="in">${escapeGrowthHtml(labels.inches)}</option></select>`)}
    ${label('plant-layout-pattern', fields.pattern, `<select id="plant-layout-pattern" name="pattern"><option value="grid">${escapeGrowthHtml(labels.grid)}</option><option value="triangular">${escapeGrowthHtml(labels.triangular)}</option></select>`)}
    ${label('plant-bed-length', fields.bedLength, '<input id="plant-bed-length" name="bedLength" type="number" min="0.001" max="1000000" step="any" inputmode="decimal" required>')}
    ${label('plant-bed-width', fields.bedWidth, '<input id="plant-bed-width" name="bedWidth" type="number" min="0.001" max="1000000" step="any" inputmode="decimal" required>')}
    ${label('plant-in-row-spacing', fields.inRowSpacing, '<input id="plant-in-row-spacing" name="inRowSpacing" type="number" min="0.001" max="1000000" step="any" inputmode="decimal" required>')}
    ${label('plant-row-spacing', fields.rowSpacing, '<input id="plant-row-spacing" name="rowSpacing" type="number" min="0.001" max="1000000" step="any" inputmode="decimal" required>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'ev-charging-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('ev-battery-capacity', fields.batteryCapacityKwh, '<input id="ev-battery-capacity" name="batteryCapacityKwh" type="number" min="0.001" max="1000000" step="any" inputmode="decimal" required>')}
    ${label('ev-start-soc', fields.startSocPercent, '<input id="ev-start-soc" name="startSocPercent" type="number" min="0" max="100" step="any" inputmode="decimal" value="20" required>')}
    ${label('ev-target-soc', fields.targetSocPercent, '<input id="ev-target-soc" name="targetSocPercent" type="number" min="0" max="100" step="any" inputmode="decimal" value="80" required>')}
    ${label('ev-charger-power', fields.chargerPowerKw, '<input id="ev-charger-power" name="chargerPowerKw" type="number" min="0.001" max="1000000" step="any" inputmode="decimal" required>')}
    ${label('ev-efficiency', fields.efficiencyPercent, '<input id="ev-efficiency" name="efficiencyPercent" type="number" min="0.1" max="100" step="any" inputmode="decimal" value="90" required>')}
    ${label('ev-electricity-rate', fields.electricityRatePerKwh, '<input id="ev-electricity-rate" name="electricityRatePerKwh" type="number" min="0" max="1000000" step="any" inputmode="decimal">')}
    ${label('ev-currency', fields.currency, '<input id="ev-currency" name="currency" type="text" value="USD" maxlength="3" pattern="[A-Za-z]{3}" autocomplete="off">')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'rainwater-harvesting-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('rainwater-area-unit', fields.areaUnit, `<select id="rainwater-area-unit" name="areaUnit"><option value="m2">${escapeGrowthHtml(labels.squareMeters)}</option><option value="ft2">${escapeGrowthHtml(labels.squareFeet)}</option></select>`)}
    ${label('rainwater-area', fields.catchmentArea, '<input id="rainwater-area" name="catchmentArea" type="number" min="0.001" max="1000000000" step="any" inputmode="decimal" required>')}
    ${label('rainfall-unit', fields.rainfallUnit, `<select id="rainfall-unit" name="rainfallUnit"><option value="mm">${escapeGrowthHtml(labels.millimeters)}</option><option value="in">${escapeGrowthHtml(labels.inches)}</option></select>`)}
    ${label('rainfall-values', fields.rainfallValues, '<textarea id="rainfall-values" name="rainfallValues" rows="12" spellcheck="false" required></textarea>')}
    ${label('runoff-percent', fields.runoffPercent, '<input id="runoff-percent" name="runoffPercent" type="number" min="0" max="100" step="any" inputmode="decimal" value="80" required>')}
    ${label('rainwater-volume-unit', fields.tankUnit, `<select id="rainwater-volume-unit" name="tankUnit"><option value="L">${escapeGrowthHtml(labels.liters)}</option><option value="gal">${escapeGrowthHtml(labels.usGallons)}</option></select>`)}
    ${label('tank-capacity', fields.tankCapacity, '<input id="tank-capacity" name="tankCapacity" type="number" min="0.001" max="1000000000" step="any" inputmode="decimal" required>')}
    ${label('starting-storage', fields.startingStorage, '<input id="starting-storage" name="startingStorage" type="number" min="0" max="1000000000" step="any" inputmode="decimal" value="0" required>')}
    ${label('monthly-demand-values', fields.monthlyDemandValues, '<textarea id="monthly-demand-values" name="monthlyDemandValues" rows="12" spellcheck="false" required></textarea>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'ramp-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('ramp-unit', fields.unit, `<select id="ramp-unit" name="unit"><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="mm">${escapeGrowthHtml(labels.millimeters)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option><option value="in">${escapeGrowthHtml(labels.inches)}</option></select>`)}
    ${label('ramp-rise', fields.rise, '<input id="ramp-rise" name="rise" type="number" min="0.001" max="1000000" step="any" inputmode="decimal" required>')}
    ${label('ramp-slope-ratio', fields.slopeRatioDenominator, '<input id="ramp-slope-ratio" name="slopeRatioDenominator" type="number" min="1" max="1000" step="1" inputmode="numeric" value="12" required>')}
    ${label('ramp-landing-count', fields.landingCount, '<input id="ramp-landing-count" name="landingCount" type="number" min="0" max="100" step="1" inputmode="numeric" value="0" required>')}
    ${label('ramp-landing-depth', fields.landingDepth, '<input id="ramp-landing-depth" name="landingDepth" type="number" min="0.001" max="1000000" step="any" inputmode="decimal">')}
    <p class="hint">${escapeGrowthHtml(fields.safetyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'heat-loss-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('heat-area-unit', fields.areaUnit, `<select id="heat-area-unit" name="areaUnit"><option value="m2">${escapeGrowthHtml(labels.squareMeters)}</option><option value="ft2">${escapeGrowthHtml(labels.squareFeet)}</option></select>`)}
    ${label('heat-temperature-unit', fields.temperatureUnit, `<select id="heat-temperature-unit" name="temperatureUnit"><option value="K">${escapeGrowthHtml(labels.kelvin)}</option><option value="F">${escapeGrowthHtml(labels.fahrenheit)}</option></select>`)}
    ${label('heat-temperature-difference', fields.temperatureDifference, '<input id="heat-temperature-difference" name="temperatureDifference" type="number" min="0" max="1000" step="any" inputmode="decimal" value="20" required>')}
    <fieldset><legend>${escapeGrowthHtml(fields.wallArea)} / ${escapeGrowthHtml(fields.wallUValue)}</legend>
      ${label('heat-wall-area', fields.wallArea, '<input id="heat-wall-area" name="wallArea" type="number" min="0" max="100000000" step="any" inputmode="decimal" value="10" required>')}
      ${label('heat-wall-u', fields.wallUValue, '<input id="heat-wall-u" name="wallUValue" type="number" min="0" max="1000" step="any" inputmode="decimal" value="1" required>')}
    </fieldset>
    <fieldset><legend>${escapeGrowthHtml(fields.roofArea)} / ${escapeGrowthHtml(fields.roofUValue)}</legend>
      ${label('heat-roof-area', fields.roofArea, '<input id="heat-roof-area" name="roofArea" type="number" min="0" max="100000000" step="any" inputmode="decimal" value="0" required>')}
      ${label('heat-roof-u', fields.roofUValue, '<input id="heat-roof-u" name="roofUValue" type="number" min="0" max="1000" step="any" inputmode="decimal" value="0" required>')}
    </fieldset>
    <fieldset><legend>${escapeGrowthHtml(fields.windowArea)} / ${escapeGrowthHtml(fields.windowUValue)}</legend>
      ${label('heat-window-area', fields.windowArea, '<input id="heat-window-area" name="windowArea" type="number" min="0" max="100000000" step="any" inputmode="decimal" value="0" required>')}
      ${label('heat-window-u', fields.windowUValue, '<input id="heat-window-u" name="windowUValue" type="number" min="0" max="1000" step="any" inputmode="decimal" value="0" required>')}
    </fieldset>
    <fieldset><legend>${escapeGrowthHtml(fields.floorArea)} / ${escapeGrowthHtml(fields.floorUValue)}</legend>
      ${label('heat-floor-area', fields.floorArea, '<input id="heat-floor-area" name="floorArea" type="number" min="0" max="100000000" step="any" inputmode="decimal" value="0" required>')}
      ${label('heat-floor-u', fields.floorUValue, '<input id="heat-floor-u" name="floorUValue" type="number" min="0" max="1000" step="any" inputmode="decimal" value="0" required>')}
    </fieldset>
    ${label('heat-volume-unit', fields.volumeUnit, `<select id="heat-volume-unit" name="volumeUnit"><option value="m3">${escapeGrowthHtml(labels.cubicMeters)}</option><option value="ft3">${escapeGrowthHtml(labels.cubicFeet)}</option></select>`)}
    ${label('heat-room-volume', fields.roomVolume, '<input id="heat-room-volume" name="roomVolume" type="number" min="0" max="1000000000" step="any" inputmode="decimal" value="0" required>')}
    ${label('heat-air-changes', fields.airChangesPerHour, '<input id="heat-air-changes" name="airChangesPerHour" type="number" min="0" max="100" step="any" inputmode="decimal" value="0" required>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'heat-pump-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('heat-output', fields.heatOutput, '<input id="heat-output" name="heatOutput" type="number" min="0" max="10000000" step="any" inputmode="decimal" value="10" required>')}
    ${label('heat-output-unit', fields.heatOutputUnit, `<select id="heat-output-unit" name="heatOutputUnit"><option value="kW">${escapeGrowthHtml(labels.kilowatts)}</option><option value="BTU/h">${escapeGrowthHtml(labels.btuPerHour)}</option></select>`)}
    ${label('heat-pump-cop', fields.cop, '<input id="heat-pump-cop" name="cop" type="number" min="0.1" max="30" step="any" inputmode="decimal" value="3" required>')}
    ${label('heat-pump-electricity-rate', fields.electricityRatePerKwh, '<input id="heat-pump-electricity-rate" name="electricityRatePerKwh" type="number" min="0" max="1000000" step="any" inputmode="decimal" value="0.2" required>')}
    ${label('heat-pump-hours', fields.hoursPerDay, '<input id="heat-pump-hours" name="hoursPerDay" type="number" min="0" max="24" step="any" inputmode="decimal" value="8" required>')}
    ${label('heat-pump-currency', fields.currency, '<input id="heat-pump-currency" name="currency" type="text" value="USD" maxlength="3" pattern="[A-Za-z]{3}" autocomplete="off" required>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'molarity-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('molarity-mode', fields.mode, `<select id="molarity-mode" name="mode"><option value="concentration">${escapeGrowthHtml(fields.concentrationMode)}</option><option value="moles">${escapeGrowthHtml(fields.molesMode)}</option><option value="volume">${escapeGrowthHtml(fields.volumeMode)}</option><option value="solute-mass">${escapeGrowthHtml(fields.soluteMassMode)}</option><option value="prepare-solution">${escapeGrowthHtml(fields.prepareMode)}</option></select>`)}
    <div class="field" data-molarity-fields="moles">${label('molarity-moles', fields.moles, '<input id="molarity-moles" name="moles" type="number" min="0" max="1000000000" step="any" inputmode="decimal" value="1">')}</div>
    <div class="field" data-molarity-fields="molarity">${label('molarity-value', fields.molarity, '<input id="molarity-value" name="molarity" type="number" min="0" max="1000000000" step="any" inputmode="decimal" value="0.5">')}</div>
    <div class="field" data-molarity-fields="volume">${label('molarity-volume', fields.volume, '<input id="molarity-volume" name="volume" type="number" min="0" max="1000000000000" step="any" inputmode="decimal" value="2">')}<label for="molarity-volume-unit">${escapeGrowthHtml(fields.volumeUnit)}</label><select id="molarity-volume-unit" name="volumeUnit"><option value="L">${escapeGrowthHtml(labels.liters)}</option><option value="mL">${escapeGrowthHtml(labels.milliliters)}</option></select></div>
    <div class="field" data-molarity-fields="molarMass">${label('molarity-molar-mass', fields.molarMass, '<input id="molarity-molar-mass" name="molarMass" type="number" min="0.00000000000000000000000000000000000000000000000001" max="1000000000" step="any" inputmode="decimal" value="58.44">')}</div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'polynomial-long-division-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('polynomial-dividend', fields.dividend, '<input id="polynomial-dividend" name="dividend" type="text" maxlength="256" value="x^2 - 1" autocomplete="off" spellcheck="false" required>')}
    ${label('polynomial-divisor', fields.divisor, '<input id="polynomial-divisor" name="divisor" type="text" maxlength="256" value="x - 1" autocomplete="off" spellcheck="false" required>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', actions.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(actions.result)}</h2><div data-result-content></div>${button('copy', actions.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'half-life-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('decay-mode', fields.mode, `<select id="decay-mode" name="mode"><option value="remaining">${escapeGrowthHtml(fields.solveRemaining)}</option><option value="initial">${escapeGrowthHtml(fields.solveInitial)}</option><option value="elapsed">${escapeGrowthHtml(fields.solveElapsed)}</option><option value="halfLife">${escapeGrowthHtml(fields.solveHalfLife)}</option></select>`)}
    ${label('decay-initial', fields.initialAmount, '<input id="decay-initial" name="initialAmount" type="number" min="0" max="1e100" step="any" inputmode="decimal" value="100" required>')}
    ${label('decay-remaining', fields.remainingAmount, '<input id="decay-remaining" name="remainingAmount" type="number" min="0" max="1e100" step="any" inputmode="decimal" value="" required>')}
    ${label('decay-half-life', fields.halfLife, '<input id="decay-half-life" name="halfLife" type="number" min="0" max="1e100" step="any" inputmode="decimal" value="10" required>')}
    ${label('decay-elapsed', fields.elapsedTime, '<input id="decay-elapsed" name="elapsedTime" type="number" min="0" max="1e100" step="any" inputmode="decimal" value="10" required>')}
    ${label('decay-time-unit', fields.timeUnit, `<select id="decay-time-unit" name="timeUnit"><option value="seconds">${escapeGrowthHtml(fields.seconds)}</option><option value="minutes">${escapeGrowthHtml(fields.minutes)}</option><option value="hours">${escapeGrowthHtml(fields.hours)}</option><option value="days">${escapeGrowthHtml(fields.days)}</option><option value="years">${escapeGrowthHtml(fields.years)}</option></select>`)}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', actions.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(actions.result)}</h2><div data-result-content></div>${button('copy', actions.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'mortgage-points-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('mortgage-principal', fields.principal, '<input id="mortgage-principal" name="principal" type="number" min="0" max="1e12" step="any" inputmode="decimal" value="200000" required>')}
    ${label('mortgage-term', fields.termMonths, '<input id="mortgage-term" name="termMonths" type="number" min="1" max="600" step="1" inputmode="numeric" value="360" required>')}
    ${label('mortgage-rate-before', fields.rateWithoutPoints, '<input id="mortgage-rate-before" name="rateWithoutPoints" type="number" min="0" max="100" step="any" inputmode="decimal" value="7.25" required>')}
    ${label('mortgage-rate-after', fields.rateWithPoints, '<input id="mortgage-rate-after" name="rateWithPoints" type="number" min="0" max="100" step="any" inputmode="decimal" value="7" required>')}
    ${label('mortgage-points-percent', fields.pointsPercent, '<input id="mortgage-points-percent" name="pointsPercent" type="number" min="0" max="100" step="any" inputmode="decimal" value="1" required>')}
    ${label('mortgage-horizon', fields.horizonMonths, '<input id="mortgage-horizon" name="horizonMonths" type="number" min="0" max="600" step="1" inputmode="numeric" value="60" required>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', actions.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(actions.result)}</h2><div data-result-content></div>${button('copy', actions.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'trapezoid-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('trapezoid-base-a', fields.baseA, '<input id="trapezoid-base-a" name="baseA" type="number" min="0" max="1000000000" step="any" inputmode="decimal" value="6" required>')}
    ${label('trapezoid-base-b', fields.baseB, '<input id="trapezoid-base-b" name="baseB" type="number" min="0" max="1000000000" step="any" inputmode="decimal" value="4" required>')}
    ${label('trapezoid-height', fields.height, '<input id="trapezoid-height" name="height" type="number" min="0" max="1000000000" step="any" inputmode="decimal" value="3" required>')}
    ${label('trapezoid-offset', fields.topOffset, '<input id="trapezoid-offset" name="topOffset" type="number" min="-1000000000" max="1000000000" step="any" inputmode="decimal" value="1" required>')}
    ${label('trapezoid-unit', fields.unit, `<select id="trapezoid-unit" name="unit"><option value="mm">${escapeGrowthHtml(fields.millimeters)}</option><option value="cm">${escapeGrowthHtml(fields.centimeters)}</option><option value="m" selected>${escapeGrowthHtml(fields.meters)}</option><option value="in">${escapeGrowthHtml(fields.inches)}</option><option value="ft">${escapeGrowthHtml(fields.feet)}</option></select>`)}
    <figure class="trapezoid-diagram"><svg viewBox="0 0 360 210" role="img" aria-labelledby="trapezoid-diagram-title"><title id="trapezoid-diagram-title">${escapeGrowthHtml(fields.diagramLabel)}</title><polygon data-trapezoid-shape points="30,180 330,180 270,100 90,100" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><line data-trapezoid-height-line x1="90" y1="100" x2="90" y2="180" stroke="currentColor" stroke-width="2" stroke-dasharray="5 5"/></svg><figcaption>${escapeGrowthHtml(fields.diagramLabel)}</figcaption></figure>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', actions.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(actions.result)}</h2><div data-result-content></div>${button('copy', actions.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'prayer-times-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('prayer-date', fields.date, '<input id="prayer-date" name="date" type="date" min="1900-01-01" max="2100-12-31" value="2026-03-20" required>')}
    ${label('prayer-latitude', fields.latitude, '<input id="prayer-latitude" name="latitude" type="number" min="-90" max="90" step="any" inputmode="decimal" value="40.7128" required>')}
    ${label('prayer-longitude', fields.longitude, '<input id="prayer-longitude" name="longitude" type="number" min="-180" max="180" step="any" inputmode="decimal" value="-74.006" required>')}
    ${label('prayer-utc-offset', fields.utcOffset, '<input id="prayer-utc-offset" name="utcOffsetHours" type="number" min="-12" max="14" step="0.25" inputmode="decimal" value="-4" required>')}
    ${label('prayer-method', fields.method, `<select id="prayer-method" name="method"><option value="mwl">${escapeGrowthHtml(fields.mwl)}</option><option value="isna" selected>${escapeGrowthHtml(fields.isna)}</option><option value="egypt">${escapeGrowthHtml(fields.egypt)}</option><option value="makkah">${escapeGrowthHtml(fields.makkah)}</option><option value="karachi">${escapeGrowthHtml(fields.karachi)}</option><option value="france">${escapeGrowthHtml(fields.france)}</option><option value="russia">${escapeGrowthHtml(fields.russia)}</option><option value="singapore">${escapeGrowthHtml(fields.singapore)}</option></select>`)}
    ${label('prayer-asr', fields.asrMethod, `<select id="prayer-asr" name="asrMethod"><option value="standard">${escapeGrowthHtml(fields.standard)}</option><option value="hanafi">${escapeGrowthHtml(fields.hanafi)}</option></select>`)}
    ${label('prayer-high-latitude', fields.highLatitudeMethod, `<select id="prayer-high-latitude" name="highLatitudeMethod"><option value="angle" selected>${escapeGrowthHtml(fields.angleBased)}</option><option value="middle">${escapeGrowthHtml(fields.middleOfNight)}</option><option value="seventh">${escapeGrowthHtml(fields.oneSeventh)}</option><option value="none">${escapeGrowthHtml(fields.noAdjustment)}</option></select>`)}
    <div class="field"><label for="prayer-ramadan">${escapeGrowthHtml(fields.ramadan)}</label><input id="prayer-ramadan" name="ramadan" type="checkbox"></div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', actions.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(actions.result)}</h2><div data-result-content></div>${button('copy', actions.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'dilution-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('dilution-mode', fields.mode, `<select id="dilution-mode" name="mode"><option value="direct">${escapeGrowthHtml(fields.directMode)}</option><option value="serial">${escapeGrowthHtml(fields.serialMode)}</option></select>`)}
    ${label('dilution-stock-concentration', fields.stockConcentration, '<input id="dilution-stock-concentration" name="stockConcentration" type="number" min="0" step="any" inputmode="decimal" value="10" required>')}
    ${label('dilution-target-concentration', fields.targetConcentration, '<input id="dilution-target-concentration" name="targetConcentration" type="number" min="0" step="any" inputmode="decimal" value="2" required>')}
    ${label('dilution-final-volume', fields.finalVolume, '<input id="dilution-final-volume" name="finalVolume" type="number" min="0" step="any" inputmode="decimal" value="1" required>')}
    ${label('dilution-volume-unit', fields.volumeUnit, `<select id="dilution-volume-unit" name="volumeUnit"><option value="L">${escapeGrowthHtml(labels.liters)}</option><option value="mL">${escapeGrowthHtml(labels.milliliters)}</option></select>`)}
    <div class="field" data-dilution-steps hidden>${label('dilution-steps', fields.steps, '<input id="dilution-steps" name="steps" type="number" min="1" max="20" step="1" inputmode="numeric" value="3" required>')}</div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'miter-angle-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('miter-mode', fields.mode, `<select id="miter-mode" name="mode"><option value="simple">${escapeGrowthHtml(labels.simpleMode)}</option><option value="compound">${escapeGrowthHtml(labels.compoundMode)}</option></select>`)}
    ${label('miter-corner-angle', fields.cornerAngle, '<input id="miter-corner-angle" name="cornerAngle" type="number" min="1" max="179" step="any" inputmode="decimal" value="90" required>')}
    <fieldset class="miter-compound-fields" data-compound-fields hidden>
      <legend>${escapeGrowthHtml(labels.compoundMode)}</legend>
      ${label('miter-spring-angle', fields.springAngle, '<input id="miter-spring-angle" name="springAngle" type="number" min="0" max="90" step="any" inputmode="decimal" value="38" required>')}
    </fieldset>
    <figure class="miter-diagram"><svg viewBox="0 0 320 170" role="img" aria-labelledby="miter-diagram-title miter-diagram-desc"><title id="miter-diagram-title">${escapeGrowthHtml(fields.diagramLabel)}</title><desc id="miter-diagram-desc">${escapeGrowthHtml(fields.diagramCorner)} ${escapeGrowthHtml(fields.diagramCut)}${labels.compoundMode ? `; ${escapeGrowthHtml(fields.diagramSpring)}` : ''}</desc><path d="M45 142 L160 28 L275 142" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M116 142 A44 44 0 0 1 129 111" fill="none" stroke="currentColor" stroke-width="2"/><path d="M160 28 L160 142" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="5 5"/><text x="160" y="158" text-anchor="middle">${escapeGrowthHtml(fields.diagramCorner)}</text><text x="73" y="89" text-anchor="middle">${escapeGrowthHtml(fields.diagramCut)}</text></svg><figcaption>${escapeGrowthHtml(fields.diagramLabel)}</figcaption></figure>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'voltage-drop-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('voltage-circuit', fields.circuit, `<select id="voltage-circuit" name="circuit"><option value="dc">${escapeGrowthHtml(fields.dc)}</option><option value="single-phase" selected>${escapeGrowthHtml(fields.singlePhase)}</option><option value="three-phase">${escapeGrowthHtml(fields.threePhase)}</option></select>`)}
    ${label('voltage-material', fields.material, `<select id="voltage-material" name="material"><option value="copper">${escapeGrowthHtml(fields.copper)}</option><option value="aluminum">${escapeGrowthHtml(fields.aluminum)}</option></select>`)}
    ${label('voltage-length', fields.oneWayLength, '<input id="voltage-length" name="oneWayLength" type="number" min="0" max="1000000" step="any" inputmode="decimal" value="30" required>')}
    ${label('voltage-length-unit', fields.lengthUnit, `<select id="voltage-length-unit" name="lengthUnit"><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option></select>`)}
    ${label('voltage-current', fields.currentA, '<input id="voltage-current" name="currentA" type="number" min="0" max="1000000" step="any" inputmode="decimal" value="20" required>')}
    ${label('voltage-section', fields.crossSectionMm2, '<input id="voltage-section" name="crossSectionMm2" type="number" min="0.0001" max="1000000" step="any" inputmode="decimal" value="2.5" required>')}
    ${label('voltage-supply', fields.supplyVoltageV, '<input id="voltage-supply" name="supplyVoltageV" type="number" min="0.001" max="10000000" step="any" inputmode="decimal" value="230" required>')}
    <div class="field" data-power-factor-field><label for="voltage-power-factor">${escapeGrowthHtml(fields.powerFactor)}</label><input id="voltage-power-factor" name="powerFactor" type="number" min="0" max="1" step="any" inputmode="decimal" value="1" required></div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'ohms-law-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('ohms-mode', fields.mode, `<select id="ohms-mode" name="mode"><option value="solve">${escapeGrowthHtml(fields.solverMode)}</option><option value="network">${escapeGrowthHtml(fields.networkMode)}</option></select>`)}
    <div data-ohms-solver>
      ${label('ohms-voltage', fields.voltage, '<input id="ohms-voltage" name="voltage" type="number" min="0.000000000001" max="1000000000000" step="any" inputmode="decimal">')}
      ${label('ohms-current', fields.current, '<input id="ohms-current" name="current" type="number" min="0.000000000001" max="1000000000000" step="any" inputmode="decimal">')}
      ${label('ohms-resistance', fields.resistance, '<input id="ohms-resistance" name="resistance" type="number" min="0.000000000001" max="1000000000000" step="any" inputmode="decimal">')}
      ${label('ohms-power', fields.power, '<input id="ohms-power" name="power" type="number" min="0.000000000001" max="1000000000000" step="any" inputmode="decimal">')}
    </div>
    <div data-ohms-network hidden>
      ${label('ohms-topology', fields.topology, `<select id="ohms-topology" name="topology"><option value="series">${escapeGrowthHtml(fields.series)}</option><option value="parallel">${escapeGrowthHtml(fields.parallel)}</option></select>`)}
      ${label('ohms-resistor-values', fields.resistorValues, '<textarea id="ohms-resistor-values" name="resistorValues" rows="4" maxlength="500" spellcheck="false"></textarea>')}
    </div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div><p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'kinetic-energy-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('kinetic-mode', fields.mode, `<select id="kinetic-mode" name="mode"><option value="energy">${escapeGrowthHtml(fields.energyMode)}</option><option value="solve-speed">${escapeGrowthHtml(fields.speedMode)}</option></select>`)}
    ${label('kinetic-mass', fields.massKg, '<input id="kinetic-mass" name="massKg" type="number" min="0.000000000001" max="1000000000000" step="any" inputmode="decimal" value="2" required>')}
    <div data-kinetic-solve>
      ${label('kinetic-speed', fields.velocityMps, '<input id="kinetic-speed" name="velocityMps" type="number" min="0" max="1000000000000" step="any" inputmode="decimal" value="3" required>')}
    </div>
    <div data-kinetic-energy-input hidden>
      ${label('kinetic-energy', fields.kineticEnergyJ, '<input id="kinetic-energy" name="kineticEnergyJ" type="number" min="0" max="1000000000000000000000000" step="any" inputmode="decimal">')}
    </div>
    ${label('kinetic-height', fields.heightM, '<input id="kinetic-height" name="heightM" type="number" min="-1000000000000" max="1000000000000" step="any" inputmode="decimal" value="0" required>')}
    ${label('kinetic-gravity', fields.gravityMps2, '<input id="kinetic-gravity" name="gravityMps2" type="number" min="0.000000000001" max="100" step="any" inputmode="decimal" value="9.80665" required>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'resistor-color-code-calculator') {
    const palette = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white', 'gold', 'silver', 'none'];
    const select = (id, options, value) => label(id, fields[id], `<select id="${id}" name="${id}">${options.map(([optionValue, text]) => `<option value="${escapeGrowthHtml(optionValue)}"${optionValue === value ? ' selected' : ''}>${escapeGrowthHtml(text)}</option>`).join('')}</select>`);
    const bandSelect = (number, initial) => select(`band${number}`, palette.map((value) => [value, fields[value]]), initial);
    const colorInputs = Array.from({ length: 6 }, (_, index) => bandSelect(index + 1, ['brown', 'black', 'red', 'gold', 'brown', 'red'][index])).join('');
    const bandOptions = [['4', fields.fourBands], ['5', fields.fiveBands], ['6', fields.sixBands]];
    const toleranceOptions = [['0.05', fields.tolerance005], ['0.1', fields.tolerance01], ['0.25', fields.tolerance025], ['0.5', fields.tolerance05], ['1', fields.tolerance1], ['2', fields.tolerance2], ['5', fields.tolerance5], ['10', fields.tolerance10], ['20', fields.tolerance20]];
    const tcrOptions = [['250', fields.ppm250], ['100', fields.ppm100], ['50', fields.ppm50], ['25', fields.ppm25], ['20', fields.ppm20], ['15', fields.ppm15], ['10', fields.ppm10], ['5', fields.ppm5], ['1', fields.ppm1]];
    return attachCopy(`<form id="tool-form" novalidate>
      ${select('mode', [['decode', fields.decodeMode], ['encode', fields.encodeMode]], 'decode')}
      ${select('bands', bandOptions, '4')}
      <fieldset data-resistor-decode><legend>${escapeGrowthHtml(fields.decodeMode)}</legend>${colorInputs}</fieldset>
      <fieldset data-resistor-encode hidden><legend>${escapeGrowthHtml(fields.encodeMode)}</legend>
        ${label('resistance-ohms', fields.resistanceOhms, '<input id="resistance-ohms" name="resistanceOhms" type="number" min="0.000000001" max="1000000000000000" step="any" value="1000" inputmode="decimal" required>')}
        ${select('tolerance', toleranceOptions, '5')}
        <div data-resistor-tcr hidden>${select('temperatureCoefficient', tcrOptions, '100')}</div>
      </fieldset>
      <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
      <div class="actions">${button('example', actions.example, 'secondary')}${button('calculate', actions.calculate)}${reset}</div>
      <p class="status" role="status" aria-live="polite" data-status></p>
      <section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
    </form>`, copy);
  }

  if (toolId === 'roth-vs-traditional-calculator') return attachCopy(`<form id="tool-form" class="roth-traditional-form" novalidate>
    ${label('roth-annual-contribution', fields.annualContribution, '<input id="roth-annual-contribution" name="annualContribution" type="number" inputmode="decimal" min="0" max="1000000" step="0.01" value="6000" required>')}
    <p class="hint">${escapeGrowthHtml(fields.budgetNote)}</p>
    <div class="roth-tax-grid">
      ${label('roth-current-tax-rate', fields.currentTaxRate, '<input id="roth-current-tax-rate" name="currentTaxRate" type="number" inputmode="decimal" min="0" max="60" step="0.1" value="22" required>')}
      ${label('roth-future-tax-rate', fields.futureTaxRate, '<input id="roth-future-tax-rate" name="futureTaxRate" type="number" inputmode="decimal" min="0" max="60" step="0.1" value="22" required>')}
      ${label('roth-annual-return', fields.annualReturn, '<input id="roth-annual-return" name="annualReturn" type="number" inputmode="decimal" min="-50" max="30" step="0.1" value="6" required>')}
      ${label('roth-years', fields.years, '<input id="roth-years" name="years" type="number" inputmode="numeric" min="1" max="80" step="1" value="25" required>')}
    </div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', actions.example, 'secondary')}${button('compare', actions.compare)}${button('reset', actions.reset, 'secondary')}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-roth-result hidden aria-live="polite"><h2>${escapeGrowthHtml(fields.resultSummary)}</h2><p data-roth-summary></p><dl>
      <div><dt>${escapeGrowthHtml(fields.rothAnnualDeposit)}</dt><dd data-roth-deposit></dd></div>
      <div><dt>${escapeGrowthHtml(fields.rothAfterTax)}</dt><dd data-roth-after-tax></dd></div>
      <div><dt>${escapeGrowthHtml(fields.traditionalBeforeTax)}</dt><dd data-traditional-before-tax></dd></div>
      <div><dt>${escapeGrowthHtml(fields.traditionalAfterTax)}</dt><dd data-traditional-after-tax></dd></div>
      <div><dt>${escapeGrowthHtml(fields.traditionalTax)}</dt><dd data-traditional-tax></dd></div>
      <div><dt>${escapeGrowthHtml(fields.taxPaidNow)}</dt><dd data-tax-paid-now></dd></div>
      <div><dt>${escapeGrowthHtml(fields.estimatedDifference)}</dt><dd data-estimated-difference></dd></div>
      <div><dt>${escapeGrowthHtml(fields.totalBudget)}</dt><dd data-total-budget></dd></div>
    </dl><a href="https://www.irs.gov/publications/p590b" target="_blank" rel="noopener noreferrer">${escapeGrowthHtml(fields.irsSource)}</a></section>
  </form>`, copy);

  if (toolId === 'polygon-calculator') return attachCopy(`<form id="tool-form" class="polygon-calculator-form" novalidate>
    <div class="calculator-grid">
      ${label('polygon-sides', fields.sides, '<input id="polygon-sides" name="sides" type="number" min="4" max="1000" step="1" value="6" inputmode="numeric" required>')}
      ${label('polygon-mode', fields.dimensionMode, `<select id="polygon-mode" name="mode"><option value="side">${escapeGrowthHtml(fields.sideLength)}</option><option value="apothem">${escapeGrowthHtml(fields.apothem)}</option><option value="circumradius">${escapeGrowthHtml(fields.circumradius)}</option></select>`)}
    </div>
    <div class="calculator-grid">
      ${label('polygon-dimension', fields.dimension, '<input id="polygon-dimension" name="dimension" type="number" min="0.000000001" max="1000000000" step="any" value="1" inputmode="decimal" required>')}
      ${label('polygon-unit', fields.unit, '<input id="polygon-unit" name="unit" type="text" maxlength="16" autocomplete="off">')}
    </div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', actions.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-polygon-result hidden aria-live="polite"><h2>${escapeGrowthHtml(fields.resultSummary)}</h2><dl data-polygon-values></dl><p class="hint">${escapeGrowthHtml(fields.formulaNote)}</p><div class="actions">${button('copy', actions.copy, 'secondary')}</div></section>
  </form>`, copy);

  if (toolId === 'acceleration-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('acceleration-mode', fields.mode, `<select id="acceleration-mode" name="mode"><option value="acceleration">${escapeGrowthHtml(fields.solveAcceleration)}</option><option value="time">${escapeGrowthHtml(fields.solveTime)}</option><option value="final-velocity">${escapeGrowthHtml(fields.solveFinalVelocity)}</option><option value="displacement">${escapeGrowthHtml(fields.solveDisplacement)}</option></select>`)}
    ${label('acceleration-units', fields.units, `<select id="acceleration-units" name="units"><option value="metric">${escapeGrowthHtml(fields.metric)}</option><option value="imperial">${escapeGrowthHtml(fields.imperial)}</option></select>`)}
    <div data-acceleration-field="initialVelocity">${label('initial-velocity', fields.initialVelocity, '<input id="initial-velocity" name="initialVelocity" type="number" min="-1000000000" max="1000000000" step="any" inputmode="decimal" value="0" required>')}</div>
    <div data-acceleration-field="finalVelocity">${label('final-velocity', fields.finalVelocity, '<input id="final-velocity" name="finalVelocity" type="number" min="-1000000000" max="1000000000" step="any" inputmode="decimal" value="20" required>')}</div>
    <div data-acceleration-field="acceleration" hidden>${label('motion-acceleration', fields.acceleration, '<input id="motion-acceleration" name="acceleration" type="number" min="-1000000000" max="1000000000" step="any" inputmode="decimal" value="4">')}</div>
    <div data-acceleration-field="timeSeconds">${label('motion-time', fields.timeSeconds, '<input id="motion-time" name="timeSeconds" type="number" min="0.000000001" max="1000000000" step="any" inputmode="decimal" value="5" required>')}</div>
    <div data-acceleration-field="initialPosition" hidden>${label('initial-position', fields.initialPosition, '<input id="initial-position" name="initialPosition" type="number" min="-1000000000" max="1000000000" step="any" inputmode="decimal" value="0">')}</div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'force-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('force-mode', fields.mode, `<select id="force-mode" name="mode"><option value="solve-force">${escapeGrowthHtml(fields.solveForce)}</option><option value="solve-mass">${escapeGrowthHtml(fields.solveMass)}</option><option value="solve-acceleration">${escapeGrowthHtml(fields.solveAcceleration)}</option><option value="net-forces">${escapeGrowthHtml(fields.netMode)}</option></select>`)}
    <div data-force-solve>
      ${label('force-unit', fields.forceUnit, `<select id="force-unit" name="forceUnit"><option value="N">N</option><option value="kN">kN</option><option value="lbf">lbf</option></select>`)}
      ${label('mass-unit', fields.massUnit, `<select id="mass-unit" name="massUnit"><option value="kg">kg</option><option value="lb">lb</option></select>`)}
      ${label('acceleration-unit', fields.accelerationUnit, `<select id="acceleration-unit" name="accelerationUnit"><option value="m/s²">m/s²</option><option value="ft/s²">ft/s²</option></select>`)}
      <div data-force-field="force">${label('force-value', fields.force, '<input id="force-value" name="force" type="number" step="any" inputmode="decimal" value="6" required>')}</div>
      <div data-force-field="mass">${label('mass-value', fields.mass, '<input id="mass-value" name="mass" type="number" min="0.000000001" max="1000000000000" step="any" inputmode="decimal" value="2" required>')}</div>
      <div data-force-field="acceleration">${label('acceleration-value', fields.acceleration, '<input id="acceleration-value" name="acceleration" type="number" step="any" inputmode="decimal" value="3" required>')}</div>
    </div>
    <div data-force-net hidden>
      ${label('net-force-values', fields.forces, '<textarea id="net-force-values" name="forces" rows="3" maxlength="100" spellcheck="false" inputmode="decimal"></textarea>')}
      <p class="hint">${escapeGrowthHtml(fields.forcesHint)}</p>
      ${label('net-force-mass', fields.netMass, '<input id="net-force-mass" name="netMass" type="number" min="0.000000001" max="1000000000000" step="any" inputmode="decimal">')}
    </div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', actions.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(actions.result)}</h2><div data-result-content></div>${button('copy', actions.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'friction-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('friction-mode', fields.mode, `<select id="friction-mode" name="mode"><option value="normal">${escapeGrowthHtml(labels.normalMode)}</option><option value="incline">${escapeGrowthHtml(labels.inclineMode)}</option></select>`)}
    <div data-friction-fields="normal">
      ${label('normal-force', fields.normalForce, '<input id="normal-force" name="normalForce" type="number" min="0" max="1000000000" step="any" inputmode="decimal" value="100">')}
    </div>
    <div data-friction-fields="incline" hidden>
      ${label('friction-mass', fields.mass, '<input id="friction-mass" name="mass" type="number" min="0.000001" max="1000000000" step="any" inputmode="decimal" value="10">')}
      ${label('friction-mass-unit', fields.massUnit, `<select id="friction-mass-unit" name="massUnit"><option value="kg">${escapeGrowthHtml(labels.kilograms)}</option><option value="lb">${escapeGrowthHtml(labels.pounds)}</option></select>`)}
      ${label('friction-angle', fields.angle, '<input id="friction-angle" name="angle" type="number" min="0" max="90" step="any" inputmode="decimal" value="30">')}
      ${label('friction-gravity', fields.gravity, '<input id="friction-gravity" name="gravity" type="number" min="0.000001" max="100" step="any" inputmode="decimal" value="9.80665">')}
    </div>
    ${label('friction-static-coefficient', fields.staticCoefficient, '<input id="friction-static-coefficient" name="staticCoefficient" type="number" min="0" max="10" step="any" inputmode="decimal" value="0.6">')}
    ${label('friction-kinetic-coefficient', fields.kineticCoefficient, '<input id="friction-kinetic-coefficient" name="kineticCoefficient" type="number" min="0" max="10" step="any" inputmode="decimal" value="0.4">')}
    ${label('friction-unit', fields.forceUnit, `<select id="friction-unit" name="forceUnit"><option value="N">${escapeGrowthHtml(labels.newtons)}</option><option value="kN">${escapeGrowthHtml(labels.kilonewtons)}</option><option value="lbf">${escapeGrowthHtml(labels.poundsForce)}</option></select>`)}
    ${label('friction-applied-force', fields.appliedForce, '<input id="friction-applied-force" name="appliedForce" type="number" min="-1000000000" max="1000000000" step="any" inputmode="decimal" value="0">')}
    ${label('friction-state', fields.motionState, `<select id="friction-state" name="motionState"><option value="rest">${escapeGrowthHtml(fields.atRest)}</option><option value="uphill">${escapeGrowthHtml(fields.movingUp)}</option><option value="downhill">${escapeGrowthHtml(fields.movingDown)}</option></select>`)}
    <p class="hint">${escapeGrowthHtml(fields.positiveSurfaceDirection)}</p><p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'thermal-expansion-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('thermal-mode', fields.mode, `<select id="thermal-mode" name="mode"><option value="linear">${escapeGrowthHtml(fields.linearMode)}</option><option value="area">${escapeGrowthHtml(fields.areaMode)}</option><option value="volume">${escapeGrowthHtml(fields.volumeMode)}</option></select>`)}
    ${label('thermal-initial-dimension', fields.initialDimension, '<input id="thermal-initial-dimension" name="initialDimension" type="number" min="0" max="1000000000000" step="any" inputmode="decimal" value="10" required>')}
    <div data-thermal-unit="linear">${label('thermal-length-unit', fields.lengthUnit, `<select id="thermal-length-unit" name="lengthUnit"><option value="m">${escapeGrowthHtml(labels.meters)}</option><option value="cm">${escapeGrowthHtml(labels.centimeters)}</option><option value="mm">${escapeGrowthHtml(labels.millimeters)}</option><option value="in">${escapeGrowthHtml(labels.inches)}</option><option value="ft">${escapeGrowthHtml(labels.feet)}</option></select>`)}</div>
    <div data-thermal-unit="area" hidden>${label('thermal-area-unit', fields.areaUnit, `<select id="thermal-area-unit" name="areaUnit" disabled><option value="m²">${escapeGrowthHtml(labels.squareMeters)}</option><option value="cm²">${escapeGrowthHtml(labels.squareCentimeters)}</option><option value="ft²">${escapeGrowthHtml(labels.squareFeet)}</option><option value="in²">${escapeGrowthHtml(labels.squareInches)}</option></select>`)}</div>
    <div data-thermal-unit="volume" hidden>${label('thermal-volume-unit', fields.volumeUnit, `<select id="thermal-volume-unit" name="volumeUnit" disabled><option value="m³">${escapeGrowthHtml(labels.cubicMeters)}</option><option value="cm³">${escapeGrowthHtml(labels.cubicCentimeters)}</option><option value="L">${escapeGrowthHtml(labels.liters)}</option><option value="ft³">${escapeGrowthHtml(labels.cubicFeet)}</option><option value="in³">${escapeGrowthHtml(labels.cubicInches)}</option></select>`)}</div>
    ${label('thermal-coefficient', fields.coefficient, '<input id="thermal-coefficient" name="coefficient" type="number" min="-0.01" max="0.01" step="any" inputmode="decimal" value="0.000012" required>')}
    ${label('thermal-coefficient-temperature-unit', fields.coefficientTemperatureUnit, `<select id="thermal-coefficient-temperature-unit" name="coefficientTemperatureUnit"><option value="C">${escapeGrowthHtml(fields.perCelsius)}</option><option value="F">${escapeGrowthHtml(fields.perFahrenheit)}</option></select>`)}
    ${label('thermal-delta-temperature', fields.deltaTemperature, '<input id="thermal-delta-temperature" name="deltaTemperature" type="number" min="-10000" max="10000" step="any" inputmode="decimal" value="50" required>')}
    ${label('thermal-temperature-unit', fields.temperatureUnit, `<select id="thermal-temperature-unit" name="temperatureUnit"><option value="C">${escapeGrowthHtml(fields.celsius)}</option><option value="F">${escapeGrowthHtml(fields.fahrenheit)}</option></select>`)}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p><section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'horsepower-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('horsepower-mode', fields.mode, `<select id="horsepower-mode" name="mode"><option value="solve-power">${escapeGrowthHtml(fields.solvePower)}</option><option value="solve-torque">${escapeGrowthHtml(fields.solveTorque)}</option><option value="solve-rpm">${escapeGrowthHtml(fields.solveRpm)}</option></select>`)}
    ${label('horsepower-torque-unit', fields.torqueUnit, '<select id="horsepower-torque-unit" name="torqueUnit"><option value="Nm">N·m</option><option value="lb·ft">lb·ft</option></select>')}
    <div data-horsepower-field="torque">${label('horsepower-torque', fields.torque, '<input id="horsepower-torque" name="torque" type="number" step="any" inputmode="decimal" value="100" required>')}</div>
    <div data-horsepower-field="rpm">${label('horsepower-rpm', fields.rpm, '<input id="horsepower-rpm" name="rpm" type="number" min="0" max="1000000000000" step="any" inputmode="decimal" value="1000" required>')}</div>
    <div data-horsepower-field="power" hidden>${label('horsepower-power', fields.power, '<input id="horsepower-power" name="power" type="number" step="any" inputmode="decimal" value="10">')}</div>
    ${label('horsepower-power-unit', fields.powerUnit, '<select id="horsepower-power-unit" name="powerUnit"><option value="hp">hp</option><option value="PS">PS</option><option value="kW">kW</option><option value="W">W</option></select>')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'rtf-converter') return attachCopy(`<form id="tool-form" novalidate>
    ${label('rtf-file', fields.file, '<input id="rtf-file" name="file" type="file" accept=".rtf,application/rtf,text/rtf" required>')}
    <p class="hint">${escapeGrowthHtml(fields.limitNote)}</p>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${submit('convert')}${button('reset', actions.reset, 'secondary')}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-result hidden aria-live="polite">
      <h2>${escapeGrowthHtml(actions.result)}</h2>
      <label class="field" for="rtf-output">${escapeGrowthHtml(fields.output)}</label>
      <textarea id="rtf-output" name="output" rows="12" maxlength="2097152" readonly spellcheck="false"></textarea>
      <div class="actions">${button('copy', actions.copy, 'secondary')}${button('download', actions.download, 'secondary')}${button('print', actions.print, 'secondary')}</div>
    </section>
  </form>`, copy);

  if (toolId === 'csv-to-pdf') return attachCopy(`<form id="tool-form" novalidate>
    ${label('csv-file', fields.file, '<input id="csv-file" name="file" type="file" accept=".csv,text/csv,text/plain" required>')}
    <div class="form-grid">
      ${label('csv-separator', fields.separator, `<select id="csv-separator" name="separator"><option value="auto">${escapeGrowthHtml(fields.auto)}</option><option value=",">${escapeGrowthHtml(fields.comma)}</option><option value=";">${escapeGrowthHtml(fields.semicolon)}</option><option value="tab">${escapeGrowthHtml(fields.tab)}</option><option value="|">${escapeGrowthHtml(fields.pipe)}</option></select>`)}
      ${label('csv-encoding', fields.encoding, `<select id="csv-encoding" name="encoding"><option value="utf-8">UTF-8</option><option value="windows-1252">Windows-1252</option><option value="utf-16le">UTF-16 LE</option><option value="utf-16be">UTF-16 BE</option></select>`)}
      ${label('csv-page-size', fields.pageSize, `<select id="csv-page-size" name="pageSize"><option value="a4">A4</option><option value="letter">Letter</option></select>`)}
      ${label('csv-orientation', fields.orientation, `<select id="csv-orientation" name="orientation"><option value="landscape">${escapeGrowthHtml(fields.landscape)}</option><option value="portrait">${escapeGrowthHtml(fields.portrait)}</option></select>`)}
      ${label('csv-margin', fields.margin, `<select id="csv-margin" name="margin"><option value="narrow">${escapeGrowthHtml(fields.narrow)}</option><option value="normal">${escapeGrowthHtml(fields.normal)}</option></select>`)}
    </div>
    <label class="check-row"><input type="checkbox" name="hasHeader" checked> ${escapeGrowthHtml(fields.hasHeader)}</label>
    <p class="hint">${escapeGrowthHtml(fields.limitNote)}</p><p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${submit('preview')}${button('example', actions.example, 'secondary')}${button('reset', actions.reset, 'secondary')}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(actions.result)}</h2><p data-csv-summary></p><div class="table-scroll"><table data-csv-preview><caption>${escapeGrowthHtml(fields.tableLabel)}</caption><thead></thead><tbody></tbody></table></div><p data-csv-preview-note></p><div class="actions">${button('print', actions.print, 'secondary')}</div></section>
  </form>`, copy);

  if (toolId === 'round-robin-tournament-generator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('round-robin-participants', fields.participants, '<textarea id="round-robin-participants" name="participants" rows="8" maxlength="1600" required></textarea>')}
    <p class="hint">${escapeGrowthHtml(fields.participantsHint)}</p>
    <label class="check-row"><input type="checkbox" name="doubleRound"> ${escapeGrowthHtml(fields.doubleRound)}</label>
    <label class="check-row"><input type="checkbox" name="shuffle"> ${escapeGrowthHtml(fields.shuffle)}</label>
    <p class="hint">${escapeGrowthHtml(fields.scoringNote)}</p><p class="hint">${escapeGrowthHtml(fields.limitNote)}</p>
    <div class="actions">${submit('generate')}${button('example', actions.example, 'secondary')}${button('reset', actions.reset, 'secondary')}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(actions.result)}</h2><p data-round-robin-summary></p>
      <h3>${escapeGrowthHtml(fields.standingsLabel)}</h3><div class="table-scroll"><table data-round-robin-standings><thead></thead><tbody></tbody></table></div>
      <div data-round-robin-rounds></div>
      <div class="actions">${button('downloadCsv', actions.downloadCsv, 'secondary')}${button('print', actions.print, 'secondary')}</div>
    </section>
  </form>`, copy);

  if (toolId === 'work-order-generator') return attachCopy(`<form id="tool-form" novalidate>
    <div class="form-grid">
      ${label('wo-number', fields.workOrderNumber, '<input id="wo-number" name="number" type="text" maxlength="48" autocomplete="off">')}
      ${label('wo-issued-date', fields.issuedDate, '<input id="wo-issued-date" name="issuedDate" type="date" required>')}
      ${label('wo-scheduled-date', fields.scheduledDate, '<input id="wo-scheduled-date" name="scheduledDate" type="date">')}
      ${label('wo-completed-date', fields.completedDate, '<input id="wo-completed-date" name="completedDate" type="date">')}
      ${label('wo-status', fields.status, `<select id="wo-status" name="status"><option value="open">${escapeGrowthHtml(actions.open)}</option><option value="in-progress">${escapeGrowthHtml(actions.inProgress)}</option><option value="completed">${escapeGrowthHtml(actions.completed)}</option></select>`)}
      ${label('wo-customer', fields.customer, '<input id="wo-customer" name="customer" type="text" maxlength="240" required autocomplete="off">')}
      ${label('wo-contact', fields.contact, '<input id="wo-contact" name="contact" type="text" maxlength="240" autocomplete="off">')}
      ${label('wo-location', fields.location, '<input id="wo-location" name="location" type="text" maxlength="240" autocomplete="off">')}
      ${label('wo-assigned-to', fields.assignedTo, '<input id="wo-assigned-to" name="assignedTo" type="text" maxlength="240" autocomplete="off">')}
    </div>
    ${label('wo-title', fields.title, '<input id="wo-title" name="title" type="text" maxlength="160" required autocomplete="off">')}
    ${label('wo-details', fields.details, '<textarea id="wo-details" name="details" rows="3" maxlength="4000"></textarea>')}
    <p class="hint">${escapeGrowthHtml(fields.tasksHint)}</p>
    ${label('wo-tasks', fields.tasks, '<textarea id="wo-tasks" name="tasks" rows="5" maxlength="10000"></textarea>')}
    <p class="hint">${escapeGrowthHtml(fields.materialsHint)} <span class="format-example">${escapeGrowthHtml(fields.materialsFormat)}</span></p>
    ${label('wo-materials', fields.materials, '<textarea id="wo-materials" name="materials" rows="4" maxlength="10000"></textarea>')}
    <p class="hint">${escapeGrowthHtml(fields.laborHint)} <span class="format-example">${escapeGrowthHtml(fields.laborFormat)}</span></p>
    ${label('wo-labor', fields.labor, '<textarea id="wo-labor" name="labor" rows="4" maxlength="10000"></textarea>')}
    ${label('wo-notes', fields.notes, '<textarea id="wo-notes" name="notes" rows="3" maxlength="4000"></textarea>')}
    <p class="hint">${escapeGrowthHtml(fields.limitNote)}</p><p class="hint">${escapeGrowthHtml(fields.privacyNote)}</p>
    <div class="actions">${submit('generate')}${button('example', actions.example, 'secondary')}${button('reset', actions.reset, 'secondary')}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(fields.previewTitle)}</h2><div data-work-order-preview></div><div class="actions">${button('downloadCsv', actions.downloadCsv, 'secondary')}${button('print', actions.print, 'secondary')}</div></section>
  </form>`, copy);

  if (toolId === 'chemical-equation-balancer') return attachCopy(`<form id="tool-form" novalidate>
    ${label('chemical-equation', fields.equation, '<textarea id="chemical-equation" name="equation" rows="3" maxlength="500" spellcheck="false" autocapitalize="off" autocomplete="off" required></textarea>')}
    <p class="hint">${escapeGrowthHtml(fields.formulaHint)}</p>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'gear-ratio-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('gear-drive-type', fields.driveType, `<select id="gear-drive-type" name="driveType"><option value="gears">${escapeGrowthHtml(fields.externalGears)}</option><option value="chain">${escapeGrowthHtml(fields.chainDrive)}</option></select>`)}
    ${label('gear-stages', fields.stages, '<textarea id="gear-stages" name="stages" rows="4" maxlength="180" spellcheck="false" autocapitalize="off" autocomplete="off" required></textarea>')}
    <p class="hint">${escapeGrowthHtml(fields.stagesHint)}</p>
    ${label('gear-input-rpm', fields.inputRpm, '<input id="gear-input-rpm" name="inputRpm" type="number" min="0.000001" max="1000000000" step="any" inputmode="decimal" required>')}
    ${label('gear-input-torque', fields.inputTorque, '<input id="gear-input-torque" name="inputTorque" type="number" min="0.000001" max="1000000000" step="any" inputmode="decimal">')}
    ${label('gear-efficiency', fields.efficiencyPercent, '<input id="gear-efficiency" name="efficiencyPercent" type="number" min="0.000001" max="100" step="any" inputmode="decimal">')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', labels.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div>${button('copy', labels.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'density-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('density-mode', fields.mode, `<select id="density-mode" name="mode"><option value="solve">${escapeGrowthHtml(fields.solveMode)}</option><option value="mix">${escapeGrowthHtml(fields.mixtureMode)}</option></select>`)}
    <div data-density-solve>
      ${label('density-mass-kg', fields.massKg, '<input id="density-mass-kg" name="massKg" type="number" min="0.000000000001" max="1000000000000" step="any" inputmode="decimal">')}
      ${label('density-volume-m3', fields.volumeM3, '<input id="density-volume-m3" name="volumeM3" type="number" min="0.000000000001" max="1000000000000" step="any" inputmode="decimal">')}
      ${label('density-kg-m3', fields.densityKgM3, '<input id="density-kg-m3" name="densityKgM3" type="number" min="0.000000000001" max="1000000000000" step="any" inputmode="decimal">')}
    </div>
    <div data-density-mixture hidden>
      ${label('density-components', fields.components, '<textarea id="density-components" name="components" rows="5" maxlength="1200" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>')}
      <p class="hint">${escapeGrowthHtml(fields.componentsHint)}</p>
    </div>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', actions.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(actions.result)}</h2><div data-result-content></div>${button('copy', actions.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'compression-ratio-calculator') return attachCopy(`<form id="tool-form" novalidate>
    ${label('compression-unit', fields.unit, `<select id="compression-unit" name="unit"><option value="mm">${escapeGrowthHtml(fields.millimeters)}</option><option value="in">${escapeGrowthHtml(fields.inches)}</option></select>`)}
    ${label('compression-volume-unit', fields.volumeUnit, `<select id="compression-volume-unit" name="volumeUnit"><option value="cc">${escapeGrowthHtml(fields.cubicCentimeters)}</option><option value="in3">${escapeGrowthHtml(fields.cubicInches)}</option></select>`)}
    ${label('compression-bore', fields.bore, '<input id="compression-bore" name="bore" type="number" min="0.000001" max="10000" step="any" inputmode="decimal" required>')}
    ${label('compression-stroke', fields.stroke, '<input id="compression-stroke" name="stroke" type="number" min="0.000001" max="10000" step="any" inputmode="decimal" required>')}
    ${label('compression-chamber', fields.chamberVolume, '<input id="compression-chamber" name="chamberVolume" type="number" min="0.000001" max="1000000000" step="any" inputmode="decimal" required>')}
    ${label('compression-gasket-bore', fields.gasketBore, '<input id="compression-gasket-bore" name="gasketBore" type="number" min="0.000001" max="10000" step="any" inputmode="decimal">')}
    ${label('compression-gasket-thickness', fields.gasketThickness, '<input id="compression-gasket-thickness" name="gasketThickness" type="number" min="0" max="10000" step="any" inputmode="decimal">')}
    ${label('compression-deck-clearance', fields.deckClearance, '<input id="compression-deck-clearance" name="deckClearance" type="number" min="-10000" max="10000" step="any" inputmode="decimal">')}
    ${label('compression-piston-crown', fields.pistonCrownVolume, '<input id="compression-piston-crown" name="pistonCrownVolume" type="number" min="-1000000000" max="1000000000" step="any" inputmode="decimal">')}
    ${label('compression-cylinders', fields.cylinders, '<input id="compression-cylinders" name="cylinders" type="number" min="1" max="16" step="1" value="1" inputmode="numeric">')}
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <div class="actions">${button('example', actions.example, 'secondary')}${submit('calculate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(actions.result)}</h2><div data-result-content></div>${button('copy', actions.copy, 'secondary')}</section>
  </form>`, copy);

  if (toolId === 'goal-planner') return attachCopy(`<form id="tool-form" novalidate>
    ${label('goal-title', fields.title, '<input id="goal-title" name="title" type="text" maxlength="120" autocomplete="off" required>')}
    ${label('goal-outcome', fields.outcome, '<textarea id="goal-outcome" name="outcome" rows="2" maxlength="240" required></textarea>')}
    ${label('goal-metric', fields.metric, '<input id="goal-metric" name="metric" type="text" maxlength="100" required>')}
    ${label('goal-unit', fields.unit, '<input id="goal-unit" name="unit" type="text" maxlength="30" autocomplete="off">')}
    <div class="calculator-grid">
      ${label('goal-start-value', fields.startValue, '<input id="goal-start-value" name="startValue" type="number" step="any" required>')}
      ${label('goal-target-value', fields.targetValue, '<input id="goal-target-value" name="targetValue" type="number" step="any" required>')}
      ${label('goal-current-value', fields.currentValue, '<input id="goal-current-value" name="currentValue" type="number" step="any" required>')}
    </div>
    <div class="calculator-grid">
      ${label('goal-start-date', fields.startDate, '<input id="goal-start-date" name="startDate" type="date" required>')}
      ${label('goal-current-date', fields.currentDate, '<input id="goal-current-date" name="currentDate" type="date" required>')}
      ${label('goal-due-date', fields.dueDate, '<input id="goal-due-date" name="dueDate" type="date" required>')}
    </div>
    ${label('goal-milestones', fields.milestones, '<textarea id="goal-milestones" name="milestones" rows="5" maxlength="9000" spellcheck="false"></textarea>')}
    <p class="hint">${escapeGrowthHtml(fields.milestoneHint)}</p>
    ${label('goal-backup-file', fields.backupFile, '<input id="goal-backup-file" name="backupFile" type="file" accept=".json,application/json">')}
    <p class="hint">${escapeGrowthHtml(fields.backupHint)}</p>
    <p class="hint">${escapeGrowthHtml(fields.accuracyNote)}</p>
    <p class="hint">${escapeGrowthHtml(fields.privacyNote)}</p>
    <div class="actions">${button('example', actions.example, 'secondary')}${submit('generate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(actions.result)}</h2><p data-summary></p><progress max="100" value="0" data-progress-bar aria-label="${escapeGrowthHtml(fields.progressLabel)}"></progress><p data-progress-copy></p><h3>${escapeGrowthHtml(fields.milestonesLabel)}</h3><ul data-milestones></ul><div class="actions"><button type="button" data-action="update-progress" class="button button--primary">${escapeGrowthHtml(actions.updateProgress)}</button><button type="button" data-action="copy" class="button button--secondary">${escapeGrowthHtml(actions.copy)}</button><button type="button" data-action="download" class="button button--secondary">${escapeGrowthHtml(actions.download)}</button></div></section>
  </form>`, copy);

  if (toolId === 'mind-map-maker') return attachCopy(`<form id="tool-form" novalidate>
    ${label('mind-map-topic', fields.centralTopic, '<input id="mind-map-topic" name="centralTopic" type="text" maxlength="160" required>')}
    <div class="actions">${button('example', actions.example, 'secondary')}${submit('generate')}${reset}</div>
    <p class="status" role="status" aria-live="polite" data-status></p>
    <section class="result" data-result hidden aria-live="polite"><h2>${escapeGrowthHtml(actions.result)}</h2>
      <p class="hint">${escapeGrowthHtml(fields.privacyNote)}</p>
      <div class="actions"><button type="button" data-action="undo" class="button button--secondary">${escapeGrowthHtml(actions.undo)}</button><button type="button" data-action="redo" class="button button--secondary">${escapeGrowthHtml(actions.redo)}</button><button type="button" data-action="export-svg" class="button button--secondary">${escapeGrowthHtml(actions.exportSvg)}</button><button type="button" data-action="export-json" class="button button--secondary">${escapeGrowthHtml(actions.exportJson)}</button></div>
      ${label('mind-map-new-idea', fields.newIdea, '<input id="mind-map-new-idea" name="newIdea" type="text" maxlength="160" autocomplete="off">')}
      <ul data-mind-map aria-label="${escapeGrowthHtml(fields.mapLabel)}"></ul>
      <label for="mind-map-import">${escapeGrowthHtml(actions.importJson)}</label><input id="mind-map-import" name="jsonFile" type="file" accept=".json,application/json"><p class="hint">${escapeGrowthHtml(fields.importHint)}</p>
    </section>
  </form>`, copy);

  if (toolId === 'mood-tracker') {
    const moodOptions = [1, 2, 3, 4, 5].map((score) => `<option value="${score}">${escapeGrowthHtml(fields[`mood${score}`])}</option>`).join('');
    const tagKeys = ['Calm', 'Anxious', 'Sad', 'Happy', 'Tired', 'Focused', 'Stressed', 'Hopeful', 'Grateful', 'Angry'];
    const tags = tagKeys.map((tag) => `<label class="choice"><input type="checkbox" name="tags" value="${tag.toLowerCase()}" data-mood-tag><span>${escapeGrowthHtml(fields[`tag${tag}`])}</span></label>`).join('');
    const weekdays = ['weekdaySun', 'weekdayMon', 'weekdayTue', 'weekdayWed', 'weekdayThu', 'weekdayFri', 'weekdaySat'].map((key) => `<th scope="col">${escapeGrowthHtml(fields[key])}</th>`).join('');
    return attachCopy(`<form id="tool-form" novalidate>
      <div class="calculator-grid">
        ${label('mood-date', fields.date, '<input id="mood-date" name="date" type="date" required>')}
        ${label('mood-score', fields.mood, `<select id="mood-score" name="mood">${moodOptions}</select>`)}
      </div>
      <fieldset><legend>${escapeGrowthHtml(fields.tags)}</legend><div class="calculator-grid">${tags}</div></fieldset>
      ${label('mood-note', fields.note, '<textarea id="mood-note" name="note" rows="3" maxlength="500"></textarea>')}
      <label class="choice" for="mood-save-consent"><input id="mood-save-consent" name="saveConsent" type="checkbox"><span>${escapeGrowthHtml(fields.saveConsent)}</span></label>
      <p class="hint">${escapeGrowthHtml(fields.consentHint)} ${escapeGrowthHtml(fields.privacyNote)}</p>
      <p class="hint">${escapeGrowthHtml(fields.accuracyNote)} ${escapeGrowthHtml(fields.sourceNote)}</p>
      <div class="actions">${button('example', actions.example, 'secondary')}<button type="submit" data-action="record" class="button button--primary">${escapeGrowthHtml(actions.saveEntry)}</button><button type="reset" data-action="reset" class="button button--secondary">${escapeGrowthHtml(actions.reset)}</button></div>
      <p class="status" role="status" aria-live="polite" data-status></p>
      <section class="result" data-result hidden><h2>${escapeGrowthHtml(actions.result)}</h2>
        <section aria-labelledby="mood-calendar-heading"><h3 id="mood-calendar-heading">${escapeGrowthHtml(fields.calendarLabel)}</h3>
          <div class="actions"><button type="button" data-action="previous-month" class="button button--secondary">${escapeGrowthHtml(actions.previousMonth)}</button><p data-calendar-month aria-live="polite"></p><button type="button" data-action="next-month" class="button button--secondary">${escapeGrowthHtml(actions.nextMonth)}</button></div>
          <table class="mood-calendar" data-calendar aria-label="${escapeGrowthHtml(fields.calendarLabel)}"><thead><tr>${weekdays}</tr></thead><tbody></tbody></table>
        </section>
        <section aria-labelledby="mood-summary-heading"><h3 id="mood-summary-heading">${escapeGrowthHtml(fields.summaryLabel)}</h3><div data-summary></div><h4>${escapeGrowthHtml(fields.distributionLabel)}</h4><ul data-distribution></ul></section>
        <section aria-labelledby="mood-selected-heading"><h3 id="mood-selected-heading">${escapeGrowthHtml(fields.selectedEntry)}</h3><div data-selected-entry></div><button type="button" data-action="delete-entry" class="button button--secondary">${escapeGrowthHtml(actions.removeEntry)}</button></section>
        <div class="actions"><button type="button" data-action="export" class="button button--secondary">${escapeGrowthHtml(actions.export)}</button><button type="button" data-action="clear-history" class="button button--secondary">${escapeGrowthHtml(actions.clearHistory)}</button></div>
        ${label('mood-backup-file', actions.import, '<input id="mood-backup-file" name="backupFile" type="file" accept=".json,application/json">')}<p class="hint">${escapeGrowthHtml(fields.importHint)}</p>
      </section>
    </form>`, copy);
  }

  if (toolId === 'journal-online') {
    return attachCopy(`<form id="tool-form" novalidate>
      <div class="calculator-grid">
        ${label('journal-date', fields.date, '<input id="journal-date" name="date" type="date" required>')}
        ${label('journal-title', fields.title, '<input id="journal-title" name="title" type="text" maxlength="160" required>')}
      </div>
      ${label('journal-tags', fields.tags, '<input id="journal-tags" name="tags" type="text" maxlength="400" autocomplete="off">')}<p class="hint">${escapeGrowthHtml(fields.tagHint)}</p>
      ${label('journal-body', fields.body, '<textarea id="journal-body" name="body" rows="8" maxlength="8000" required></textarea>')}
      <label class="choice" for="journal-save-consent"><input id="journal-save-consent" name="saveConsent" type="checkbox"><span>${escapeGrowthHtml(fields.saveConsent)}</span></label>
      <p class="hint">${escapeGrowthHtml(fields.storageNote)}</p>
      <p class="hint">${escapeGrowthHtml(fields.encryptionNote)}</p>
      ${label('journal-backup-password', fields.backupPassword, '<input id="journal-backup-password" name="backupPassword" type="password" minlength="12" maxlength="256" autocomplete="new-password">')}
      ${label('journal-backup-confirm', fields.confirmPassword, '<input id="journal-backup-confirm" name="confirmPassword" type="password" minlength="12" maxlength="256" autocomplete="new-password">')}
      <p class="hint">${escapeGrowthHtml(fields.passwordHint)}</p>
      <div class="actions">${button('example', actions.example, 'secondary')}<button type="submit" data-action="record" class="button button--primary">${escapeGrowthHtml(actions.saveEntry)}</button><button type="button" data-action="new-entry" class="button button--secondary">${escapeGrowthHtml(actions.newEntry)}</button>${button('reset', actions.reset, 'secondary')}</div>
      <p class="status" role="status" aria-live="polite" data-status></p>
      <section class="result" data-result><h2>${escapeGrowthHtml(actions.result)}</h2>
        <p class="hint">${escapeGrowthHtml(fields.safetyNote)}</p>
        <div class="calculator-grid">
          ${label('journal-search', fields.search, '<input id="journal-search" name="search" type="search" maxlength="200">')}
          ${label('journal-from', fields.dateFrom, '<input id="journal-from" name="dateFrom" type="date">')}
          ${label('journal-to', fields.dateTo, '<input id="journal-to" name="dateTo" type="date">')}
        </div>
        <div class="actions"><button type="button" data-action="search" class="button button--secondary">${escapeGrowthHtml(actions.search)}</button><button type="button" data-action="clear-search" class="button button--secondary">${escapeGrowthHtml(actions.clearSearch)}</button></div>
        <section aria-labelledby="journal-entries-heading"><h3 id="journal-entries-heading">${escapeGrowthHtml(fields.entriesLabel)} (<span data-entry-count>0</span>)</h3><ul data-journal-list></ul><p data-empty hidden>${escapeGrowthHtml(fields.noEntries)}</p></section>
        <section aria-labelledby="journal-selected-heading"><h3 id="journal-selected-heading">${escapeGrowthHtml(fields.resultLabel)}</h3><article data-selected-entry></article></section>
        <div class="actions"><button type="button" data-action="delete-entry" class="button button--secondary">${escapeGrowthHtml(actions.deleteEntry)}</button><button type="button" data-action="clear-all" class="button button--secondary">${escapeGrowthHtml(actions.clearAll)}</button><button type="button" data-action="export-json" class="button button--secondary">${escapeGrowthHtml(actions.exportJson)}</button><button type="button" data-action="save-backup" class="button button--secondary">${escapeGrowthHtml(actions.saveBackup)}</button></div>
        ${label('journal-import-file', actions.importJson, '<input id="journal-import-file" name="backupFile" type="file" accept=".json,application/json">')}<p class="hint">${escapeGrowthHtml(fields.importHint)}</p>
      </section>
    </form>`, copy);
  }

  if (toolId === 'travel-itinerary-planner') {
    const categoryOptions = ['activity', 'meal', 'transport', 'stay', 'reservation', 'other'].map((category) => `<option value="${category}">${escapeGrowthHtml(fields.categories[category])}</option>`).join('');
    return attachCopy(`<form id="tool-form" novalidate>
      <section aria-labelledby="trip-details-heading"><h3 id="trip-details-heading">${escapeGrowthHtml(actions.createTrip)}</h3>
        <div class="calculator-grid">
          ${label('trip-name', fields.tripName, '<input id="trip-name" name="tripName" type="text" maxlength="140" required>')}
          ${label('trip-start-date', fields.tripStartDate, '<input id="trip-start-date" name="tripStartDate" type="date" required>')}
          ${label('trip-end-date', fields.tripEndDate, '<input id="trip-end-date" name="tripEndDate" type="date" required>')}
          ${label('trip-buffer', fields.bufferMinutes, '<input id="trip-buffer" name="bufferMinutes" type="number" min="0" max="240" step="1" value="0" required>')}
        </div>
        <p class="hint">${escapeGrowthHtml(fields.limitNote)} ${escapeGrowthHtml(fields.timeZoneNote)}</p>
        <button type="button" data-action="create-trip" class="button button--primary">${escapeGrowthHtml(actions.createTrip)}</button>
      </section>
      <section aria-labelledby="itinerary-item-heading"><h3 id="itinerary-item-heading">${escapeGrowthHtml(fields.itemTitle)}</h3>
        <div class="calculator-grid">
          ${label('item-date', fields.itemDate, '<input id="item-date" name="itemDate" type="date" required>')}
          ${label('item-start-time', fields.startTime, '<input id="item-start-time" name="startTime" type="time" required>')}
          ${label('item-end-time', fields.endTime, '<input id="item-end-time" name="endTime" type="time" required>')}
          ${label('item-title', fields.itemTitle, '<input id="item-title" name="itemTitle" type="text" maxlength="140" required>')}
          ${label('item-category', fields.category, `<select id="item-category" name="category">${categoryOptions}</select>`)}
          ${label('item-location', fields.location, '<input id="item-location" name="location" type="text" maxlength="180">')}
          ${label('item-reservation', fields.reservation, '<input id="item-reservation" name="reservation" type="text" maxlength="180">')}
        </div>
        ${label('item-notes', fields.notes, '<textarea id="item-notes" name="notes" rows="3" maxlength="2000"></textarea>')}
        <p class="hint">${escapeGrowthHtml(fields.reservationPrivacyNote)}</p>
        <div class="actions">${button('example', actions.example, 'secondary')}<button type="submit" data-action="save-item" class="button button--primary">${escapeGrowthHtml(actions.saveItem)}</button><button type="button" data-action="new-item" class="button button--secondary">${escapeGrowthHtml(actions.newItem)}</button>${button('reset', actions.reset, 'secondary')}<button type="button" data-action="delete-item" class="button button--secondary" disabled>${escapeGrowthHtml(actions.deleteItem)}</button></div>
      </section>
      <label class="choice" for="itinerary-save-consent"><input id="itinerary-save-consent" name="saveConsent" type="checkbox"><span>${escapeGrowthHtml(fields.saveConsent)}</span></label>
      <p class="hint">${escapeGrowthHtml(fields.storageNote)}</p>
      <p class="status" role="status" aria-live="polite" data-status></p>
      <section class="result" data-result><h2>${escapeGrowthHtml(actions.result)}</h2>
        <p data-trip-summary>${escapeGrowthHtml(fields.noTrip)}</p>
        <p>${escapeGrowthHtml(fields.itemCount)}: <span data-item-count>0</span> · ${escapeGrowthHtml(fields.overlapCount)}: <span data-overlap-count>0</span> · ${escapeGrowthHtml(fields.bufferWarningCount)}: <span data-buffer-count>0</span></p>
        <ul data-itinerary-list></ul><p data-empty>${escapeGrowthHtml(fields.noItems)}</p>
        <section aria-labelledby="itinerary-conflicts-heading"><h3 id="itinerary-conflicts-heading">${escapeGrowthHtml(fields.conflictsLabel)}</h3><ul data-conflict-list></ul></section>
        <div class="actions"><button type="button" data-action="export-ics" class="button button--primary">${escapeGrowthHtml(actions.exportIcs)}</button><button type="button" data-action="export-json" class="button button--secondary">${escapeGrowthHtml(actions.exportJson)}</button><button type="button" data-action="print" class="button button--secondary">${escapeGrowthHtml(actions.print)}</button><button type="button" data-action="delete-trip" class="button button--secondary">${escapeGrowthHtml(actions.deleteTrip)}</button></div>
        ${label('itinerary-backup-file', actions.importJson, '<input id="itinerary-backup-file" name="backupFile" type="file" accept=".json,application/json">')}<p class="hint">${escapeGrowthHtml(fields.backupHint)}</p>
      </section>
    </form>`, copy);
  }

  return attachCopy(`<section class="game" aria-label="${escapeGrowthHtml(copy.name)}"><div class="game-toolbar"><label for="mancala-mode">${escapeGrowthHtml(fields.mode)}</label><select id="mancala-mode" data-mode><option value="computer">${escapeGrowthHtml(labels.computer)}</option><option value="two-player">${escapeGrowthHtml(labels.twoPlayers)}</option></select>${button('new-game', labels.newGame, 'primary')}</div><p class="status" role="status" aria-live="polite" data-status></p><div class="mancala-board" data-board aria-label="${escapeGrowthHtml(fields.board)}"></div><section class="result" data-result hidden><h2>${escapeGrowthHtml(labels.result)}</h2><div data-result-content></div></section><details class="rules"><summary>${escapeGrowthHtml(labels.rules)}</summary><p>${escapeGrowthHtml(fields.rules ?? '')}</p></details></section>`, copy);
}
