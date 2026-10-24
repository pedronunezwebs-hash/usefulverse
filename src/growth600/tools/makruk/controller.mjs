import { createInitialState, findBestMove, generateLegalMoves, isCheck, isCheckmate, isDraw, isGameOver, isStalemate, move, readMakrukBoard, squareName, viewSquares } from './logic.mjs';

const root = document.querySelector('[data-tool="makruk"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const make = (tag, text, className) => { const element = document.createElement(tag); if (text !== undefined) element.textContent = String(text); if (className) element.className = className; return element; };
  let game = null;
  let playerColor = 'white';
  let difficulty = 1;
  let selected = null;
  let history = [];
  let busy = false;

  function pieceName(piece) { return copy.fields.pieces[piece] ?? piece; }
  function colorName(color) { return copy.fields[color]; }
  function currentColor() { return game.turn === 'w' ? 'white' : 'black'; }
  function announceTurn() {
    status.classList.remove('status--error');
    if (isCheckmate(game)) status.textContent = currentColor() === playerColor ? copy.fields.youLost : copy.fields.youWon;
    else if (isStalemate(game) || isDraw(game)) status.textContent = copy.fields.draw;
    else if (game.countdown) status.textContent = `${copy.fields.endgameCount}: ${game.countdown.count}`;
    else if (isCheck(game)) status.textContent = `${colorName(currentColor())} · ${copy.fields.inCheck}`;
    else status.textContent = `${colorName(currentColor())} · ${copy.fields.toMove}`;
  }

  function renderBoard(focusSquare = null) {
    const boardNode = content.querySelector('[data-makruk-board]');
    if (!boardNode || !game) return;
    const board = readMakrukBoard(game);
    const moves = generateLegalMoves(game);
    const choices = selected === null ? [] : moves.filter((candidate) => candidate.from === selected);
    const targets = new Set(choices.map(({ to }) => to));
    boardNode.replaceChildren();
    for (const square of viewSquares(playerColor)) {
      const file = square % 8;
      const rank = Math.floor(square / 8);
      const piece = board[square];
      const button = make('button', undefined, `makruk-square ${(file + rank) % 2 ? 'makruk-square--dark' : 'makruk-square--light'}`);
      button.type = 'button';
      button.dataset.square = String(square);
      button.setAttribute('aria-label', `${squareName(square)}, ${piece ? `${colorName(piece.color)}, ${pieceName(piece.piece)}` : copy.fields.emptySquare}${square === selected ? `, ${copy.fields.selected}` : ''}${targets.has(square) ? `, ${copy.fields.legalDestination}` : ''}`);
      button.setAttribute('aria-pressed', square === selected ? 'true' : 'false');
      if (square === selected) button.classList.add('makruk-square--selected');
      if (targets.has(square)) button.classList.add('makruk-square--target');
      if (piece) button.append(make('span', pieceName(piece.piece), `makruk-piece makruk-piece--${piece.color}`));
      button.append(make('span', squareName(square), 'makruk-coordinate'));
      button.disabled = busy || isGameOver(game);
      button.addEventListener('click', () => chooseSquare(square));
      boardNode.append(button);
    }
    if (focusSquare !== null && !busy) boardNode.querySelector(`[data-square="${focusSquare}"]`)?.focus();
    announceTurn();
  }

  function showMoveHistory() {
    const list = content.querySelector('[data-makruk-history]');
    if (!list) return;
    list.replaceChildren(...history.map((notation) => make('li', notation)));
  }

  function updateState(nextGame, notation) {
    game = nextGame;
    history.push(notation);
    selected = null;
    showMoveHistory();
    renderBoard();
    if (!isGameOver(game) && currentColor() !== playerColor) runBot();
  }

  function chooseSquare(square) {
    if (!game || busy || isGameOver(game) || currentColor() !== playerColor) return;
    const board = readMakrukBoard(game);
    const legalMoves = generateLegalMoves(game);
    if (selected !== null) {
      const played = legalMoves.find((candidate) => candidate.from === selected && candidate.to === square);
      if (played) {
        const notation = `${squareName(played.from)}–${squareName(played.to)}`;
        updateState(move(game, played), notation);
        return;
      }
    }
    selected = board[square]?.color === playerColor && legalMoves.some((candidate) => candidate.from === square) ? square : null;
    renderBoard(square);
  }

  function runBot() {
    busy = true;
    const boardNode = content.querySelector('[data-makruk-board]');
    if (boardNode) for (const square of boardNode.children) square.disabled = true;
    status.textContent = copy.fields.botThinking;
    window.setTimeout(() => {
      try {
        const choice = findBestMove(game, difficulty);
        const bestMove = choice?.bestMove;
        if (!bestMove) { busy = false; renderBoard(); return; }
        const notation = `${squareName(bestMove.from)}–${squareName(bestMove.to)}`;
        history.push(notation);
        game = move(game, bestMove);
        selected = null;
        busy = false;
        showMoveHistory();
        renderBoard();
      } catch {
        busy = false;
        status.textContent = copy.fields.botUnavailable;
        status.classList.add('status--error');
        renderBoard();
      }
    }, 25);
  }

  function startGame(event) {
    event.preventDefault();
    playerColor = form.elements.namedItem('side').value;
    difficulty = Number(form.elements.namedItem('difficulty').value) === 2 ? 2 : 1;
    game = createInitialState();
    history = [];
    selected = null;
    busy = false;
    content.replaceChildren();
    const board = make('div', undefined, 'makruk-board');
    board.dataset.makrukBoard = '';
    board.setAttribute('aria-label', copy.fields.boardLabel);
    board.setAttribute('role', 'group');
    const panel = make('div', undefined, 'makruk-game-panel');
    panel.append(make('h3', copy.fields.moveHistory));
    const list = make('ol', undefined, 'makruk-history');
    list.dataset.makrukHistory = '';
    panel.append(list);
    const reset = make('button', copy.actions.newGame, 'button button--secondary');
    reset.type = 'button'; reset.addEventListener('click', startGame);
    panel.append(reset);
    for (const [label, url] of [[copy.fields.officialRules, 'https://www.thailandchess.or.th/'], [copy.fields.movementGuide, 'https://makruk.app/rules']]) {
      const link = make('a', label); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; panel.append(link);
    }
    content.append(board, panel);
    result.hidden = false;
    renderBoard();
    if (currentColor() !== playerColor) runBot();
  }

  form.addEventListener('submit', startGame);
  form.addEventListener('reset', () => {
    game = null; history = []; selected = null; busy = false;
    content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error');
  });
}
