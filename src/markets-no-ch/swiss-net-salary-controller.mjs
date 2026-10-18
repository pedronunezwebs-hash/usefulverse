import { calculateSwissNetSalary } from './swiss-net-salary.mjs';

const root = document.querySelector('[data-swiss-net-salary]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]').textContent);
  const f = copy.fields;
  const $ = (selector) => root.querySelector(selector);
  const result = $('[data-ch-net-result]');
  const status = $('[data-ch-net-status]');
  const money = (amount) => new Intl.NumberFormat(document.documentElement.lang, { style: 'currency', currency: 'CHF', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  const annualMoney = (amount) => money(amount);
  let latest = null;

  const rows = (calculation) => [
    [f.annualGross, calculation.annualGross],
    [f.ahvIvEo, calculation.ahvIvEo],
    [f.alv, calculation.unemployment],
    ...(calculation.ahvAllowance ? [[f.ahvAllowanceResult, calculation.ahvAllowance]] : []),
    [f.pensionResult, calculation.pension],
    [f.accidentResult, calculation.accident],
    [f.sourceTaxResult, calculation.sourceTax],
    [f.otherResult, calculation.otherDeductions],
    [f.totalDeductions, calculation.totalKnownDeductions],
    [f.annualNet, calculation.annualNet],
    [f.perPayment, calculation.averageNetPerPayment],
    [f.monthlyNet, calculation.estimatedNetPerMonth],
  ];
  const employerRows = (calculation) => [
    [f.employerAhv, calculation.employerAhvIvEo],
    [f.employerAlv, calculation.employerUnemployment],
  ];

  const render = (calculation) => {
    result.replaceChildren();
    const heading = document.createElement('h3'); heading.textContent = f.result; result.append(heading);
    const table = document.createElement('table');
    const body = document.createElement('tbody');
    for (const [label, amount] of rows(calculation)) {
      const row = document.createElement('tr');
      const headingCell = document.createElement('th'); headingCell.scope = 'row'; headingCell.textContent = label;
      const valueCell = document.createElement('td'); valueCell.textContent = annualMoney(amount);
      row.append(headingCell, valueCell); body.append(row);
    }
    table.append(body); result.append(table); result.hidden = false;
    const employerHeading = document.createElement('h4'); employerHeading.textContent = f.employerShare; result.append(employerHeading);
    const employerTable = document.createElement('table'); const employerBody = document.createElement('tbody');
    for (const [label, amount] of employerRows(calculation)) {
      const row = document.createElement('tr'); const headingCell = document.createElement('th'); headingCell.scope = 'row'; headingCell.textContent = label;
      const valueCell = document.createElement('td'); valueCell.textContent = annualMoney(amount); row.append(headingCell, valueCell); employerBody.append(row);
    }
    employerTable.append(employerBody); result.append(employerTable);
    const employerNote = document.createElement('p'); employerNote.className = 'hint'; employerNote.textContent = f.employerNote; result.append(employerNote);
    status.textContent = f.done;
  };

  const calculate = () => {
    try {
      const sourceTaxEnabled = $('#ch-net-tax-status').value === 'source';
      latest = calculateSwissNetSalary({
        grossPerPayPeriod: $('#ch-net-gross').value,
        paymentsPerYear: $('#ch-net-payments').value,
        age: $('#ch-net-age').value,
        contributionStatus: $('#ch-net-status').value,
        postReferenceAgeAllowance: $('#ch-net-status').value === 'postReferenceAge' && $('#ch-net-allowance').checked,
        pensionDeductionAnnual: $('#ch-net-pension').value,
        accidentDeductionAnnual: $('#ch-net-accident').value,
        sourceTaxAnnual: sourceTaxEnabled ? $('#ch-net-source-tax').value : 0,
        otherDeductionsAnnual: $('#ch-net-other').value,
      });
      render(latest);
    } catch {
      latest = null; result.hidden = true; result.replaceChildren(); status.textContent = f.invalid;
    }
  };

  const updateFields = () => {
    $('[data-ch-net-allowance]').hidden = $('#ch-net-status').value !== 'postReferenceAge';
    $('#ch-net-source-tax').disabled = $('#ch-net-tax-status').value !== 'source';
  };
  $('#ch-net-status').addEventListener('change', updateFields);
  $('#ch-net-tax-status').addEventListener('change', updateFields);
  updateFields();

  $('[data-ch-net-calculate]').addEventListener('click', calculate);
  $('[data-ch-net-reset]').addEventListener('click', () => {
    $('#ch-net-gross').value = '8000'; $('#ch-net-payments').value = '13'; $('#ch-net-age').value = '35';
    $('#ch-net-status').value = 'standard'; $('#ch-net-allowance').checked = false; $('#ch-net-canton').value = 'ZH';
    $('#ch-net-tax-status').value = 'ordinary'; $('#ch-net-pension').value = '0'; $('#ch-net-accident').value = '0';
    $('#ch-net-source-tax').value = '0'; $('#ch-net-other').value = '0'; updateFields();
    latest = null; result.replaceChildren(); result.hidden = true; status.textContent = f.ready;
  });

  const exportButton = document.createElement('button');
  exportButton.type = 'button'; exportButton.textContent = copy.actions.exportCsv; exportButton.disabled = true;
  exportButton.addEventListener('click', () => {
    if (!latest) return;
    const csvCell = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const records = [[f.result, '2026'], ...rows(latest).map(([label, amount]) => [label, amount.toFixed(2)]), [f.employerShare], ...employerRows(latest).map(([label, amount]) => [label, amount.toFixed(2)])];
    const csv = `\uFEFF${records.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'swiss-net-salary-scenario-2026.csv'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  });
  $('[data-ch-net-calculate]').parentElement.append(exportButton);
  $('[data-ch-net-calculate]').addEventListener('click', () => { exportButton.disabled = !latest; });
}
