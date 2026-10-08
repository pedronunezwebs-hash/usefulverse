export const REQUIRED_GROWTH_COPY = Object.freeze(['name', 'title', 'description', 'intro', 'howQuestion', 'howAnswer', 'privacyQuestion', 'privacyAnswer']);
export const REQUIRED_GROWTH_HOME_COPY = Object.freeze(['title', 'description', 'intro', 'directoryLabel', 'freeLabel', 'footerFree', 'skipToTool', 'home', 'languageLabel', 'breadcrumbLabel', 'faqLabel']);
export const REQUIRED_TOOL_MESSAGES = Object.freeze({
  'image-color-picker': ['unsupportedImage', 'imageTooLarge', 'imageReady', 'selectImage', 'pixelSelected', 'sampleAdded', 'paletteFull', 'copiedColor', 'copiedPalette', 'copyUnavailable', 'paletteCleared'],
  'image-region-redactor': ['unsupportedImage', 'imageTooLarge', 'imageReady', 'selectImage', 'invalidRegion', 'regionAdded', 'regionRemoved', 'regionsCleared', 'addRegionFirst', 'exporting', 'exportFailed', 'exportReady', 'region'],
  'image-sharpener': ['unsupportedImage', 'imageTooLarge', 'imageReady', 'selectImage', 'exporting', 'exportFailed', 'exportReady'],
  'image-upscaler': ['unsupportedImage', 'imageTooLarge', 'imageReady', 'selectImage', 'modelLoading', 'processing', 'cancelled', 'workerUnavailable', 'processingFailed', 'outputReady'],
  'wallpaper-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'netArea', 'strips', 'dropLength', 'dropsPerRoll', 'stripsToOrder', 'rolls'],
  'pool-salt-calculator': ['copied', 'copyUnavailable', 'calculated', 'noSaltNeeded', 'checkInputs', 'poolVolume', 'currentSalinity', 'targetSalinity', 'increase', 'pureSalt', 'saltToAdd', 'bags'],
  'fence-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'totalRun', 'gateOpening', 'fenceLength', 'sections', 'averageSection', 'posts', 'panels', 'pickets', 'picketGap', 'picketLength', 'extra', 'onePicket', 'panelCost', 'picketCost'],
  'deck-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'area', 'boardRows', 'coveredWidth', 'orderLength', 'boards', 'supportLines', 'fasteners', 'joints', 'estimatedCost', 'costNotEntered'],
  'roofing-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'projectedArea', 'roofArea', 'extraArea', 'pitch', 'slopeFactor', 'roofingSquares', 'bundles', 'estimatedCost', 'costNotEntered'],
  'drywall-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'wallArea', 'ceilingArea', 'totalArea', 'boardCount', 'boardCoverage', 'estimatedScrews', 'jointSeams', 'estimatedCost', 'costNotEntered'],
  'roof-pitch-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'angleDegrees', 'angleRadians', 'slopePercent', 'pitch', 'rafterLength'],
  'pool-volume-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'volume', 'liters', 'usGallons', 'imperialGallons', 'averageDepth'],
  'soil-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'volumePerContainer', 'totalVolume', 'orderVolume', 'bagsToBuy'],
  'gravel-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'area', 'volume', 'orderVolume', 'estimatedWeight', 'bagsToBuy'],
  'molar-mass-calculator': ['copied', 'copyUnavailable', 'calculated', 'invalidFormula', 'atomCount', 'molarMass'],
  'auto-loan-refinance-calculator': ['copied', 'copyUnavailable', 'estimateOnly', 'checkInputs', 'currentPayment', 'newPayment', 'paymentDifference', 'currentTotal', 'newTotal', 'estimatedDifference', 'breakEven', 'noBreakEven', 'monthCount'],
  'heloc-calculator': ['copied', 'copyUnavailable', 'checkInputs', 'estimateOnly', 'interestOnlyPayment', 'availableCredit', 'repaymentPayment', 'drawInterest', 'repaymentInterest', 'totalInterest', 'totalPayments', 'paymentChange'],
  'secret-santa-generator': ['copied', 'copyUnavailable', 'privatePair', 'allRevealed', 'drawReady', 'checkNamesAndRules', 'downloaded'],
  'tire-size-calculator': ['copied', 'copyUnavailable', 'calculated', 'sameSize', 'checkInputs', 'diameter', 'sidewall', 'circumference', 'revolutions', 'diameterDifference', 'diameterChange', 'groundClearance', 'actualSpeed'],
  'stair-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'riserHeight', 'treadCount', 'totalRun', 'angle', 'stringerLength', 'diagram'],
  'asphalt-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'compactedVolume', 'orderVolume', 'metricTonnes', 'shortTons', 'estimatedCost'],
  mancala: ['pit', 'seeds', 'playerOne', 'playerTwo', 'playerOneWins', 'playerTwoWins', 'tie', 'gameOver', 'turn'],
  'dominoes-game': ['playerOne', 'playerTwo', 'turn', 'played', 'drew', 'passed', 'noMoves', 'stockEmpty', 'playerOneWins', 'playerTwoWins', 'tie', 'gameOver'],
  'weight-loss-calculator': ['copied', 'copyUnavailable', 'checkInputs', 'estimateOnly', 'weightToLose', 'energyEquivalent', 'timeline', 'weeklyRate', 'noDeficitChange', 'paceNote'],
  'random-team-generator': ['copied', 'copyUnavailable', 'generated', 'checkInputs', 'invalidCount', 'duplicateName', 'invalidPair', 'unknownName', 'incompatible', 'searchLimit', 'downloadReady', 'seedUnavailable'],
  'mulch-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'bedArea', 'mulchDepth', 'volume', 'orderVolume', 'cubicYards', 'bags', 'estimatedCost', 'costNotEntered'],
  'paver-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'area', 'perimeter', 'moduleCount', 'paversBeforeWaste', 'paversToBuy', 'baseVolume', 'baseOrderVolume', 'paverCost', 'baseCost', 'totalCost', 'costNotEntered'],
  'solar-panel-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'panelCount', 'systemSize', 'dailyProduction', 'monthlyProduction', 'annualProduction', 'panelArea', 'annualSavings', 'simplePayback', 'paybackUnavailable'],
  'btu-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'roomArea', 'roomVolume', 'baseCapacity', 'ceilingAdjustment', 'insulationAdjustment', 'sunAdjustment', 'occupantAdjustment', 'kitchenAdjustment', 'capacity', 'tons', 'belowReferenceBand'],
  'brick-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'grossArea', 'netArea', 'courses', 'bricksPerCourse', 'bricksBeforeWaste', 'bricksToOrder', 'mortarVolume', 'mortarBags'],
  'rafter-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'effectiveRun', 'rafterLength', 'pitch', 'roofAngle', 'plumbCut', 'overhangRun'],
  'carpet-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'floorArea', 'pileDirection', 'cuts', 'seams', 'cutLength', 'orderLength', 'purchasedArea', 'alternative'],
  'aquarium-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'tankVolume', 'substrateDisplacement', 'airSpace', 'waterVolume', 'waterMassKg', 'waterMassLb'],
  'density-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'mass', 'volume', 'density', 'densityMetric', 'densityImperial', 'componentCount'],
  'compression-ratio-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'ratio', 'sweptVolume', 'clearanceVolume', 'totalDisplacement', 'boreStroke'],
  'polynomial-long-division-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'quotient', 'remainder', 'step', 'quotientTerm', 'subtract', 'newRemainder', 'exampleLoaded'],
  'half-life-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'calculatedValue', 'initialAmount', 'remainingAmount', 'halfLife', 'elapsedTime', 'remainingPercent', 'halfLivesElapsed', 'exampleLoaded'],
  'mortgage-points-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'exampleLoaded', 'pointCost', 'paymentWithoutPoints', 'paymentWithPoints', 'monthlyPaymentSavings', 'lifetimeInterestSavings', 'balanceWithoutPoints', 'balanceWithPoints', 'netBenefitAtHorizon', 'paymentOnlyBreakEven', 'netBreakEven', 'noBreakEven', 'noMonthlySavings'],
  'goal-planner': ['copied', 'copyUnavailable', 'generated', 'downloaded', 'importFailed', 'saved', 'storageUnavailable', 'checkInputs', 'current', 'day', 'days', 'remaining'],
  'mind-map-maker': ['created', 'updated', 'added', 'removed', 'imported', 'importFailed', 'checkTopic', 'checkIdea', 'enterIdea'],
  'mood-tracker': ['recorded', 'updated', 'removed', 'imported', 'importFailed', 'downloaded', 'saved', 'storageUnavailable', 'storageEnabled', 'storageDisabled', 'cleared', 'confirmClear', 'confirmClearSession', 'checkInputs', 'noEntry', 'current', 'mood', 'tags', 'note', 'count', 'average'],
  'journal-online': ['savedInTab', 'updatedInTab', 'deleted', 'allDeleted', 'allDeletedStorageFailed', 'backupTooLarge', 'imported', 'importFailed', 'importCancelled', 'exported', 'encryptedExported', 'localSaved', 'localSaveRemoved', 'storageFailed', 'searchUpdated', 'noSelection', 'passwordMismatch', 'passwordNeeded', 'encrypting', 'decrypting', 'confirmDelete', 'confirmClear', 'confirmImport', 'checkInputs', 'unsupportedCrypto', 'searchRange'],
  'travel-itinerary-planner': ['tripSaved', 'storageFailed', 'tripDeletedStorageFailed', 'checkTrip', 'createTripFirst', 'exampleLoaded', 'itemSaved', 'itemUpdated', 'checkItem', 'formCleared', 'itemDeleted', 'confirmDeleteTrip', 'tripDeleted', 'confirmRestore', 'localSaved', 'localRemoved', 'jsonDownloaded', 'icsDownloaded', 'backupTooLarge', 'noItemsToExport', 'exportFailed', 'confirmImport', 'importCancelled', 'imported', 'importFailed', 'overlap', 'shortConnection'],
});
export const REQUIRED_TOOL_FIELDS = Object.freeze({
  'image-color-picker': ['imageFile', 'accuracyNote', 'previewHint', 'zoom', 'currentColor', 'paletteLabel', 'relatedSharpener', 'relatedRedactor'],
  'image-region-redactor': ['imageFile', 'mode', 'strength', 'regionX', 'regionY', 'regionWidth', 'regionHeight', 'accuracyNote', 'dragHint', 'regionsLabel', 'format', 'relatedMosaic', 'relatedCropper'],
  'image-sharpener': ['imageFile', 'amount', 'radius', 'threshold', 'compare', 'accuracyNote', 'previewHint', 'format', 'relatedRedactor', 'relatedCropper'],
  'image-upscaler': ['imageFile', 'accuracyNote', 'progressHint', 'sourcePreview', 'resultPreview', 'relatedResizer', 'relatedSharpener'],
  'wallpaper-calculator': ['unit', 'perimeter', 'wallHeight', 'openingsArea', 'rollWidth', 'rollLength', 'patternRepeat', 'wastePercent', 'accuracyNote', 'relatedPaintCalculator'],
  'pool-salt-calculator': ['volume', 'volumeUnit', 'currentSalinityPpm', 'targetSalinityPpm', 'saltPurityPercent', 'bagSize', 'bagUnit', 'accuracyNote'],
  'fence-calculator': ['unit', 'length', 'gateCount', 'gateWidth', 'materialUnit', 'postSpacing', 'panelWidth', 'picketWidth', 'maxPicketGap', 'picketHeight', 'wastePercent', 'pricePerPost', 'pricePerGate', 'pricePerPanel', 'pricePerPicket', 'accuracyNote'],
  'deck-calculator': ['unit', 'length', 'width', 'boardUnit', 'boardWidth', 'gap', 'stockBoardLength', 'joistSpacing', 'wastePercent', 'fastenersPerIntersection', 'pricePerBoard', 'safetyNote'],
  'roofing-calculator': ['projectedArea', 'areaUnit', 'rise', 'run', 'pitchUnit', 'wastePercent', 'bundlesPerSquare', 'pricePerBundle', 'safetyNote'],
  'drywall-calculator': ['roomLength', 'roomWidth', 'wallHeight', 'openingArea', 'roomCount', 'unit', 'includeCeiling', 'boardWidth', 'boardHeight', 'wastePercent', 'screwsPerBoard', 'pricePerBoard', 'accuracyNote'],
  'roof-pitch-calculator': ['rise', 'run', 'overhang', 'unit', 'safetyNote'],
  'pool-volume-calculator': ['shape', 'length', 'width', 'diameter', 'floor', 'shallowDepth', 'deepDepth', 'dimensionUnit', 'accuracyNote'],
  'soil-calculator': ['shape', 'length', 'width', 'diameter', 'depth', 'dimensionUnit', 'containerCount', 'wastePercent', 'bagVolume', 'bagUnit', 'accuracyNote'],
  'gravel-calculator': ['shape', 'depth', 'length', 'width', 'diameter', 'base', 'triangleHeight', 'dimensionUnit', 'depthUnit', 'density', 'densityUnit', 'waste', 'bagSize', 'bagUnit'],
  'molar-mass-calculator': ['formula', 'supportedHint'],
  'auto-loan-refinance-calculator': ['balance', 'currentApr', 'currentMonths', 'newApr', 'newMonths', 'fees', 'feeTreatment', 'upfront', 'rolledIn', 'currencyNote'],
  'heloc-calculator': ['creditLimit', 'balance', 'annualApr', 'drawMonths', 'repaymentMonths', 'currency', 'accuracyNote', 'relatedLoanCalculator'],
  'secret-santa-generator': ['names', 'exclusions', 'exclusionsHint'],
  'tire-size-calculator': ['originalSize', 'replacementSize', 'indicatedSpeed', 'speedUnit', 'fitmentNote', 'relatedUnitConverter'],
  'stair-calculator': ['totalRise', 'riserCount', 'treadDepth', 'unit', 'codeNote', 'relatedUnitConverter'],
  'asphalt-calculator': ['area', 'areaUnit', 'compactedThickness', 'thicknessUnit', 'density', 'densityUnit', 'wastePercent', 'pricePerTonne', 'accuracyNote', 'relatedConcreteCalculator'],
  mancala: ['mode', 'board', 'rules'],
  'dominoes-game': ['mode', 'variant', 'board', 'stock', 'hand', 'opponentHand', 'accuracyNote', 'rules'],
  'weight-loss-calculator': ['currentWeight', 'targetWeight', 'dailyDeficit', 'unit', 'methodNote', 'healthNote', 'sourceNiddk', 'sourceCdc'],
  'random-team-generator': ['names', 'teamCount', 'separations', 'separationsHint', 'seed', 'seedHint', 'privacyNote', 'relatedNamePicker'],
  'mulch-calculator': ['shape', 'dimensionUnit', 'length', 'width', 'diameter', 'bedCount', 'depth', 'depthUnit', 'bagVolume', 'bagUnit', 'wastePercent', 'pricePerBag', 'currency', 'currencyNote', 'accuracyNote', 'relatedGravelCalculator', 'relatedSoilCalculator'],
  'paver-calculator': ['length', 'width', 'surfaceUnit', 'moduleLength', 'moduleWidth', 'moduleUnit', 'paversPerModule', 'paverWastePercent', 'baseDepth', 'baseDepthUnit', 'baseWastePercent', 'pricePerPaver', 'basePricePerM3', 'currency', 'unitsNote', 'accuracyNote', 'relatedTileCalculator', 'relatedGravelCalculator'],
  'solar-panel-calculator': ['mode', 'dailyTargetKwh', 'panelCount', 'panelWatts', 'peakSunHours', 'lossPercent', 'panelLengthM', 'panelWidthM', 'electricityRate', 'systemCost', 'currency', 'assumptionNote', 'accuracyNote'],
  'btu-calculator': ['length', 'width', 'ceilingHeight', 'dimensionUnit', 'insulationAdjustment', 'sunExposure', 'occupants', 'kitchen', 'accuracyNote'],
  'brick-calculator': ['wallLength', 'wallHeight', 'wallUnit', 'brickLength', 'brickHeight', 'brickDepth', 'brickUnit', 'joint', 'jointUnit', 'openingWidth', 'openingHeight', 'openingCount', 'wythes', 'wastePercent', 'bagYieldLiters', 'accuracyNote'],
  'rafter-calculator': ['unit', 'mode', 'span', 'rise', 'pitch', 'ridgeThickness', 'ridgeUnit', 'overhang', 'diagramLabel', 'accuracyNote'],
  'carpet-calculator': ['unit', 'roomLength', 'roomWidth', 'rollWidth', 'rooms', 'pileDirection', 'wastePercent', 'accuracyNote'],
  'aquarium-calculator': ['length', 'width', 'height', 'dimensionUnit', 'substrateDepth', 'substrateSolidPercent', 'airGap', 'accuracyNote'],
  'density-calculator': ['mode', 'solveMode', 'mixtureMode', 'massKg', 'volumeM3', 'densityKgM3', 'components', 'componentsHint', 'accuracyNote'],
  'compression-ratio-calculator': ['unit', 'volumeUnit', 'millimeters', 'inches', 'cubicCentimeters', 'cubicInches', 'bore', 'stroke', 'chamberVolume', 'gasketBore', 'gasketThickness', 'deckClearance', 'pistonCrownVolume', 'cylinders', 'accuracyNote'],
  'polynomial-long-division-calculator': ['dividend', 'divisor', 'accuracyNote'],
  'half-life-calculator': ['mode', 'solveRemaining', 'solveInitial', 'solveElapsed', 'solveHalfLife', 'initialAmount', 'remainingAmount', 'halfLife', 'elapsedTime', 'timeUnit', 'seconds', 'minutes', 'hours', 'days', 'years', 'accuracyNote'],
  'mortgage-points-calculator': ['principal', 'termMonths', 'rateWithoutPoints', 'rateWithPoints', 'pointsPercent', 'horizonMonths', 'monthsLabel', 'accuracyNote'],
  'goal-planner': ['title', 'outcome', 'metric', 'unit', 'startValue', 'targetValue', 'currentValue', 'startDate', 'currentDate', 'dueDate', 'milestones', 'milestoneHint', 'accuracyNote', 'privacyNote', 'progressLabel', 'milestonesLabel', 'backupFile', 'backupHint', 'relatedTaskList'],
  'mind-map-maker': ['centralTopic', 'newIdea', 'privacyNote', 'mapLabel', 'editIdea', 'moveTo', 'jsonFile', 'importHint'],
  'mood-tracker': ['date', 'mood', 'note', 'tags', 'saveConsent', 'privacyNote', 'consentHint', 'calendarLabel', 'monthLabel', 'selectedEntry', 'weekdaySun', 'weekdayMon', 'weekdayTue', 'weekdayWed', 'weekdayThu', 'weekdayFri', 'weekdaySat', 'mood1', 'mood2', 'mood3', 'mood4', 'mood5', 'tagCalm', 'tagAnxious', 'tagSad', 'tagHappy', 'tagTired', 'tagFocused', 'tagStressed', 'tagHopeful', 'tagGrateful', 'tagAngry', 'summaryLabel', 'averageLabel', 'countLabel', 'distributionLabel', 'noEntries', 'accuracyNote', 'importHint', 'sourceNote'],
  'journal-online': ['date', 'title', 'body', 'tags', 'search', 'dateFrom', 'dateTo', 'saveConsent', 'storageNote', 'encryptionNote', 'backupPassword', 'confirmPassword', 'entriesLabel', 'resultLabel', 'noEntries', 'countLabel', 'tagHint', 'importHint', 'passwordHint', 'exampleHint', 'exampleTitle', 'exampleBody', 'exampleTags', 'safetyNote'],
  'travel-itinerary-planner': ['tripName', 'tripStartDate', 'tripEndDate', 'bufferMinutes', 'saveConsent', 'storageNote', 'itemDate', 'startTime', 'endTime', 'itemTitle', 'category', 'location', 'reservation', 'notes', 'itineraryLabel', 'noTrip', 'noItems', 'itemCount', 'overlapCount', 'bufferWarningCount', 'conflictsLabel', 'backupFile', 'backupHint', 'limitNote', 'timeZoneNote', 'reservationPrivacyNote', 'exampleTrip', 'exampleActivity', 'exampleMeal', 'exampleLocation', 'exampleReservation'],
});
export const REQUIRED_TOOL_ACTIONS = Object.freeze({
  'image-color-picker': ['load', 'addSample', 'copyColor', 'copyPalette', 'remove', 'clear', 'reset'],
  'image-region-redactor': ['load', 'addRegion', 'undo', 'clear', 'export', 'example', 'download', 'removeRegion', 'black', 'pixelate', 'blur', 'png', 'jpeg'],
  'image-sharpener': ['load', 'export', 'download', 'original', 'sharpened', 'png', 'jpeg', 'reset'],
  'image-upscaler': ['upscale', 'cancel', 'download', 'reset'],
  'goal-planner': ['generate', 'reset', 'example', 'result', 'copy', 'download', 'updateProgress'],
  'mind-map-maker': ['generate', 'reset', 'example', 'result', 'addChild', 'removeNode', 'moveUp', 'moveDown', 'moveNode', 'collapse', 'expand', 'undo', 'redo', 'exportSvg', 'exportJson', 'importJson'],
  'mood-tracker': ['saveEntry', 'updateEntry', 'example', 'reset', 'removeEntry', 'clearHistory', 'previousMonth', 'nextMonth', 'export', 'import', 'result'],
  'journal-online': ['saveEntry', 'updateEntry', 'newEntry', 'example', 'reset', 'search', 'clearSearch', 'deleteEntry', 'clearAll', 'exportJson', 'importJson', 'saveBackup', 'result'],
  'travel-itinerary-planner': ['createTrip', 'saveItem', 'updateItem', 'newItem', 'deleteItem', 'deleteTrip', 'example', 'reset', 'exportIcs', 'exportJson', 'importJson', 'print', 'result'],
  'polynomial-long-division-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
  'half-life-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
  'mortgage-points-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
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
  'heloc-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
  'secret-santa-generator': ['generate', 'reset', 'copy', 'download', 'result', 'reveal', 'next', 'privacyNote'],
  'tire-size-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'kmh', 'mph'],
  'stair-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'centimeters', 'feet', 'inches'],
  'asphalt-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
  mancala: ['newGame', 'rules', 'result', 'computer', 'twoPlayers'],
  'dominoes-game': ['newGame', 'draw', 'pass', 'playLeft', 'playRight', 'computer', 'twoPlayers', 'drawRule', 'blockRule', 'rules', 'result'],
  'weight-loss-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'kilograms', 'pounds', 'dayUnit', 'weekUnit', 'kilocalories', 'perWeek'],
  'random-team-generator': ['generateTeams', 'reset', 'example', 'copy', 'download', 'result', 'team', 'participant', 'seedLabel'],
  'mulch-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'rectangle', 'circle', 'meters', 'feet', 'centimeters', 'millimeters', 'inches', 'liters', 'cubicFeet', 'squareMeters', 'squareFeet'],
  'paver-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'feet', 'centimeters', 'inches', 'millimeters', 'squareMeters', 'squareFeet'],
  'solar-panel-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'productionMode', 'sizingMode', 'years'],
  'btu-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'feet', 'meters', 'inches', 'shaded', 'typical', 'sunny', 'no', 'yes'],
  'brick-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'feet', 'centimeters', 'inches'],
  'rafter-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'feet', 'centimeters', 'inches', 'riseMode', 'pitchMode'],
  'carpet-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'feet', 'eitherDirection', 'alongRoomLength', 'alongRoomWidth'],
  'aquarium-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'centimeters', 'feet', 'inches', 'liters', 'usGallons', 'imperialGallons'],
});
const MESSAGE_PLACEHOLDERS = Object.freeze({ monthCount: ['{count}'], privatePair: ['{giver}', '{recipient}'], turn: ['{player}'], overlap: ['{first}', '{second}', '{minutes}'], shortConnection: ['{first}', '{second}', '{minutes}', '{needed}'] });

export function assertGrowthLocaleCoverage(tools, localeEntries, copyByLocale, { titleMax = 60, descriptionMax = 160 } = {}) {
  const errors = [];
  for (const locale of localeEntries) {
    const languageCopy = copyByLocale?.[locale.key];
    if (!languageCopy) { errors.push(`${locale.key}: locale copy is missing`); continue; }
    const home = languageCopy._home;
    for (const key of REQUIRED_GROWTH_HOME_COPY) {
      if (typeof home?.[key] !== 'string' || !home[key].trim()) errors.push(`${locale.key}/home: ${key} is missing`);
    }
    if (home?.copyLanguage !== locale.key) errors.push(`${locale.key}/home: copy language does not match its route`);
    if (typeof home?.title === 'string' && home.title.length > titleMax) errors.push(`${locale.key}/home: title is ${home.title.length} characters (max ${titleMax})`);
    if (typeof home?.description === 'string' && home.description.length > descriptionMax) errors.push(`${locale.key}/home: description is ${home.description.length} characters (max ${descriptionMax})`);
    for (const tool of tools) {
      const copy = languageCopy[tool.id];
      if (!copy) { errors.push(`${locale.key}/${tool.id}: translation is missing`); continue; }
      if (copy.localizationStatus && copy.localizationStatus !== 'approved') errors.push(`${locale.key}/${tool.id}: localization is not approved for release`);
      for (const key of REQUIRED_GROWTH_COPY) {
        if (typeof copy[key] !== 'string' || !copy[key].trim()) errors.push(`${locale.key}/${tool.id}: ${key} is missing`);
      }
      for (const key of REQUIRED_TOOL_FIELDS[tool.id] ?? []) {
        if (typeof copy.fields?.[key] !== 'string' || !copy.fields[key].trim()) errors.push(`${locale.key}/${tool.id}: fields.${key} is missing`);
      }
      if (tool.id === 'travel-itinerary-planner' && ['activity', 'meal', 'transport', 'stay', 'reservation', 'other'].some((key) => typeof copy.fields?.categories?.[key] !== 'string' || !copy.fields.categories[key].trim())) errors.push(`${locale.key}/${tool.id}: all six category labels are required`);
      for (const key of REQUIRED_TOOL_ACTIONS[tool.id] ?? []) {
        if (typeof copy.actions?.[key] !== 'string' || !copy.actions[key].trim()) errors.push(`${locale.key}/${tool.id}: actions.${key} is missing`);
      }
      for (const key of REQUIRED_TOOL_MESSAGES[tool.id] ?? []) {
        if (typeof copy.messages?.[key] !== 'string' || !copy.messages[key].trim()) errors.push(`${locale.key}/${tool.id}: messages.${key} is missing`);
        for (const token of MESSAGE_PLACEHOLDERS[key] ?? []) {
          if (typeof copy.messages?.[key] === 'string' && !copy.messages[key].includes(token)) errors.push(`${locale.key}/${tool.id}: messages.${key} must preserve ${token}`);
        }
      }
      if (['deck-calculator', 'roofing-calculator', 'drywall-calculator', 'roof-pitch-calculator', 'pool-volume-calculator', 'soil-calculator', 'tire-size-calculator', 'stair-calculator', 'asphalt-calculator', 'wallpaper-calculator', 'mulch-calculator', 'paver-calculator', 'solar-panel-calculator', 'btu-calculator', 'brick-calculator', 'rafter-calculator', 'carpet-calculator', 'aquarium-calculator', 'image-region-redactor', 'image-sharpener', 'image-upscaler', 'image-color-picker', 'dominoes-game', 'weight-loss-calculator', 'heloc-calculator', 'random-team-generator', 'mood-tracker', 'journal-online', 'travel-itinerary-planner'].includes(tool.id)
        && (!Array.isArray(copy.additionalFaqs) || copy.additionalFaqs.length !== 2
          || copy.additionalFaqs.some((faq) => !faq.question?.trim() || !faq.answer?.trim()))) {
        errors.push(`${locale.key}/${tool.id}: two complete localized tool FAQs are required`);
      }
      if (typeof copy.title === 'string' && copy.title.length > titleMax) errors.push(`${locale.key}/${tool.id}: title is ${copy.title.length} characters (max ${titleMax})`);
      if (typeof copy.description === 'string' && copy.description.length > descriptionMax) errors.push(`${locale.key}/${tool.id}: description is ${copy.description.length} characters (max ${descriptionMax})`);
      if (copy.title?.includes('UsefulVerse') === false) errors.push(`${locale.key}/${tool.id}: title must include the brand suffix`);
      if (copy.copyLanguage !== locale.key) errors.push(`${locale.key}/${tool.id}: copy language does not match its route`);
    }
  }
  if (errors.length) throw new Error(`Growth locale release gate failed:\n${errors.map((error) => `- ${error}`).join('\n')}`);
  return true;
}
