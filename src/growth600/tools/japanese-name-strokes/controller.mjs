import { calculateJapaneseNameStrokes } from './logic.mjs';

export function mountJapaneseNameStrokes() {
  const form = document.querySelector('#tool-form.japanese-name-strokes');
  if (!form) return;
  let copy = {};
  try { copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}'); } catch { return; }
  const fields = copy.fields ?? {};
  const input = form.elements.namedItem('name');
  const result = form.querySelector('[data-japanese-strokes-result]');
  const status = form.querySelector('[data-japanese-strokes-status]');
  let strokeCounts;
  const row = (label, value) => {
    const item = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = `${label}: `;
    item.append(strong, document.createTextNode(String(value)));
    result.append(item);
  };
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    result.replaceChildren();
    status.textContent = fields.loading;
    status.dataset.state = 'loading';
    try {
      if (!strokeCounts) {
        const response = await fetch(new URL('/assets/japanese-name-strokes/stroke-counts.json', location.origin), { credentials: 'same-origin' });
        if (!response.ok) throw new Error('Data could not be loaded.');
        strokeCounts = await response.json();
      }
      const counted = calculateJapaneseNameStrokes(input.value, strokeCounts);
      for (const item of counted.characters) row(item.character, item.strokes === null ? fields.unsupported : fields.strokeCount.replace('{count}', String(item.strokes)));
      if (counted.complete) row(fields.total, counted.total);
      status.textContent = counted.complete ? fields.complete : fields.partial;
      status.dataset.state = counted.complete ? 'success' : 'warning';
    } catch (error) {
      result.replaceChildren();
      status.textContent = error instanceof RangeError ? fields.invalidName : fields.unavailable;
      status.dataset.state = 'error';
    }
  });
}

mountJapaneseNameStrokes();
