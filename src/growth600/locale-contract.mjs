export const REQUIRED_GROWTH_COPY = Object.freeze(['name', 'title', 'description', 'intro', 'howQuestion', 'howAnswer', 'privacyQuestion', 'privacyAnswer']);
export const REQUIRED_GROWTH_HOME_COPY = Object.freeze(['title', 'description', 'intro', 'directoryLabel', 'freeLabel', 'footerFree', 'skipToTool', 'home', 'languageLabel', 'breadcrumbLabel', 'faqLabel']);
export const REQUIRED_TOOL_MESSAGES = Object.freeze({
  'effective-interest-rate-calculator': ['copied', 'copyUnavailable', 'calculated', 'exampleLoaded', 'checkInputs', 'apr', 'apy', 'periodicRate', 'formula', 'compounding'],
  '529-calculator': ['calculated', 'checkInputs', 'exampleLoaded', 'target', 'grossCost', 'scholarships', 'projectedSavings', 'fundingGap', 'monthlyNeeded', 'amountNeededNow', 'noTime', 'assumption'],
  'julian-date-converter': ['calculated', 'checkInputs', 'exampleLoaded', 'jd', 'mjd', 'utc', 'dayFraction', 'calendar', 'calendarValue', 'timeScale', 'precision'],
  'interval-timer': ['started', 'paused', 'resumed', 'reset', 'finished', 'checkInputs', 'workCue', 'restCue', 'prepCue', 'soundUnavailable'],
  'logic-grid-puzzle': ['newPuzzle', 'solved', 'incomplete', 'conflict', 'incorrect', 'hintSame', 'hintDifferent', 'noHint', 'marksCleared', 'markedSame', 'markedDifferent', 'unmarked', 'generationFailed'],
  'markdown-editor': ['ready', 'previewReady', 'copied', 'copyUnavailable', 'downloaded', 'cleared', 'restored', 'saved', 'storageUnavailable', 'storageDisabled', 'tooLong', 'empty', 'previewFailed', 'undoUnavailable', 'redoUnavailable'],
  'purchase-order-generator': ['ready', 'invalid', 'createFirst', 'printBlocked', 'downloaded', 'downloadFailed', 'exampleLoaded', 'cleared'],
  'eigenvalue-calculator': ['calculated', 'copied', 'copyUnavailable', 'checkInputs', 'emptyMatrix', 'invalidSize', 'notSquare', 'notSymmetric', 'invalidEntry', 'didNotConverge', 'exampleLoaded'],
  'bond-calculator': ['calculated', 'exampleLoaded', 'checkInputs', 'copied', 'copyUnavailable', 'invalidPeriods', 'yieldOutOfRange'],
  'beam-deflection-calculator': ['calculated', 'checkInputs', 'exampleLoaded', 'maxDeflection', 'location', 'maxMoment', 'flexuralRigidity', 'curveLabel'],
  'font-pairing-tool': ['fontLoaded', 'fontLoadFailed', 'noFiles', 'tooMany', 'unsupported', 'fileTooLarge', 'totalTooLarge', 'copied', 'copyUnavailable', 'fontsCleared', 'presetApplied', 'rolesSwapped'],
  'roth-vs-traditional-calculator': ['calculated', 'checkInputs'],
  'polygon-calculator': ['calculated', 'checkInputs', 'copied', 'copyUnavailable'],
  'friction-calculator': ['calculated', 'checkInputs', 'copied', 'copyUnavailable', 'normalForce', 'gravityComponent', 'requiredStatic', 'maximumStatic', 'frictionMagnitude', 'frictionDirection', 'regime', 'netForce', 'acceleration', 'noDirection', 'positiveDirection', 'negativeDirection', 'uphill', 'downhill', 'static', 'startsDownhill', 'startsUphill'],
  'thermal-expansion-calculator': ['calculated', 'checkInputs', 'copied', 'copyUnavailable', 'mode', 'initialDimension', 'coefficient', 'temperatureChange', 'dimensionChange', 'finalDimension', 'relativeChange'],
  'rtf-converter': ['converted', 'invalidFile', 'fileTooLarge', 'noText', 'copyUnavailable', 'printBlocked', 'downloaded'],
  'csv-to-pdf': ['noFile', 'invalidFile', 'fileTooLarge', 'invalidCsv', 'ready', 'exampleLoaded', 'printBlocked', 'noRows'],
  'round-robin-tournament-generator': ['noNames', 'invalidNames', 'scheduleReady', 'exampleLoaded', 'noSchedule', 'copied', 'copyUnavailable', 'printBlocked', 'invalidScore'],
  'work-order-generator': ['ready', 'invalid', 'createFirst', 'printBlocked', 'exampleLoaded', 'downloaded', 'downloadFailed'],
  'image-color-picker': ['unsupportedImage', 'imageTooLarge', 'imageReady', 'selectImage', 'pixelSelected', 'sampleAdded', 'paletteFull', 'copiedColor', 'copiedPalette', 'copyUnavailable', 'paletteCleared'],
  'image-region-redactor': ['unsupportedImage', 'imageTooLarge', 'imageReady', 'selectImage', 'invalidRegion', 'regionAdded', 'regionRemoved', 'regionsCleared', 'addRegionFirst', 'exporting', 'exportFailed', 'exportReady', 'region'],
  'image-sharpener': ['unsupportedImage', 'imageTooLarge', 'imageReady', 'selectImage', 'exporting', 'exportFailed', 'exportReady'],
  'image-splitter': ['unsupportedImage', 'imageTooLarge', 'selectImage', 'invalidGrid', 'exporting', 'exportFailed', 'exportReady', 'imageLoaded', 'cancelled'],
  'photo-to-sketch': ['unsupportedImage', 'imageTooLarge', 'imageReady', 'selectImage', 'exporting', 'cancelled', 'exportFailed', 'exportReady'],
  'schema-markup-validator': ['invalidJson', 'rootNotObject', 'inputTooLarge', 'loadingVocabulary', 'vocabularyUnavailable', 'valid', 'invalid', 'unknownType', 'unknownProperty', 'noTypedEntity', 'exampleLoaded', 'copied', 'copyUnavailable'],
  'readability-checker': ['emptyInput', 'inputTooLarge', 'noScore', 'shortSample', 'analyzed', 'exampleLoaded', 'analyzeFirst', 'copied', 'copyUnavailable'],
  'savings-goal-calculator': ['calculated', 'checkInputs', 'exampleLoaded', 'calculateFirst', 'copied', 'copyUnavailable', 'unreachable', 'horizonCapped', 'alreadyReached'],
  'severance-pay-calculator': ['calculated', 'checkInputs', 'calculationFailed', 'exampleLoaded', 'calculateFirst', 'copied', 'copyUnavailable', 'belowServiceMinimum', 'capApplied', 'noCapApplied', 'customAssumptions'],
  'divisibility-calculator': ['calculated', 'checkInputs', 'exampleLoaded', 'commonDivisorsLoaded', 'calculateFirst', 'copied', 'copyUnavailable', 'divisible', 'notDivisible'],
  'number-line-graphing-tool': ['calculated', 'checkInputs', 'exampleLoaded', 'downloaded'],
  'laplace-transform-calculator': ['calculated', 'checkInputs', 'exampleLoaded'],
  'vector-calculator': ['calculated', 'checkInputs', 'exampleLoaded', 'missingComponent', 'componentOutOfRange', 'invalidDimension', 'zeroNormalize', 'zeroAngle', 'zeroProjection', 'invalidOperation', 'resultOutOfRange'],
  'cubic-quartic-equation-calculator': ['calculated', 'checkInputs', 'exampleLoaded', 'invalidDegree', 'missingCoefficient', 'coefficientOutOfRange', 'zeroLeadingCoefficient', 'illConditioned', 'rangeTooWide', 'calculationFailed', 'noRealRoots'],
  'complex-number-calculator': ['calculated', 'checkInputs', 'exampleLoaded', 'missingValue', 'componentOutOfRange', 'radiusOutOfRange', 'angleOutOfRange', 'negativeRadius', 'invalidAngleUnit', 'invalidRootDegree', 'divisionByZero', 'zeroArgument', 'resultOutOfRange', 'invalidOperation'],
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
  hitori: ['newPuzzle', 'solved', 'duplicateWhite', 'adjacentBlack', 'disconnectedWhite', 'hintBlack', 'hintWhite', 'noHint', 'marksCleared', 'markedBlack', 'markedWhite', 'generationFailed'],
  nurikabe: ['newPuzzle', 'solved', 'clueInSea', 'seaSquare', 'seaDisconnected', 'islandsTouch', 'islandWithoutClue', 'islandSize', 'hintSea', 'hintIsland', 'noHint', 'marksCleared', 'markedSea', 'markedIsland', 'generationFailed'],
  slitherlink: ['newPuzzle', 'solved', 'loopError', 'clueError', 'hintOn', 'hintOff', 'noHint', 'undoEmpty', 'edgeOn', 'edgeOff', 'marksCleared', 'generationFailed'],
  'peg-solitaire': ['newGame', 'moved', 'won', 'noMoves', 'choosePeg', 'chooseHole', 'hint', 'undo', 'undoEmpty'],
  futoshiki: ['newPuzzle', 'solved', 'incomplete', 'duplicateRow', 'duplicateColumn', 'inequality', 'hint', 'noHint', 'undo', 'undoEmpty', 'invalidValue', 'generationFailed', 'notesEnabled', 'notesDisabled', 'noteAdded', 'noteRemoved', 'cellCleared'],
  'hashi-puzzle': ['newPuzzle', 'fallbackPuzzle', 'solved', 'degree', 'crossing', 'disconnected', 'hint', 'noHint', 'undo', 'undoEmpty', 'cleared', 'bridgeChanged', 'islandFull'],
  'chess-opening-trainer': ['ready', 'progress', 'selectPiece', 'wrong', 'illegal', 'correct', 'opponentMove', 'lineComplete', 'hint'],
  'decibel-calculator': ['calculated', 'checkInputs', 'resultValue', 'linearRatio', 'levelCount'],
  'hijri-calendar-converter': ['converted', 'checkInputs', 'hijriLabel', 'gregorianLabel', 'leapYear', 'leapYes', 'leapNo'],
  'hebrew-calendar-converter': ['converted', 'checkInputs', 'copied', 'copyUnavailable'],
  'capacitor-calculator': ['calculated', 'checkInputs'],
  'body-water-calculator': ['calculated', 'checkInputs'],
  'waist-to-hip-ratio-calculator': ['calculated', 'checkInputs', 'copied', 'copyUnavailable'],
  '555-timer-calculator': ['calculated', 'checkInputs', 'copied', 'copyUnavailable'],
  'fourier-series-calculator': ['calculated', 'calculatedConstant', 'checkInputs', 'copied', 'copyUnavailable'],
  'modular-inverse-calculator': ['calculated', 'noInverse', 'checkInputs', 'copied', 'copyUnavailable'],
  'a-b-test-calculator': ['significant', 'inconclusive', 'checkInputs', 'copied', 'copyUnavailable'],
  'investment-allocation-calculator': ['calculated', 'checkInputs', 'exampleLoaded', 'copied', 'copyUnavailable'],
  'repeating-decimal-to-fraction': ['calculated', 'checkInputs', 'copied', 'copyUnavailable'],
  'parametric-equation-calculator': ['calculated', 'checkInputs', 'exampleLoaded', 'downloaded', 'downloadUnavailable'],
  'singular-value-decomposition-calculator': ['calculated', 'checkInputs', 'exampleLoaded', 'downloaded', 'downloadUnavailable'],
  'spearman-correlation-calculator': ['calculated', 'checkInputs', 'exampleLoaded', 'downloaded', 'downloadUnavailable'],
  'wilcoxon-signed-rank-test-calculator': ['calculated', 'allZero', 'checkInputs', 'exampleLoaded', 'downloaded', 'downloadUnavailable'],
  'chinese-remainder-theorem-calculator': ['calculated', 'incompatible', 'checkInputs', 'exampleLoaded', 'copied', 'copyUnavailable'],
  'json-diff': ['compared', 'noChanges', 'copied', 'copyUnavailable', 'downloaded', 'invalid'],
  'text-to-binary-converter': ['converted', 'copied', 'copyUnavailable', 'downloaded', 'invalid', 'empty-input', 'text-too-long', 'binary-too-long', 'binary-invalid', 'binary-incomplete', 'utf8-invalid'],
  'certificate-decoder': ['decoded', 'invalid', 'invalidPem', 'tooLarge', 'fingerprintUnavailable', 'copied', 'copyUnavailable', 'exampleLoaded'],
  'json-to-xml-converter': ['converted', 'empty-input', 'too-large', 'invalid-json', 'invalid-xml', 'invalid-xml-name', 'too-deep', 'too-many-nodes', 'too-many-array-items', 'doctype-blocked', 'attribute-must-be-scalar', 'unknown-reserved-key', 'invalid-indent', 'expected-scalar', 'xml-parser-unavailable', 'invalid', 'copied', 'copyUnavailable', 'downloaded'],
  'har-viewer': ['analyzed', 'emptyInput', 'tooLarge', 'invalidJson', 'invalidHar', 'tooManyEntries', 'tooManyValues', 'tooDeep', 'fileReadError', 'invalid'],
  'robots-txt-tester': ['evaluated', 'emptyRobots', 'emptyUrls', 'tooLarge', 'tooComplex', 'tooManyLines', 'tooManyRules', 'tooManyUrls', 'invalidAgent', 'invalidUrl', 'invalid'],
  'json-to-excel': ['previewReady', 'downloaded', 'emptyInput', 'tooLarge', 'invalidJson', 'tooManyValues', 'tooDeep', 'tooManyRows', 'tooManyColumns', 'tooManyCells', 'valueTooLong', 'emptyDataset', 'invalidDataset', 'workbookTooLarge', 'invalidNumber', 'noPreview', 'noData', 'invalid'],
  'binary-base64-tool': ['encoded', 'emptyFile', 'tooLarge', 'fileReadError', 'convertFirst', 'downloaded', 'copied', 'copyUnavailable', 'invalid'],
  'json-model-generator': ['generated', 'exampleLoaded', 'emptyInput', 'tooLarge', 'invalidJson', 'tooManyValues', 'tooDeep', 'emptyRootArray', 'invalidLanguage', 'nameTooLong', 'generateFirst', 'copied', 'copyUnavailable', 'downloaded', 'invalid'],
  'csv-editor': ['loaded', 'emptyInput', 'tooLarge', 'tooManyRows', 'tooManyColumns', 'tooManyCells', 'cellTooLong', 'invalidDelimiter', 'unclosedQuote', 'unexpectedQuote', 'textAfterQuote', 'invalidCell', 'invalidColumn', 'invalidRow', 'invalidEdit', 'invalidTable', 'fileReadError', 'invalid', 'exported', 'copied', 'copyUnavailable', 'undoUnavailable', 'redoUnavailable', 'noMatches'],
  'capacitor-calculator': ['calculated', 'checkInputs'],
  'openapi-editor': ['empty', 'tooLarge', 'yamlUnavailable', 'invalidSyntax', 'valid', 'invalid', 'noOperations', 'operationCount', 'exampleLoaded', 'formatted', 'downloaded', 'copied', 'copyUnavailable', 'rootObject', 'version', 'info', 'paths', 'tooManyPaths', 'complexity', 'invalidPath', 'invalidPathItem', 'invalidOperation', 'operationId', 'duplicateOperationId', 'responses', 'responseDescription', 'parameter', 'pathParameter', 'remoteReference', 'unresolvedReference'],
  'color-name-finder': ['found', 'checkColor', 'copied', 'copyUnavailable', 'exactMatch', 'nearestMatch', 'distance'],
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
  'trapezoid-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'exampleLoaded', 'area', 'leftSide', 'rightSide', 'perimeter'],
  'prayer-times-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'exampleLoaded', 'fajr', 'sunrise', 'dhuhr', 'asr', 'sunset', 'maghrib', 'isha', 'unavailable', 'highLatitudeAdjusted', 'methodLabel', 'asrLabel', 'offsetLabel'],
  'goal-planner': ['copied', 'copyUnavailable', 'generated', 'downloaded', 'importFailed', 'saved', 'storageUnavailable', 'checkInputs', 'current', 'day', 'days', 'remaining'],
  'mind-map-maker': ['created', 'updated', 'added', 'removed', 'imported', 'importFailed', 'checkTopic', 'checkIdea', 'enterIdea'],
  'mood-tracker': ['recorded', 'updated', 'removed', 'imported', 'importFailed', 'downloaded', 'saved', 'storageUnavailable', 'storageEnabled', 'storageDisabled', 'cleared', 'confirmClear', 'confirmClearSession', 'checkInputs', 'noEntry', 'current', 'mood', 'tags', 'note', 'count', 'average'],
  'journal-online': ['savedInTab', 'updatedInTab', 'deleted', 'allDeleted', 'allDeletedStorageFailed', 'backupTooLarge', 'imported', 'importFailed', 'importCancelled', 'exported', 'encryptedExported', 'localSaved', 'localSaveRemoved', 'storageFailed', 'searchUpdated', 'noSelection', 'passwordMismatch', 'passwordNeeded', 'encrypting', 'decrypting', 'confirmDelete', 'confirmClear', 'confirmImport', 'checkInputs', 'unsupportedCrypto', 'searchRange'],
  'travel-itinerary-planner': ['tripSaved', 'storageFailed', 'tripDeletedStorageFailed', 'checkTrip', 'createTripFirst', 'exampleLoaded', 'itemSaved', 'itemUpdated', 'checkItem', 'formCleared', 'itemDeleted', 'confirmDeleteTrip', 'tripDeleted', 'confirmRestore', 'localSaved', 'localRemoved', 'jsonDownloaded', 'icsDownloaded', 'backupTooLarge', 'noItemsToExport', 'exportFailed', 'confirmImport', 'importCancelled', 'imported', 'importFailed', 'overlap', 'shortConnection'],
});
export const REQUIRED_TOOL_FIELDS = Object.freeze({
  'effective-interest-rate-calculator': ['mode', 'aprToApy', 'apyToApr', 'rate', 'frequency', 'annual', 'semiannual', 'quarterly', 'monthly', 'twiceMonthly', 'biweekly', 'weekly', 'daily', 'continuous', 'accuracyNote'],
  '529-calculator': ['currentSavings', 'monthlyContribution', 'yearsUntilCollege', 'annualCostToday', 'collegeYears', 'tuitionInflationPercent', 'annualReturnPercent', 'scholarshipPerYear', 'currency', 'accuracyNote'],
  'julian-date-converter': ['direction', 'toJulian', 'toUtc', 'utcDate', 'julianValue', 'dateKind', 'jd', 'mjd', 'accuracyNote'],
  'interval-timer': ['preset', 'workSeconds', 'restSeconds', 'rounds', 'prepSeconds', 'secondsUnit', 'sound', 'soundHint', 'accuracyNote', 'phaseLabel', 'roundLabel', 'remainingLabel', 'totalLabel', 'progressLabel', 'prep', 'work', 'rest', 'complete'],
  'logic-grid-puzzle': ['difficulty', 'board', 'clues', 'categoryPair', 'same', 'different', 'unmarked', 'sameMark', 'differentMark', 'rules', 'accuracyNote'],
  'markdown-editor': ['editor', 'editorHint', 'preview', 'previewHint', 'autosave', 'words', 'characters', 'storageNote'],
  'purchase-order-generator': ['purchaseOrderNumber', 'issueDate', 'deliveryDate', 'currency', 'currencyHint', 'buyer', 'buyerAddress', 'supplier', 'supplierAddress', 'items', 'itemsHint', 'taxPercent', 'shipping', 'paymentTerms', 'deliveryTerms', 'notes', 'description', 'quantity', 'unitPrice', 'lineTotal', 'subtotal', 'tax', 'shippingLabel', 'total', 'privacyNote', 'limitNote', 'previewTitle'],
  'eigenvalue-calculator': ['matrix', 'matrixHint', 'accuracyNote', 'resultSummary', 'eigenvalue', 'eigenvector', 'residual'],
  'bond-calculator': ['mode', 'priceMode', 'yieldMode', 'faceValue', 'couponPercent', 'years', 'frequency', 'annual', 'semiannual', 'quarterly', 'monthly', 'yieldPercent', 'marketPrice', 'accuracyNote', 'resultSummary', 'yieldToMaturity', 'estimatedPrice', 'couponPayment', 'currentYield', 'totalCoupons', 'premiumDiscount', 'periods', 'chartTitle', 'chartDescription', 'chartYield', 'chartPrice'],
  'beam-deflection-calculator': ['support', 'simplySupported', 'cantilever', 'loadCase', 'pointLoad', 'uniformLoad', 'span', 'lengthUnit', 'meters', 'centimeters', 'millimeters', 'inches', 'feet', 'load', 'forceUnit', 'newtons', 'kilonewtons', 'poundsForce', 'modulus', 'modulusUnit', 'pascals', 'megapascals', 'gigapascals', 'psi', 'ksi', 'inertia', 'inertiaUnit', 'mm4', 'cm4', 'm4', 'in4', 'ft4', 'loadUnitHint', 'accuracyNote', 'sourceNote'],
  'font-pairing-tool': ['preset', 'headingFont', 'bodyFont', 'fontFiles', 'accuracyNote', 'sampleHeading', 'sampleBody', 'hierarchyLabel', 'headingSize', 'bodySize', 'headingWeight', 'bodyWeight', 'lineHeight', 'familyGeorgia', 'familyTimes', 'familyArial', 'familyVerdana', 'familyTrebuchet', 'familyMono', 'familySystem', 'presetEditorial', 'presetModern', 'presetClassic', 'presetTechnical', 'presetFriendly', 'presetSystem'],
  'roth-vs-traditional-calculator': ['annualContribution', 'currentTaxRate', 'futureTaxRate', 'annualReturn', 'years', 'budgetNote', 'accuracyNote', 'resultSummary', 'rothAnnualDeposit', 'rothAfterTax', 'traditionalBeforeTax', 'traditionalAfterTax', 'traditionalTax', 'taxPaidNow', 'estimatedDifference', 'totalBudget', 'irsSource'],
  'polygon-calculator': ['sides', 'dimensionMode', 'sideLength', 'apothem', 'circumradius', 'dimension', 'unit', 'accuracyNote', 'resultSummary', 'perimeter', 'area', 'computedSide', 'computedApothem', 'computedCircumradius', 'interiorAngle', 'centralAngle', 'formulaNote'],
  'friction-calculator': ['mode', 'normalForce', 'mass', 'massUnit', 'angle', 'gravity', 'staticCoefficient', 'kineticCoefficient', 'appliedForce', 'forceUnit', 'motionState', 'atRest', 'movingUp', 'movingDown', 'positiveSurfaceDirection', 'accuracyNote'],
  'thermal-expansion-calculator': ['mode', 'linearMode', 'areaMode', 'volumeMode', 'initialDimension', 'lengthUnit', 'areaUnit', 'volumeUnit', 'coefficient', 'coefficientTemperatureUnit', 'perCelsius', 'perFahrenheit', 'perCelsiusShort', 'perFahrenheitShort', 'deltaTemperature', 'temperatureUnit', 'celsius', 'fahrenheit', 'accuracyNote'],
  'rtf-converter': ['file', 'accuracyNote', 'limitNote', 'output'],
  'csv-to-pdf': ['file', 'separator', 'encoding', 'hasHeader', 'pageSize', 'orientation', 'margin', 'accuracyNote', 'limitNote', 'resultCount', 'columnCount', 'previewLimit', 'tableLabel'],
  'round-robin-tournament-generator': ['participants', 'participantsHint', 'doubleRound', 'shuffle', 'scoringNote', 'limitNote', 'standingsLabel', 'rank', 'team', 'played', 'wins', 'draws', 'losses', 'goalsFor', 'goalsAgainst', 'goalDifference', 'points', 'round', 'leg', 'home', 'away', 'bye', 'homeScore', 'awayScore', 'fixtureTableLabel'],
  'work-order-generator': ['workOrderNumber', 'issuedDate', 'scheduledDate', 'completedDate', 'status', 'customer', 'contact', 'location', 'assignedTo', 'title', 'details', 'tasks', 'tasksHint', 'materials', 'materialsHint', 'materialsFormat', 'labor', 'laborHint', 'laborFormat', 'notes', 'limitNote', 'privacyNote', 'previewTitle', 'checklist', 'materialsLabel', 'laborLabel', 'description', 'quantity', 'unit', 'activity', 'hours', 'totalLaborHours'],
  'image-color-picker': ['imageFile', 'accuracyNote', 'previewHint', 'zoom', 'currentColor', 'paletteLabel', 'relatedSharpener', 'relatedRedactor'],
  'image-region-redactor': ['imageFile', 'mode', 'strength', 'regionX', 'regionY', 'regionWidth', 'regionHeight', 'accuracyNote', 'dragHint', 'regionsLabel', 'format', 'relatedMosaic', 'relatedCropper'],
  'image-sharpener': ['imageFile', 'amount', 'radius', 'threshold', 'compare', 'accuracyNote', 'previewHint', 'format', 'relatedRedactor', 'relatedCropper'],
  'image-splitter': ['imageFile', 'mode', 'gridMode', 'tileSizeMode', 'columns', 'rows', 'tileWidth', 'tileHeight', 'overlap', 'accuracyNote', 'previewHint', 'imageReady'],
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
  hitori: ['size', 'difficulty', 'board', 'rules', 'accuracyNote', 'cell', 'row', 'column', 'black', 'white'],
  nurikabe: ['difficulty', 'board', 'rules', 'accuracyNote', 'cell', 'row', 'column', 'sea', 'island'],
  slitherlink: ['size', 'board', 'rules', 'accuracyNote', 'row', 'column', 'horizontal', 'vertical'],
  'peg-solitaire': ['board', 'rules', 'accuracyNote', 'hole', 'row', 'column', 'peg', 'empty'],
  futoshiki: ['size', 'difficulty', 'board', 'rules', 'accuracyNote', 'cell', 'row', 'column', 'notes'],
  'hashi-puzzle': ['difficulty', 'board', 'rules', 'accuracyNote', 'island', 'needs', 'current', 'bridge', 'to', 'toggleHint'],
  'chess-opening-trainer': ['opening', 'side', 'white', 'black', 'board', 'moves', 'progressLabel', 'square', 'empty', 'accuracyNote', 'rules', 'opening_italian', 'opening_sicilian', 'opening_ruy_lopez', 'opening_french', 'opening_caro_kann', 'opening_queens_gambit', 'opening_london', 'opening_scandinavian', 'opening_english', 'opening_kings_indian', 'piece_wp', 'piece_wn', 'piece_wb', 'piece_wr', 'piece_wq', 'piece_wk', 'piece_bp', 'piece_bn', 'piece_bb', 'piece_br', 'piece_bq', 'piece_bk'],
  'decibel-calculator': ['mode', 'powerMode', 'amplitudeMode', 'dbToPowerMode', 'dbToAmplitudeMode', 'sumMode', 'applyMode', 'ratio', 'inputDb', 'levels', 'levelsHint', 'inputLevel', 'gainDb', 'formula', 'accuracyNote', 'assumptionsNote'],
  'hijri-calendar-converter': ['mode', 'gregorianToHijri', 'hijriToGregorian', 'gregorianDate', 'gregorianYear', 'gregorianMonth', 'gregorianDay', 'hijriYear', 'hijriMonth', 'hijriDay', 'methodNote'],
  'hebrew-calendar-converter': ['direction', 'gregorianToHebrew', 'hebrewToGregorian', 'gregorianDate', 'hebrewDate', 'gregorianInput', 'hebrewYear', 'hebrewMonth', 'hebrewDay', 'methodNote', 'yearType', 'leapYes', 'leapNo'],
  'capacitor-calculator': ['values', 'valuesHint', 'connection', 'series', 'parallel', 'unit', 'voltage', 'accuracyNote', 'resultEquivalent', 'resultCharge', 'resultEnergy', 'resultVoltage', 'capacitor', 'formulaNote'],
  'body-water-calculator': ['equation', 'watsonMale', 'watsonFemale', 'age', 'height', 'heightUnit', 'weight', 'weightUnit', 'centimeters', 'inches', 'kilograms', 'pounds', 'accuracyNote', 'resultLiters', 'resultPercent', 'equationNote'],
  'waist-to-hip-ratio-calculator': ['waist', 'hip', 'unit', 'centimeters', 'inches', 'accuracyNote', 'resultRatio', 'formulaNote'],
  '555-timer-calculator': ['mode', 'astable', 'monostable', 'resistanceA', 'resistanceB', 'resistance', 'resistanceUnit', 'ohms', 'kilohms', 'megohms', 'capacitance', 'capacitanceUnit', 'farads', 'millifarads', 'microfarads', 'nanofarads', 'picofarads', 'accuracyNote', 'frequencyNote', 'highFrequencyWarning', 'formulaNote', 'sourceLink', 'resultFrequency', 'resultPeriod', 'resultHigh', 'resultLow', 'resultWaveformDuty', 'resultDischargeDuty', 'resultPulse'],
  'fourier-series-calculator': ['samples', 'samplesHint', 'period', 'periodHint', 'harmonics', 'harmonicsHint', 'accuracyNote', 'formulaLabel', 'formula', 'resultDc', 'resultFrequency', 'resultHarmonics', 'resultRms', 'coefficient', 'coefficientA', 'coefficientB', 'coefficientAmplitude', 'phase', 'radians', 'frequencyUnit', 'chartLabel', 'samplesLegend', 'reconstructionLegend'],
  'modular-inverse-calculator': ['a', 'modulus', 'accuracyNote', 'formulaLabel', 'formula', 'resultStatus', 'resultGcd', 'resultResidue', 'resultInverse', 'bezout', 'step', 'quotient', 'remainder', 'coefficientA', 'coefficientModulus', 'existsLabel', 'missingLabel', 'verification'],
  'a-b-test-calculator': ['groupA', 'groupB', 'visitorsA', 'conversionsA', 'visitorsB', 'conversionsB', 'accuracyNote', 'rateA', 'rateB', 'difference', 'percentagePoints', 'relativeLift', 'notAvailable', 'intervalA', 'intervalB', 'intervalDifference', 'pValue', 'conclusion', 'significant', 'inconclusive', 'method', 'methodNote'],
  'investment-allocation-calculator': ['assetCount', 'asset', 'assetName', 'currentValue', 'targetWeight', 'currencyCode', 'contribution', 'accuracyNote', 'resultSummary', 'currentTotal', 'contributionTotal', 'projectedTotal', 'targetValue', 'contributionShare', 'difference'],
  'repeating-decimal-to-fraction': ['decimal', 'inputHint', 'accuracyNote', 'resultSummary', 'simplified', 'mixedNumber', 'derivation'],
  'parametric-equation-calculator': ['xExpression', 'yExpression', 'tMin', 'tMax', 'samples', 'expressionHint', 'accuracyNote', 'chartLabel', 'resultCount'],
  'singular-value-decomposition-calculator': ['matrix', 'matrixHint', 'accuracyNote', 'resultRank', 'resultSingularValues', 'resultReconstructionError', 'resultOriginal', 'resultU', 'resultSigma', 'resultVt', 'resultReconstructed', 'resultFrobenius'],
  'spearman-correlation-calculator': ['pairs', 'pairsHint', 'accuracyNote', 'resultRho', 'resultCount', 'rankX', 'rankY', 'resultTable', 'tiesNote', 'chartLabel'],
  'wilcoxon-signed-rank-test-calculator': ['pairs', 'pairsHint', 'accuracyNote', 'resultStatus', 'resultCount', 'nonzeroLabel', 'zeroCount', 'tiedCount', 'positiveRankSum', 'negativeRankSum', 'pValue', 'method', 'methodExact', 'methodApproximation', 'methodNotAvailable', 'resultTable', 'before', 'after', 'difference', 'absoluteRank', 'signedRank'],
  'chinese-remainder-theorem-calculator': ['congruences', 'congruencesHint', 'accuracyNote', 'resultStatus', 'resultResidue', 'resultModulus', 'combinedEquation', 'equationCount', 'conflictAt', 'conflictGcd', 'difference', 'stepLabel'],
  'json-diff': ['before', 'after', 'beforeHint', 'afterHint', 'arrayMode', 'arrayIndex', 'arrayKeyMode', 'arrayKey', 'arrayKeyHint', 'accuracyNote', 'results', 'added', 'removed', 'changed', 'changeList', 'noChanges', 'path', 'oldValue', 'newValue', 'patch', 'patchHint', 'invalid', 'operation', 'tooMany'],
  'text-to-binary-converter': ['mode', 'textToBinary', 'binaryToText', 'textInput', 'textHint', 'binaryInput', 'binaryHint', 'groupBytes', 'accuracyNote', 'output', 'result', 'copyHint'],
  'certificate-decoder': ['certificate', 'upload', 'supported', 'accuracyNote', 'resultTitle', 'subject', 'issuer', 'commonName', 'organizationName', 'countryName', 'localityName', 'stateOrProvinceName', 'organizationalUnitName', 'streetAddress', 'serialNumber', 'notBefore', 'notAfter', 'alternativeNames', 'fingerprint', 'noAlternativeNames', 'unlistedAttribute'],
  'json-to-xml-converter': ['mode', 'jsonToXml', 'xmlToJson', 'jsonInput', 'jsonHint', 'xmlInput', 'xmlHint', 'rootName', 'indent', 'accuracyNote', 'output', 'result', 'copyHint'],
  'har-viewer': ['file', 'paste', 'pasteHint', 'privacyWarning', 'search', 'method', 'statusFilter', 'all', 'errorsOnly', 'successOnly', 'totalRequests', 'failedRequests', 'transferred', 'totalTime', 'slowest', 'request', 'response', 'duration', 'size', 'waterfall', 'results', 'shown', 'of', 'noMatches', 'methodLabel', 'statusLabel', 'urlLabel', 'durationLabel', 'sizeLabel', 'timingNote', 'unknownDate', 'invalid', 'tooMany'],
  'robots-txt-tester': ['robotsText', 'robotsHint', 'userAgent', 'userAgentHint', 'urls', 'urlsHint', 'scopeNote', 'agentGroup', 'noSpecificGroup', 'ruleCount', 'diagnostics', 'ignored', 'malformed', 'allowed', 'blocked', 'winningRule', 'defaultRule'],
  'json-to-excel': ['jsonInput', 'jsonHint', 'dataset', 'datasetHint', 'rootObject', 'preview', 'tableLabel', 'rowCount', 'columnCount', 'previewLimit', 'flattenNote', 'privacyNote'],
  'binary-base64-tool': ['file', 'fileHint', 'outputFormat', 'base64Only', 'dataUri', 'accuracyNote', 'mimeType', 'fileSize', 'bytes', 'outputSize', 'characters', 'imagePreview', 'result', 'output'],
  'json-model-generator': ['json', 'jsonHint', 'language', 'typescript', 'csharp', 'java', 'rootName', 'rootNameHint', 'accuracyNote', 'privacyNote', 'output', 'result'],
  'csv-editor': ['file', 'paste', 'delimiter', 'autoDelimiter', 'comma', 'semicolon', 'tab', 'pipe', 'hasHeader', 'search', 'searchHint', 'tableLabel', 'row', 'column', 'accuracyNote', 'privacyNote', 'rowsSummary', 'columnsSummary', 'filteredSummary', 'page', 'of', 'noMatches', 'exportDelimiter', 'utf8Bom', 'columnType', 'textType', 'numberType', 'dateType', 'booleanType', 'typeSummary', 'typeHint', 'result'],
  'capacitor-calculator': ['values', 'valuesHint', 'connection', 'series', 'parallel', 'unit', 'voltage', 'accuracyNote', 'resultEquivalent', 'resultCharge', 'resultEnergy', 'resultVoltage', 'capacitor', 'formulaNote'],
  'openapi-editor': ['format', 'autoFormat', 'jsonFormat', 'yamlFormat', 'document', 'upload', 'accuracyNote', 'previewTitle', 'operations', 'issues', 'yamlLicense'],
  'color-name-finder': ['hexColor', 'colorPreview', 'nearestNames', 'exactMatchNote', 'paletteNote'],
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
  'trapezoid-calculator': ['baseA', 'baseB', 'height', 'topOffset', 'unit', 'millimeters', 'centimeters', 'meters', 'inches', 'feet', 'accuracyNote', 'diagramLabel'],
  'prayer-times-calculator': ['date', 'latitude', 'longitude', 'utcOffset', 'method', 'mwl', 'isna', 'egypt', 'makkah', 'karachi', 'france', 'russia', 'singapore', 'asrMethod', 'standard', 'hanafi', 'highLatitudeMethod', 'angleBased', 'middleOfNight', 'oneSeventh', 'noAdjustment', 'ramadan', 'accuracyNote'],
  'goal-planner': ['title', 'outcome', 'metric', 'unit', 'startValue', 'targetValue', 'currentValue', 'startDate', 'currentDate', 'dueDate', 'milestones', 'milestoneHint', 'accuracyNote', 'privacyNote', 'progressLabel', 'milestonesLabel', 'backupFile', 'backupHint', 'relatedTaskList'],
  'mind-map-maker': ['centralTopic', 'newIdea', 'privacyNote', 'mapLabel', 'editIdea', 'moveTo', 'jsonFile', 'importHint'],
  'mood-tracker': ['date', 'mood', 'note', 'tags', 'saveConsent', 'privacyNote', 'consentHint', 'calendarLabel', 'monthLabel', 'selectedEntry', 'weekdaySun', 'weekdayMon', 'weekdayTue', 'weekdayWed', 'weekdayThu', 'weekdayFri', 'weekdaySat', 'mood1', 'mood2', 'mood3', 'mood4', 'mood5', 'tagCalm', 'tagAnxious', 'tagSad', 'tagHappy', 'tagTired', 'tagFocused', 'tagStressed', 'tagHopeful', 'tagGrateful', 'tagAngry', 'summaryLabel', 'averageLabel', 'countLabel', 'distributionLabel', 'noEntries', 'accuracyNote', 'importHint', 'sourceNote'],
  'journal-online': ['date', 'title', 'body', 'tags', 'search', 'dateFrom', 'dateTo', 'saveConsent', 'storageNote', 'encryptionNote', 'backupPassword', 'confirmPassword', 'entriesLabel', 'resultLabel', 'noEntries', 'countLabel', 'tagHint', 'importHint', 'passwordHint', 'exampleHint', 'exampleTitle', 'exampleBody', 'exampleTags', 'safetyNote'],
  'travel-itinerary-planner': ['tripName', 'tripStartDate', 'tripEndDate', 'bufferMinutes', 'saveConsent', 'storageNote', 'itemDate', 'startTime', 'endTime', 'itemTitle', 'category', 'location', 'reservation', 'notes', 'itineraryLabel', 'noTrip', 'noItems', 'itemCount', 'overlapCount', 'bufferWarningCount', 'conflictsLabel', 'backupFile', 'backupHint', 'limitNote', 'timeZoneNote', 'reservationPrivacyNote', 'exampleTrip', 'exampleActivity', 'exampleMeal', 'exampleLocation', 'exampleReservation'],
});
export const REQUIRED_TOOL_ACTIONS = Object.freeze({
  'effective-interest-rate-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
  '529-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
  'julian-date-converter': ['calculate', 'reset', 'copy', 'example', 'result'],
  'interval-timer': ['start', 'pause', 'resume', 'reset'],
  'logic-grid-puzzle': ['newGame', 'checkBoard', 'hint', 'clearMarks', 'easy', 'medium', 'hard', 'rules'],
  'markdown-editor': ['heading', 'bold', 'italic', 'link', 'code', 'quote', 'bulletList', 'numberList', 'checklist', 'table', 'undo', 'redo', 'showPreview', 'hidePreview', 'copy', 'download', 'clear'],
  'font-pairing-tool': ['applyPreset', 'swap', 'copyCss', 'clearFonts', 'reset'],
  'roth-vs-traditional-calculator': ['compare', 'example', 'reset', 'result'],
  'polygon-calculator': ['calculate', 'example', 'reset', 'copy', 'result'],
  'friction-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'normalMode', 'inclineMode', 'newtons', 'kilonewtons', 'poundsForce', 'kilograms', 'pounds'],
  'thermal-expansion-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'centimeters', 'millimeters', 'inches', 'feet', 'squareMeters', 'squareCentimeters', 'squareFeet', 'squareInches', 'cubicMeters', 'cubicCentimeters', 'liters', 'cubicFeet', 'cubicInches'],
  'rtf-converter': ['convert', 'reset', 'copy', 'download', 'print', 'result'],
  'csv-to-pdf': ['preview', 'reset', 'example', 'print', 'result'],
  'round-robin-tournament-generator': ['generate', 'reset', 'example', 'downloadCsv', 'print', 'result'],
  'work-order-generator': ['generate', 'reset', 'example', 'downloadCsv', 'print', 'result', 'open', 'inProgress', 'completed'],
  'purchase-order-generator': ['generate', 'reset', 'example', 'downloadCsv', 'print', 'result'],
  'eigenvalue-calculator': ['calculate', 'example', 'reset', 'copy'],
  'bond-calculator': ['calculate', 'example', 'reset', 'copy', 'result'],
  'image-color-picker': ['load', 'addSample', 'copyColor', 'copyPalette', 'remove', 'clear', 'reset'],
  'image-region-redactor': ['load', 'addRegion', 'undo', 'clear', 'export', 'example', 'download', 'removeRegion', 'black', 'pixelate', 'blur', 'png', 'jpeg'],
  'image-sharpener': ['load', 'export', 'download', 'original', 'sharpened', 'png', 'jpeg', 'reset'],
  'image-splitter': ['choose', 'export', 'cancel', 'download', 'reset'],
  'photo-to-sketch': ['load', 'export', 'cancel', 'download', 'original', 'reset'],
  'schema-markup-validator': ['validate', 'example', 'copySummary', 'reset'],
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
  hitori: ['newGame', 'checkBoard', 'hint', 'clearMarks', 'easy', 'medium', 'hard', 'rules'],
  nurikabe: ['newGame', 'checkBoard', 'hint', 'clearMarks', 'easy', 'medium', 'hard', 'rules'],
  slitherlink: ['newGame', 'checkBoard', 'hint', 'undo', 'clearMarks', 'rules', 'small', 'medium', 'large'],
  'peg-solitaire': ['newGame', 'hint', 'undo', 'rules', 'pegsRemaining'],
  futoshiki: ['newGame', 'checkBoard', 'hint', 'undo', 'notes', 'notesOn', 'rules', 'small', 'medium', 'large', 'easy', 'regular', 'hard'],
  'hashi-puzzle': ['newGame', 'checkBoard', 'hint', 'undo', 'clearBoard', 'rules', 'easy', 'regular', 'hard'],
  'chess-opening-trainer': ['newGame', 'hint', 'rules'],
  'decibel-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
  'hijri-calendar-converter': ['convert', 'reset', 'example', 'result'],
  'hebrew-calendar-converter': ['convert', 'reset', 'example', 'result', 'copy'],
  'capacitor-calculator': ['calculate', 'reset', 'example', 'result'],
  'body-water-calculator': ['calculate', 'reset', 'example', 'result'],
  'waist-to-hip-ratio-calculator': ['calculate', 'reset', 'example', 'copy', 'result'],
  '555-timer-calculator': ['calculate', 'reset', 'example', 'result', 'copy'],
  'fourier-series-calculator': ['calculate', 'reset', 'example', 'constant', 'result', 'copy'],
  'modular-inverse-calculator': ['calculate', 'reset', 'example', 'result', 'copy'],
  'a-b-test-calculator': ['calculate', 'reset', 'example', 'result', 'copy'],
  'investment-allocation-calculator': ['calculate', 'reset', 'example', 'result', 'copy'],
  'repeating-decimal-to-fraction': ['calculate', 'reset', 'example', 'result', 'copy'],
  'parametric-equation-calculator': ['calculate', 'reset', 'example', 'result', 'downloadCsv'],
  'singular-value-decomposition-calculator': ['calculate', 'reset', 'example', 'result', 'downloadCsv'],
  'spearman-correlation-calculator': ['calculate', 'reset', 'example', 'result', 'downloadCsv'],
  'wilcoxon-signed-rank-test-calculator': ['calculate', 'reset', 'example', 'result', 'downloadCsv'],
  'chinese-remainder-theorem-calculator': ['calculate', 'reset', 'example', 'result', 'copy'],
  'json-diff': ['compare', 'example', 'reset', 'result', 'copy', 'copyPatch', 'downloadPatch'],
  'text-to-binary-converter': ['convert', 'example', 'reset', 'result', 'copy', 'download'],
  'certificate-decoder': ['decode', 'example', 'reset', 'copySummary'],
  'json-to-xml-converter': ['convert', 'example', 'reset', 'copy', 'download'],
  'har-viewer': ['analyze', 'example', 'reset', 'showMore', 'result'],
  'robots-txt-tester': ['test', 'example', 'reset', 'result'],
  'json-to-excel': ['preview', 'example', 'reset', 'download'],
  'binary-base64-tool': ['convert', 'reset', 'copy', 'download'],
  'json-model-generator': ['example', 'generate', 'reset', 'copy', 'download'],
  'csv-editor': ['load', 'example', 'reset', 'addRow', 'addColumn', 'deleteRow', 'deleteColumn', 'undo', 'redo', 'previous', 'next', 'export', 'copy', 'result'],
  'capacitor-calculator': ['calculate', 'reset', 'example', 'result'],
  'openapi-editor': ['validate', 'example', 'format', 'download', 'copyReport'],
  'color-name-finder': ['findName', 'copyName', 'copyHex', 'result'],
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
const MESSAGE_PLACEHOLDERS = Object.freeze({ monthCount: ['{count}'], privatePair: ['{giver}', '{recipient}'], turn: ['{player}'], overlap: ['{first}', '{second}', '{minutes}'], shortConnection: ['{first}', '{second}', '{minutes}', '{needed}'], invalidValue: ['{size}'] });
const TOOL_MESSAGE_PLACEHOLDERS = Object.freeze({ futoshiki: Object.freeze({ hint: ['{row}', '{column}'], invalidValue: ['{size}'], noteAdded: ['{value}'], noteRemoved: ['{value}'] }), 'hashi-puzzle': Object.freeze({ hint: ['{count}'], bridgeChanged: ['{count}'] }), 'chess-opening-trainer': Object.freeze({ ready: ['{opening}', '{move}'], progress: ['{played}', '{total}'], wrong: ['{expected}'], opponentMove: ['{moves}'] }), 'logic-grid-puzzle': Object.freeze({ hintSame: ['{left}', '{right}'], hintDifferent: ['{left}', '{right}'] }) });

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
      const ownerAcceptedMachineCopy = copy.localizationStatus === 'machine-accepted'
        && copy.localizationAcceptedBy === 'site-owner'
        && /^\d{4}-\d{2}-\d{2}$/u.test(copy.localizationAcceptedAt ?? '');
      if (copy.localizationStatus && copy.localizationStatus !== 'approved' && !ownerAcceptedMachineCopy) errors.push(`${locale.key}/${tool.id}: localization is not approved for release`);
      for (const key of REQUIRED_GROWTH_COPY) {
        if (typeof copy[key] !== 'string' || !copy[key].trim()) errors.push(`${locale.key}/${tool.id}: ${key} is missing`);
      }
      for (const key of REQUIRED_TOOL_FIELDS[tool.id] ?? []) {
        if (typeof copy.fields?.[key] !== 'string' || !copy.fields[key].trim()) errors.push(`${locale.key}/${tool.id}: fields.${key} is missing`);
      }
      if (tool.id === 'logic-grid-puzzle'
        && (!Array.isArray(copy.fields?.categoryGroups) || copy.fields.categoryGroups.length !== 4
          || copy.fields.categoryGroups.some((group) => !group?.name?.trim() || !Array.isArray(group.values)
            || group.values.length !== 4 || group.values.some((value) => typeof value !== 'string' || !value.trim())
            || new Set(group.values.map((value) => value.trim().toLowerCase())).size !== 4))) {
        errors.push(`${locale.key}/${tool.id}: four localized categories with four distinct values each are required`);
      }
      if (tool.id === 'hijri-calendar-converter' && (!Array.isArray(copy.fields?.hijriMonths) || copy.fields.hijriMonths.length !== 12 || copy.fields.hijriMonths.some((month) => typeof month !== 'string' || !month.trim()))) errors.push(`${locale.key}/${tool.id}: all twelve Hijri month names are required`);
      if (tool.id === 'hebrew-calendar-converter'
        && (!Array.isArray(copy.fields?.commonMonths) || copy.fields.commonMonths.length !== 12
          || copy.fields.commonMonths.some((month) => typeof month !== 'string' || !month.trim())
          || !Array.isArray(copy.fields?.leapMonths) || copy.fields.leapMonths.length !== 13
          || copy.fields.leapMonths.some((month) => typeof month !== 'string' || !month.trim()))) {
        errors.push(`${locale.key}/${tool.id}: twelve common-year and thirteen leap-year Hebrew month names are required`);
      }
      if (tool.id === 'capacitor-calculator' && (!Array.isArray(copy.additionalFaqs) || copy.additionalFaqs.length !== 3)) errors.push(`${locale.key}/${tool.id}: exactly three capacitor FAQs are required`);
      if (tool.id === 'travel-itinerary-planner' && ['activity', 'meal', 'transport', 'stay', 'reservation', 'other'].some((key) => typeof copy.fields?.categories?.[key] !== 'string' || !copy.fields.categories[key].trim())) errors.push(`${locale.key}/${tool.id}: all six category labels are required`);
      if (tool.id === 'work-order-generator'
        && ((copy.fields?.materialsFormat?.match(/\|/gu)?.length ?? 0) !== 2 || (copy.fields?.laborFormat?.match(/\|/gu)?.length ?? 0) !== 1)) {
        errors.push(`${locale.key}/${tool.id}: localized material and labor formats must preserve their pipe separators`);
      }
      for (const key of REQUIRED_TOOL_ACTIONS[tool.id] ?? []) {
        if (typeof copy.actions?.[key] !== 'string' || !copy.actions[key].trim()) errors.push(`${locale.key}/${tool.id}: actions.${key} is missing`);
      }
      for (const key of REQUIRED_TOOL_MESSAGES[tool.id] ?? []) {
        if (typeof copy.messages?.[key] !== 'string' || !copy.messages[key].trim()) errors.push(`${locale.key}/${tool.id}: messages.${key} is missing`);
        for (const token of TOOL_MESSAGE_PLACEHOLDERS[tool.id]?.[key] ?? MESSAGE_PLACEHOLDERS[key] ?? []) {
          if (typeof copy.messages?.[key] === 'string' && !copy.messages[key].includes(token)) errors.push(`${locale.key}/${tool.id}: messages.${key} must preserve ${token}`);
        }
      }
      const faqTools = ['529-calculator', 'julian-date-converter', 'interval-timer', 'deck-calculator', 'roofing-calculator', 'drywall-calculator', 'roof-pitch-calculator', 'pool-volume-calculator', 'soil-calculator', 'tire-size-calculator', 'stair-calculator', 'asphalt-calculator', 'wallpaper-calculator', 'mulch-calculator', 'paver-calculator', 'solar-panel-calculator', 'btu-calculator', 'brick-calculator', 'rafter-calculator', 'carpet-calculator', 'aquarium-calculator', 'image-region-redactor', 'image-sharpener', 'image-splitter', 'photo-to-sketch', 'image-upscaler', 'image-color-picker', 'dominoes-game', 'hitori', 'nurikabe', 'slitherlink', 'peg-solitaire', 'futoshiki', 'hashi-puzzle', 'chess-opening-trainer', 'decibel-calculator', 'hijri-calendar-converter', 'hebrew-calendar-converter', 'capacitor-calculator', 'body-water-calculator', '555-timer-calculator', 'fourier-series-calculator', 'modular-inverse-calculator', 'a-b-test-calculator', 'investment-allocation-calculator', 'repeating-decimal-to-fraction', 'parametric-equation-calculator', 'singular-value-decomposition-calculator', 'spearman-correlation-calculator', 'wilcoxon-signed-rank-test-calculator', 'chinese-remainder-theorem-calculator', 'json-diff', 'text-to-binary-converter', 'certificate-decoder', 'json-to-xml-converter', 'json-to-excel', 'binary-base64-tool', 'json-model-generator', 'har-viewer', 'robots-txt-tester', 'openapi-editor', 'font-pairing-tool', 'roth-vs-traditional-calculator', 'polygon-calculator', 'friction-calculator', 'thermal-expansion-calculator', 'color-name-finder', 'schema-markup-validator', 'readability-checker', 'savings-goal-calculator', 'weight-loss-calculator', 'heloc-calculator', 'random-team-generator', 'mood-tracker', 'journal-online', 'travel-itinerary-planner', 'laplace-transform-calculator', 'csv-to-pdf', 'round-robin-tournament-generator', 'work-order-generator', 'purchase-order-generator'];
      faqTools.push('bond-calculator', 'waist-to-hip-ratio-calculator');
      const faqCount = tool.id === 'bond-calculator' ? 4 : ['529-calculator', 'julian-date-converter', 'interval-timer', 'image-splitter', 'csv-to-pdf', 'round-robin-tournament-generator', 'work-order-generator', 'purchase-order-generator', 'slitherlink', 'peg-solitaire', 'futoshiki', 'hashi-puzzle', 'chess-opening-trainer', 'decibel-calculator', 'hijri-calendar-converter', 'hebrew-calendar-converter', 'capacitor-calculator', 'body-water-calculator', '555-timer-calculator', 'fourier-series-calculator', 'modular-inverse-calculator', 'a-b-test-calculator', 'investment-allocation-calculator', 'repeating-decimal-to-fraction', 'parametric-equation-calculator', 'singular-value-decomposition-calculator', 'spearman-correlation-calculator', 'wilcoxon-signed-rank-test-calculator', 'chinese-remainder-theorem-calculator', 'json-diff', 'text-to-binary-converter', 'certificate-decoder', 'json-to-xml-converter', 'json-to-excel', 'binary-base64-tool', 'json-model-generator', 'har-viewer', 'robots-txt-tester', 'openapi-editor', 'font-pairing-tool', 'roth-vs-traditional-calculator', 'friction-calculator', 'thermal-expansion-calculator', 'markdown-editor'].includes(tool.id) ? 3 : 2;
      if (tool.id === 'markdown-editor' && (!Array.isArray(copy.additionalFaqs) || copy.additionalFaqs.length !== 3 || copy.additionalFaqs.some((faq) => !faq.question?.trim() || !faq.answer?.trim()))) errors.push(`${locale.key}/${tool.id}: three complete localized tool FAQs are required`);
      if (faqTools.includes(tool.id)
        && (!Array.isArray(copy.additionalFaqs) || copy.additionalFaqs.length !== faqCount
          || copy.additionalFaqs.some((faq) => !faq.question?.trim() || !faq.answer?.trim()))) {
        errors.push(`${locale.key}/${tool.id}: ${faqCount} complete localized tool FAQs are required`);
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
