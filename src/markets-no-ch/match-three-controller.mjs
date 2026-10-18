import { MATCH_LEVELS, createMatchThreeState, findMatchHint, hintMatchThree, nextMatchLevel, shuffleMatchThree, swapMatchThree, undoMatchThree } from './match-three.mjs';

const SAVE_KEY = 'usefulverse.match-three.progress.v1';

export function mountMatchThree(root, copy, storage = globalThis.localStorage) {
  const q = (selector) => root.querySelector(selector);
  const board = q('[data-m3-board]'); const f = copy.fields;
  if (!board) return () => {};
  let state = createMatchThreeState(); let selected = null; let focused = 0; let paused = false; let audio = null;
  const say = (message) => { q('[data-m3-status]').textContent = message; };
  const colorName = (index) => f.colors[index] ?? f.color;
  const escapeAttribute = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll("'", '&#39;');

  function sound(freq = 500) {
    if (!q('[data-m3-sound]').checked) return;
    try {
      const Audio = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!Audio) return;
      audio ??= new Audio(); void audio.resume();
      const oscillator = audio.createOscillator(); const gain = audio.createGain();
      oscillator.frequency.value = freq; gain.gain.setValueAtTime(.025, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .09);
      oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + .09);
    } catch {}
  }

  function render(restoreFocus = false) {
    q('[data-m3-level]').textContent = String(state.level + 1);
    q('[data-m3-score]').textContent = String(state.score);
    q('[data-m3-goal]').textContent = String(MATCH_LEVELS[state.level].goal);
    q('[data-m3-moves]').textContent = String(state.moves);
    q('[data-m3-undo]').disabled = !state.lastMove;
    q('[data-m3-next]').hidden = state.status !== 'won' || state.level === MATCH_LEVELS.length - 1;
    q('[data-m3-restart]').disabled = paused;
    board.setAttribute('aria-disabled', String(paused || state.status !== 'playing'));
    const hint = new Set(state.hint ?? []);
    board.innerHTML = state.board.flatMap((row, rowIndex) => row.map((color, colIndex) => {
      const index = rowIndex * 8 + colIndex; const pressed = selected === index;
      return `<button type="button" class="match-three-cell" data-cell="${index}" data-hint="${hint.has(index)}" role="gridcell" aria-label="${escapeAttribute(f.row)} ${rowIndex + 1}, ${escapeAttribute(f.column)} ${colIndex + 1}, ${escapeAttribute(colorName(color))} ${escapeAttribute(f.tile)}" aria-pressed="${pressed}" tabindex="${focused === index ? '0' : '-1'}" ${paused || state.status !== 'playing' ? 'disabled' : ''}><i class="match-three-piece match-three-color-${color}" aria-hidden="true"></i></button>`;
    })).join('');
    if (restoreFocus) q(`[data-cell="${focused}"]`)?.focus();
  }

  function clickCell(index) {
    if (paused || state.status !== 'playing') return;
    focused = index;
    if (selected === null) { selected = index; say(f.selectTile); render(true); return; }
    if (selected === index) { selected = null; say(f.ready); render(true); return; }
    const result = swapMatchThree(state, selected, index);
    selected = null;
    if (!result.valid) { say(result.reason === 'invalid' ? f.invalidSwap : f.noMatch); render(true); return; }
    state = result.state; sound(state.status === 'won' ? 780 : 480);
    if (state.status === 'won') say(state.level === MATCH_LEVELS.length - 1 ? f.wonFinal : f.won);
    else if (state.status === 'lost') say(f.lost);
    else if (state.boardShuffled) say(f.deadBoard);
    else say((state.lastCascade ?? 1) > 1 ? `${f.cascade} ${state.lastCascade}` : f.matched);
    render(true);
  }

  board.addEventListener('click', (event) => {
    const cell = event.target.closest('[data-cell]');
    if (cell && board.contains(cell)) clickCell(Number(cell.dataset.cell));
  });
  board.addEventListener('keydown', (event) => {
    const cell = event.target.closest('[data-cell]'); if (!cell) return;
    const index = Number(cell.dataset.cell); let next = index;
    if (event.key === 'ArrowLeft') next = index % 8 === 0 ? index + 7 : index - 1;
    else if (event.key === 'ArrowRight') next = index % 8 === 7 ? index - 7 : index + 1;
    else if (event.key === 'ArrowUp') next = (index + 56) % 64;
    else if (event.key === 'ArrowDown') next = (index + 8) % 64;
    else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); clickCell(index); return; }
    else if (event.key === 'Escape') { selected = null; say(f.ready); render(true); return; }
    else return;
    event.preventDefault(); focused = next; render(true);
  });
  q('[data-m3-hint]').addEventListener('click', () => {
    if (paused || state.status !== 'playing') return;
    state = hintMatchThree(state);
    if (state.hint) { focused = state.hint[0]; say(f.hintText.replace('{row}', String(Math.floor(state.hint[0] / 8) + 1)).replace('{column}', String(state.hint[0] % 8 + 1))); }
    else { state = shuffleMatchThree(state); say(f.noHint); }
    selected = null; render();
  });
  q('[data-m3-undo]').addEventListener('click', () => { if (!paused) { state = undoMatchThree(state); selected = null; say(f.undone); render(); } });
  q('[data-m3-shuffle]').addEventListener('click', () => { if (!paused && state.status === 'playing') { state = shuffleMatchThree(state); selected = null; say(f.shuffled); render(); } });
  q('[data-m3-restart]').addEventListener('click', () => { state = createMatchThreeState({ level: state.level, seed: state.seed }); selected = null; paused = false; say(f.ready); render(); });
  q('[data-m3-next]').addEventListener('click', () => { state = nextMatchLevel(state); selected = null; say(f.ready); render(); });
  q('[data-m3-pause]').addEventListener('click', (event) => { paused = !paused; event.currentTarget.textContent = paused ? f.resume : f.pause; say(paused ? f.paused : f.ready); render(); });
  q('[data-m3-save]').addEventListener('click', () => {
    try { storage.setItem(SAVE_KEY, JSON.stringify({ level: state.level, seed: state.seed, score: state.score, moves: state.moves, board: state.board })); say(f.saved); }
    catch { say(f.saveError); }
  });
  q('[data-m3-load]').addEventListener('click', () => {
    try {
      const saved = JSON.parse(storage.getItem(SAVE_KEY) ?? 'null');
      if (!saved || !Number.isInteger(saved.level) || !MATCH_LEVELS[saved.level] || !Array.isArray(saved.board) || saved.board.length !== 8 || saved.board.some((row) => !Array.isArray(row) || row.length !== 8 || row.some((color) => !Number.isInteger(color) || color < 0 || color > 5)) || !Number.isFinite(saved.score) || saved.score < 0 || !Number.isInteger(saved.moves) || saved.moves < 1 || saved.moves > MATCH_LEVELS[saved.level].moves) throw new Error('invalid save');
      const status = saved.score >= MATCH_LEVELS[saved.level].goal ? 'won' : saved.moves === 0 ? 'lost' : 'playing';
      state = { ...createMatchThreeState({ level: saved.level, seed: saved.seed }), ...saved, status, lastMove: null, hint: null }; selected = null; paused = false; say(status === 'won' ? f.won : status === 'lost' ? f.lost : f.loaded); render();
    } catch { say(f.noSave); }
  });
  q('[data-m3-delete]').addEventListener('click', () => { try { storage.removeItem(SAVE_KEY); say(f.deleted); } catch { say(f.saveError); } });
  const onVisibility = () => { if (document.hidden) { paused = true; q('[data-m3-pause]').textContent = f.resume; say(f.paused); render(); } };
  document.addEventListener('visibilitychange', onVisibility);
  render();
  return () => { document.removeEventListener('visibilitychange', onVisibility); try { audio?.close(); } catch {} };
}

const root = document.querySelector('[data-match-three]');
if (root) mountMatchThree(root, JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}'));
