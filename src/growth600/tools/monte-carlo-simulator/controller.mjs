import { parseSimulationVariables, runMonteCarlo } from './logic.mjs';

const root = document.querySelector('[data-tool="monte-carlo-simulator"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields;
  const n = (tag, text, cls) => { const el = document.createElement(tag); if (text !== undefined) el.textContent = String(text); if (cls) el.className = cls; return el; };
  const format = (value) => new Intl.NumberFormat(copy.copyLanguage || undefined, { maximumSignificantDigits: 6 }).format(value);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const variables = parseSimulationVariables(form.elements.namedItem('variables').value);
      const output = runMonteCarlo({ variables, iterations: Number(form.elements.namedItem('iterations').value), seed: Number(form.elements.namedItem('seed').value) });
      content.replaceChildren();
      const table = n('table'); table.className = 'pending-table'; table.setAttribute('aria-label', f.summary);
      const body = n('tbody');
      for (const [label, value] of [[f.mean,output.mean],[f.standardDeviation,output.standardDeviation],[f.min,output.min],[f.p5,output.p5],[f.median,output.median],[f.p95,output.p95],[f.max,output.max]]) { const row = n('tr'); row.append(n('th',label),n('td',format(value))); body.append(row); }
      table.append(body); content.append(table);
      const heading = n('h3', f.histogram); content.append(heading);
      const chart = n('div'); chart.className = 'pending-histogram'; chart.setAttribute('role','img'); chart.setAttribute('aria-label',f.histogramDescription);
      const maxCount = Math.max(...output.bins.map((bin) => bin.count), 1);
      for (const [index, bin] of output.bins.entries()) { const bar = n('div'); bar.className = 'pending-histogram__bar'; bar.style.height = `${Math.max(2, bin.count / maxCount * 100)}%`; bar.title = `${format(bin.from)}–${format(bin.to)}: ${bin.count}`; bar.setAttribute('aria-label',`${f.bin} ${index + 1}: ${bin.count}`); chart.append(bar); }
      content.append(chart,n('p',`${f.iterations}: ${format(output.iterations)} · ${f.seed}: ${format(output.seed)}`));
      result.hidden = false; status.textContent = copy.messages.complete; status.classList.remove('status--error');
    } catch (error) {
      status.textContent = error instanceof RangeError ? error.message : copy.messages.invalid;
      status.classList.add('status--error'); result.hidden = false;
    }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
