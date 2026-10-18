export const swissQrBillEnglish = Object.freeze({
  name: 'Swiss QR-bill Generator',
  title: 'Swiss QR-bill Generator — Free QR Invoice Maker',
  description: 'Create and check a Swiss QR-bill locally. Validate IBAN, QR-IBAN, QRR and SCOR references; print the A6 payment part and receipt without uploading invoice data.',
  intro: 'Create a Swiss payment slip with a Swiss QR Code. Your invoice details stay in this browser; no payment is initiated and no bank register is queried.',
  details: 'The tool builds the SIX Swiss Payments Code (SPC) data and checks its fields, account/reference combination, IBAN check digits and supported characters. It formats the payment part and receipt for printing at their required physical size.',
  example: 'SIX example: a QR-IBAN, CHF 50.00, a 27-digit QRR reference and structured creditor/debtor addresses.',
  exampleHeading: 'Example', howItWorks: 'How it works', faqHeading: 'Frequently asked questions', limitsHeading: 'Limits and accuracy',
  limits: 'This is a local document tool, not a bank service or certification. It cannot confirm who owns an IBAN, whether an account is open, or whether a payment will be accepted. Print at 100% / Actual size and measure the 100 mm check line before using a paper payment order.',
  fields: {
    iban: 'Creditor IBAN or QR-IBAN', creditorHeading: 'Payable to · creditor', creditorName: 'Account holder / creditor name', street: 'Street or P.O. box', building: 'Building number', postalCode: 'Postal code', city: 'Town / city', country: '2-letter country code',
    amount: 'Amount (optional)', currency: 'Currency', chf: 'CHF', eur: 'EUR', debtorHeading: 'Payable by · optional debtor', debtorName: 'Debtor name', debtorStreet: 'Street or P.O. box', debtorBuilding: 'Building number', debtorPostalCode: 'Postal code', debtorCity: 'Town / city', debtorCountry: '2-letter country code',
    referenceType: 'Reference type', qrr: 'QR reference · QR-IBAN only', scor: 'Creditor reference · IBAN', non: 'No structured reference · IBAN', reference: 'Reference', message: 'Unstructured message', billing: 'Billing information (optional)',
    generate: 'Create QR-bill', loadSample: 'Load SIX sample', clear: 'Clear form', validate: 'Check QR payload', exportPayload: 'Download payment data', downloadSvg: 'Download QR SVG', print: 'Print / save as PDF',
    uploadQr: 'Read a QR Code image', chooseImage: 'Choose PNG or JPEG', readImage: 'Read image locally', payload: 'Paste Swiss QR Code payment data', input: 'Invoice details', output: 'QR-bill preview', receipt: 'Receipt', paymentPart: 'Payment part', payableTo: 'Payable to', payableBy: 'Payable by', account: 'Account', referenceLabel: 'Reference', additionalInfo: 'Additional information', paymentCurrency: 'Currency / amount', printScale: 'Print scale check · 100 mm', standardSource: 'SIX · Swiss QR-bill standard',
    ready: 'QR-bill ready. Details stayed on this device.', invalid: 'Some fields need checking. Review the highlighted information.', reading: 'Reading this image on your device…', readSuccess: 'Swiss QR Code read and checked locally.', readFailed: 'No readable QR Code was found in that image.', payloadValid: 'Swiss QR Code data is valid for the supported fields.', payloadInvalid: 'The data is not a valid Swiss QR Code payment payload.', cleared: 'Form and preview cleared.', sampleLoaded: 'SIX sample loaded. Replace its sample details before real use.', noOutput: 'Create or read a valid QR-bill first.', imageTooLarge: 'Choose a PNG or JPEG of 10 MiB or less.', qrUnavailable: 'The local QR reader could not load. You can paste the payment data instead.',
    faq: [
      { q: 'Which IBAN and reference combinations are allowed?', a: 'A QR-IBAN uses a QRR reference. A normal Swiss IBAN uses SCOR or no structured reference (NON). QRR is for CHF invoices only.' },
      { q: 'Does this check that the account exists or belongs to the creditor?', a: 'No. It checks the format and IBAN checksum only. It does not contact a bank or account registry.' },
      { q: 'Can I print this at any scale?', a: 'For a paper payment order, print at 100% / Actual size. The payment part must be A6 landscape (148 × 105 mm); check the 100 mm line with a ruler.' },
      { q: 'Does the tool send invoice data anywhere?', a: 'No. Generation and image reading happen in your browser. No account or payment service is used.' },
    ],
  },
});
