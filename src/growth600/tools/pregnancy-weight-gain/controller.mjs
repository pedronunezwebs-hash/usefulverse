import { getPregnancyWeightGainGuide } from './logic.mjs';

const root = document.querySelector('[data-pregnancy-weight-gain]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('[data-pregnancy-form]');
  const content = root.querySelector('[data-result-content]');
  const result = root.querySelector('[data-result]');
  const status = root.querySelector('[data-status]');
  const locale = document.documentElement.lang || 'en';
  const format = (value) => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const guide = getPregnancyWeightGainGuide(form.elements.namedItem('bmi').value, form.elements.namedItem('pregnancyType').value);
      if (!guide.supported) {
        content.textContent = copy.messages[guide.reason];
      } else {
        const category = copy.fields[guide.category];
        const list = document.createElement('dl');
        for (const [label, value] of [
          [copy.fields.category, category],
          [copy.fields.totalRange, `${format(guide.minLb)}–${format(guide.maxLb)} ${copy.fields.pounds} (${format(guide.minKg)}–${format(guide.maxKg)} ${copy.fields.kilograms})`],
          [copy.fields.referenceDate, copy.fields.cdcDate],
        ]) {
          const dt = document.createElement('dt'); dt.textContent = label;
          const dd = document.createElement('dd'); dd.textContent = value;
          list.append(dt, dd);
        }
        content.replaceChildren(list);
      }
      status.textContent = copy.messages.complete;
      status.classList.remove('status--error'); result.hidden = false;
    } catch (error) {
      content.textContent = copy.messages[error?.code] ?? copy.messages.error;
      status.textContent = copy.messages.error;
      status.classList.add('status--error'); result.hidden = false;
    }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { content.replaceChildren(); status.textContent = ''; status.classList.remove('status--error'); result.hidden = true; }));
}
