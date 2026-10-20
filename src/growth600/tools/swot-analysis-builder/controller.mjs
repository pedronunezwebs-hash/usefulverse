import { createSwotSummary } from './logic.mjs';

const root = document.querySelector('[data-tool="swot-analysis-builder"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    content.replaceChildren();
    try {
      const input = Object.fromEntries(['strengths','weaknesses','opportunities','threats'].map((key) => [key, form.elements.namedItem(key).value]));
      const summary = createSwotSummary(input);
      const list = document.createElement('dl');
      for (const key of Object.keys(summary)) {
        const term = document.createElement('dt'); term.textContent = copy.fields[key];
        const description = document.createElement('dd'); description.textContent = summary[key] || copy.messages.emptySection;
        list.append(term, description);
      }
      content.append(list);
      status.textContent = copy.messages.complete;
      status.classList.remove('status--error');
      result.hidden = false;
    } catch (error) {
      status.textContent = error?.code === 'section-too-long' ? copy.messages.sectionTooLong : error?.code === 'empty-input' ? copy.messages.emptyInput : copy.messages.error;
      status.classList.add('status--error');
      result.hidden = false;
    }
  });
  form.addEventListener('reset', () => queueMicrotask(() => {
    content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error');
  }));
}
