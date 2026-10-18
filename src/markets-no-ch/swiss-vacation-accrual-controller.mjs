import { estimateSwissVacationAccrual } from './swiss-vacation-accrual.mjs';

const root = document.querySelector('[data-swiss-vacation-accrual]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields;
  const form = root.querySelector('form');
  const result = root.querySelector('[data-vacation-result]');
  const status = root.querySelector('[data-vacation-status]');
  const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const showStatus = (text, error = false) => { status.textContent = text; status.dataset.state = error ? 'error' : 'success'; };
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-vacation-clear]')) { form.reset(); result.hidden = true; showStatus(f.ready); return; }
    if (!event.target.closest('[data-vacation-calculate]')) return;
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const estimate = estimateSwissVacationAccrual(data);
      const days = (value) => new Intl.NumberFormat(document.documentElement.lang || undefined, { maximumFractionDigits: 2 }).format(value);
      result.innerHTML = `<h3>${escape(f.resultHeading)}</h3><dl><dt>${escape(f.annualDays)}</dt><dd>${days(estimate.annualDays)}</dd><dt>${escape(f.employedDays)}</dt><dd>${days(estimate.employedCalendarDays)} / ${estimate.daysInYear}</dd><dt>${escape(f.earned)}</dt><dd>${days(estimate.earnedDays)}</dd><dt>${escape(f.takenResult)}</dt><dd>${days(estimate.daysTaken)}</dd><dt>${escape(f.remaining)}</dt><dd><strong>${days(estimate.remainingDays)}</strong></dd></dl><p>${escape(f.explanation)}</p>`;
      result.hidden = false;
      showStatus(copy.messages.done);
    } catch { result.hidden = true; showStatus(copy.messages.invalid, true); }
  });
}
