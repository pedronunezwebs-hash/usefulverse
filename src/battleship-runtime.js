import { BATTLESHIP_SIZE, createBattleshipGame, playBattleshipTurn } from './battleship-logic.mjs';

function randomValue() {
  if (globalThis.crypto?.getRandomValues) { const value = new Uint32Array(1); globalThis.crypto.getRandomValues(value); return value[0] / 0x1_0000_0000; }
  return Math.random();
}

export function setupBattleship(root) {
  const messages = JSON.parse(root.dataset.plannerMessages || '{}');
  const say = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), messages[key] ?? key);
  const enemyGrid = root.querySelector('[data-battleship-enemy]'); const playerGrid = root.querySelector('[data-battleship-player]'); const status = root.querySelector('#op-status');
  let game = createBattleshipGame(randomValue); let focusedEnemyCell = 0;
  const stateName = (mark, ship) => mark === -1 ? say('No ship here') : mark > 0 ? say('Ship hit') : ship ? say('Ship') : say('No shot yet');
  const number = new Intl.NumberFormat(document.documentElement.lang || 'en');
  const cellButton = ({ index, mark, ship = false, enemy = false }) => {
    const row = Math.floor(index / BATTLESHIP_SIZE) + 1; const column = index % BATTLESHIP_SIZE + 1;
    const button = document.createElement('button'); button.type = 'button'; button.className = 'battleship__cell';
    if (ship && !enemy) button.classList.add('is-ship');
    if (mark === -1) button.classList.add('is-miss');
    if (mark > 0) button.classList.add('is-hit');
    button.textContent = mark === -1 ? '·' : mark > 0 ? '×' : ship && !enemy ? '■' : '';
    button.dataset.battleshipCell = String(index); button.disabled = !enemy || game.over || mark !== 0;
    button.tabIndex = enemy && index === focusedEnemyCell && !button.disabled ? 0 : -1;
    button.setAttribute('aria-label', say('Row {row}, column {column}: {state}', { row, column, state: stateName(mark, ship && !enemy) }));
    return button;
  };
  const render = (restoreFocus = false) => {
    enemyGrid.replaceChildren(); playerGrid.replaceChildren();
    enemyGrid.style.setProperty('--battleship-size', String(BATTLESHIP_SIZE + 1)); playerGrid.style.setProperty('--battleship-size', String(BATTLESHIP_SIZE + 1));
    for (const grid of [enemyGrid, playerGrid]) {
      const corner = document.createElement('span'); corner.className = 'battleship__coordinate'; corner.setAttribute('aria-hidden', 'true'); grid.append(corner);
      for (let column = 1; column <= BATTLESHIP_SIZE; column += 1) { const label = document.createElement('span'); label.className = 'battleship__coordinate'; label.textContent = number.format(column); label.setAttribute('aria-hidden', 'true'); grid.append(label); }
    }
    for (let index = 0; index < game.playerFleet.length; index += 1) {
      if (index % BATTLESHIP_SIZE === 0) { const label = document.createElement('span'); label.className = 'battleship__coordinate'; label.textContent = number.format(Math.floor(index / BATTLESHIP_SIZE) + 1); label.setAttribute('aria-hidden', 'true'); enemyGrid.append(label); playerGrid.append(label.cloneNode(true)); }
      enemyGrid.append(cellButton({ index, mark: game.playerShots[index], enemy: true }));
      playerGrid.append(cellButton({ index, mark: game.enemyShots[index], ship: game.playerFleet[index] > 0 }));
    }
    if (restoreFocus) enemyGrid.querySelector(`[data-battleship-cell="${focusedEnemyCell}"]:not(:disabled)`)?.focus();
  };
  const announce = (text, kind = '') => { status.textContent = text; status.className = `tool-status${kind ? ` is-${kind}` : ''}`; };
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-battleship-new]')) { game = createBattleshipGame(randomValue); focusedEnemyCell = 0; render(true); announce(say('A new fleet was placed randomly.')); return; }
    const cell = event.target.closest('[data-battleship-cell]'); if (!cell || !enemyGrid.contains(cell) || cell.disabled) return;
    focusedEnemyCell = Number(cell.dataset.battleshipCell);
    const result = playBattleshipTurn(game, focusedEnemyCell, randomValue); if (!result) return;
    game = result.game; render(true);
    if (game.winner === 'player') { announce(say('You win!'), 'success'); return; }
    if (game.winner === 'computer') { announce(say('The computer sank your fleet.'), 'error'); return; }
    const computerMessage = result.enemyShot.hit
      ? say('Computer hit your ship at row {row}, column {column}.', { row: Math.floor(result.enemyShot.index / BATTLESHIP_SIZE) + 1, column: result.enemyShot.index % BATTLESHIP_SIZE + 1 })
      : say('Computer missed at row {row}, column {column}.', { row: Math.floor(result.enemyShot.index / BATTLESHIP_SIZE) + 1, column: result.enemyShot.index % BATTLESHIP_SIZE + 1 });
    announce(`${result.playerHit ? say(result.playerSunk ? 'You sank a ship!' : 'You hit a ship.') : say('You missed.')} ${computerMessage}`);
  });
  enemyGrid.addEventListener('keydown', (event) => {
    const cell = event.target.closest('[data-battleship-cell]'); if (!cell) return;
    const index = Number(cell.dataset.battleshipCell); const row = Math.floor(index / BATTLESHIP_SIZE); const column = index % BATTLESHIP_SIZE;
    const next = { ArrowLeft: column > 0 ? index - 1 : -1, ArrowRight: column < BATTLESHIP_SIZE - 1 ? index + 1 : -1, ArrowUp: row > 0 ? index - BATTLESHIP_SIZE : -1, ArrowDown: row < BATTLESHIP_SIZE - 1 ? index + BATTLESHIP_SIZE : -1 }[event.key];
    if (next === undefined) return; event.preventDefault(); focusedEnemyCell = next; enemyGrid.querySelector(`[data-battleship-cell="${next}"]:not(:disabled)`)?.focus();
  });
  render(); announce(say('Choose an untried square on the enemy board to fire.'));
}
