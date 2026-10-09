import { announce, clearResult, readToolCopy, showRows } from '../controller-helpers.mjs';
import { filterHarEntries, HAR_LIMITS, parseHarDocument, summarizeHarBytes } from './logic.mjs';

const root = document.querySelector('[data-tool="har-viewer"]');
if (root) {
  const form = root.querySelector('#tool-form'); const copy = readToolCopy(root);
  const fileField = form.elements.namedItem('harFile'); const textField = form.elements.namedItem('harText');
  const queryField = form.elements.namedItem('query'); const methodField = form.elements.namedItem('method'); const statusField = form.elements.namedItem('status');
  const filters = root.querySelector('[data-har-filters]'); const rows = root.querySelector('[data-har-rows]');
  const count = root.querySelector('[data-har-count]'); const empty = root.querySelector('[data-har-empty]'); const more = root.querySelector('[data-action="showMore"]');
  let analysis = null; let visibleLimit = HAR_LIMITS.renderedEntries;

  function clearAnalysis() {
    analysis = null; visibleLimit = HAR_LIMITS.renderedEntries;
    clearResult(root); rows.replaceChildren(); filters.hidden = true; count.textContent = ''; empty.hidden = true; more.hidden = true;
    methodField.replaceChildren(new Option(copy.fields.all, 'all'));
  }

  function formatMs(value) { return Number.isFinite(value) ? value.toFixed(1) : '—'; }

  function renderEntries() {
    if (!analysis) return;
    const filtered = filterHarEntries(analysis.entries, { query: queryField.value, status: statusField.value, method: methodField.value });
    const shown = filtered.slice(0, visibleLimit); const fragment = document.createDocumentFragment();
    for (const entry of shown) {
      const row = document.createElement('tr');
      const request = document.createElement('th'); request.scope = 'row'; request.className = 'har-viewer__request';
      const method = document.createElement('span'); method.className = 'har-viewer__method'; method.textContent = entry.method;
      const url = document.createElement('span'); url.className = 'har-viewer__url'; url.textContent = entry.url;
      request.append(method, url);
      const status = document.createElement('td'); status.textContent = entry.status ? String(entry.status) : '—'; status.dataset.status = entry.status >= 400 ? 'error' : 'ok';
      const duration = document.createElement('td'); duration.textContent = formatMs(entry.duration);
      const size = document.createElement('td'); size.textContent = summarizeHarBytes(entry.size);
      const waterfall = document.createElement('td'); const track = document.createElement('div'); track.className = 'har-viewer__track';
      const bar = document.createElement('span'); bar.className = 'har-viewer__bar';
      bar.style.setProperty('--har-left', `${entry.offsetPercent}%`); bar.style.setProperty('--har-width', `${entry.widthPercent}%`);
      bar.setAttribute('aria-label', `${entry.method} ${entry.status || ''} ${formatMs(entry.duration)} ms`);
      track.append(bar); waterfall.append(track); row.append(request, status, duration, size, waterfall); fragment.append(row);
    }
    rows.replaceChildren(fragment);
    count.textContent = `${copy.fields.shown} ${shown.length} ${copy.fields.of} ${filtered.length}`;
    empty.hidden = filtered.length !== 0;
    more.hidden = filtered.length <= visibleLimit;
  }

  async function analyze(event) {
    event?.preventDefault(); clearAnalysis(); announce(root, '');
    try {
      const pasted = textField.value.trim(); const file = fileField.files?.[0];
      if (!pasted && !file) throw new Error('emptyInput');
      if (!pasted && file.size > HAR_LIMITS.bytes) throw new Error('tooLarge');
      let text = pasted;
      if (!text) {
        try { text = await file.text(); }
        catch { throw new Error('fileReadError'); }
      }
      analysis = parseHarDocument(text); visibleLimit = HAR_LIMITS.renderedEntries;
      for (const method of [...new Set(analysis.entries.map((entry) => entry.method).filter((value) => value !== '—'))].sort()) methodField.add(new Option(method, method));
      const summary = analysis.summary;
      showRows(root, [
        [copy.fields.totalRequests, String(summary.total)],
        [copy.fields.failedRequests, String(summary.failed)],
        [copy.fields.transferred, summarizeHarBytes(summary.totalBytes)],
        [copy.fields.totalTime, `${formatMs(summary.totalDuration)} ms`],
        [copy.fields.slowest, `${formatMs(summary.slowestMs)} ms`],
      ]);
      filters.hidden = false; renderEntries(); announce(root, copy.messages.analyzed, 'success');
    } catch (error) {
      clearAnalysis(); announce(root, copy.messages[error.message] ?? copy.messages.invalid, 'error');
    }
  }

  form.addEventListener('submit', analyze);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => { textField.value = copy.exampleHar; fileField.value = ''; form.requestSubmit(); });
  root.querySelector('[data-action="showMore"]')?.addEventListener('click', () => { visibleLimit += HAR_LIMITS.renderedEntries; renderEntries(); });
  queryField.addEventListener('input', renderEntries); methodField.addEventListener('change', renderEntries); statusField.addEventListener('change', renderEntries);
  textField.addEventListener('input', () => { clearAnalysis(); announce(root, ''); }); fileField.addEventListener('change', () => { clearAnalysis(); announce(root, ''); });
  form.addEventListener('reset', () => queueMicrotask(() => { clearAnalysis(); announce(root, ''); }));
}
