import { createPegSolitaireGame, PEG_HOLES, PEG_BOARD_SIZE, pegSolitaireHint, pegSolitaireMoves, pegSolitaireStatus, playPegSolitaireMove } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="peg-solitaire"]');
if (root) {
  const copy = readToolCopy(root);
  const board = root.querySelector('[data-board]');
  const count = root.querySelector('[data-peg-count]');
  let game = createPegSolitaireGame();
  let selected = null;
  let history = [];
  let hintMove = null;

  function holeLabel(index) {
    const row = Math.floor(index / PEG_BOARD_SIZE) + 1;
    const column = index % PEG_BOARD_SIZE + 1;
    return `${copy.fields.hole}, ${copy.fields.row} ${row}, ${copy.fields.column} ${column}, ${game.pegs.has(index) ? copy.fields.peg : copy.fields.empty}`;
  }

  function render(focusIndex = null) {
    const fragment = document.createDocumentFragment();
    board.style.gridTemplateColumns = `repeat(${PEG_BOARD_SIZE}, minmax(2.4rem, 1fr))`;
    let first = true;
    for (let index = 0; index < PEG_HOLES.length; index += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'peg-solitaire-hole';
      button.style.gridRow = String(Math.floor(index / PEG_BOARD_SIZE) + 1);
      button.style.gridColumn = String(index % PEG_BOARD_SIZE + 1);
      button.tabIndex = -1;
      if (PEG_HOLES[index]) {
        button.dataset.hole = String(index);
        button.textContent = game.pegs.has(index) ? '●' : '';
        button.setAttribute('aria-label', holeLabel(index));
        button.setAttribute('aria-pressed', String(selected === index));
        button.classList.toggle('is-occupied', game.pegs.has(index));
        button.classList.toggle('is-selected', selected === index);
        button.classList.toggle('is-hint', hintMove && (hintMove.from === index || hintMove.middle === index || hintMove.to === index));
        if (focusIndex === index || focusIndex === null && first) { button.tabIndex = 0; first = false; }
      } else {
        button.disabled = true;
        button.tabIndex = -1;
        button.setAttribute('aria-hidden', 'true');
        button.classList.add('is-outside');
      }
      fragment.append(button);
    }
    board.replaceChildren(fragment);
    count.textContent = String(game.pegs.size);
    if (focusIndex !== null) board.querySelector(`[data-hole="${focusIndex}"]`)?.focus();
  }

  function finishStatus() {
    const status = pegSolitaireStatus(game);
    if (status === 'won') announce(root, copy.messages.won, 'success');
    else if (status === 'no-moves') announce(root, copy.messages.noMoves, 'info');
    return status;
  }

  function move(move) {
    const next = playPegSolitaireMove(game, move);
    if (!next) return false;
    history.push(game);
    if (history.length > 100) history.shift();
    game = next;
    selected = null;
    hintMove = null;
    render(move.to);
    const status = finishStatus();
    if (status === 'playing') announce(root, copy.messages.moved.replace('{count}', String(game.pegs.size)), 'success');
    return true;
  }

  board.addEventListener('click', (event) => {
    const button = event.target.closest('[data-hole]');
    if (!button || !board.contains(button) || pegSolitaireStatus(game) !== 'playing') return;
    const index = Number(button.dataset.hole);
    if (selected === null) {
      if (!game.pegs.has(index) || !pegSolitaireMoves(game).some(({ from }) => from === index)) {
        announce(root, copy.messages.choosePeg, 'info');
        return;
      }
      selected = index;
      hintMove = null;
      render(index);
      announce(root, copy.messages.chooseHole, 'info');
      return;
    }
    const legal = pegSolitaireMoves(game).find(({ from, to }) => from === selected && to === index);
    if (legal) { move(legal); return; }
    if (game.pegs.has(index) && pegSolitaireMoves(game).some(({ from }) => from === index)) {
      selected = index;
      render(index);
      announce(root, copy.messages.chooseHole, 'info');
    } else {
      selected = null;
      render(index);
      announce(root, copy.messages.chooseHole, 'info');
    }
  });

  board.addEventListener('keydown', (event) => {
    const button = event.target.closest('[data-hole]');
    if (!button) return;
    const delta = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[event.key];
    if (!delta) return;
    event.preventDefault();
    let row = Math.floor(Number(button.dataset.hole) / PEG_BOARD_SIZE);
    let column = Number(button.dataset.hole) % PEG_BOARD_SIZE;
    for (let tries = 0; tries < PEG_BOARD_SIZE; tries += 1) {
      row += delta[0]; column += delta[1];
      if (row < 0 || row >= PEG_BOARD_SIZE || column < 0 || column >= PEG_BOARD_SIZE) break;
      const target = board.querySelector(`[data-hole="${row * PEG_BOARD_SIZE + column}"]`);
      if (target) { button.tabIndex = -1; target.tabIndex = 0; target.focus(); break; }
    }
  });

  root.querySelector('[data-action="new-game"]')?.addEventListener('click', () => {
    game = createPegSolitaireGame(); selected = null; history = []; hintMove = null; render();
    announce(root, copy.messages.newGame, 'success');
  });
  root.querySelector('[data-action="undo"]')?.addEventListener('click', () => {
    const previous = history.pop();
    if (!previous) { announce(root, copy.messages.undoEmpty, 'info'); return; }
    game = previous; selected = null; hintMove = null; render();
    announce(root, copy.messages.undo, 'success');
  });
  root.querySelector('[data-action="hint"]')?.addEventListener('click', () => {
    hintMove = pegSolitaireHint(game);
    selected = null;
    render(hintMove?.from ?? null);
    announce(root, hintMove ? copy.messages.hint : copy.messages.noMoves, hintMove ? 'info' : 'error');
  });
  render();
}
