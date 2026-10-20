import { announce } from '../controller-helpers.mjs';
import { createBowlingGame, rollBowlingGame } from './logic.mjs';

const root = document.querySelector('[data-tool="bowling-game"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const fields = copy.fields ?? {};
  const form = root.querySelector('#tool-form');
  const table = root.querySelector('[data-bowling-table]');
  const summary = root.querySelector('[data-bowling-summary]');
  const pinsGroup = root.querySelector('[data-bowling-pins]');
  const path = root.querySelector('[data-bowling-path]');
  const rollButton = root.querySelector('[data-bowling-roll]');
  let game = createBowlingGame();
  const number = new Intl.NumberFormat(document.documentElement.lang || 'en');
  const element = (tag, text, className) => {
    const item = document.createElement(tag);
    if (text !== undefined) item.textContent = String(text);
    if (className) item.className = className;
    return item;
  };
  const pinPositions = [[220,44],[196,72],[244,72],[172,100],[220,100],[268,100],[148,128],[196,128],[244,128],[292,128]];
  function render() {
    const scored = root._bowlingScore;
    pinsGroup.replaceChildren();
    pinPositions.forEach(([x,y], index) => {
      if (index >= game.rackRemaining) return;
      const pin = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      pin.setAttribute('transform', `translate(${x} ${y})`);
      const body = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      body.setAttribute('d', 'M -5 0 Q -8 11 -3 14 L 3 14 Q 8 11 5 0 Z'); body.setAttribute('fill', 'Canvas'); body.setAttribute('stroke', 'currentColor');
      const neck = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      neck.setAttribute('d', 'M -3 2 L -2 -5 L 2 -5 L 3 2'); neck.setAttribute('fill', 'none'); neck.setAttribute('stroke', '#cf4b45'); neck.setAttribute('stroke-width', '2');
      pin.append(body, neck); pin.setAttribute('aria-hidden', 'true'); pinsGroup.append(pin);
    });
    const aim = Number(form.elements.namedItem('aim').value); const spin = Number(form.elements.namedItem('spin').value);
    const targetX = Math.max(115, Math.min(325, 220 + aim * 0.48 + spin * 0.22));
    path.setAttribute('d', `M 220 278 Q ${targetX} 150 ${targetX} 42`);
    const rows = [
      [fields.frame, ...Array.from({ length: 10 }, (_, index) => number.format(index + 1))],
      [fields.rollsLabel, ...scored.frames.map((frame) => frame.rolls.length ? frame.rolls.map(number.format).join(' · ') : '—')],
      [fields.frameScore, ...scored.frames.map((frame) => frame.score === null ? fields.pending : number.format(frame.score))],
      [fields.cumulative, ...scored.frames.map((frame) => frame.cumulative === null ? '—' : number.format(frame.cumulative))],
    ];
    table.replaceChildren();
    const head = document.createElement('thead'); const headRow = document.createElement('tr');
    rows[0].forEach((value, index) => headRow.append(index === 0 ? element('th', value, 'bowling-game__rowhead') : element('th', value)));
    head.append(headRow); table.append(head);
    const body = document.createElement('tbody');
    for (const values of rows.slice(1)) {
      const row = document.createElement('tr'); row.append(element('th', values[0], 'bowling-game__rowhead'));
      for (const value of values.slice(1)) row.append(element('td', value));
      body.append(row);
    }
    table.append(body);
    const totalLabel = scored.complete ? fields.finalScore : fields.provisionalScore;
    summary.textContent = `${fields.frame}: ${number.format(game.frame)} / 10 · ${totalLabel}: ${number.format(scored.total)}`;
    rollButton.disabled = game.complete;
  }
  root._bowlingScore = { frames: Array.from({ length: 10 }, (_, index) => ({ frame: index + 1, rolls: [], score: null, cumulative: null })), total: 0, complete: false };
  const updateScore = () => {
    // The roll controller updates the score from each accepted throw.
    render();
  };
  for (const [name, selector] of [['aim','[data-bowling-aim]'],['power','[data-bowling-power]'],['spin','[data-bowling-spin]']]) {
    const input = form.elements.namedItem(name); const output = root.querySelector(selector);
    input.addEventListener('input', () => { output.value = input.value; output.textContent = input.value; });
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const result = rollBowlingGame(game, { aim: Number(form.elements.namedItem('aim').value), power: Number(form.elements.namedItem('power').value), spin: Number(form.elements.namedItem('spin').value) });
      game = result.game; root._bowlingScore = result.score; updateScore();
      const message = fields.rollMessage.replace('{pins}', number.format(result.pins)).replace('{remaining}', number.format(game.rackRemaining)).replace('{frame}', number.format(game.frame));
      announce(root, message, 'success');
      if (game.complete) announce(root, fields.gameComplete.replace('{score}', number.format(result.score.total)), 'success');
    } catch { announce(root, fields.gameError, 'error'); }
  });
  form.addEventListener('reset', () => {
    queueMicrotask(() => {
      game = createBowlingGame();
      root._bowlingScore = { frames: Array.from({ length: 10 }, (_, index) => ({ frame: index + 1, rolls: [], score: null, cumulative: null })), total: 0, complete: false };
      for (const name of ['aim','power','spin']) {
        const input = form.elements.namedItem(name); const output = root.querySelector(`[data-bowling-${name}]`);
        output.value = input.value; output.textContent = input.value;
      }
      render(); announce(root, fields.newGame);
    });
  });
  render();
}
