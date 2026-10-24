import { createRacingGame, moveRacingCar, pauseRacingGame, startRacingGame, stepRacingGame } from './logic.mjs';

const root = document.querySelector('[data-tool="racing-game"]');
if (root) {
  const form = root.querySelector('[data-pending-form]'); const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]'); const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  let game = createRacingGame(); let timer = null;
  const make = (tag, text, className) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = String(text); if (className) node.className = className; return node; };
  const clearTimer = () => { if (timer !== null) { clearInterval(timer); timer = null; } };
  const render = () => {
    const restoreFocus = content.contains(document.activeElement);
    content.replaceChildren();
    const score = make('p', `${copy.fields.score}: ${game.score}`, 'pending-racing-score'); content.append(score);
    const track = make('div', undefined, 'pending-racing-track'); track.tabIndex = 0; track.setAttribute('role', 'group'); track.setAttribute('aria-label', copy.fields.trackInstructions);
    for (let row = 0; row <= 6; row += 1) {
      const trackRow = make('div', undefined, 'pending-racing-row');
      for (let lane = 0; lane < 3; lane += 1) {
        const cell = make('div', undefined, 'pending-racing-cell');
        if (game.obstacle?.lane === lane && game.obstacle.row === row) cell.append(make('span', '🚧', 'pending-racing-obstacle'), make('span', copy.fields.obstacle, 'sr-only'));
        if (row === 6 && game.lane === lane) cell.append(make('span', '🚗', 'pending-racing-car'), make('span', copy.fields.yourCar, 'sr-only'));
        trackRow.append(cell);
      }
      track.append(trackRow);
    }
    content.append(track);
    const controls = make('div', undefined, 'pending-racing-controls');
    const left = make('button', `← ${copy.fields.left}`, 'button button--secondary'); left.type = 'button'; left.disabled = game.status !== 'running'; left.addEventListener('click', () => move('left'));
    const right = make('button', `${copy.fields.right} →`, 'button button--secondary'); right.type = 'button'; right.disabled = game.status !== 'running'; right.addEventListener('click', () => move('right'));
    const pause = make('button', game.status === 'paused' ? copy.fields.resume : copy.fields.pause, 'button button--secondary'); pause.type = 'button'; pause.disabled = !['running', 'paused'].includes(game.status); pause.addEventListener('click', togglePause);
    const restart = make('button', copy.fields.newRace, 'button button--secondary'); restart.type = 'button'; restart.addEventListener('click', start);
    controls.append(left, right, pause, restart); content.append(controls);
    if (game.status === 'finished') { content.append(make('h3', `${copy.fields.crash} · ${copy.fields.finalScore}: ${game.score}`, 'pending-racing-result')); status.textContent = copy.messages.crash; }
    else if (game.status === 'paused') status.textContent = copy.messages.paused;
    else if (game.status === 'ready') status.textContent = copy.messages.ready;
    result.hidden = false;
    if (restoreFocus) track.focus({ preventScroll: true });
  };
  const move = (direction) => { game = moveRacingCar(game, direction); render(); };
  const tick = () => {
    try { game = stepRacingGame(game); if (game.status === 'finished') clearTimer(); render(); if (game.score > 0 && game.ticks % 8 === 0) status.textContent = `${copy.fields.score}: ${game.score}`; }
    catch { clearTimer(); game = Object.freeze({ ...game, status: 'paused' }); status.textContent = copy.messages.error; status.classList.add('status--error'); render(); }
  };
  const start = () => { clearTimer(); status.classList.remove('status--error'); game = startRacingGame(game); status.textContent = copy.messages.started; render(); timer = setInterval(tick, 450); };
  const togglePause = () => { game = pauseRacingGame(game); if (game.status === 'paused') clearTimer(); else timer = setInterval(tick, 450); render(); };
  content.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault(); move(event.key === 'ArrowLeft' ? 'left' : 'right');
  });
  form.addEventListener('submit', (event) => { event.preventDefault(); start(); });
  form.addEventListener('reset', () => queueMicrotask(() => { clearTimer(); game = createRacingGame(); content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
  window.addEventListener('pagehide', clearTimer, { once: true });
  render();
}
