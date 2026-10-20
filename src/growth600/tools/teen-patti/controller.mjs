import { dealTeenPatti, resolveTeenPattiShowdown } from '../pending-23/teen-patti.mjs';

const root = document.querySelector('[data-tool="teen-patti"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const text = (tag, value, className) => { const el = document.createElement(tag); el.textContent = String(value); if (className) el.className = className; return el; };
  let round = null;
  let stats = { wins: 0, losses: 0, ties: 0, folds: 0 };
  function render() {
    content.replaceChildren();
    const board = document.createElement('section'); board.className = 'pending-teen-patti';
    board.append(text('h2', `${copy.fields.round}: ${stats.wins + stats.losses + stats.ties + stats.folds + (round?.complete ? 0 : round ? 1 : 0)}`));
    board.append(text('p', `${copy.fields.wins}: ${stats.wins} · ${copy.fields.losses}: ${stats.losses} · ${copy.fields.ties}: ${stats.ties} · ${copy.fields.folds}: ${stats.folds}`));
    const playerCards = document.createElement('ul'); playerCards.className = 'pending-card-hand'; playerCards.setAttribute('aria-label', copy.fields.yourCards);
    for (const card of round.hands[0]) playerCards.append(text('li', `${copy.fields[card.rank] ?? card.rank} ${copy.fields[card.suit]}`));
    board.append(text('h3', copy.fields.yourCards), playerCards);
    if (round.complete && round.decision.action === 'showdown') {
      for (let index = 1; index < 3; index++) {
        const heading = text('h3', `${copy.fields.opponent} ${index}`); const cards = document.createElement('ul'); cards.className = 'pending-card-hand';
        for (const card of round.hands[index]) cards.append(text('li', `${copy.fields[card.rank] ?? card.rank} ${copy.fields[card.suit]}`));
        board.append(heading, cards);
      }
      const resultLabel = round.decision.outcome === 'win' ? copy.fields.youWin : round.decision.outcome === 'loss' ? copy.fields.youLose : copy.fields.tie;
      board.append(text('p', resultLabel, 'status'));
      round.decision.rankings.forEach((rank, index) => board.append(text('p', `${index === 0 ? copy.fields.you : `${copy.fields.opponent} ${index}`} · ${copy.fields[rank.category]}${round.decision.winners.includes(index) ? ` · ${copy.fields.winner}` : ''}`)));
    } else if (round.complete) board.append(text('p', copy.fields.folded, 'status'));
    else board.append(text('p', copy.fields.chooseAction, 'hint'));
    board.append(text('p', copy.fields.practiceOnly, 'hint')); content.append(board); result.hidden = false;
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault(); status.textContent = ''; status.classList.remove('status--error');
    const action = form.elements.namedItem('action').value;
    try {
      if (action === 'start') { round = { ...dealTeenPatti(), complete: false, decision: null }; status.textContent = copy.messages.dealt; render(); return; }
      if (!round || round.complete) throw new RangeError('Start a round first.');
      const decision = resolveTeenPattiShowdown(round.hands, action); round = { ...round, complete: true, decision };
      if (decision.outcome === 'win') stats.wins++; else if (decision.outcome === 'loss') stats.losses++; else if (decision.outcome === 'tie') stats.ties++; else stats.folds++;
      render(); status.textContent = copy.messages.complete;
    } catch { status.textContent = copy.messages.error; status.classList.add('status--error'); result.hidden = false; }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { round = null; stats = { wins: 0, losses: 0, ties: 0, folds: 0 }; content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
