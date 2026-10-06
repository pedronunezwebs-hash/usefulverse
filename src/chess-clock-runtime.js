import {
  createChessClock,
  getChessClockSnapshot,
  pauseChessClock,
  resetChessClock,
  startChessClock,
  switchChessClockPlayer,
} from './chess-clock-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);
const $$ = (selector, root) => [...root.querySelectorAll(selector)];
const language = document.documentElement.lang || 'en';
const locale = window.usefulverseLocale ?? {};
const say = (phrase) => locale.runtime?.[phrase] ?? locale.messages?.[phrase] ?? phrase;

export function setupChessClock(root) {
  const settings = $('[data-chess-settings]', root);
  const start = $('[data-chess-start]', root);
  const pause = $('[data-chess-pause]', root);
  const reset = $('[data-chess-reset]', root);
  const status = $('[data-chess-status]', root);
  const playerButtons = $$('[data-chess-player]', root);
  const times = Object.fromEntries(['white', 'black'].map((color) => [color, $(`[data-chess-time="${color}"]`, root)]));
  let clock = null;
  let timer = 0;
  const format = (milliseconds) => {
    const seconds = Math.ceil(milliseconds / 1000);
    const number = (value) => new Intl.NumberFormat(language, { minimumIntegerDigits: 2, useGrouping: false }).format(value);
    return `${number(Math.floor(seconds / 60))}:${number(seconds % 60)}`;
  };
  const render = () => {
    if (!clock) return;
    const now = performance.now();
    let snapshot = getChessClockSnapshot(clock, now);
    if (snapshot.flagged && clock.running) {
      clock = pauseChessClock(clock, now);
      snapshot = getChessClockSnapshot(clock, now);
    }
    for (const color of ['white', 'black']) {
      times[color].textContent = format(snapshot[`${color}Ms`]);
      const button = playerButtons.find((item) => item.dataset.chessPlayer === color);
      button.classList.toggle('is-active', snapshot.running && snapshot.active === color);
      button.classList.toggle('is-flagged', snapshot.flagged === color);
    }
    pause.disabled = !snapshot.running;
    reset.disabled = false;
    playerButtons.forEach((button) => { button.disabled = !snapshot.running || snapshot.active !== button.dataset.chessPlayer; });
    if (snapshot.flagged) status.textContent = say(snapshot.flagged === 'white' ? 'White ran out of time.' : 'Black ran out of time.');
    else if (snapshot.running) status.textContent = say(snapshot.active === 'white' ? 'White to move' : 'Black to move');
    else if (clock.active) status.textContent = say('Game paused.');
    if (!snapshot.running) { clearTimeout(timer); timer = 0; return; }
    clearTimeout(timer);
    const remaining = snapshot[`${snapshot.active}Ms`];
    timer = window.setTimeout(render, document.hidden ? 1000 : remaining <= 10_000 ? 100 : 250);
  };
  start.addEventListener('click', () => {
    try {
      if (!clock) clock = createChessClock({ minutes: $('[data-chess-minutes]', root).value, incrementSeconds: $('[data-chess-increment]', root).value }, performance.now());
      clock = startChessClock(clock, performance.now());
      settings.querySelectorAll('input').forEach((input) => { input.disabled = true; });
      start.disabled = true;
      render();
    } catch { status.textContent = say('Choose valid clock settings.'); }
  });
  pause.addEventListener('click', () => { clock = pauseChessClock(clock, performance.now()); render(); });
  reset.addEventListener('click', () => {
    if (!clock) return;
    clock = resetChessClock(clock, performance.now());
    settings.querySelectorAll('input').forEach((input) => { input.disabled = false; });
    start.disabled = false;
    status.textContent = say('Clock reset.');
    render();
  });
  playerButtons.forEach((button) => button.addEventListener('click', () => {
    if (!clock?.running || button.dataset.chessPlayer !== clock.active) return;
    clock = switchChessClockPlayer(clock, performance.now());
    render();
  }));
  document.addEventListener('visibilitychange', render);
  window.addEventListener('pagehide', () => { clearTimeout(timer); document.removeEventListener('visibilitychange', render); }, { once: true });
}
