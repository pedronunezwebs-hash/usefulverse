import { calculateSwissPremiumReduction } from './swiss-premium-reduction.mjs';
const root = document.querySelector('[data-swiss-premium-reduction]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('form'); const result = root.querySelector('[data-premium-result]'); const status = root.querySelector('[data-premium-status]');
  const f = copy.fields;
  const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const money = (value) => new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'currency', currency: 'CHF' }).format(value);
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-premium-clear]')) { form.reset(); result.hidden = true; status.textContent = copy.messages.ready; return; }
    if (!event.target.closest('[data-premium-calculate]')) return;
    try {
      const out = calculateSwissPremiumReduction(Object.fromEntries(new FormData(form).entries()));
      result.innerHTML = `<h3>${escape(f.resultHeading)}</h3><dl><dt>${escape(f.gross)}</dt><dd>${money(out.monthlyPremium)}</dd><dt>${escape(f.reductionValue)}</dt><dd>−${money(out.monthlyReduction)} (${out.reductionPercent}%)</dd><dt>${escape(f.net)}</dt><dd><strong>${money(out.netMonthlyPremium)}</strong></dd><dt>${escape(f.annual)}</dt><dd>${money(out.annualReduction)}</dd></dl>`;
      result.hidden = false; status.textContent = copy.messages.done;
    } catch { result.hidden = true; status.textContent = copy.messages.invalid; }
  });
}
