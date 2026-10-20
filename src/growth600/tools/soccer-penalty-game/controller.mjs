import { newPenaltyShootout, playPenaltyTurn } from '../pending-23/penalty.mjs';

const root = document.querySelector('[data-tool="soccer-penalty-game"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const button = form.querySelector('[data-action="run"]');
  let game = null;
  const text = (tag, value) => { const element = document.createElement(tag); element.textContent = String(value); return element; };
  function render() {
    content.replaceChildren();
    const board = document.createElement('section');
    board.className = 'pending-penalty-board';
    const score = text('h2', `${copy.fields.player}: ${game.playerGoals} — ${game.cpuGoals} : ${copy.fields.cpu}`);
    board.append(score, text('p', `${copy.fields.shots}: ${game.playerShots} / ${game.cpuShots}`));
    if (game.complete) board.append(text('p', copy.fields[game.winner === 'player' ? 'winnerPlayer' : 'winnerCpu']));
    else board.append(text('p', game.turn % 2 === 0 ? copy.fields.roleShooter : copy.fields.roleKeeper));
    const history = document.createElement('ol');
    history.setAttribute('aria-label', copy.fields.shotHistory);
    for (const kick of game.history) history.append(text('li', `${copy.fields[kick.shooter]} · ${copy.fields[kick.direction]} · ${kick.saved ? copy.fields.saved : copy.fields.goal}`));
    board.append(history); content.append(board); result.hidden = false; button.disabled = game.complete;
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault(); status.textContent = ''; status.classList.remove('status--error');
    try { game ??= newPenaltyShootout(); game = playPenaltyTurn(game, form.elements.namedItem('direction').value); render(); status.textContent = game.complete ? copy.fields[game.winner === 'player' ? 'winnerPlayer' : 'winnerCpu'] : copy.messages.complete; }
    catch { status.textContent = copy.messages.error; status.classList.add('status--error'); result.hidden = false; }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { game = null; content.replaceChildren(); result.hidden = true; button.disabled = false; status.textContent = ''; status.classList.remove('status--error'); }));
}
