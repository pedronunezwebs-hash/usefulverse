import {
  HALMA_SIZE, applyHalmaMove, createHalmaGame,
  getHalmaNextHops, legalHalmaMoves, playHalmaCpuTurn,
} from './halma-game.mjs';

const root = document.querySelector('[data-market-tool="halma"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const q = (selector) => root.querySelector(selector);
  const squares = [...root.querySelectorAll('[data-halma-square]')];
  const storageKey = 'usefulverse.halma.v1';
  let game = null;
  let selected = null;
  let jumpPath = [];
  let storageAvailable = true;
  let cpuTimer = 0;

  function validSave(saved) {
    return saved && Array.isArray(saved.board) && saved.board.length === HALMA_SIZE * HALMA_SIZE
      && saved.board.every((owner) => owner === null || owner === 0 || owner === 1)
      && (saved.toMove === 0 || saved.toMove === 1)
      && Number.isInteger(saved.turnCount) && saved.turnCount >= 0
      && saved.repetitions && typeof saved.repetitions === 'object'
      && (saved.mode === 'cpu' || saved.mode === 'local')
      && ['playing', 'won', 'draw'].includes(saved.status)
      && (saved.winner === null || saved.winner === 0 || saved.winner === 1);
  }

  function getSaved() {
    try {
      const text = localStorage.getItem(storageKey);
      if (!text) return null;
      const saved = JSON.parse(text);
      return validSave(saved) ? saved : null;
    } catch { return null; }
  }

  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(game)); storageAvailable = true; }
    catch { storageAvailable = false; }
  }

  const ownerName = (owner) => owner === 0 ? (copy.playerOne ?? 'Player 1') : owner === 1
    ? (game?.mode === 'cpu' ? (copy.computer ?? 'Computer') : (copy.playerTwo ?? 'Player 2'))
    : (copy.empty ?? 'empty');

  function statusText() {
    if (!game) return copy.ready ?? '';
    if (game.status === 'draw') return copy.draw ?? '';
    if (game.status === 'won') {
      if (game.mode === 'cpu') return game.winner === 0 ? (copy.gameWon ?? '') : (copy.cpuWon ?? '');
      return game.winner === 0 ? (copy.playerOneWon ?? '') : (copy.playerTwoWon ?? '');
    }
    if (game.mode === 'cpu' && game.toMove === 1) return copy.cpuTurn ?? '';
    if (game.mode === 'local' && game.turnCount > 0) return copy.localTurn ?? '';
    return copy.yourTurn ?? '';
  }

  function render() {
    const active = Boolean(game);
    q('[data-halma-match]').hidden = !active;
    q('[data-halma-resume]').hidden = active || !getSaved();
    q('[data-halma-finish]').hidden = !canFinishJump();
    q('[data-halma-status]').textContent = statusText();
    q('[data-halma-first-field]').hidden = q('#halma-mode').value !== 'cpu';
    if (!game) return;

    q('[data-halma-count-one]').textContent = String(game.board.filter((owner) => owner === 0).length);
    q('[data-halma-count-two]').textContent = String(game.board.filter((owner) => owner === 1).length);
    q('[data-halma-turn]').textContent = game.mode === 'cpu' && game.toMove === 1
      ? (copy.computer ?? 'Computer') : ownerName(game.toMove);
    q('[data-halma-save-note]').textContent = storageAvailable ? (copy.saved ?? '') : (copy.saveUnavailable ?? '');

    const activePlayer = game.mode === 'cpu' ? 0 : game.toMove;
    const legal = legalHalmaMoves(game, activePlayer);
    const availableHops = selected === null ? [] : getHalmaNextHops(game, activePlayer, selected, jumpPath);
    const selectedSteps = new Set(selected === null ? [] : legal.filter((move) => move.from === selected && move.kind === 'step').map((move) => move.to));
    let focusAssigned = false;

    squares.forEach((node, index) => {
      const owner = game.board[index];
      const isSelected = selected === index;
      const isJumpTarget = selected !== null && availableHops.includes(index);
      const isStepTarget = selected !== null && jumpPath.length === 0 && selectedSteps.has(index);
      const enabled = game.status === 'playing' && game.toMove === activePlayer
        && (jumpPath.length ? isJumpTarget
          : selected === null ? owner === activePlayer
            : (isStepTarget || isJumpTarget || owner === activePlayer));
      node.classList.toggle('is-player-one', owner === 0);
      node.classList.toggle('is-player-two', owner === 1);
      node.classList.toggle('is-selected', isSelected);
      node.classList.toggle('is-step-target', isStepTarget);
      node.classList.toggle('is-jump-target', isJumpTarget);
      node.setAttribute('aria-label', `${copy.squareLabel?.replace('{row}', String(Math.floor(index / HALMA_SIZE) + 1)).replace('{column}', String(index % HALMA_SIZE + 1)) ?? `Row ${Math.floor(index / HALMA_SIZE) + 1}, column ${index % HALMA_SIZE + 1}`} · ${ownerName(owner)}`);
      node.setAttribute('aria-selected', String(isSelected));
      node.setAttribute('aria-disabled', String(!enabled));
      node.tabIndex = !focusAssigned && enabled ? (focusAssigned = true, 0) : -1;
    });
  }

  function saveAndRender() { save(); render(); }

  function canFinishJump() {
    if (!game || selected === null || !jumpPath.length) return false;
    const player = game.mode === 'cpu' ? 0 : game.toMove;
    return legalHalmaMoves(game, player, selected).some((move) => move.kind === 'hop'
      && move.path.length === jumpPath.length && move.path.every((point, index) => point === jumpPath[index]));
  }

  function runCpu() {
    window.clearTimeout(cpuTimer);
    if (!game || game.status !== 'playing' || game.mode !== 'cpu' || game.toMove !== 1) return;
    q('[data-halma-status]').textContent = copy.cpuTurn ?? '';
    cpuTimer = window.setTimeout(() => {
      game = playHalmaCpuTurn(game);
      selected = null;
      jumpPath = [];
      saveAndRender();
    }, 120);
  }

  function finishTurn(move) {
    const humanPlayer = game.mode === 'cpu' ? 0 : game.toMove;
    game = applyHalmaMove(game, humanPlayer, move);
    selected = null;
    jumpPath = [];
    saveAndRender();
    runCpu();
  }

  function onSquare(index) {
    if (!game || game.status !== 'playing') return;
    const player = game.mode === 'cpu' ? 0 : game.toMove;
    if (game.toMove !== player) return;
    const owner = game.board[index];
    try {
      if (selected === null) {
        if (owner !== player) return;
        selected = index;
        jumpPath = [];
        render();
        return;
      }
      if (!jumpPath.length && owner === player) {
        selected = index;
        render();
        return;
      }
      const hops = getHalmaNextHops(game, player, selected, jumpPath);
      if (hops.includes(index)) {
        jumpPath = [...jumpPath, index];
        saveAndRender();
        return;
      }
      if (!jumpPath.length) {
        const step = legalHalmaMoves(game, player, selected).find((move) => move.kind === 'step' && move.to === index);
        if (step) { finishTurn(step); return; }
      }
      q('[data-halma-status]').textContent = copy.invalidMove ?? '';
    } catch {
      q('[data-halma-status]').textContent = copy.invalidMove ?? '';
    }
  }

  q('#halma-mode').addEventListener('change', () => {
    q('[data-halma-first-field]').hidden = q('#halma-mode').value !== 'cpu';
  });
  q('[data-halma-new]').addEventListener('click', () => {
    window.clearTimeout(cpuTimer);
    let seed;
    try { seed = crypto.getRandomValues(new Uint32Array(1))[0]; } catch { seed = Date.now() >>> 0; }
    const mode = q('#halma-mode').value;
    const firstPlayer = mode === 'cpu' ? Number(q('#halma-first-player').value) : 0;
    game = createHalmaGame({ seed, mode, firstPlayer });
    selected = null;
    jumpPath = [];
    saveAndRender();
    q('[data-halma-status]').textContent = copy.newStarted ?? '';
    runCpu();
  });
  q('[data-halma-resume]').addEventListener('click', () => {
    const saved = getSaved();
    if (!saved) { q('[data-halma-status]').textContent = copy.saveDamaged ?? ''; return; }
    game = saved;
    selected = null;
    jumpPath = [];
    q('#halma-mode').value = game.mode;
    q('#halma-first-player').value = String(game.toMove);
    render();
    q('[data-halma-status]').textContent = copy.resumed ?? '';
    runCpu();
  });
  q('[data-halma-delete]').addEventListener('click', () => {
    window.clearTimeout(cpuTimer);
    game = null;
    selected = null;
    jumpPath = [];
    let message = copy.deleted ?? '';
    try { localStorage.removeItem(storageKey); storageAvailable = true; }
    catch { storageAvailable = false; message = copy.saveUnavailable ?? ''; }
    render();
    q('[data-halma-status]').textContent = message;
  });
  q('[data-halma-finish]').addEventListener('click', () => {
    if (!canFinishJump()) return;
    const player = game.mode === 'cpu' ? 0 : game.toMove;
    const move = legalHalmaMoves(game, player, selected).find((candidate) => candidate.kind === 'hop'
      && candidate.path.length === jumpPath.length && candidate.path.every((point, index) => point === jumpPath[index]));
    if (move) finishTurn(move);
  });
  for (const node of squares) {
    node.addEventListener('click', () => onSquare(Number(node.dataset.halmaSquare)));
    node.addEventListener('keydown', (event) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      const current = Number(node.dataset.halmaSquare);
      let row = Math.floor(current / HALMA_SIZE);
      let column = current % HALMA_SIZE;
      if (event.key === 'ArrowUp') row = (row + HALMA_SIZE - 1) % HALMA_SIZE;
      if (event.key === 'ArrowDown') row = (row + 1) % HALMA_SIZE;
      if (event.key === 'ArrowLeft') column = (column + HALMA_SIZE - 1) % HALMA_SIZE;
      if (event.key === 'ArrowRight') column = (column + 1) % HALMA_SIZE;
      event.preventDefault();
      squares[row * HALMA_SIZE + column].focus();
    });
  }
  render();
}
