import { estimateKoreaNetSalary } from './logic.mjs';

const root = document.querySelector('[data-korea-net-salary]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('form');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const withholdingTable = JSON.parse(document.querySelector('[data-korea-withholding-table]')?.textContent ?? '[]');
  const money = (value) => new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(value);
  const asOf = () => {
    const parts = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const part = (type) => parts.find((item) => item.type === type)?.value;
    return `${part('year')}-${part('month')}-${part('day')}`;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const estimate = estimateKoreaNetSalary(
        form.elements.namedItem('salary').value,
        form.elements.namedItem('family').value,
        form.elements.namedItem('children').value,
        form.elements.namedItem('ratio').value,
        asOf(),
        withholdingTable,
      );
      const rows = [
        [copy.fields.pensionableSalary, money(estimate.pensionableSalary)],
        [copy.fields.pension, money(estimate.nationalPension)],
        [copy.fields.health, money(estimate.healthInsurance)],
        [copy.fields.longTermCare, money(estimate.longTermCare)],
        [copy.fields.employment, money(estimate.employmentInsurance)],
        [copy.fields.incomeTax, money(estimate.nationalIncomeTax)],
        [copy.fields.localTax, money(estimate.localIncomeTax)],
        [copy.fields.totalDeductions, money(estimate.employeeDeductions)],
        [copy.fields.netSalary, money(estimate.estimatedNetSalary)],
        [copy.fields.tablePeriod, '2026-07 to 2026-12'],
      ];
      const list = document.createElement('dl');
      for (const [label, value] of rows) {
        const dt = document.createElement('dt'); dt.textContent = label;
        const dd = document.createElement('dd'); dd.textContent = value;
        list.append(dt, dd);
      }
      content.replaceChildren(list); result.hidden = false;
      status.textContent = copy.messages.complete;
      status.classList.remove('status--error');
    } catch (error) {
      status.textContent = copy.messages[error?.code] ?? copy.messages.error;
      status.classList.add('status--error'); result.hidden = true;
    }
  });
  form.addEventListener('reset', () => queueMicrotask(() => {
    content.replaceChildren(); result.hidden = true; status.textContent = '';
    status.classList.remove('status--error');
  }));
}
