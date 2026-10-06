const opponent = (color) => color === 'B' ? 'W' : 'B';
const keyFor = (board) => board.map((cell) => cell ?? '.').join('');

export function createGoGame(size = 9) {
  if (![5, 9, 13, 19].includes(size)) throw new RangeError('Choose a supported Go board size.');
  const board = Array(size * size).fill(null);
  return Object.freeze({ size, board: Object.freeze(board), turn: 'B', captures: Object.freeze({ B: 0, W: 0 }), history: Object.freeze([keyFor(board)]), passes: 0, finished: false });
}

export function goNeighbors(index, size) {
  const row = Math.floor(index / size); const column = index % size;
  return [row > 0 ? index - size : -1, row < size - 1 ? index + size : -1, column > 0 ? index - 1 : -1, column < size - 1 ? index + 1 : -1].filter((next) => next >= 0);
}

export function getGoGroup(board, start, size) {
  if (!Array.isArray(board) || !Number.isInteger(start) || start < 0 || start >= board.length || !board[start]) return { stones: [], liberties: new Set() };
  const color = board[start]; const stones = []; const liberties = new Set(); const seen = new Set([start]); const pending = [start];
  while (pending.length) {
    const index = pending.pop(); stones.push(index);
    for (const next of goNeighbors(index, size)) {
      if (board[next] == null) liberties.add(next);
      else if (board[next] === color && !seen.has(next)) { seen.add(next); pending.push(next); }
    }
  }
  return { stones, liberties };
}

export function playGoMove(game, index) {
  if (!game || game.finished) throw new Error('The game has ended. Start a new game.');
  if (!Number.isInteger(index) || index < 0 || index >= game.board.length) throw new RangeError('Choose an intersection on the board.');
  if (game.board[index] != null) return { game, status: 'occupied', captured: 0 };
  const board = [...game.board]; const color = game.turn; board[index] = color; let captured = 0;
  for (const next of goNeighbors(index, game.size)) {
    if (board[next] !== opponent(color)) continue;
    const group = getGoGroup(board, next, game.size);
    if (group.liberties.size === 0) { for (const stone of group.stones) board[stone] = null; captured += group.stones.length; }
  }
  if (getGoGroup(board, index, game.size).liberties.size === 0) return { game, status: 'suicide', captured: 0 };
  const position = keyFor(board);
  if (game.history.includes(position)) return { game, status: 'repeat', captured: 0 };
  const captures = { ...game.captures, [color]: game.captures[color] + captured };
  const nextGame = Object.freeze({ ...game, board: Object.freeze(board), turn: opponent(color), captures: Object.freeze(captures), history: Object.freeze([...game.history, position]), passes: 0 });
  return { game: nextGame, status: captured ? 'capture' : 'played', captured };
}

export function passGoTurn(game) {
  if (!game || game.finished) throw new Error('The game has ended. Start a new game.');
  const passes = game.passes + 1;
  const finished = passes >= 2;
  const next = Object.freeze({ ...game, turn: opponent(game.turn), passes, finished });
  return { game: next, status: finished ? 'finished' : 'passed', score: finished ? scoreGoArea(next.board, next.size) : null };
}

export function scoreGoArea(board, size) {
  if (!Array.isArray(board) || board.length !== size * size) throw new TypeError('Board does not match its size.');
  const score = { B: 0, W: 0 }; const seen = new Set();
  for (let index = 0; index < board.length; index += 1) {
    if (board[index]) { score[board[index]] += 1; continue; }
    if (seen.has(index)) continue;
    const region = []; const boundary = new Set(); const pending = [index]; seen.add(index);
    while (pending.length) {
      const current = pending.pop(); region.push(current);
      for (const next of goNeighbors(current, size)) {
        if (board[next]) boundary.add(board[next]);
        else if (!seen.has(next)) { seen.add(next); pending.push(next); }
      }
    }
    if (boundary.size === 1) score[[...boundary][0]] += region.length;
  }
  return Object.freeze(score);
}
