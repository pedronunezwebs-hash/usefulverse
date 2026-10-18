import { estimateLatePaymentInterest, norwayLateInterest2026Periods } from './late-payment-interest.mjs';

const root = document.querySelector('[data-late-interest-tool]');
if (root) {
  const copy = JSON.parse(root.closest('[data-market-tool]')?.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields ?? {};
  const $ = (selector) => root.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/gu, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  let result = null;
  const ratesRoot = $('[data-late-rates]');
  const paymentsRoot = $('[data-late-payments]');
  const invalidate = () => { result = null; $('[data-late-result]').hidden = true; };
  const markCustom = () => {
    if ($('#late-rate-profile').value === 'norway2026') {
      $('#late-rate-profile').value = 'custom';
      $('#late-currency').disabled = false;
    }
  };
  const money = () => new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: $('#late-currency').value.trim().toUpperCase(), maximumFractionDigits: 2 });
  const makeRate = (period = {}) => {
    const section = document.createElement('fieldset');
    section.className = 'fields'; section.dataset.rate = '';
    section.innerHTML = `<label class="field">${escape(f.rateStart)}<input type="date" data-rate-start value="${escape(period.startDate ?? '')}" required></label><label class="field">${escape(f.rateEnd)}<input type="date" data-rate-end value="${escape(period.endDate ?? '')}" required></label><label class="field">${escape(f.annualRate)}<input type="number" inputmode="decimal" min="0" max="1000" step="any" data-rate-value value="${period.annualRatePct ?? ''}" required></label><button type="button" data-rate-remove>${escape(f.remove)}</button>`;
    section.querySelector('[data-rate-remove]').addEventListener('click', () => { section.remove(); invalidate(); });
    ratesRoot.append(section);
  };
  const resetRates = () => {
    const norway = $('#late-rate-profile').value === 'norway2026';
    $('#late-currency').disabled = norway;
    if (norway) $('#late-currency').value = 'NOK';
    ratesRoot.replaceChildren();
    if (norway) norwayLateInterest2026Periods.forEach(makeRate);
    else makeRate();
    invalidate();
  };
  const makePayment = () => {
    const section = document.createElement('fieldset');
    section.className = 'fields'; section.dataset.payment = '';
    section.innerHTML = `<label class="field">${escape(f.paymentDate)}<input type="date" data-payment-date required></label><label class="field">${escape(f.paymentAmount)}<input type="number" inputmode="decimal" min="0.01" step="any" data-payment-amount required></label><button type="button" data-payment-remove>${escape(f.remove)}</button>`;
    section.querySelector('[data-payment-remove]').addEventListener('click', () => { section.remove(); invalidate(); });
    paymentsRoot.append(section);
  };
  const readRates = () => [...ratesRoot.querySelectorAll('[data-rate]')].map((section) => ({ startDate: section.querySelector('[data-rate-start]').value, endDate: section.querySelector('[data-rate-end]').value, annualRatePct: Number(section.querySelector('[data-rate-value]').value) }));
  const readPayments = () => [...paymentsRoot.querySelectorAll('[data-payment]')].map((section) => ({ date: section.querySelector('[data-payment-date]').value, principalPayment: Number(section.querySelector('[data-payment-amount]').value) }));
  const csvCell = (value) => { const text = String(value); const safe = /^[=+\-@\t\r]/u.test(text) ? `'${text}` : text; return `"${safe.replaceAll('"', '""')}"`; };
  $('#late-rate-profile').addEventListener('change', resetRates);
  $('[data-late-add-rate]').addEventListener('click', () => { if (ratesRoot.querySelectorAll('[data-rate]').length >= 100) return; markCustom(); makeRate(); invalidate(); });
  $('[data-late-add-payment]').addEventListener('click', () => { if (paymentsRoot.querySelectorAll('[data-payment]').length >= 1000) return; makePayment(); invalidate(); });
  root.addEventListener('input', invalidate);
  root.addEventListener('change', invalidate);
  ratesRoot.addEventListener('input', markCustom);
  ratesRoot.addEventListener('change', markCustom);
  $('[data-late-calculate]').addEventListener('click', () => {
    try {
      const formatter = money();
      result = estimateLatePaymentInterest({
        principal: Number($('#late-principal').value),
        currencyCode: $('#late-currency').value.trim().toUpperCase(),
        dueDate: $('#late-due-date').value,
        interestStartDate: $('#late-start-date').value,
        calculationDate: $('#late-end-date').value,
        payments: readPayments(),
        ratePeriods: readRates(),
      });
      const amount = (label, value) => `<div><dt>${escape(label)}</dt><dd>${escape(formatter.format(value))}</dd></div>`;
      const periodRows = result.ratePeriods.map((period) => `<tr><td>${escape(period.startDate)}</td><td>${escape(period.endDate)}</td><td>${escape(period.days)}</td><td>${escape(period.annualRatePct)}%</td><td>${escape(formatter.format(period.interestNok))}</td></tr>`).join('');
      const dailyRows = result.daily.map((row) => `<tr><td>${escape(row.date)}</td><td>${escape(formatter.format(row.openingPrincipal))}</td><td>${escape(row.annualRatePct)}%</td><td>${escape(formatter.format(row.interest))}</td><td>${escape(formatter.format(row.closingPrincipal))}</td></tr>`).join('');
      $('[data-late-result]').innerHTML = `<h3>${escape(f.resultHeading)}</h3><dl>${amount(f.totalDays, result.days)}${amount(f.initialPrincipal, result.initialPrincipal)}${amount(f.principalPaid, result.principalPaid)}${amount(f.remainingPrincipal, result.remainingPrincipal)}${amount(f.interest, result.totalInterest)}${amount(f.totalBalance, result.totalAmount)}</dl><h4>${escape(f.periodHeading)}</h4><div class="table-wrap"><table><thead><tr><th>${escape(f.rateStart)}</th><th>${escape(f.rateEnd)}</th><th>${escape(f.totalDays)}</th><th>${escape(f.rateLabel)}</th><th>${escape(f.dailyInterest)}</th></tr></thead><tbody>${periodRows}</tbody></table></div><details><summary>${escape(f.dailyHeading)}</summary><div class="table-wrap"><table><thead><tr><th>${escape(f.dateLabel)}</th><th>${escape(f.openingPrincipal)}</th><th>${escape(f.rateLabel)}</th><th>${escape(f.dailyInterest)}</th><th>${escape(f.closingPrincipal)}</th></tr></thead><tbody>${dailyRows}</tbody></table></div></details><p>${escape(f.calculated)}</p>`;
      $('[data-late-result]').hidden = false;
      $('[data-late-status]').textContent = f.calculated;
    } catch {
      result = null; $('[data-late-result]').hidden = true; $('[data-late-status]').textContent = f.error;
    }
  });
  $('[data-late-export]').addEventListener('click', () => {
    if (!result) { $('[data-late-status]').textContent = f.noResult; return; }
    const rows = [[f.dateLabel, f.openingPrincipal, f.rateLabel, f.dailyInterest, f.closingPrincipal], ...result.daily.map((row) => [row.date, row.openingPrincipal, `${row.annualRatePct}%`, row.interest, row.closingPrincipal])];
    const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'late-payment-interest-daily.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  $('[data-late-clear]').addEventListener('click', () => {
    ['late-principal', 'late-due-date', 'late-start-date', 'late-end-date'].forEach((id) => { $(`#${id}`).value = ''; });
    $('#late-currency').value = 'NOK'; $('#late-rate-profile').value = 'norway2026';
    paymentsRoot.replaceChildren(); result = null; $('[data-late-result]').hidden = true; resetRates();
    $('[data-late-status]').textContent = f.cleared;
  });
  resetRates();
}
