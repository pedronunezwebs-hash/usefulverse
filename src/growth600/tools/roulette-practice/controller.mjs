import { spinRoulette } from './logic.mjs';

const root = document.querySelector('[data-tool="roulette-practice"]');
if (root) {
  const form = root.querySelector('[data-pending-form]'); const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]'); const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const type = form.querySelector('[data-input="betType"]');
  const fields = Object.fromEntries(['number', 'color', 'parity'].map((key) => [key, form.querySelector(`[data-input="${key}"]`)]));
  let game = Object.freeze({ history: Object.freeze([]), spins: 0, hits: 0 });
  const make = (tag, text, className) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = String(text); if (className) node.className = className; return node; };
  const syncFields = () => { for (const [key, input] of Object.entries(fields)) input.closest('.field').hidden = type.value !== key; };
  const render = () => {
    content.replaceChildren();
    const outcome = game.last;
    if (outcome) {
      const section = make('section', undefined, 'pending-roulette-result');
      section.append(make('h3', copy.fields[outcome.hit ? 'hit' : 'miss']));
      section.append(make('p', `${copy.fields.result}: ${new Intl.NumberFormat(document.documentElement.lang || 'en').format(outcome.number)} · ${copy.fields[outcome.color]}`));
      const betLabel = copy.fields[{ number: 'numberBet', color: 'colorBet', parity: 'parityBet' }[outcome.betType]];
      section.append(make('p', `${copy.fields.bet}: ${betLabel} · ${copy.fields[outcome.betValue] || outcome.betValue}`));
      section.append(make('p', `${copy.fields.practiceRecord}: ${game.hits} / ${game.spins}`));
      section.append(make('p', copy.fields.noPrediction, 'hint'));
      const list = make('ol', undefined, 'pending-roulette-history'); list.setAttribute('aria-label', copy.fields.recentSpins);
      for (const round of game.history) list.append(make('li', `${round.number} · ${copy.fields[round.color]} · ${copy.fields[round.hit ? 'hit' : 'miss']}`));
      section.append(list); content.append(section); result.hidden = false;
    }
  };
  type.addEventListener('change', syncFields);
  form.addEventListener('submit', (event) => {
    event.preventDefault(); status.textContent = ''; status.classList.remove('status--error');
    try {
      game = spinRoulette(game, { betType: type.value, betValue: fields[type.value].value }); render();
      status.textContent = copy.messages.complete;
    } catch { status.textContent = copy.messages.error; status.classList.add('status--error'); result.hidden = false; }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { game = Object.freeze({ history: Object.freeze([]), spins: 0, hits: 0 }); content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); syncFields(); }));
  syncFields();
}
