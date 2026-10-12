export const netWorthCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en', localizationStatus: 'approved', name: 'Net Worth Calculator',
  title: 'Net Worth Calculator Free & Private | UsefulVerse',
  description: 'Total your assets and debts, compare dated snapshots and export CSV. Free and local, with optional browser-only saving.',
  intro: 'Add the balances you already know to estimate your net worth: assets minus liabilities. Compare snapshots in one currency. This is an organizer, not an appraisal or financial recommendation.',
  howQuestion: 'How do I calculate net worth?',
  howAnswer: 'Add your asset balances and liabilities using the same currency, then subtract total liabilities from total assets. Values are only as accurate as the amounts and valuations you enter.',
  privacyQuestion: 'Are my financial balances saved or uploaded?',
  privacyAnswer: 'Calculations happen in this page. Browser storage is off unless you check the consent box and separately save a snapshot. Saved data stays in this browser and can be deleted here or in browser settings.',
  fields: {
    currencyCode: 'Currency code (three letters)', date: 'Snapshot date', assets: 'Assets', liabilities: 'Liabilities',
    assetCash: 'Cash and savings', assetInvestments: 'Investments', assetProperty: 'Property estimate', assetVehicles: 'Vehicles and valuables', assetOther: 'Other assets',
    liabilityCreditCards: 'Credit cards', liabilityMortgage: 'Mortgage', liabilityStudentLoans: 'Student loans', liabilityAutoLoans: 'Auto loans', liabilityOther: 'Other liabilities',
    consent: 'I agree to save snapshots in this browser', privacyNote: 'Financial details are sensitive. Nothing is uploaded. Saving is optional, local to this browser and visible to anyone with access to it.',
    totalAssets: 'Total assets', totalLiabilities: 'Total liabilities', netWorth: 'Estimated net worth', debtToAsset: 'Debt-to-asset ratio', snapshotHistory: 'Saved snapshots', noSnapshots: 'No snapshots saved.',
  },
  actions: { calculate: 'Calculate net worth', saveSnapshot: 'Save this snapshot', exportCsv: 'Download history CSV', deleteHistory: 'Delete saved history', result: 'Estimate' },
  messages: { calculated: 'Estimate calculated.', checkInputs: 'Check the amounts, date and currency code.', consentRequired: 'Enable the consent box before saving.', saved: 'Snapshot saved in this browser.', deleted: 'Saved snapshots deleted.', nothingToExport: 'There is no saved history to export.', storageUnavailable: 'Browser storage is unavailable.', exported: 'CSV download started.' },
  additionalFaqs: [
    { question: 'What counts as net worth?', answer: 'Net worth is the total value you assign to assets minus the liabilities you enter. The result is not an appraisal or a credit score.' },
    { question: 'Can I compare different currencies?', answer: 'No automatic exchange rates are used. Compare snapshots only when they use the same currency code.' },
    { question: 'Where are saved snapshots stored?', answer: 'Only in this browser’s local storage after you opt in and press Save. Clearing browser data removes them; download a CSV if you need a separate copy.' },
  ],
});
