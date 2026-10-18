import {
  createMorrisGame, getMorrisRemovablePoints, legalMorrisMoves, moveMorrisPiece,
  placeMorrisPiece, playMorrisCpuTurn, removeMorrisPiece,
} from './nine-mens-morris.mjs';

const root = document.querySelector('[data-market-tool="nineMensMorris"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const q = (selector) => root.querySelector(selector);
  const points = [...root.querySelectorAll('[data-morris-point]')];
  const storageKey = 'usefulverse.nineMensMorris.v1';
  let game = null;
  let selected = null;
  let storageAvailable = true;
  let cpuTimer = 0;

  function getSaved() {
    try {
      const text = localStorage.getItem(storageKey);
      if (!text) return null;
      const saved = JSON.parse(text);
      if (!Array.isArray(saved.board) || saved.board.length !== 24 || !Array.isArray(saved.placed) || saved.placed.length !== 2 || !Array.isArray(saved.onBoard) || saved.onBoard.length !== 2 || !['placing', 'moving', 'flying'].includes(saved.phase) || !['playing', 'won', 'draw'].includes(saved.status) || saved.board.some((owner) => ![null, 0, 1].includes(owner))) return null;
      return saved;
    } catch { return null; }
  }

  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(game)); storageAvailable = true; }
    catch { storageAvailable = false; }
  }

  function labelForPoint(index, owner) {
    const label = copy.pointLabel ?? 'Point {number}';
    const point = label.replace('{number}', String(index + 1));
    if (owner === 0) return `${point} · ${copy.you ?? 'You'}`;
    if (owner === 1) return `${point} · ${copy.computer ?? 'Computer'}`;
    return point;
  }

  function phaseText() {
    if (!game) return '';
    if (game.phase === 'placing') return copy.phasePlace ?? '';
    if (game.phase === 'flying' && game.onBoard[game.toMove] === 3) return copy.phaseFly ?? '';
    return copy.phaseMove ?? '';
  }

  function statusText() {
    if (!game) return copy.ready ?? '';
    if (game.status === 'draw') return copy.draw ?? '';
    if (game.status === 'won') return game.winner === 0 ? (copy.gameWon ?? '') : (copy.cpuWon ?? '');
    if (game.pendingMill) return game.toMove === 0 ? (copy.selectCapture ?? '') : (copy.cpuTurn ?? '');
    if (game.toMove === 1) return copy.cpuTurn ?? '';
    if (game.phase === 'placing') return copy.yourTurnPlace ?? '';
    if (game.phase === 'flying' && game.onBoard[0] === 3) return copy.yourTurnFly ?? '';
    return copy.yourTurnMove ?? '';
  }

  function render() {
    const active = Boolean(game);
    q('[data-morris-match]').hidden = !active;
    const saved = getSaved();
    q('[data-morris-resume]').hidden = Boolean(game) || !saved;
    q('[data-morris-status]').textContent = statusText();
    if (!game) return;
    q('[data-morris-count-you]').textContent = String(game.onBoard[0]);
    q('[data-morris-count-cpu]').textContent = String(game.onBoard[1]);
    q('[data-morris-hand-you]').textContent = String(Math.max(0, 9 - game.placed[0]));
    q('[data-morris-hand-cpu]').textContent = String(Math.max(0, 9 - game.placed[1]));
    q('[data-morris-turn]').textContent = game.toMove === 0 ? (copy.you ?? 'You') : (copy.computer ?? 'Computer');
    q('[data-morris-phase]').textContent = phaseText();
    q('[data-morris-save-note]').textContent = storageAvailable ? (copy.saved ?? '') : (copy.saveUnavailable ?? '');

    const captureOptions = new Set(getMorrisRemovablePoints(game, 0));
    const legalMoves = legalMorrisMoves(game, 0);
    points.forEach((node, index) => {
      const owner = game.board[index];
      const isSelected = selected === index;
      node.classList.toggle('is-you', owner === 0);
      node.classList.toggle('is-computer', owner === 1);
      node.classList.toggle('is-selected', isSelected);
      node.classList.toggle('is-capture-option', game.pendingMill && captureOptions.has(index));
      node.setAttribute('aria-label', labelForPoint(index, owner));
      node.setAttribute('aria-pressed', String(isSelected));
      const enabled = game.status === 'playing' && game.toMove === 0 && (
        game.pendingMill ? captureOptions.has(index)
          : game.phase === 'placing' ? owner === null
            : selected === null ? owner === 0
              : (owner === null && legalMoves.some((move) => move.from === selected && move.to === index)) || owner === 0
      );
      node.setAttribute('aria-disabled', String(!enabled));
      node.setAttribute('tabindex', enabled ? '0' : '-1');
    });
  }

  function saveAndRender() { save(); render(); }

  function runCpu() {
    window.clearTimeout(cpuTimer);
    if (!game || game.status !== 'playing' || game.toMove !== 1) return;
    q('[data-morris-status]').textContent = copy.cpuTurn ?? '';
    cpuTimer = window.setTimeout(() => {
      game = playMorrisCpuTurn(game);
      selected = null;
      saveAndRender();
    }, 120);
  }

  function finishHumanAction() {
    selected = null;
    saveAndRender();
    runCpu();
  }

  function onPoint(index) {
    if (!game || game.status !== 'playing' || game.toMove !== 0) return;
    const owner = game.board[index];
    try {
      if (game.pendingMill) {
        game = removeMorrisPiece(game, 0, index);
        finishHumanAction();
        return;
      }
      if (game.phase === 'placing') {
        game = placeMorrisPiece(game, 0, index);
        if (game.pendingMill) { saveAndRender(); return; }
        finishHumanAction();
        return;
      }
      if (selected === null) {
        if (owner !== 0) throw new Error('select-own');
        selected = index; render(); return;
      }
      if (owner === 0) { selected = index; render(); return; }
      game = moveMorrisPiece(game, 0, selected, index);
      if (game.pendingMill) { selected = null; saveAndRender(); return; }
      finishHumanAction();
    } catch (error) {
      q('[data-morris-status]').textContent = error.message === 'select-own' ? (copy.selectOwn ?? '') : (game.pendingMill ? (copy.invalidCapture ?? '') : (copy.invalidMove ?? ''));
    }
  }

  q('[data-morris-new]').addEventListener('click', () => {
    window.clearTimeout(cpuTimer);
    let seed;
    try { seed = crypto.getRandomValues(new Uint32Array(1))[0]; } catch { seed = Date.now() >>> 0; }
    game = createMorrisGame({ seed }); selected = null; saveAndRender();
    q('[data-morris-status]').textContent = copy.newStarted ?? '';
  });
  q('[data-morris-resume]').addEventListener('click', () => {
    const saved = getSaved();
    if (!saved) { q('[data-morris-status]').textContent = copy.saveDamaged ?? ''; return; }
    game = saved; selected = null; render(); q('[data-morris-status]').textContent = copy.resumed ?? ''; runCpu();
  });
  q('[data-morris-delete]').addEventListener('click', () => {
    window.clearTimeout(cpuTimer); game = null; selected = null;
    try { localStorage.removeItem(storageKey); storageAvailable = true; q('[data-morris-status]').textContent = copy.deleted ?? ''; }
    catch { storageAvailable = false; q('[data-morris-status]').textContent = copy.saveUnavailable ?? ''; }
    render();
  });
  for (const node of points) {
    node.addEventListener('click', () => onPoint(Number(node.dataset.morrisPoint)));
    node.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onPoint(Number(node.dataset.morrisPoint)); }
    });
  }
  render();
}
