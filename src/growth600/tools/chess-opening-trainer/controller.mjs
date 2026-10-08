import { createOpeningSession, getExpectedMoveDetails, OPENING_LINES, playOpponentMoves, submitOpeningMove } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="chess-opening-trainer"]');
if (root) {
  const copy = readToolCopy(root);
  const board = root.querySelector('[data-board]');
  const openingSelect = root.querySelector('[data-opening]');
  const sideSelect = root.querySelector('[data-side]');
  const moveList = root.querySelector('[data-moves]');
  let session; let selected = ''; let focusSquare = 'e2'; let isHint = false;
  const files = 'abcdefgh';
  const glyph = { wk: '♔', wq: '♕', wr: '♖', wb: '♗', wn: '♘', wp: '♙', bk: '♚', bq: '♛', br: '♜', bb: '♝', bn: '♞', bp: '♟' };
  const pieceName = (piece) => piece ? copy.fields[`piece_${piece.color}${piece.type}`] : copy.fields.empty;

  function announceTurn() {
    if (session.completed) announce(root, copy.messages.lineComplete, 'success');
    else announce(root, copy.messages.ready.replace('{opening}', session.line.name).replace('{move}', session.line.moves[session.ply]), 'info');
  }
  function moveOpponent() {
    const reply = playOpponentMoves(session);
    if (reply.played.length) announce(root, copy.messages.opponentMove.replace('{moves}', reply.played.join(' ')), 'info');
    return reply;
  }
  function render() {
    const game = session.game;
    const restoreFocus = board.contains(document.activeElement);
    const rows = sideSelect.value === 'b' ? [...Array(8).keys()] : [...Array(8).keys()].reverse();
    const columns = sideSelect.value === 'b' ? [...files].reverse() : [...files];
    const fragment = document.createDocumentFragment();
    board.setAttribute('aria-label', copy.fields.board);
    board.replaceChildren();
    for (const row of rows) for (const file of columns) {
      const square = `${file}${row + 1}`; const piece = game.get(square);
      const button = document.createElement('button');
      button.type = 'button'; button.className = `chess-opening-square ${(files.indexOf(file) + row) % 2 ? 'is-dark' : 'is-light'}${selected === square ? ' is-selected' : ''}`;
      button.dataset.square = square; button.tabIndex = square === focusSquare ? 0 : -1;
      button.setAttribute('aria-label', `${copy.fields.square} ${square}, ${pieceName(piece)}`);
      button.textContent = piece ? glyph[`${piece.color}${piece.type}`] : '';
      const hint = isHint ? getExpectedMoveDetails(session) : null;
      if (hint && (square === hint.from || square === hint.to)) button.classList.add('is-hint');
      button.addEventListener('click', () => activateSquare(square));
      button.addEventListener('keydown', (event) => {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        const f = files.indexOf(square[0]); const r = Number(square[1]);
        const rankDirection = sideSelect.value === 'b' ? -1 : 1;
        const delta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, rankDirection], ArrowDown: [0, -rankDirection] }[event.key];
        const nextFile = Math.max(0, Math.min(7, f + delta[0])); const nextRank = Math.max(1, Math.min(8, r + delta[1]));
        focusSquare = `${files[nextFile]}${nextRank}`; button.tabIndex = -1;
        const nextButton = board.querySelector(`[data-square="${focusSquare}"]`); if (nextButton) { nextButton.tabIndex = 0; nextButton.focus(); }
      });
      fragment.append(button);
    }
    board.replaceChildren(fragment);
    if (restoreFocus) board.querySelector(`[data-square="${focusSquare}"]`)?.focus();
    moveList.value = game.history().reduce((text, san, index) => text + (index % 2 === 0 ? `${Math.floor(index / 2) + 1}. ` : '') + `${san} `, '').trim();
    root.querySelector('[data-progress]').textContent = copy.messages.progress.replace('{played}', String(session.ply)).replace('{total}', String(session.line.moves.length));
  }
  function activateSquare(square) {
    if (session.completed || session.game.turn() !== session.side) return;
    const piece = session.game.get(square);
    if (!selected) {
      if (!piece || piece.color !== session.side) { announce(root, copy.messages.selectPiece, 'info'); return; }
      selected = square; focusSquare = square; render(); return;
    }
    if (piece?.color === session.side) { selected = square; focusSquare = square; render(); return; }
    const result = submitOpeningMove(session, selected, square);
    selected = ''; isHint = false;
    if (!result.ok) {
      const message = result.reason === 'off-line' ? copy.messages.wrong.replace('{expected}', result.expected) : copy.messages.illegal;
      render(); announce(root, message, 'error'); return;
    }
    focusSquare = square;
    const reply = moveOpponent(); render();
    if (reply.completed) announce(root, copy.messages.lineComplete, 'success');
    else if (!reply.played.length) announce(root, copy.messages.correct, 'success');
  }
  function start() {
    session = createOpeningSession(openingSelect.value, sideSelect.value);
    selected = ''; isHint = false; focusSquare = sideSelect.value === 'b' ? 'e7' : 'e2';
    const reply = moveOpponent(); render();
    if (reply.played.length) announce(root, copy.messages.opponentMove.replace('{moves}', reply.played.join(' ')), 'info');
    else announceTurn();
  }
  for (const line of OPENING_LINES) {
    const option = openingSelect.querySelector(`option[value="${line.id}"]`);
    if (option) option.textContent = copy.fields[`opening_${line.id.replaceAll('-', '_')}`];
  }
  openingSelect.addEventListener('change', start);
  sideSelect.addEventListener('change', start);
  root.querySelector('[data-action="new-game"]')?.addEventListener('click', start);
  root.querySelector('[data-action="hint"]')?.addEventListener('click', () => {
    if (session.completed) { announce(root, copy.messages.lineComplete, 'info'); return; }
    isHint = true; render(); announce(root, copy.messages.hint, 'info');
  });
  root.querySelector('[data-action="rules"]')?.addEventListener('click', () => root.querySelector('[data-rules]')?.toggleAttribute('open'));
  start();
}
