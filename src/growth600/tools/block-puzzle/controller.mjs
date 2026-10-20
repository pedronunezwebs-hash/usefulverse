import { createBlockPuzzle, getBlockCells, getBlockPlacements, placeBlockPiece, rotateBlockPiece } from './logic.mjs';

const root = document.querySelector('[data-tool="block-puzzle"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields;
  let game = null;
  let selectedPiece = 0;
  const node = (tag, text, className) => { const element = document.createElement(tag); if (text !== undefined) element.textContent = String(text); if (className) element.className = className; return element; };

  function drawPiece(parent, piece) {
    const cells = getBlockCells(piece);
    const rows = Math.max(...cells.map(([row]) => row)) + 1;
    const columns = Math.max(...cells.map(([, column]) => column)) + 1;
    const preview = node('span', undefined, 'pending-block-piece');
    preview.style.gridTemplateColumns = `repeat(${columns},.8rem)`;
    preview.style.gridTemplateRows = `repeat(${rows},.8rem)`;
    for (const [row, column] of cells) {
      const block = node('span', undefined, 'pending-block-piece__cell');
      block.style.gridRow = String(row + 1); block.style.gridColumn = String(column + 1); preview.append(block);
    }
    parent.append(preview);
  }

  function render(message = copy.messages.playing, focus = '') {
    content.replaceChildren();
    if (!game) return;
    const summary = node('p', `${f.score}: ${game.score} · ${f.clearedLines}: ${game.clearedLines} · ${f.turns}: ${game.turns}`);
    content.append(summary);
    const tray = node('div', undefined, 'pending-block-tray');
    tray.setAttribute('aria-label', f.pieces);
    game.tray.forEach((piece, index) => {
      const button = node('button', undefined, 'button button--secondary pending-block-piece-button');
      button.type = 'button'; button.dataset.piece = String(index); button.disabled = !piece || game.gameOver;
      button.setAttribute('aria-pressed', String(selectedPiece === index));
      if (piece) { button.setAttribute('aria-label', `${f.piece} ${f.shapeNames[piece.shape]}`); drawPiece(button, piece); }
      else button.textContent = f.used;
      if (selectedPiece === index) button.classList.add('is-selected');
      tray.append(button);
    });
    const rotate = node('button', f.rotate, 'button button--secondary'); rotate.type = 'button'; rotate.dataset.rotate = 'true'; rotate.disabled = game.gameOver || !game.tray[selectedPiece];
    tray.append(rotate); content.append(tray);
    const current = game.tray[selectedPiece];
    const placements = current ? getBlockPlacements(game.board, current) : [];
    const legalStarts = new Set(placements.map(({ row, column }) => row * 10 + column));
    const board = node('div', undefined, 'pending-block-grid'); board.setAttribute('role', 'grid'); board.setAttribute('aria-label', f.boardLabel);
    for (let row = 0; row < 10; row++) for (let column = 0; column < 10; column++) {
      const index = row * 10 + column; const occupied = Boolean(game.board[index]); const legal = legalStarts.has(index);
      const button = node('button', occupied ? '■' : '', `pending-block-grid__cell${occupied ? ' is-filled' : ''}${legal ? ' is-place-start' : ''}`);
      button.type = 'button'; button.dataset.cell = String(index); button.disabled = game.gameOver || !legal;
      button.setAttribute('role', 'gridcell'); button.setAttribute('aria-rowindex', String(row + 1)); button.setAttribute('aria-colindex', String(column + 1));
      button.setAttribute('aria-label', `${f.row} ${row + 1}, ${f.column} ${column + 1}, ${occupied ? f.filled : f.empty}${legal ? `, ${f.placeHere}` : ''}`);
      board.append(button);
    }
    content.append(board);
    if (game.gameOver) { message = copy.messages.gameOver; content.append(node('p', f.playAgain)); }
    content.append(node('p', f.scoringNote, 'hint'));
    status.textContent = message; status.classList.remove('status--error'); result.hidden = false;
    if (focus) content.querySelector(focus)?.focus();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    game = createBlockPuzzle(); selectedPiece = 0;
    render(copy.messages.started, '[data-piece="0"]');
  });
  content.addEventListener('click', (event) => {
    const pieceButton = event.target.closest('[data-piece]');
    if (pieceButton && game && !game.gameOver) {
      selectedPiece = Number(pieceButton.dataset.piece); render(copy.messages.pieceSelected, `[data-piece="${selectedPiece}"]`); return;
    }
    const rotateButton = event.target.closest('[data-rotate]');
    if (rotateButton && game && game.tray[selectedPiece]) {
      const tray = [...game.tray]; tray[selectedPiece] = rotateBlockPiece(tray[selectedPiece]);
      game = Object.freeze({ ...game, tray: Object.freeze(tray) }); render(copy.messages.rotated, '[data-rotate]'); return;
    }
    const cell = event.target.closest('[data-cell]');
    if (!cell || !game || game.gameOver) return;
    const index = Number(cell.dataset.cell);
    try {
      game = placeBlockPiece(game, selectedPiece, Math.floor(index / 10), index % 10);
      if (!game.tray[selectedPiece]) selectedPiece = game.tray.findIndex(Boolean);
      if (selectedPiece < 0) selectedPiece = 0;
      const cleared = game.lastMove.clearedRows + game.lastMove.clearedColumns;
      render(cleared ? `${copy.messages.cleared} ${cleared}` : copy.messages.placed, '.pending-block-grid__cell:not(:disabled)');
    } catch { status.textContent = copy.messages.illegal; status.classList.add('status--error'); }
  });
  form.addEventListener('reset', () => queueMicrotask(() => {
    game = null; selectedPiece = 0; content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error');
  }));
}
