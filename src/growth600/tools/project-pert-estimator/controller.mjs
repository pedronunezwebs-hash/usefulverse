import { estimateProjectPERT } from './logic.mjs';

const root = document.querySelector('[data-tool="project-pert-estimator"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const make = (tag, text) => { const element = document.createElement(tag); if (text !== undefined) element.textContent = String(text); return element; };
  const format = (value) => Number(value).toLocaleString(document.documentElement.lang || 'en', { maximumFractionDigits: 4 });
  const resetOutput = () => { content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    resetOutput();
    try {
      const estimate = estimateProjectPERT({ tasks: form.elements.namedItem('tasks').value, unit: form.elements.namedItem('unit').value, locale: document.documentElement.lang || navigator.language || 'en' });
      const suffix = estimate.unit ? ` ${estimate.unit}` : '';
      const summary = make('dl');
      for (const [label, value, unit] of [[copy.fields.expectedDuration, estimate.expectedDuration, suffix], [copy.fields.standardDeviation, estimate.standardDeviation, suffix], [copy.fields.variance, estimate.variance, estimate.unit ? ` ${estimate.unit}²` : '']]) {
        summary.append(make('dt', label), make('dd', `${format(value)}${unit}`));
      }
      content.append(summary, make('h3', copy.fields.criticalPath));
      const path = make('p', estimate.criticalPath.join(' → '));
      path.setAttribute('aria-label', copy.fields.criticalPath);
      content.append(path, make('p', copy.fields.independentTaskAssumption));

      const table = make('table');
      table.className = 'pending-table';
      const headings = [copy.fields.activity, copy.fields.predecessors, copy.fields.earliestStart, copy.fields.earliestFinish, copy.fields.latestStart, copy.fields.latestFinish, copy.fields.slack, copy.fields.critical];
      const head = make('tr');
      for (const heading of headings) head.append(make('th', heading));
      const thead = make('thead'); thead.append(head); table.append(thead);
      const body = make('tbody');
      for (const activity of estimate.activities) {
        const row = make('tr');
        const values = [activity.id, activity.predecessors.join(', ') || '—', format(activity.earliestStart), format(activity.earliestFinish), format(activity.latestStart), format(activity.latestFinish), format(activity.slack), activity.critical ? copy.fields.yes : copy.fields.no];
        for (const value of values) row.append(make('td', value));
        body.append(row);
      }
      table.append(body);
      const tableRegion = make('div'); tableRegion.className = 'pending-table-wrap'; tableRegion.tabIndex = 0; tableRegion.setAttribute('aria-label', copy.fields.taskTable);
      tableRegion.append(table); content.append(tableRegion);
      for (const [key, url] of [['nasaReference', 'https://ntrs.nasa.gov/api/citations/19910020076/downloads/19910020076.pdf'], ['pmiReference', 'https://www.pmi.org/learning/library/leveraging-new-practice-standard-project-estimating-6222']]) {
        const link = make('a', copy.fields[key]); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; content.append(link, document.createElement('br'));
      }
      status.textContent = copy.messages.complete;
      result.hidden = false;
    } catch (error) {
      status.textContent = copy.messages[error?.code] ?? copy.messages.error;
      status.classList.add('status--error');
      result.hidden = false;
    }
  });
  form.addEventListener('reset', () => queueMicrotask(resetOutput));
}
