import { chessAnalysisUciToSan, createChessAnalysisSession, getChessAnalysisState, loadChessAnalysisInput, playChessAnalysisMove, resetChessAnalysisSession, setChessAnalysisCursor } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="chess-analysis-board"]');
if (root) {
  const copy = readToolCopy(root); const board = root.querySelector('[data-board]'); let session = createChessAnalysisSession(); let selected = ''; let engineWorker = null; let engineReady = false; let engineQueued = null; let engineSearching = false; let engineFen = '';
  const engineStatus = root.querySelector('[data-engine-status]'); const engineLines = root.querySelector('[data-analysis-lines]'); const analyzeButton = root.querySelector('[data-action="analyze"]'); const stopButton = root.querySelector('[data-action="stop"]');
  function message(text, kind = '') { announce(root, text, kind); }
  function stopEngine(announceStop = false) {
    if (engineWorker) engineWorker.terminate(); engineWorker = null; engineReady = false; engineQueued = null; engineSearching = false;
    analyzeButton.disabled = false; stopButton.disabled = true; stopButton.hidden = true;
    if (announceStop) engineStatus.textContent = copy.messages.analysisStopped;
  }
  function invalidateAnalysis() {
    if (engineWorker || engineQueued || engineSearching) stopEngine();
    engineLines.replaceChildren(); engineStatus.textContent = '';
  }
  function renderVariation(line) {
    const san = chessAnalysisUciToSan(engineFen, line.moves); const item = document.createElement('li');
    item.textContent = `${copy.fields.engineDepth}: ${line.depth} · ${copy.fields.engineScore}: ${line.score} · ${san.join(' ')}`;
    item.dataset.multipv = String(line.multipv); engineLines.querySelector(`[data-multipv="${line.multipv}"]`)?.remove(); engineLines.append(item);
    const items = [...engineLines.children].sort((a, b) => Number(a.dataset.multipv) - Number(b.dataset.multipv)); engineLines.replaceChildren(...items);
  }
  function startEngineSearch(options) {
    if (!engineWorker || !engineReady) { engineQueued = options; return; }
    engineQueued = null; engineFen = options.fen; engineSearching = true; engineLines.replaceChildren();
    analyzeButton.disabled = true; stopButton.disabled = false; stopButton.hidden = false;
    engineStatus.textContent = copy.messages.analysisRunning;
    engineWorker.postMessage('position fen ' + options.fen);
    engineWorker.postMessage(options.mode === 'time' ? 'go movetime ' + options.seconds * 1000 : 'go depth ' + options.depth);
  }
  function handleEngineMessage(value) {
    if (typeof value !== 'string') return;
    if (value === 'uciok') { engineWorker?.postMessage('setoption name MultiPV value 3'); engineWorker?.postMessage('isready'); return; }
    if (value === 'readyok') { engineReady = true; engineStatus.textContent = copy.messages.engineReady; if (engineQueued) startEngineSearch(engineQueued); return; }
    if (value.startsWith('info ') && engineSearching) {
      const depth = Number(value.match(/(?:^|\s)depth (\d+)/u)?.[1] ?? 0); const multipv = Number(value.match(/(?:^|\s)multipv (\d+)/u)?.[1] ?? 1);
      const scoreMatch = value.match(/(?:^|\s)score (cp|mate) (-?\d+)/u); const pv = value.match(/(?:^|\s)pv ((?:[a-h][1-8][a-h][1-8][qrbn]?\s*)+)/u)?.[1]?.trim();
      if (depth && scoreMatch && pv) { const raw = Number(scoreMatch[2]); const score = scoreMatch[1] === 'mate' ? `${copy.fields.mate} ${raw > 0 ? '+' : ''}${raw}` : (raw / 100).toFixed(2); renderVariation({ depth, multipv, score, moves: pv.split(/\s+/u) }); }
      return;
    }
    if (value.startsWith('bestmove')) { engineSearching = false; analyzeButton.disabled = false; stopButton.disabled = true; stopButton.hidden = true; engineStatus.textContent = engineLines.children.length ? copy.messages.analysisComplete : copy.messages.noVariation; }
  }
  function requestAnalysis() {
    const state = getChessAnalysisState(session); const mode = root.querySelector('[data-engine-mode]').value;
    const options = { fen: state.fen, mode, depth: Number(root.querySelector('[data-engine-depth]').value), seconds: Number(root.querySelector('[data-engine-time]').value) };
    if (!Number.isInteger(options.depth) || options.depth < 8 || options.depth > 20 || ![1, 3, 5].includes(options.seconds) || !['depth', 'time'].includes(mode)) return;
    if (!engineWorker) {
      const engineSrc = root.querySelector('[data-engine-src]')?.dataset.engineSrc;
      if (!engineSrc) { engineStatus.textContent = copy.messages.engineUnavailable; return; }
      try { engineWorker = new Worker(engineSrc, { name: 'UsefulVerse local chess analysis' }); }
      catch { engineStatus.textContent = copy.messages.engineUnavailable; return; }
      engineWorker.addEventListener('message', (event) => handleEngineMessage(event.data));
      engineWorker.addEventListener('error', () => { stopEngine(); engineStatus.textContent = copy.messages.engineFailed; }, { once: true });
      engineQueued = options; engineStatus.textContent = copy.messages.engineLoading; engineWorker.postMessage('uci');
    } else if (engineReady) startEngineSearch(options);
    else engineQueued = options;
  }
  function pieceName(piece) { return piece ? copy.fields[piece.color === 'w' ? 'white' : 'black'] + ' ' + copy.fields['piece_' + piece.type] : copy.fields.empty; }
  function paint() {
    const rows = session.game.board(); const fragment = document.createDocumentFragment();
    rows.forEach((row, rowIndex) => { const rowNode = document.createElement('div'); rowNode.setAttribute('role', 'row'); row.forEach((piece, fileIndex) => {
      const squareName = String.fromCharCode(97 + fileIndex) + (8 - rowIndex); const button = document.createElement('button'); button.type = 'button'; button.dataset.square = squareName; button.setAttribute('role', 'gridcell'); button.setAttribute('aria-pressed', String(selected === squareName)); button.setAttribute('aria-label', copy.fields.square + ' ' + squareName + ': ' + pieceName(piece));
      const glyphs = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }; const glyph = piece ? glyphs[piece.type] : '';
      button.textContent = piece ? (piece.color === 'w' ? String.fromCodePoint(glyph.codePointAt(0) - 6) : glyph) : '';
      button.className = 'chess-analysis-board__square ' + ((rowIndex + fileIndex) % 2 ? 'is-dark' : 'is-light');
      if (piece?.color === 'w') button.classList.add('is-white-piece'); if (selected === squareName) button.classList.add('is-selected'); rowNode.append(button);
    }); fragment.append(rowNode); });
    board.replaceChildren(fragment); const state = getChessAnalysisState(session);
    root.querySelector('[data-fen-output]').value = state.fen; root.querySelector('[data-pgn-output]').value = state.pgn;
    root.querySelector('[data-move-count]').textContent = String(state.cursor); root.querySelector('[data-move-total]').textContent = String(state.total);
    root.querySelector('[data-action="previous"]').disabled = state.cursor === 0; root.querySelector('[data-action="next"]').disabled = state.cursor === state.total;
    root.querySelector('[data-board-state]').textContent = state.checkmate ? copy.messages.checkmate : state.draw ? copy.messages.draw : state.check ? copy.messages.check : state.turn === 'w' ? copy.fields.white : copy.fields.black;
  }
  function resetSelection() { if (engineSearching) stopEngine(); selected = ''; paint(); }
  board.addEventListener('click', (event) => { const button = event.target.closest('[data-square]'); if (!button) return; const square = button.dataset.square; const piece = session.game.get(square);
    if (piece?.color === session.game.turn() && (!selected || !session.game.moves({ square: selected, verbose: true }).some(({ to }) => to === square))) { selected = selected === square ? '' : square; paint(); return; }
    if (!selected) return; const result = playChessAnalysisMove(session, selected, square, root.querySelector('[data-promotion]').value); if (result.ok) invalidateAnalysis(); selected = ''; paint(); message(result.ok ? copy.messages.moved : copy.messages.illegal, result.ok ? 'success' : 'error');
  });
  board.addEventListener('keydown', (event) => { if (!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)) return; const cell = event.target.closest('[data-square]'); if (!cell) return; event.preventDefault(); const file = cell.dataset.square.charCodeAt(0) - 97; const rank = Number(cell.dataset.square[1]); const f = Math.max(0, Math.min(7, file + (event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0))); const r = Math.max(1, Math.min(8, rank + (event.key === 'ArrowDown' ? -1 : event.key === 'ArrowUp' ? 1 : 0))); board.querySelector('[data-square="' + String.fromCharCode(97 + f) + r + '"]')?.focus(); });
  function loadInput(key) { const field = root.querySelector('[data-' + key + '-input]'); const result = loadChessAnalysisInput(session, key === 'fen' ? { fen: field.value } : { pgn: field.value }); if (!result.ok) { message(key === 'fen' ? copy.messages.invalidFen : copy.messages.invalidPgn, 'error'); return; } invalidateAnalysis(); selected = ''; paint(); message(key === 'fen' ? copy.messages.loadedFen : copy.messages.loadedPgn, 'success'); }
  root.querySelector('[data-action="load-fen"]').addEventListener('click', () => loadInput('fen'));
  root.querySelector('[data-action="load-pgn"]').addEventListener('click', () => loadInput('pgn'));
  root.querySelector('[data-action="new-game"]').addEventListener('click', () => { invalidateAnalysis(); resetChessAnalysisSession(session); selected = ''; paint(); message(copy.messages.ready); });
  root.querySelector('[data-action="previous"]').addEventListener('click', () => { const result = setChessAnalysisCursor(session, session.cursor - 1); invalidateAnalysis(); selected = ''; paint(); message(result.state.cursor === 0 ? copy.messages.beginning : copy.messages.ready); });
  root.querySelector('[data-action="next"]').addEventListener('click', () => { const result = setChessAnalysisCursor(session, session.cursor + 1); invalidateAnalysis(); selected = ''; paint(); message(result.state.cursor === result.state.total ? copy.messages.end : copy.messages.ready); });
  root.querySelector('[data-engine-mode]').addEventListener('change', (event) => { root.querySelector('[data-engine-depth]').disabled = event.target.value !== 'depth'; root.querySelector('[data-engine-time]').disabled = event.target.value !== 'time'; });
  analyzeButton.addEventListener('click', requestAnalysis);
  stopButton.addEventListener('click', () => stopEngine(true));
  async function copyField(selector, success) { try { await navigator.clipboard.writeText(root.querySelector(selector).value); message(success, 'success'); } catch { message(copy.messages.copyUnavailable, 'error'); } }
  root.querySelector('[data-action="copy-fen"]').addEventListener('click', () => copyField('[data-fen-output]', copy.messages.copiedFen));
  root.querySelector('[data-action="copy-pgn"]').addEventListener('click', () => copyField('[data-pgn-output]', copy.messages.copiedPgn));
  paint(); message(copy.messages.ready); window.addEventListener('pagehide', () => stopEngine(), { once: true });
}
