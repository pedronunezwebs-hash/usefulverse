const dateAddMonths = (date, months) => {
  const result = new Date(`${date}T12:00:00Z`);
  const day = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const last = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(day, last));
  return result;
};

export function calculateRemainingTool(mode, values) {
  const n = (key) => Number(values[key]);
  if (mode === 'swissUnemployment') {
    const salary = n('salary'); const rate = n('rate');
    if (!(salary > 0) || ![70, 80].includes(rate)) throw new RangeError('Invalid salary or rate');
    const insured = Math.min(salary, 12350); const daily = insured * rate / 100 / 21.7;
    return { rows: [['insured', insured], ['daily', daily], ['monthlyLow', daily * 20], ['monthlyHigh', daily * 23]] };
  }
  if (mode === 'swissTenancy') {
    const received = new Date(`${values.received}T12:00:00Z`); const months = n('months');
    const target = dateAddMonths(values.received, months); const day = n('noticeDay');
    if (Number.isNaN(+received) || !Number.isInteger(months) || months < 0 || months > 36 || !Number.isInteger(day) || day < 1 || day > 31) throw new RangeError('Invalid notice details');
    let year = target.getUTCFullYear(); let month = target.getUTCMonth(); let end = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    let date = new Date(Date.UTC(year, month, Math.min(day, end), 12));
    if (date < target) { month += 1; if (month > 11) { month = 0; year++; } end = new Date(Date.UTC(year, month + 1, 0)).getUTCDate(); date = new Date(Date.UTC(year, month, Math.min(day, end), 12)); }
    const iso = date.toISOString().slice(0, 10);
    return { date: iso, letter: values.recipient.trim() ? `${values.sender.trim()}\n${values.senderAddress.trim()}\n\n${values.recipient.trim()}\n${values.recipientAddress.trim()}\n\n${values.place.trim()}, ${values.sentDate}\n\n${values.subject}\n\nDear Sir or Madam,\n\nI hereby terminate the tenancy agreement for ${values.property.trim()} on the contractually applicable date of ${iso}. Please confirm receipt and the termination date in writing.\n\nKind regards,\n${values.sender.trim()}` : '' };
  }
  if (mode === 'swissPropertyGain') {
    const gain = n('sale') - n('purchase') - n('costs'); const rate = n('rate');
    if (![n('sale'), n('purchase'), n('costs'), rate].every(Number.isFinite) || n('sale') < 0 || n('purchase') < 0 || n('costs') < 0 || rate < 0 || rate > 100) throw new RangeError('Invalid amounts');
    return { gain: Math.max(0, gain), tax: Math.max(0, gain) * rate / 100 };
  }
  if (mode === 'swissInheritance') {
    const amount = n('amount'); const exempt = n('exemption'); const rate = n('rate');
    if ([amount, exempt, rate].some((v) => !Number.isFinite(v)) || amount < 0 || exempt < 0 || rate < 0 || rate > 100) throw new RangeError('Invalid amounts');
    const taxable = Math.max(0, amount - exempt); return { taxable, tax: taxable * rate / 100 };
  }
  if (mode === 'swissChildBudget') {
    const need = n('need'); const parentA = n('incomeA'); const parentB = n('incomeB'); const creditA = n('creditA');
    if ([need, parentA, parentB, creditA].some((v) => !Number.isFinite(v)) || need < 0 || parentA < 0 || parentB < 0 || parentA + parentB <= 0 || creditA < 0 || creditA > need) throw new RangeError('Invalid budget');
    const total = parentA + parentB; const shareA = (need - creditA) * parentA / total; return { shareA, shareB: need - creditA - shareA, total: need };
  }
  return {};
}

export const escapeRemainingHtml = (value) => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
