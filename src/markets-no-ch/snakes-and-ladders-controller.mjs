import { createSnakesAndLaddersGame, getSnakesAndLaddersPathPosition, rollSnakesAndLaddersDie, SNAKES_AND_LADDERS_JUMPS } from './snakes-and-ladders.mjs';

const root = document.querySelector('[data-market-tool="snakesAndLadders"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const q = (selector) => root.querySelector(selector);
  const cells = [...root.querySelectorAll('[data-snl-cell]')];
  const storageKey = 'usefulverse.snakes-and-ladders.v1';
  let game = null;
  let storageAvailable = true;
  let cpuTimer = 0;

  function validSave(value) {
    return value && Array.isArray(value.positions) && value.positions.length >= 2 && value.positions.length <= 4
      && value.positions.every((position) => Number.isInteger(position) && position >= 0 && position <= 100)
      && Array.isArray(value.names) && value.names.length === value.positions.length
      && Number.isInteger(value.toMove) && value.toMove >= 0 && value.toMove < value.positions.length
      && Number.isInteger(value.turnCount) && value.turnCount >= 0 && Number.isInteger(value.seed)
      && ['cpu', 'shared'].includes(value.mode) && ['exact', 'bounce'].includes(value.finishRule)
      && ['playing', 'won'].includes(value.status) && (value.winner === null || (Number.isInteger(value.winner) && value.winner >= 0 && value.winner < value.positions.length));
  }

  function getSaved() {
    try { const raw = localStorage.getItem(storageKey); if (!raw) return null; const value = JSON.parse(raw); return validSave(value) ? value : null; }
    catch { return null; }
  }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(game)); storageAvailable = true; }
    catch { storageAvailable = false; }
  }
  function playerName(index) {
    if (game.mode === 'cpu' && index === 0) return copy.you ?? 'You';
    if (game.mode === 'cpu') return (copy.computer ?? 'Computer {number}').replace('{number}', String(index));
    return (copy.player ?? 'Player {number}').replace('{number}', String(index + 1));
  }
  function statusText() {
    if (!game) return copy.ready ?? '';
    if (game.status === 'won') return (copy.won ?? '{player} wins!').replace('{player}', playerName(game.winner));
    if (game.mode === 'cpu' && game.toMove > 0) return copy.computerTurn ?? '';
    return game.mode === 'shared'
      ? (copy.playerTurn ?? '{player} to roll.').replace('{player}', playerName(game.toMove))
      : (copy.yourTurn ?? 'Your turn. Roll the die.');
  }
  function cellLabel(cell, occupants) {
    let label = cell === 1 ? copy.start : cell === 100 ? copy.finish : (copy.position ?? 'Square {number}').replace('{number}', String(cell));
    const jump = SNAKES_AND_LADDERS_JUMPS[cell];
    if (jump) label += ` · ${(jump > cell ? copy.ladder : copy.snake) ?? (jump > cell ? 'Ladder' : 'Snake')} · ${jump}`;
    if (occupants.length) label += ` · ${occupants.map((index) => playerName(index)).join(', ')}`;
    return label;
  }
  function render() {
    q('[data-snl-match]').hidden = !game;
    q('[data-snl-resume]').hidden = Boolean(game) || !getSaved();
    q('[data-snl-roll]').disabled = !game || game.status !== 'playing' || (game.mode === 'cpu' && game.toMove > 0);
    q('[data-snl-status]').textContent = statusText();
    q('[data-snl-save-note]').textContent = storageAvailable ? (copy.saved ?? '') : (copy.saveUnavailable ?? '');
    if (!game) return;
    q('[data-snl-turn]').textContent = game.status === 'won' ? playerName(game.winner) : playerName(game.toMove);
    q('[data-snl-turn-count]').textContent = String(game.turnCount);
    q('[data-snl-rule]').textContent = game.finishRule === 'exact' ? copy.exact : copy.bounce;
    cells.forEach((cell) => {
      const number = Number(cell.dataset.snlCell);
      const occupants = game.positions.flatMap((position, index) => position === number ? [index] : []);
      cell.replaceChildren();
      const numberNode = document.createElement('span'); numberNode.className = 'snl-number'; numberNode.textContent = String(number); cell.append(numberNode);
      const tokens = document.createElement('span'); tokens.className = 'snl-tokens'; tokens.setAttribute('aria-hidden', 'true');
      for (const index of occupants) { const token = document.createElement('span'); token.className = `snl-token snl-token-${index}`; token.textContent = String(index + 1); tokens.append(token); }
      cell.append(tokens);
      const jump = SNAKES_AND_LADDERS_JUMPS[number];
      cell.classList.toggle('is-ladder', Boolean(jump && jump > number));
      cell.classList.toggle('is-snake', Boolean(jump && jump < number));
      cell.setAttribute('aria-label', cellLabel(number, occupants));
    });
  }
  function announceTurn(result) {
    const move = result.lastMove;
    if (result.status === 'won') return (copy.won ?? '{player} wins!').replace('{player}', playerName(move.player));
    if (move.jump === 'ladder') return `${(copy.rollResult ?? '{player} rolled {roll}: {landed}.').replace('{player}', playerName(move.player)).replace('{roll}', String(move.roll)).replace('{from}', String(move.from)).replace('{landed}', String(move.landed))} ${(copy.ladder ?? 'Ladder! Climb to square {to}.').replace('{to}', String(move.to))}`;
    if (move.jump === 'snake') return `${(copy.rollResult ?? '{player} rolled {roll}: {landed}.').replace('{player}', playerName(move.player)).replace('{roll}', String(move.roll)).replace('{from}', String(move.from)).replace('{landed}', String(move.landed))} ${(copy.snake ?? 'Snake! Slide to square {to}.').replace('{to}', String(move.to))}`;
    if (move.to === move.from && move.from + move.roll > 100) return game.finishRule === 'exact' ? copy.stayed : (copy.bounced ?? 'Bounced to {to}.').replace('{to}', String(move.to));
    return (copy.rollResult ?? '{player} rolled {roll}: moved from {from} to {landed}.').replace('{player}', playerName(move.player)).replace('{roll}', String(move.roll)).replace('{from}', String(move.from)).replace('{landed}', String(move.landed));
  }
  function saveAndRender() { save(); render(); }
  function runCpu() {
    window.clearTimeout(cpuTimer);
    if (!game || game.status !== 'playing' || game.mode !== 'cpu' || game.toMove === 0) return;
    q('[data-snl-status]').textContent = copy.computerTurn ?? '';
    cpuTimer = window.setTimeout(() => {
      game = rollSnakesAndLaddersDie(game);
      const message = announceTurn(game);
      saveAndRender();
      if (game.status === 'playing' && game.mode === 'cpu' && game.toMove > 0) {
        q('[data-snl-status]').textContent = `${message} ${copy.computerTurn ?? ''}`;
        cpuTimer = window.setTimeout(runCpu, 350);
      } else q('[data-snl-status]').textContent = game.status === 'playing' ? `${message} ${statusText()}` : message;
    }, 350);
  }

  q('[data-snl-new]').addEventListener('click', () => {
    window.clearTimeout(cpuTimer);
    let seed; try { seed = crypto.getRandomValues(new Uint32Array(1))[0]; } catch { seed = Date.now() >>> 0; }
    game = createSnakesAndLaddersGame({ seed, playerCount: Number(q('#snl-players').value), mode: q('#snl-mode').value, finishRule: q('#snl-finish').value });
    saveAndRender(); q('[data-snl-status]').textContent = copy.newStarted ?? '';
    runCpu();
  });
  q('[data-snl-roll]').addEventListener('click', () => {
    if (!game || game.status !== 'playing' || (game.mode === 'cpu' && game.toMove !== 0)) return;
    game = rollSnakesAndLaddersDie(game);
    const message = announceTurn(game);
    saveAndRender(); q('[data-snl-status]').textContent = game.status === 'playing' ? `${message} ${statusText()}` : message;
    runCpu();
  });
  q('[data-snl-resume]').addEventListener('click', () => {
    const saved = getSaved(); if (!saved) return;
    window.clearTimeout(cpuTimer); game = saved; saveAndRender(); q('[data-snl-status]').textContent = copy.resumed ?? '';
    runCpu();
  });
  q('[data-snl-delete]').addEventListener('click', () => {
    window.clearTimeout(cpuTimer); game = null;
    try { localStorage.removeItem(storageKey); storageAvailable = true; } catch { storageAvailable = false; }
    q('[data-snl-status]').textContent = copy.deleted ?? ''; render();
  });
  render();
}
