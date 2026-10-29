import { createDartsGame, recordDartsVisit, suggestDartsCheckouts, undoDartsVisit } from './logic.mjs';

const root = document.querySelector('[data-tool="darts-scoreboard"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const startScore = form.elements.namedItem('startScore');
  const playersInput = form.elements.namedItem('players');
  const dartScores = form.elements.namedItem('dartScores');
  let game = null;
  const node = (tag, text, className) => { const element = document.createElement(tag); if (text !== undefined) element.textContent = String(text); if (className) element.className = className; return element; };

  function render(message) {
    content.replaceChildren();
    const table = node('table', undefined, 'pending-table');
    table.setAttribute('aria-label', copy.fields.scoreboard);
    const head = node('thead'); const headings = node('tr');
    headings.append(node('th', copy.fields.player), node('th', copy.fields.remaining), node('th', copy.fields.lastVisit));
    head.append(headings); table.append(head);
    const body = node('tbody');
    game.players.forEach((player, index) => {
      const row = node('tr');
      if (game.winner === index || (game.winner === null && game.currentPlayer === index)) row.setAttribute('aria-current', 'true');
      const latest = [...game.visits].reverse().find((visit) => visit.player === index);
      row.append(node('th', player), node('td', game.scores[index]), node('td', latest ? `${latest.darts.join(' · ')} (${latest.points})${latest.bust ? ` — ${copy.fields.bust}` : ''}` : '—'));
      body.append(row);
    });
    table.append(body); content.append(table);
    if (game.winner !== null) content.append(node('p', `${copy.fields.winner}: ${game.players[game.winner]}`));
    else {
      const routes = suggestDartsCheckouts(game.scores[game.currentPlayer]);
      content.append(node('p', routes.length ? `${copy.fields.checkout}: ${routes.join(' · ')}` : `${copy.fields.checkout}: ${copy.fields.noCheckout}`));
      content.append(node('p', `${copy.fields.nextPlayer}: ${game.players[game.currentPlayer]}`));
    }
    if (game.visits.length) {
      const history = node('ol'); history.setAttribute('aria-label', copy.fields.throwHistory);
      for (const visit of game.visits.slice(-20).reverse()) {
        const summary = `${game.players[visit.player]}: ${visit.darts.join(' · ')} = ${visit.points}${visit.bust ? ` — ${copy.fields.bust}` : ''}${visit.won ? ` — ${copy.fields.won}` : ''}`;
        history.append(node('li', summary));
      }
      content.append(history);
      const undo = node('button', copy.fields.undo ?? copy.actions.reset, 'button button--secondary'); undo.type = 'button';
      undo.addEventListener('click', () => { game = undoDartsVisit(game); render(copy.messages.undone); });
      content.append(undo);
    }
    for (const [label, url] of [
      [copy.fields.officialRules ?? 'DRA rules (PDF)', 'https://www.pdc.tv/sites/default/files/2020-08/DRA-Rules.pdf'],
      [copy.fields.wdfRules ?? 'World Darts Federation rules', 'https://dartswdf.com/rules/'],
    ]) { const link = node('a', label); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; content.append(document.createElement('br'), link); }
    status.textContent = message; status.classList.remove('status--error'); result.hidden = false;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      if (!dartScores.value.trim()) throw Object.assign(new Error('Enter one to three dart scores.'), { code: 'invalidDarts' });
      if (!game) {
        const names = playersInput.value.split(/\r?\n/u).map((name) => name.trim()).filter(Boolean);
        game = createDartsGame({ startScore: Number(startScore.value), players: names.length ? names : ['Player 1'] });
        startScore.disabled = true; playersInput.disabled = true;
      }
      game = recordDartsVisit(game, dartScores.value);
      dartScores.value = '';
      const last = game.visits.at(-1);
      render(last.won ? copy.messages.gameFinished : last.bust ? copy.messages.busted : copy.messages.complete);
    } catch (error) {
      status.textContent = copy.messages[error?.code] ?? copy.messages.invalidDarts;
      status.classList.add('status--error'); result.hidden = false;
    }
  });
  form.addEventListener('reset', () => queueMicrotask(() => {
    game = null; startScore.disabled = false; playersInput.disabled = false;
    content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error');
  }));
}
