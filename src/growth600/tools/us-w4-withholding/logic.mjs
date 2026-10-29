const PERIODS = Object.freeze({ weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 });
// IRS Publication 15-T (2026), Worksheet 1A annual percentage method tables.
const TABLES = Object.freeze({
  single: {
    standard: [[0,7500,0,0,0],[7500,19900,0,.10,7500],[19900,57900,1240,.12,19900],[57900,113200,5800,.22,57900],[113200,209275,17966,.24,113200],[209275,263725,41024,.32,209275],[263725,648100,58448,.35,263725],[648100,Infinity,192979.25,.37,648100]],
    checkbox: [[0,8050,0,0,0],[8050,14250,0,.10,8050],[14250,33250,620,.12,14250],[33250,60900,2900,.22,33250],[60900,108938,8983,.24,60900],[108938,136163,20512,.32,108938],[136163,328350,29224,.35,136163],[328350,Infinity,96489.63,.37,328350]],
  },
  married: {
    standard: [[0,19300,0,0,0],[19300,44100,0,.10,19300],[44100,120100,2480,.12,44100],[120100,230700,11600,.22,120100],[230700,422850,35932,.24,230700],[422850,531750,82048,.32,422850],[531750,788000,116896,.35,531750],[788000,Infinity,206583.5,.37,788000]],
    checkbox: [[0,16100,0,0,0],[16100,28500,0,.10,16100],[28500,66500,1240,.12,28500],[66500,121800,5800,.22,66500],[121800,217875,17966,.24,121800],[217875,272325,41024,.32,217875],[272325,400450,58448,.35,272325],[400450,Infinity,103291.75,.37,400450]],
  },
  head: {
    standard: [[0,15550,0,0,0],[15550,33250,0,.10,15550],[33250,83000,1770,.12,33250],[83000,121250,7740,.22,83000],[121250,217300,16155,.24,121250],[217300,271750,39207,.32,217300],[271750,656150,56631,.35,271750],[656150,Infinity,191171,.37,656150]],
    checkbox: [[0,12075,0,0,0],[12075,20925,0,.10,12075],[20925,45800,885,.12,20925],[45800,64925,3870,.22,45800],[64925,112950,8077.5,.24,64925],[112950,140175,19603.5,.32,112950],[140175,332375,28315.5,.35,140175],[332375,Infinity,95585.5,.37,332375]],
  },
});

export function estimateUsW4Withholding({ wagesPerPeriod, frequency, filingStatus, step2 = false, step3Credits = 0, step4aOtherIncome = 0, step4bDeductions = 0, step4cExtra = 0 }, asOf = new Date().toISOString().slice(0, 10)) {
  if (asOf >= '2027-01-01') throw Object.assign(new Error('table-expired'), { code: 'table-expired' });
  const wages = Number(wagesPerPeriod); const credits = Number(step3Credits); const other = Number(step4aOtherIncome); const deductions = Number(step4bDeductions); const extra = Number(step4cExtra);
  if (!Object.hasOwn(PERIODS, frequency) || !Object.hasOwn(TABLES, filingStatus)) throw Object.assign(new Error('invalid-options'), { code: 'invalid-options' });
  if (![wages, credits, other, deductions, extra].every((value) => Number.isFinite(value) && value >= 0 && value <= 1_000_000)) throw Object.assign(new Error('invalid-amount'), { code: 'invalid-amount' });
  const periods = PERIODS[frequency];
  const standardReduction = step2 ? 0 : filingStatus === 'married' ? 12900 : 8600;
  const adjustedAnnualWages = Math.max(0, wages * periods + other - deductions - standardReduction);
  const table = TABLES[filingStatus][step2 ? 'checkbox' : 'standard'];
  const row = table.find(([min, max]) => adjustedAnnualWages >= min && adjustedAnnualWages < max) ?? table.at(-1);
  const tentativeAnnual = row[2] + (adjustedAnnualWages - row[4]) * row[3];
  const tentativePerPeriod = tentativeAnnual / periods;
  const afterCredits = Math.max(0, tentativePerPeriod - credits / periods);
  return Object.freeze({ wagesPerPeriod: wages, frequency, periods, filingStatus, step2: Boolean(step2), adjustedAnnualWages, tentativePerPeriod, afterCredits, extraWithholding: extra, withholding: afterCredits + extra, taxYear: 2026 });
}
