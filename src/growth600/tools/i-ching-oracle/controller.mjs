import { castIChing } from './logic.mjs';

const root = document.querySelector('[data-tool="i-ching-oracle"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const make = (tag, text, className) => { const element = document.createElement(tag); if (text !== undefined) element.textContent = String(text); if (className) element.className = className; return element; };

  function renderCast(event) {
    event.preventDefault();
    content.replaceChildren();
    status.classList.remove('status--error');
    try {
      const cast = castIChing({ headsValue: form.elements.namedItem('headsValue').value });
      const output = make('div', undefined, 'iching-output');
      const columns = make('div', undefined, 'iching-hexagrams');
      for (const [title, hexagram] of [[copy.fields.primaryHexagram, cast.primary], [copy.fields.transformedHexagram, cast.transformed]]) {
        const card = make('section', undefined, 'iching-hexagram');
        card.append(make('h3', title));
        for (const side of ['upper', 'lower']) {
          const trigram = hexagram[side];
          const row = make('p', undefined, 'iching-trigram');
          row.append(make('span', trigram.symbol, 'iching-trigram-symbol'), make('span', `${copy.fields[side]}: ${copy.fields.trigrams[trigram.name]}`));
          card.append(row);
        }
        columns.append(card);
      }
      output.append(columns, make('h3', copy.fields.sixLines));
      const lines = make('ol', undefined, 'iching-lines');
      lines.setAttribute('aria-label', copy.fields.castBottomUp);
      for (const line of [...cast.lines].reverse()) {
        const item = make('li', undefined, 'iching-line');
        item.append(make('span', `${copy.fields.line} ${line.number}`, 'iching-line__number'));
        const drawing = make('span', undefined, `iching-line__drawing ${line.yin ? 'iching-line__drawing--yin' : 'iching-line__drawing--yang'}`);
        drawing.setAttribute('aria-label', line.yin ? copy.fields.yin : copy.fields.yang);
        item.append(drawing, make('span', copy.fields.lineStates[String(line.value)], 'iching-line__state'), make('span', line.coins.join(' '), 'iching-line__coins'));
        if (line.changing) item.append(make('span', copy.fields.changing, 'iching-line__change'));
        lines.append(item);
      }
      output.append(lines);
      const changed = cast.changingLines.length ? cast.changingLines.join(', ') : copy.fields.none;
      output.append(make('p', `${copy.fields.changingLines}: ${changed}`));
      const method = make('a', copy.fields.methodReference);
      method.href = 'https://people.willamette.edu/~rloftus/Asia%20201/AS%20201%203CoinCasting.pdf';
      method.target = '_blank'; method.rel = 'noopener noreferrer'; output.append(method);
      content.append(output);
      status.textContent = copy.messages.complete;
      result.hidden = false;
    } catch (error) {
      status.textContent = copy.messages[error?.code] ?? copy.messages.error;
      status.classList.add('status--error');
      result.hidden = false;
    }
  }
  form.addEventListener('submit', renderCast);
  form.addEventListener('reset', () => queueMicrotask(() => { content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
