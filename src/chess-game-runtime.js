import { Chess } from 'chess.js';

const SAVE_KEY = 'usefulverse:chess-game:pgn:v1';
const PIECE_NAMES = {
  w: { k: 'White king', q: 'White queen', r: 'White rook', b: 'White bishop', n: 'White knight', p: 'White pawn' },
  b: { k: 'Black king', q: 'Black queen', r: 'Black rook', b: 'Black bishop', n: 'Black knight', p: 'Black pawn' },
};
const PIECE_GLYPHS = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
};
const FILES = 'abcdefgh';

export function setupChessGame(root) {
  const messages = JSON.parse(root.dataset.plannerMessages || '{}');
  const say = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), messages[key] ?? key);
  const boardElement = root.querySelector('[data-chess-board]');
  const movesElement = root.querySelector('[data-chess-moves]');
  const promotionElement = root.querySelector('[data-chess-promotion]');
  const statusElement = root.querySelector('#op-status');
  let game = new Chess();
  let selected = '';
  let legalTargets = [];
  let flipped = false;
  let focusedSquare = 'a1';

  const status = (key, values = {}, type = '') => {
    statusElement.textContent = say(key, values);
    statusElement.className = `tool-status${type ? ` is-${type}` : ''}`;
  };
  const positionText = () => {
    if (game.isCheckmate()) return status('Checkmate — {winner} wins!', { winner: say(game.turn() === 'w' ? 'Black' : 'White') }, 'success');
    if (game.isStalemate()) return status('Draw by stalemate.');
    if (game.isDraw()) return status('Game drawn.');
    if (game.isCheck()) return status(game.turn() === 'w' ? 'White is in check.' : 'Black is in check.', {}, 'error');
    status(game.turn() === 'w' ? 'White to move.' : 'Black to move.');
  };
  const displayedSquares = () => {
    const ranks = flipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
    const files = flipped ? [...FILES].reverse() : [...FILES];
    return ranks.flatMap((rank) => files.map((file) => `${file}${rank}`));
  };
  const render = (focus = false) => {
    const board = game.board();
    const squares = displayedSquares();
    boardElement.replaceChildren();
    for (const square of squares) {
      const fileIndex = FILES.indexOf(square[0]);
      const rankIndex = Number(square[1]) - 1;
      const piece = board[7 - rankIndex][fileIndex];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `local-chess__square${(fileIndex + rankIndex) % 2 ? ' is-dark' : ' is-light'}`;
      button.dataset.chessSquare = square;
      button.setAttribute('role', 'gridcell');
      button.tabIndex = square === focusedSquare ? 0 : -1;
      if (selected === square) button.classList.add('is-selected');
      if (legalTargets.includes(square)) button.classList.add('is-legal-target');
      button.setAttribute('aria-label', piece ? say('Square {square}: {piece}', { square, piece: say(PIECE_NAMES[piece.color][piece.type]) }) : say('Square {square}: {piece}', { square, piece: say('Empty square') }));
      if (piece) {
        button.textContent = PIECE_GLYPHS[piece.color][piece.type];
        button.classList.add(`piece-${piece.color}`);
      }
      boardElement.append(button);
    }
    movesElement.value = game.history().reduce((text, move, index) => {
      const moveNumber = Math.floor(index / 2) + 1;
      return index % 2 === 0 ? `${text}${moveNumber}. ${move} ` : `${text}${move}\n`;
    }, '').trim();
    if (focus) boardElement.querySelector(`[data-chess-square="${focusedSquare}"]`)?.focus();
    positionText();
  };
  const chooseSquare = (square) => {
    const piece = game.get(square);
    if (selected && legalTargets.includes(square)) {
      try {
        game.move({ from: selected, to: square, promotion: promotionElement.value });
        selected = ''; legalTargets = []; focusedSquare = square;
        render(true);
      } catch { status('That is not a legal move.', {}, 'error'); }
      return;
    }
    if (piece?.color === game.turn()) {
      selected = square;
      legalTargets = game.moves({ square, verbose: true }).map((move) => move.to);
      focusedSquare = square;
      render(true);
      if (!legalTargets.length) status('Choose a piece with a legal move.');
      return;
    }
    selected = ''; legalTargets = []; focusedSquare = square;
    render(true);
    status('Choose a piece with a legal move.');
  };
  const squareFromArrow = (square, key) => {
    const file = FILES.indexOf(square[0]); const rank = Number(square[1]);
    const offsets = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] };
    const [df, dr] = offsets[key];
    const nextFile = Math.max(0, Math.min(7, file + (flipped ? -df : df)));
    const nextRank = Math.max(1, Math.min(8, rank + (flipped ? -dr : dr)));
    return `${FILES[nextFile]}${nextRank}`;
  };
  root.addEventListener('click', (event) => {
    const cell = event.target.closest('[data-chess-square]');
    if (cell) return chooseSquare(cell.dataset.chessSquare);
    if (event.target.closest('[data-chess-new]')) { game = new Chess(); selected = ''; legalTargets = []; focusedSquare = flipped ? 'h1' : 'a8'; return render(); }
    if (event.target.closest('[data-chess-undo]')) {
      if (!game.undo()) return status('No move to undo.');
      selected = ''; legalTargets = []; focusedSquare = flipped ? 'h1' : 'a8'; render(); return;
    }
    if (event.target.closest('[data-chess-flip]')) { flipped = !flipped; render(); return; }
    if (event.target.closest('[data-chess-save]')) {
      if (!game.history().length) return status('Make a move before saving the game.', {}, 'error');
      try { localStorage.setItem(SAVE_KEY, game.pgn()); status('Game saved on this device.', {}, 'success'); }
      catch { status('Could not save the game on this device.', {}, 'error'); }
      return;
    }
    if (event.target.closest('[data-chess-load]')) {
      try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (!saved) return status('No saved game on this device.');
        const restored = new Chess();
        restored.loadPgn(saved);
        game = restored; selected = ''; legalTargets = []; focusedSquare = flipped ? 'h1' : 'a8'; render(); status('Saved game loaded.', {}, 'success');
      } catch { status('Could not load the saved game.', {}, 'error'); }
      return;
    }
    if (event.target.closest('[data-chess-clear]')) {
      try {
        if (localStorage.getItem(SAVE_KEY) === null) return status('No saved game on this device.');
        localStorage.removeItem(SAVE_KEY); status('Saved game deleted.', {}, 'success');
      } catch { status('Could not save the game on this device.', {}, 'error'); }
      return;
    }
    if (event.target.closest('[data-chess-download]')) {
      if (!game.history().length) return status('Make a move before saving the game.', {}, 'error');
      const url = URL.createObjectURL(new Blob([game.pgn()], { type: 'application/x-chess-pgn;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = 'usefulverse-chess-game.pgn'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status('PGN download started.', {}, 'success');
    }
  });
  root.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const cell = event.target.closest('[data-chess-square]');
    if (!cell || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', ' '].includes(event.key)) return;
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); chooseSquare(cell.dataset.chessSquare); return; }
    event.preventDefault(); focusedSquare = squareFromArrow(cell.dataset.chessSquare, event.key); render(true);
  });
  render();
}
