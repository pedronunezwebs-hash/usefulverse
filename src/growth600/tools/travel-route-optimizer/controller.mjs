import { optimizeCoordinateRoute } from './logic.mjs';
const root = document.querySelector('[data-tool="travel-route-optimizer"]');
if (root) {
  const form = root.querySelector('[data-pending-form]'), result = root.querySelector('[data-result]'), content = root.querySelector('[data-result-content]'), status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}'), f = copy.fields;
  const clear = () => { result.hidden = true; content.replaceChildren(); status.textContent = ''; status.classList.remove('status--error'); };
  form.addEventListener('input', clear); form.addEventListener('reset', () => queueMicrotask(clear));
  form.addEventListener('submit', (event) => {
    event.preventDefault(); clear();
    try {
      const raw = form.elements.namedItem('locations').value.trim();
      const lines = raw ? raw.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean) : [];
      if (lines.length < 2 || lines.length > 16) throw new RangeError();
      const points = lines.map((line) => { const parts = line.split('|').map((part) => part.trim()); if (parts.length !== 3) throw new RangeError(); return { name: parts[0], lat: Number(parts[1].replace(',', '.')), lon: Number(parts[2].replace(',', '.')) }; });
      const optimized = optimizeCoordinateRoute(points, { closeLoop: form.elements.namedItem('closeLoop').checked });
      const fmt = new Intl.NumberFormat(copy.copyLanguage?.replaceAll('_','-') ?? undefined, { maximumFractionDigits: 1 });
      const list = document.createElement('ol'); list.className = 'route-optimizer-list'; list.setAttribute('aria-label', f.optimizedOrder);
      for (const index of optimized.order) { const item = document.createElement('li'); item.textContent = optimized.points[index].name; list.append(item); }
      const summary = document.createElement('dl'); summary.className = 'route-optimizer-summary';
      for (const [label, value] of [[f.optimizedDistance, `${fmt.format(optimized.optimizedKm)} km`], [f.inputOrderDistance, `${fmt.format(optimized.originalKm)} km`], [f.distanceSaved, `${fmt.format(optimized.savedKm)} km`]]) { const dt = document.createElement('dt'); dt.textContent = label; const dd = document.createElement('dd'); dd.textContent = value; summary.append(dt, dd); }
      content.append(list, summary); status.textContent = copy.messages.approximation; result.hidden = false;
    } catch { status.textContent = copy.messages.error; status.classList.add('status--error'); result.hidden = false; }
  });
}
