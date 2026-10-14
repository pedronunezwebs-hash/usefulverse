import { createChessPuzzleSession, getChessPuzzleBoard, getChessPuzzleHint, submitChessPuzzleMove } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="chess-puzzles"]');
if (root) {
  const copy = readToolCopy(root);
  const boardElement = root.querySelector('[data-board]');
  let session = createChessPuzzleSession();
  let selected = '';
  let hint = null;

  function render() {
    const squares = getChessPuzzleBoard(session);
    const fragment = document.createDocumentFragment();
    squares.forEach((row, rowIndex) => {
      const rowElement = document.createElement('div');
      rowElement.setAttribute('role', 'row');
      row.forEach((piece, fileIndex) => {
        const rank = 8 - rowIndex;
        const file = String.fromCharCode(97 + fileIndex);
        const square = file + rank;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chess-puzzles__square';
        button.dataset.square = square;
        button.setAttribute('role', 'gridcell');
        button.setAttribute('aria-pressed', String(square === selected));
        const pieceName = piece ? copy.fields['piece_' + piece.color + piece.type] : copy.fields.empty;
        button.setAttribute('aria-label', copy.fields.square + ' ' + square + ': ' + pieceName);
        const glyph = piece ? { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }[piece.type] : '';
        button.textContent = piece ? (piece.color === 'w' ? String.fromCodePoint(glyph.codePointAt(0) - 6) : glyph) : '';
        if (piece?.color === 'w') button.classList.add('chess-puzzles__square--light-piece');
        if (square === selected) button.classList.add('is-selected');
        if (hint?.from === square || hint?.to === square) button.classList.add('is-hint');
        if (session.solved) button.disabled = true;
        rowElement.append(button);
      });
      fragment.append(rowElement);
    });
    boardElement.replaceChildren(fragment);
    root.querySelector('[data-attempts]').textContent = String(session.attempts);
    root.querySelector('[data-hints]').textContent = String(session.hints);
    root.querySelector('[data-action="hint"]').disabled = session.solved;
  }

  function newPuzzle() {
    session = createChessPuzzleSession({ previousId: session.puzzle.id });
    selected = '';
    hint = null;
    render();
    announce(root, copy.messages.ready);
  }

  function chooseSquare(button) {
    const square = button.dataset.square;
    const piece = session.game.get(square);
    if (piece?.color === 'w' && (!selected || square === selected || !session.game.moves({ square: selected, verbose: true }).some((move) => move.to === square))) {
      selected = square === selected ? '' : square;
      hint = null;
      render();
      const selectedPiece = session.game.get(selected);
      announce(root, selectedPiece ? copy.messages.selected.replace('{piece}', copy.fields['piece_' + selectedPiece.color + selectedPiece.type]) : copy.messages.selectionCleared);
      boardElement.querySelector('[data-square="' + (selected || square) + '"]')?.focus();
      return;
    }
    if (!selected) return;
    const result = submitChessPuzzleMove(session, selected, square);
    selected = '';
    hint = null;
    render();
    announce(root, result.ok ? copy.messages.solved : result.reason === 'illegal' ? copy.messages.illegal : copy.messages.wrong, result.ok ? 'success' : 'error');
  }

  boardElement.addEventListener('click', (event) => {
    const button = event.target.closest('[data-square]');
    if (button && !session.solved) chooseSquare(button);
  });
  boardElement.addEventListener('keydown', (event) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    const current = event.target.closest('[data-square]');
    if (!current) return;
    event.preventDefault();
    const file = current.dataset.square.charCodeAt(0) - 97;
    const rank = Number(current.dataset.square[1]) - 1;
    const nextFile = Math.max(0, Math.min(7, file + (event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0)));
    const nextRank = Math.max(1, Math.min(8, rank + (event.key === 'ArrowDown' ? -1 : event.key === 'ArrowUp' ? 1 : 0)));
    boardElement.querySelector('[data-square="' + String.fromCharCode(97 + nextFile) + nextRank + '"]')?.focus();
  });
  root.querySelector('[data-action="new-puzzle"]').addEventListener('click', newPuzzle);
  root.querySelector('[data-action="hint"]').addEventListener('click', () => {
    hint = getChessPuzzleHint(session);
    if (!hint) return;
    selected = '';
    render();
    announce(root, copy.messages.hint);
  });
  root.querySelector('[data-action="clear-selection"]').addEventListener('click', () => {
    selected = '';
    hint = null;
    render();
    announce(root, copy.messages.selectionCleared);
  });
  render();
  announce(root, copy.messages.ready);
}
