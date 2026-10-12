import { announce } from '../controller-helpers.mjs';
import { calculateRetirementProjection } from './logic.mjs';

const root = document.querySelector('[data-tool="retirement-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
  const results = root.querySelector('[data-retirement-results]');
  const status = root.querySelector('[data-status]');
  const formatter = new Intl.NumberFormat(copy.copyLanguage.replace('_', '-'), { maximumFractionDigits: 2 });
  const setText = (selector, value) => { root.querySelector(selector).textContent = value; };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = '';
    try {
      const data = new FormData(form);
      const projection = calculateRetirementProjection(Object.fromEntries(data.entries()));
      const formatAge = (age) => age === null ? copy.fields.noDepletion : copy.messages.depletion.replace('{age}', formatter.format(age));
      setText('[data-retirement-contributions]', formatter.format(projection.totalContributions));
      setText('[data-retirement-conservative-contributions]', formatter.format(projection.totalContributions));
      setText('[data-retirement-at-age]', formatter.format(projection.base.balanceAtRetirement));
      setText('[data-retirement-conservative-at-age]', formatter.format(projection.conservative.balanceAtRetirement));
      setText('[data-retirement-today]', formatter.format(projection.base.balanceAtRetirementInTodayMoney));
      setText('[data-retirement-conservative-today]', formatter.format(projection.conservative.balanceAtRetirementInTodayMoney));
      setText('[data-retirement-ending]', formatter.format(projection.base.endingBalance));
      setText('[data-retirement-conservative-ending]', formatter.format(projection.conservative.endingBalance));
      setText('[data-retirement-depletion]', formatAge(projection.base.depletedAtAge));
      setText('[data-retirement-conservative-depletion]', formatAge(projection.conservative.depletedAtAge));
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
