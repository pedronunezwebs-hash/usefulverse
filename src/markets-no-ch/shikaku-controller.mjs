import { canPlaceShikakuRegion, dailyShikakuSeed, generateShikaku, rectangleBetween, validateShikaku } from './shikaku.mjs';

const root = document.querySelector('[data-shikaku]');
if (root) {
  const payload = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = payload.fields ?? {};
  const $ = (selector) => root.querySelector(selector);
  const status = $('[data-shikaku-status]'); const board = $('[data-shikaku-board]');
  const match = $('[data-shikaku-match]'); const saveKey = 'usefulverse-shikaku-save-v1';
  let puzzle = null; let regions = []; let solution = []; let start = null; let drag = null; let preview = null; let undo = [];
  const text = (key) => f[key] ?? key;
  const say = (key) => { status.textContent = text(key); };
  const localDate = () => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), now.getDate()); };
  const save = () => { if (!puzzle) return; try { localStorage.setItem(saveKey, JSON.stringify({ puzzle, regions, solution })); $('[data-shikaku-resume]').hidden = false; } catch { $('[data-shikaku-resume]').hidden = true; } };
  const boundsFor = (startIndex, endIndex) => rectangleBetween(startIndex, endIndex, puzzle.size);
  const regionOwner = (index) => regions.findIndex((region) => {
    const row = Math.floor(index / puzzle.size); const col = index % puzzle.size;
    return row >= region.top && row <= region.bottom && col >= region.left && col <= region.right;
  });
  const paintPreview = () => {
    for (const cell of board.querySelectorAll('[data-shikaku-cell]')) {
      const index = Number(cell.dataset.shikakuCell); const row = Math.floor(index / puzzle.size); const col = index % puzzle.size;
      cell.classList.toggle('is-preview', Boolean(preview && row >= preview.top && row <= preview.bottom && col >= preview.left && col <= preview.right));
      cell.setAttribute('aria-pressed', String(start === index));
    }
  };
  const draw = () => {
    if (!puzzle) return;
    board.style.setProperty('--shikaku-size', puzzle.size);
    board.setAttribute('aria-label', `${puzzle.size} × ${puzzle.size}`);
    board.innerHTML = Array.from({ length: puzzle.size * puzzle.size }, (_, index) => {
      const clue = puzzle.clues.find((item) => item.index === index); const owner = regionOwner(index);
      const row = Math.floor(index / puzzle.size); const col = index % puzzle.size;
      const isPreview = preview && row >= preview.top && row <= preview.bottom && col >= preview.left && col <= preview.right;
      const region = owner >= 0 ? regions[owner] : null;
      const edge = (condition) => condition ? 'shikaku-edge' : '';
      const regionClass = owner >= 0 ? `shikaku-region shikaku-color-${owner % 8}` : '';
      const clueLabel = clue ? `${clue.area}` : '·';
      return `<button type="button" class="shikaku-cell ${regionClass} ${isPreview ? 'is-preview' : ''} ${clue ? 'has-clue' : ''} ${region ? [edge(row === region.top), edge(col === region.right), edge(row === region.bottom), edge(col === region.left)].join(' ') : ''}" data-shikaku-cell="${index}" aria-label="${row + 1}, ${col + 1}${clue ? `, ${clue.area}` : ''}" aria-pressed="${start === index}">${clueLabel}</button>`;
    }).join('');
    $('[data-shikaku-count]').textContent = `${regions.length} / ${puzzle.clues.length}`;
    $('[data-shikaku-seed]').textContent = String(puzzle.seed);
    $('[data-shikaku-undo]').disabled = undo.length === 0;
    $('[data-shikaku-match]').hidden = false;
  };
  const begin = (seed, daily = false) => {
    const size = Number($('[data-shikaku-size]').value);
    try {
      const generated = generateShikaku(size, seed, { maxAttempts: 250 });
      puzzle = { size: generated.size, clues: generated.clues, seed: generated.seed };
      solution = generated.solution; regions = []; undo = []; start = null; preview = null;
      draw(); save(); say(daily ? 'statusDaily' : 'statusGenerated');
    } catch {
      say('statusIncomplete');
    }
  };
  const randomSeed = () => { const values = new Uint32Array(1); crypto.getRandomValues(values); return values[0] || 1; };
  const commit = (from, to) => {
    const rect = boundsFor(from, to);
    if (!canPlaceShikakuRegion(puzzle, rect, regions)) { say('statusInvalid'); return false; }
    undo.push(regions.map((item) => ({ ...item }))); regions.push({ ...rect, area: (rect.bottom - rect.top + 1) * (rect.right - rect.left + 1) });
    start = null; preview = null; draw(); save(); say('statusPlaced');
    const checked = validateShikaku(puzzle, regions);
    if (checked.valid) say('statusWon');
    return true;
  };
  root.addEventListener('pointerdown', (event) => {
    const cell = event.target.closest('[data-shikaku-cell]'); if (!cell || !puzzle || event.button > 0) return;
    drag = Number(cell.dataset.shikakuCell); preview = boundsFor(drag, drag); paintPreview();
  });
  root.addEventListener('pointerover', (event) => {
    const cell = event.target.closest('[data-shikaku-cell]'); if (drag === null || !cell) return;
    preview = boundsFor(drag, Number(cell.dataset.shikakuCell)); paintPreview();
  });
  root.addEventListener('pointerup', (event) => {
    if (drag === null) return;
    const cell = event.target.closest('[data-shikaku-cell]'); const from = drag; drag = null;
    if (cell && Number(cell.dataset.shikakuCell) !== from) { commit(from, Number(cell.dataset.shikakuCell)); root.dataset.suppressClick = 'true'; }
    else { preview = null; paintPreview(); }
  });
  root.addEventListener('pointercancel', () => { drag = null; preview = null; if (puzzle) paintPreview(); });
  root.addEventListener('click', (event) => {
    const cell = event.target.closest('[data-shikaku-cell]'); if (!cell || !puzzle) return;
    if (root.dataset.suppressClick === 'true') { delete root.dataset.suppressClick; return; }
    const index = Number(cell.dataset.shikakuCell); const owner = regionOwner(index);
    if (owner >= 0) { undo.push(regions.map((item) => ({ ...item }))); regions.splice(owner, 1); start = null; draw(); save(); say('statusRemoved'); return; }
    if (start === null) { start = index; preview = null; draw(); say('selectEnd'); return; }
    const from = start; start = null; commit(from, index);
  });
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-shikaku-action]')?.dataset.shikakuAction;
    if (!action) return;
    if (action === 'new') begin(randomSeed());
    if (action === 'daily') begin(dailyShikakuSeed(localDate()), true);
    if (action === 'undo' && undo.length) { regions = undo.pop(); start = null; draw(); save(); say('statusRemoved'); }
    if (action === 'clear') { undo.push(regions.map((item) => ({ ...item }))); regions = []; start = null; draw(); save(); say('statusRemoved'); }
    if (action === 'check') say(validateShikaku(puzzle, regions).valid ? 'statusWon' : regions.length < puzzle.clues.length ? 'statusIncomplete' : 'statusWrong');
    if (action === 'hint') {
      const missing = solution.find((candidate) => !regions.some((placed) => placed.top === candidate.top && placed.left === candidate.left && placed.bottom === candidate.bottom && placed.right === candidate.right));
      if (!missing) { say('statusNoHint'); return; }
      preview = missing; draw(); say('statusHint'); window.setTimeout(() => { if (preview === missing) { preview = null; draw(); } }, 1800);
    }
    if (action === 'reveal') { regions = solution.map((region) => ({ ...region })); undo = []; draw(); save(); say('statusRevealed'); }
    if (action === 'resume') {
      try { const saved = JSON.parse(localStorage.getItem(saveKey)); if (!saved?.puzzle || !validateShikaku(saved.puzzle, saved.solution).valid) throw new Error('bad save'); puzzle = saved.puzzle; solution = saved.solution; regions = Array.isArray(saved.regions) ? saved.regions : []; undo = []; start = null; draw(); say('statusSaved'); } catch { say('statusIncomplete'); }
    }
    if (action === 'delete') { localStorage.removeItem(saveKey); $('[data-shikaku-resume]').hidden = true; say('statusDeleted'); }
  });
  try { const saved = JSON.parse(localStorage.getItem(saveKey)); if (saved?.puzzle && validateShikaku(saved.puzzle, saved.solution).valid) $('[data-shikaku-resume]').hidden = false; } catch { /* Ignore damaged local save. */ }
  say('ready');
}
