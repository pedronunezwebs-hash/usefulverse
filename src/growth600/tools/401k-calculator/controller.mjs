import { announce } from '../controller-helpers.mjs';
import { calculate401kProjection } from './logic.mjs';

const root = document.querySelector('[data-tool="401k-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
  const results = root.querySelector('[data-401k-results]');
  const status = root.querySelector('[data-status]');
  const number = new Intl.NumberFormat(copy.copyLanguage.replace('_', '-'), { maximumFractionDigits: 2 });
  const money = (value) => number.format(value);
  const setText = (selector, value) => { root.querySelector(selector).textContent = value; };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const projection = calculate401kProjection(Object.fromEntries(new FormData(form).entries()));
      setText('[data-401k-employee]', money(projection.annualEmployeeContribution));
      setText('[data-401k-match]', money(projection.annualEmployerMatch));
      setText('[data-401k-vested-match]', money(projection.annualVestedMatch));
      setText('[data-401k-total]', money(projection.totalAnnualContribution));
      setText('[data-401k-balance]', money(projection.accountBalance));
      setText('[data-401k-vested-balance]', money(projection.vestedBalance));
      const rows = root.querySelector('[data-401k-years]');
      rows.replaceChildren(...projection.yearly.map(({ year, accountBalance, vestedBalance }) => {
        const row = document.createElement('tr');
        for (const value of [number.format(year), money(accountBalance), money(vestedBalance)]) {
          const cell = document.createElement('td');
          cell.textContent = value;
          row.append(cell);
        }
        return row;
      }));
      results.hidden = false;
      announce(root, copy.messages.calculated, 'success');
    } catch {
      results.hidden = true;
      announce(root, copy.messages.invalid, 'error');
    }
  });

  root.querySelector('[data-action="example"]').addEventListener('click', () => {
    form.reset();
    form.requestSubmit();
  });
  root.querySelector('[data-action="reset"]').addEventListener('click', () => {
    form.reset();
    results.hidden = true;
    status.textContent = '';
  });
}
