const q = (selector) => document.querySelector(selector);
const tool = q('.suguru-tool');
if (tool) {
  const copy = JSON.parse(q('[data-tool-copy]').textContent).fields;
  const worker = new Worker('/assets/suguru-worker.mjs', { type: 'module' });
  const saveKey = 'usefulverse-suguru-save-v1';
  const statsKey = 'usefulverse-suguru-stats-v1';
  let requestId = 0;
  let game = null;
  let selected = -1;
  let notesMode = false;
  let undoStack = [];
  let daily = false;
  let savedAvailable = true;

  const message = (text) => { q('[data-suguru-status]').textContent = text; };
  const storageRead = (key) => { try { return JSON.parse(localStorage.getItem(key) ?? 'null'); } catch { return null; } };
  const save = () => {
    if (!game) return;
    try {
      localStorage.setItem(saveKey, JSON.stringify({ game, selected, notesMode, daily }));
      savedAvailable = true;
    } catch { savedAvailable = false; q('[data-suguru-save-note]').textContent = copy.saveUnavailable; }
  };
  const request = (type, payload) => new Promise((resolve, reject) => {
    const id = ++requestId;
    const listener = ({ data }) => {
      if (data?.id !== id) return;
      worker.removeEventListener('message', listener);
      data.ok ? resolve(data) : reject(new Error(data.error || copy.generateFailed));
    };
    worker.addEventListener('message', listener);
    worker.postMessage({ id, type, payload });
  });
  const snapshot = () => ({ values: [...game.values], notes: game.notes.map((items) => [...items]), selected, notesMode });
  const remember = () => { undoStack.push(snapshot()); if (undoStack.length > 100) undoStack.shift(); };
  const regionAt = (cell) => game.puzzle.regions.findIndex((region) => region.includes(cell));
  const borderClass = (cell) => {
    const row = Math.floor(cell / game.puzzle.width); const col = cell % game.puzzle.width;
    const region = regionAt(cell);
    const at = (r, c) => r < 0 || r >= game.puzzle.height || c < 0 || c >= game.puzzle.width ? -1 : regionAt(r * game.puzzle.width + c);
    return ['top', 'right', 'bottom', 'left'].filter((side) => {
      if (side === 'top') return at(row - 1, col) !== region;
      if (side === 'right') return at(row, col + 1) !== region;
      if (side === 'bottom') return at(row + 1, col) !== region;
      return at(row, col - 1) !== region;
    }).map((side) => `suguru-region-${side}`).join(' ');
  };
  const conflictCells = () => {
    const conflicts = new Set();
    const check = async () => request('check', { puzzle: game.puzzle, values: game.values });
    return { conflicts, check };
  };
  const render = () => {
    if (!game) return;
    const { width, height } = game.puzzle;
    const board = q('[data-suguru-board]');
    board.style.setProperty('--suguru-size', String(width));
    board.setAttribute('aria-label', `${width} × ${height} Suguru puzzle`);
    const invalid = new Set();
    for (let cell = 0; cell < game.values.length; cell += 1) {
      const value = game.values[cell]; if (!value) continue;
      const row = Math.floor(cell / width); const col = cell % width;
      for (let dr = -1; dr <= 1; dr += 1) for (let dc = -1; dc <= 1; dc += 1) {
        if (!dr && !dc) continue;
        const r = row + dr; const c = col + dc;
        if (r < 0 || r >= height || c < 0 || c >= width) continue;
        const other = r * width + c;
        if (other > cell && game.values[other] === value) { invalid.add(cell); invalid.add(other); }
      }
    }
    board.innerHTML = Array.from({ length: width * height }, (_, cell) => {
      const value = game.values[cell];
      const notes = game.notes[cell].map((note) => `<span>${note}</span>`).join('');
      const classes = ['suguru-cell', borderClass(cell), selected === cell ? 'is-selected' : '', game.puzzle.givens[cell] ? 'is-given' : '', invalid.has(cell) ? 'has-conflict' : ''].filter(Boolean).join(' ');
      const label = `${copy.cell} ${Math.floor(cell / width) + 1}, ${cell % width + 1}; ${copy.region} ${regionAt(cell) + 1}; ${value || copy.empty}${game.puzzle.givens[cell] ? `; ${copy.given}` : ''}${invalid.has(cell) ? `; ${copy.conflict}` : ''}`;
      return `<button type="button" class="${classes}" data-suguru-cell="${cell}" aria-label="${label}" aria-pressed="${selected === cell}"${game.puzzle.givens[cell] ? ' aria-disabled="true"' : ''}>${value ? `<span class="suguru-value">${value}</span>` : `<span class="suguru-notes">${notes}</span>`}</button>`;
    }).join('');
    q('[data-suguru-match]').hidden = false;
    q('[data-suguru-notes-toggle]').setAttribute('aria-pressed', String(notesMode));
    q('[data-suguru-notes-toggle]').textContent = `${copy.notes}: ${notesMode ? copy.notesOn : copy.notesOff}`;
    q('[data-suguru-difficulty]').textContent = `${copy.difficulty}: ${copy[game.puzzle.difficulty]}`;
    q('[data-suguru-selected]').textContent = selected >= 0 ? `${copy.selected}: ${Math.floor(selected / width) + 1}, ${selected % width + 1}` : copy.selectCell;
    q('[data-suguru-resume]').hidden = true;
    q('[data-suguru-undo]').disabled = undoStack.length === 0;
    save();
  };
  const refreshStats = () => {
    const stats = storageRead(statsKey) ?? { completed: [], streak: 0, best: 0, last: '' };
    q('[data-suguru-stats]').innerHTML = `<p>${copy.played}: <strong>${stats.completed.length}</strong></p><p>${copy.streak}: <strong>${stats.streak}</strong></p><p>${copy.best}: <strong>${stats.best}</strong></p>`;
  };
  const recordDaily = () => {
    if (!daily) return;
    const today = new Date().toISOString().slice(0, 10);
    const stats = storageRead(statsKey) ?? { completed: [], streak: 0, best: 0, last: '' };
    if (stats.completed.includes(today)) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    stats.streak = stats.last === yesterday ? stats.streak + 1 : 1;
    stats.best = Math.max(stats.best, stats.streak);
    stats.last = today;
    stats.completed = [...stats.completed.filter((date) => date >= new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10)), today];
    try { localStorage.setItem(statsKey, JSON.stringify(stats)); } catch {}
    refreshStats();
  };
  const start = async ({ size = Number(q('[data-suguru-size-select]').value), isDaily = false, seed = null } = {}) => {
    daily = isDaily;
    q('[data-suguru-new]').disabled = true; q('[data-suguru-daily]').disabled = true;
    q('[data-suguru-match]').hidden = true;
    message(copy.generating);
    try {
      if (seed === null) seed = isDaily ? Number(new Date().toISOString().slice(0, 10).replaceAll('-', '')) : crypto.getRandomValues(new Uint32Array(1))[0];
      const result = await request('generate', { width: size, height: size, seed });
      game = { puzzle: result.puzzle, values: [...result.puzzle.givens], notes: Array.from({ length: result.puzzle.givens.length }, () => []), complete: false };
      selected = -1; notesMode = false; undoStack = [];
      q('[data-suguru-save-note]').textContent = savedAvailable ? copy.saved : copy.saveUnavailable;
      render();
      message(isDaily ? copy.dailyReady : copy.generated);
    } catch (error) { game = null; message(`${copy.generateFailed} ${error.message}`); }
    finally { q('[data-suguru-new]').disabled = false; q('[data-suguru-daily]').disabled = false; }
  };
  const put = (value) => {
    if (!game || selected < 0 || game.puzzle.givens[selected] || game.complete) return;
    remember();
    if (notesMode && value) {
      const notes = new Set(game.notes[selected]);
      if (notes.has(value)) notes.delete(value); else notes.add(value);
      game.notes[selected] = [...notes].sort();
    } else {
      game.values[selected] = value;
      if (value) game.notes[selected] = [];
    }
    render();
  };
  const setNumber = (value) => {
    if (!Number.isInteger(value) || value < 1 || value > 5) return;
    put(value);
  };
  const afterCheck = async () => {
    if (!game) return;
    const result = await request('check', { puzzle: game.puzzle, values: game.values });
    if (result.result.solved) {
      game.complete = true; save(); recordDaily(); message(daily ? copy.dailyComplete : copy.solved);
    } else if (result.result.valid) message(copy.incomplete);
    else message(copy.statusWrong);
    render();
  };
  const hint = async (reveal = false) => {
    if (!game || selected < 0 || game.values[selected]) { message(copy.selectCell); return; }
    try {
      const result = await request('hint', { puzzle: game.puzzle, values: game.values, cell: selected });
      if (!result.hint.consistent) { message(copy.statusWrong); return; }
      if (result.hint.logical) {
        message(`${copy.hintSingle} ${copy.hintRegion} ${copy.hintNeighbors} Candidate: ${result.hint.candidates.join(', ')}.`);
      } else if (reveal) {
        message(copy.hintReveal); setNumber(result.hint.value);
      } else message(copy.noHint);
    } catch (error) { message(error.message); }
  };

  tool.addEventListener('click', (event) => {
    const cell = event.target.closest('[data-suguru-cell]');
    if (cell) { selected = Number(cell.dataset.suguruCell); render(); return; }
    const action = event.target.closest('[data-suguru-action]')?.dataset.suguruAction;
    if (action === 'number') { setNumber(Number(event.target.dataset.value)); return; }
    if (action === 'new') start();
    else if (action === 'daily') start({ size: 10, isDaily: true });
    else if (action === 'notes') { notesMode = !notesMode; render(); }
    else if (action === 'erase') put(0);
    else if (action === 'undo' && undoStack.length) {
      const state = undoStack.pop(); game.values = state.values; game.notes = state.notes; selected = state.selected; notesMode = state.notesMode; render();
    }
    else if (action === 'check') afterCheck().catch((error) => message(error.message));
    else if (action === 'hint') hint(false);
    else if (action === 'reveal') hint(true);
    else if (action === 'delete') {
      try { localStorage.removeItem(saveKey); savedAvailable = true; q('[data-suguru-resume]').hidden = true; q('[data-suguru-save-note]').textContent = copy.deleted; } catch { message(copy.saveUnavailable); }
    }
    else if (action === 'resume') {
      const data = storageRead(saveKey);
      if (!data?.game?.puzzle) { message(copy.loadingError); return; }
      game = data.game; selected = data.selected ?? -1; notesMode = Boolean(data.notesMode); daily = Boolean(data.daily); undoStack = []; render(); message(copy.resumed);
    }
  });
  tool.addEventListener('keydown', (event) => {
    if (/^[1-5]$/u.test(event.key)) { setNumber(Number(event.key)); event.preventDefault(); }
    else if (event.key === 'Backspace' || event.key === 'Delete') { put(0); event.preventDefault(); }
    else if (event.key.startsWith('Arrow') && game && selected >= 0) {
      const row = Math.floor(selected / game.puzzle.width); const col = selected % game.puzzle.width;
      const delta = event.key === 'ArrowLeft' ? [0, -1] : event.key === 'ArrowRight' ? [0, 1] : event.key === 'ArrowUp' ? [-1, 0] : [1, 0];
      const nr = Math.max(0, Math.min(game.puzzle.height - 1, row + delta[0])); const nc = Math.max(0, Math.min(game.puzzle.width - 1, col + delta[1]));
      selected = nr * game.puzzle.width + nc; render(); event.preventDefault();
    }
  });
  worker.addEventListener('error', () => message(copy.loadingError));
  refreshStats();
  if (storageRead(saveKey)) q('[data-suguru-resume]').hidden = false;
}
