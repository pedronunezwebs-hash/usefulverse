import { estimateNorwayMileageReimbursement } from './norway-mileage-reimbursement.mjs';

const root = document.querySelector('[data-mileage-tool]');
if (root) {
  const copy = JSON.parse(root.closest('[data-market-tool]')?.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields ?? {};
  const $ = (selector) => root.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/gu, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const money = new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: 'NOK', maximumFractionDigits: 2 });
  let result = null;
  let sequence = 0;
  const tripsRoot = $('[data-mileage-trips]');
  const makeTrip = () => {
    const id = sequence++;
    const section = document.createElement('fieldset');
    section.className = 'fields';
    section.dataset.trip = String(id);
    section.innerHTML = `<legend>${escape(f.tripHeading)} ${id + 1}</legend><label class="field" for="mileage-date-${id}">${escape(f.date)}<input id="mileage-date-${id}" type="date" min="2026-01-01" max="2026-12-31" required></label><label class="field" for="mileage-km-${id}">${escape(f.km)}<input id="mileage-km-${id}" type="number" inputmode="decimal" min="0.01" max="100000" step="any" required></label><label class="field" for="mileage-paid-${id}">${escape(f.reimbursement)}<input id="mileage-paid-${id}" type="number" inputmode="decimal" min="0" max="1000000000" step="any" required></label><label class="field" for="mileage-passengers-${id}">${escape(f.passengers)}<input id="mileage-passengers-${id}" type="number" inputmode="numeric" min="0" max="20" step="1" value="0" required></label><label class="field" for="mileage-forest-${id}">${escape(f.forestRoad)}<input id="mileage-forest-${id}" type="number" inputmode="decimal" min="0" max="100000" step="any" value="0" required></label><label class="field" for="mileage-equipment-${id}">${escape(f.equipment)}<input id="mileage-equipment-${id}" type="number" inputmode="decimal" min="0" max="100000" step="any" value="0" required></label><button type="button" data-trip-remove>${escape(f.removeTrip)}</button>`;
    section.querySelector('[data-trip-remove]').addEventListener('click', () => { section.remove(); result = null; $('[data-mileage-result]').hidden = true; });
    tripsRoot.append(section);
  };
  const readTrips = () => [...tripsRoot.querySelectorAll('[data-trip]')].map((section) => ({
    date: section.querySelector('input[type="date"]').value,
    km: Number(section.querySelector('input[type="number"][id^="mileage-km-"]').value),
    reimbursementNok: Number(section.querySelector('input[type="number"][id^="mileage-paid-"]').value),
    passengerCount: Number(section.querySelector('input[type="number"][id^="mileage-passengers-"]').value),
    forestOrConstructionRoadKm: Number(section.querySelector('input[id^="mileage-forest-"]').value),
    specialEquipmentKm: Number(section.querySelector('input[id^="mileage-equipment-"]').value),
  }));
  const csvCell = (value) => {
    const text = String(value);
    const safe = /^[=+\-@\t\r]/u.test(text) ? `'${text}` : text;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  const invalidate = () => { result = null; $('[data-mileage-result]').hidden = true; };
  tripsRoot.addEventListener('input', invalidate);
  tripsRoot.addEventListener('change', invalidate);
  $('#mileage-tax-rate').addEventListener('input', invalidate);
  $('[data-mileage-add]').addEventListener('click', () => {
    if (tripsRoot.querySelectorAll('[data-trip]').length >= 100) { $('[data-mileage-status]').textContent = f.error; return; }
    invalidate();
    makeTrip();
  });
  $('[data-mileage-calculate]').addEventListener('click', () => {
    try {
      const taxValue = $('#mileage-tax-rate').value.trim();
      result = estimateNorwayMileageReimbursement({ trips: readTrips(), taxEffectRatePct: taxValue === '' ? 0 : Number(taxValue) });
      const row = (label, value) => `<div><dt>${escape(label)}</dt><dd>${escape(money.format(value))}</dd></div>`;
      const detail = result.trips.map((trip) => `<tr><td>${escape(trip.date)}</td><td>${escape(trip.km)}</td><td>${escape(money.format(trip.reimbursementNok))}</td><td>${escape(money.format(trip.exemptCapNok))}</td><td>${escape(money.format(trip.taxableExcessNok))}</td></tr>`).join('');
      const taxRow = taxValue === '' ? '' : row(f.taxEstimate, result.estimatedTaxOnExcessNok);
      const output = $('[data-mileage-result]');
      output.innerHTML = `<h3>${escape(f.resultHeading)}</h3><dl>${row(f.totalTrips, result.tripCount)}${row(f.totalKm, result.totalKm)}${row(f.reimbursed, result.reimbursedNok)}${row(f.taxFreeCap, result.taxFreeCapNok)}${row(f.taxFree, result.taxFreeNok)}${row(f.taxable, result.taxableExcessNok)}${taxRow}</dl><div class="table-wrap"><table><thead><tr><th>${escape(f.tripDate)}</th><th>${escape(f.tripKm)}</th><th>${escape(f.tripPaid)}</th><th>${escape(f.tripCap)}</th><th>${escape(f.tripExcess)}</th></tr></thead><tbody>${detail}</tbody></table></div><p>${escape(f.calculated)}</p>`;
      output.hidden = false;
      $('[data-mileage-status]').textContent = f.calculated;
    } catch {
      result = null;
      $('[data-mileage-result]').hidden = true;
      $('[data-mileage-status]').textContent = f.error;
    }
  });
  $('[data-mileage-clear]').addEventListener('click', () => {
    tripsRoot.replaceChildren();
    result = null;
    $('[data-mileage-result]').hidden = true;
    $('#mileage-tax-rate').value = '';
    $('[data-mileage-status]').textContent = f.cleared;
  });
  $('[data-mileage-print]').addEventListener('click', () => {
    if (!result) { $('[data-mileage-status]').textContent = f.noTrips; return; }
    window.print();
  });
  $('[data-mileage-csv]').addEventListener('click', () => {
    if (!result) { $('[data-mileage-status]').textContent = f.noTrips; return; }
    try {
      const columns = [f.tripDate, f.tripKm, f.tripPaid, f.tripCap, f.tripExcess];
      const lines = [columns, ...result.trips.map((trip) => [trip.date, trip.km, trip.reimbursementNok, trip.exemptCapNok, trip.taxableExcessNok]), [f.resultHeading, result.totalKm, result.reimbursedNok, result.taxFreeCapNok, result.taxableExcessNok]].map((line) => line.map(csvCell).join(','));
      const url = URL.createObjectURL(new Blob([`\uFEFF${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = 'norway-mileage-reimbursement-2026.csv'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      $('[data-mileage-status]').textContent = f.csvDownloaded;
    } catch { $('[data-mileage-status]').textContent = f.csvError; }
  });
  makeTrip();
}
