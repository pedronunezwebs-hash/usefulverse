import { estimateSwissUnemploymentAllowance } from './swiss-unemployment.mjs';
const root = document.querySelector('[data-swiss-unemployment]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields; const form = root.querySelector('form'); const result = root.querySelector('[data-unemployment-result]'); const status = root.querySelector('[data-unemployment-status]');
  const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const money = (value) => new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'currency', currency: 'CHF', maximumFractionDigits: 2 }).format(value);
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-unemployment-clear]')) { form.reset(); result.hidden = true; status.textContent = copy.messages.ready; return; }
    if (!event.target.closest('[data-unemployment-calculate]')) return;
    try {
      const out = estimateSwissUnemploymentAllowance(Object.fromEntries(new FormData(form).entries()));
      result.innerHTML = `<h3>${escape(f.resultHeading)}</h3><dl><dt>${escape(f.insured)}</dt><dd>${money(out.insuredMonthlySalary)}</dd><dt>${escape(f.daily)}</dt><dd>${money(out.dailyAllowance)}</dd><dt>${escape(f.monthlyRange)}</dt><dd>${money(out.monthlyLow)} – ${money(out.monthlyHigh)}</dd><dt>${escape(f.monthlyTypical)}</dt><dd>${money(out.monthlyTypical)}</dd></dl>${out.capped ? `<p class="hint">${escape(f.cap)}</p>` : ''}`;
      result.hidden = false; status.textContent = copy.messages.done;
    } catch { result.hidden = true; status.textContent = copy.messages.invalid; }
  });
}
