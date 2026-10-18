import { calculateSwissRentReferenceScenario } from './swiss-rent-adjustment.mjs';

const root = document.querySelector('[data-swiss-rent-adjustment]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields;
  const form = root.querySelector('form');
  const result = root.querySelector('[data-rent-result]');
  const status = root.querySelector('[data-rent-status]');
  const money = new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'currency', currency: 'CHF', maximumFractionDigits: 2 });
  const rate = new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'percent', maximumFractionDigits: 2 });
  const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const setStatus = (text, error = false) => { status.textContent = text; status.dataset.state = error ? 'error' : 'success'; };
  const clear = () => { form.reset(); result.hidden = true; setStatus(f.cleared); };
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-rent-clear]')) { clear(); return; }
    if (!event.target.closest('[data-rent-calculate]')) return;
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const outcome = calculateSwissRentReferenceScenario(data);
      const direction = outcome.stepCount > 0 ? f.increase : outcome.stepCount < 0 ? f.decrease : f.unchanged;
      result.innerHTML = `<h3>${escape(f.resultHeading)}</h3><dl><dt>${escape(f.currentRent)}</dt><dd>${money.format(outcome.monthlyRent)}</dd><dt>${escape(f.rateChange)}</dt><dd>${rate.format(outcome.leaseRate / 100)} → ${rate.format(outcome.currentRate / 100)} · ${escape(direction)}</dd><dt>${escape(f.effect)}</dt><dd>${outcome.monthlyReferenceEffect > 0 ? '+' : ''}${money.format(outcome.monthlyReferenceEffect)} (${outcome.changePercent > 0 ? '+' : ''}${rate.format(outcome.changePercent / 100)})</dd><dt>${escape(f.scenarioRent)}</dt><dd><strong>${money.format(outcome.scenarioMonthlyRent)}</strong></dd><dt>${escape(f.annualEffect)}</dt><dd>${outcome.annualReferenceEffect > 0 ? '+' : ''}${money.format(outcome.annualReferenceEffect)}</dd></dl><p>${escape(f.explanation)}</p><p>${escape(f.exclusions)}</p>`;
      result.hidden = false;
      setStatus(f.done);
    } catch {
      result.hidden = true;
      setStatus(f.invalid, true);
    }
  });
}
