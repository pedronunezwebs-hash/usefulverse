import { estimateNorwayPropertyTransfer } from './norway-property-transfer.mjs';

const root = document.querySelector('[data-property-transfer-tool]');
if (root) {
  const copy = JSON.parse(root.closest('[data-market-tool]')?.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const q = (selector) => root.querySelector(selector);
  const status = q('[data-property-transfer-status]');
  const output = q('[data-property-transfer-result]');
  q('#property-transfer-title-type').addEventListener('change', (event) => {
    const cooperative = event.currentTarget.value === 'housing-cooperative';
    q('#property-transfer-exemption').disabled = cooperative;
    if (cooperative) q('#property-transfer-exemption').checked = false;
  });
  let lastResult = null;
  const money = (amount) => new Intl.NumberFormat(document.documentElement.lang, { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(amount);
  const showRows = (result) => {
    const f = copy.fields;
    const rows = [
      [f.acquiredValue, money(result.acquiredValueNok)],
      [f.documentDuty, money(result.documentDutyNok)],
      [f.registrationTotal, `${money(result.registrationTotalNok)} (${result.registeredDocuments} × ${money(result.registrationFeePerDocumentNok)})`],
      [f.total, money(result.estimatedTotalNok)],
    ];
    const list = document.createElement('dl');
    for (const [label, amount] of rows) {
      const term = document.createElement('dt'); term.textContent = label;
      const detail = document.createElement('dd'); detail.textContent = amount;
      list.append(term, detail);
    }
    const note = document.createElement('p');
    note.className = 'hint';
    note.textContent = result.exemptionBasis === 'housing-cooperative-share' ? f.cooperativeExemption : `${f.exemptionApplied}: ${result.dutyExempt ? f.exemptionYes : f.exemptionNo}`;
    output.replaceChildren();
    const heading = document.createElement('h3'); heading.textContent = f.resultHeading;
    output.append(heading, list, note);
    output.hidden = false;
  };
  const csvCell = (value) => {
    const text = String(value);
    const safe = /^[=+\-@\t\r]/u.test(text) ? `'${text}` : text;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  q('[data-property-transfer-calculate]').addEventListener('click', () => {
    try {
      lastResult = estimateNorwayPropertyTransfer({
        propertyMarketValueNok: q('#property-transfer-market-value').value,
        acquiredSharePct: q('#property-transfer-share').value,
        titleType: q('#property-transfer-title-type').value,
        confirmedExemption: q('#property-transfer-exemption').checked,
        registrationFeeNok: q('#property-transfer-registration-fee').value,
        registeredDocuments: q('#property-transfer-documents').value,
      });
      showRows(lastResult);
      status.textContent = copy.fields.resultHeading;
    } catch {
      lastResult = null;
      output.hidden = true;
      status.textContent = copy.fields.invalid;
    }
  });
  q('[data-property-transfer-clear]').addEventListener('click', () => {
    q('#property-transfer-market-value').value = '';
    q('#property-transfer-share').value = '100';
    q('#property-transfer-title-type').value = 'property-title';
    q('#property-transfer-exemption').checked = false;
    q('#property-transfer-registration-fee').value = '545';
    q('#property-transfer-documents').value = '1';
    lastResult = null; output.hidden = true; output.replaceChildren(); status.textContent = copy.fields.ready;
  });
  q('[data-property-transfer-export]').addEventListener('click', () => {
    if (!lastResult) { status.textContent = copy.fields.ready; return; }
    const f = copy.fields;
    const rows = [
      [f.resultHeading, 'NOK'], [f.acquiredValue, lastResult.acquiredValueNok],
      [f.documentDuty, lastResult.documentDutyNok], [f.registrationTotal, lastResult.registrationTotalNok],
      [f.total, lastResult.estimatedTotalNok],
    ];
    const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'norway-property-transfer-estimate.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  q('[data-property-transfer-print]').addEventListener('click', () => window.print());
}
