const finite = (value, name, min = 0, max = 1e12) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} is outside the supported range.`);
  return number;
};

/** Estimates 2026 Norwegian transfer costs from entered values. Exemption eligibility is not decided here. */
export function estimateNorwayPropertyTransfer({
  propertyMarketValueNok,
  acquiredSharePct = 100,
  titleType = 'property-title',
  confirmedExemption = false,
  registrationFeeNok = 545,
  registeredDocuments = 1,
} = {}) {
  const marketValue = finite(propertyMarketValueNok, 'Property market value', 1, 1e12);
  const sharePct = finite(acquiredSharePct, 'Acquired share', 0.01, 100);
  const registrationFee = finite(registrationFeeNok, 'Registration fee', 0, 1e7);
  const documents = finite(registeredDocuments, 'Registered documents', 1, 100);
  if (!Number.isInteger(documents)) throw new RangeError('Registered document count must be a whole number.');
  if (!['property-title', 'housing-cooperative'].includes(titleType)) throw new RangeError('Choose a supported title type.');

  const acquiredValueNok = Math.round(marketValue * sharePct / 100);
  const automaticallyExemptTitle = titleType === 'housing-cooperative';
  const dutyExempt = automaticallyExemptTitle || confirmedExemption === true;
  const documentDutyNok = dutyExempt ? 0 : Math.max(250, Math.round(acquiredValueNok * 0.025));
  const registrationTotalNok = Math.round(registrationFee * documents);
  return Object.freeze({
    taxYear: 2026,
    propertyMarketValueNok: Math.round(marketValue),
    acquiredSharePct: sharePct,
    acquiredValueNok,
    titleType,
    dutyExempt,
    exemptionBasis: automaticallyExemptTitle ? 'housing-cooperative-share' : confirmedExemption ? 'user-confirmed-with-kartverket' : null,
    documentDutyRatePct: 2.5,
    documentDutyMinimumNok: 250,
    documentDutyNok,
    registrationFeePerDocumentNok: Math.round(registrationFee),
    registeredDocuments: documents,
    registrationTotalNok,
    estimatedTotalNok: documentDutyNok + registrationTotalNok,
    attribution: '2026 Norwegian rules and fees; confirm the transfer, valuation and any exemption with Kartverket.',
  });
}
