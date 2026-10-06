const validRandom = (random) => {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a number from 0 (inclusive) to 1 (exclusive).');
  return value;
};

export function isSlidingPuzzleSolved(board) {
  return Array.isArray(board) && board.length >= 4 && board.every((value, index) => value === (index === board.length - 1 ? 0 : index + 1));
}

export function isSlidingPuzzleSolvable(board, size) {
  if (!Array.isArray(board) || !Number.isInteger(size) || size < 2 || board.length !== size * size
      || [...board].sort((a, b) => a - b).some((value, index) => value !== index)) return false;
  let inversions = 0;
  for (let left = 0; left < board.length; left += 1) {
    if (board[left] === 0) continue;
    for (let right = left + 1; right < board.length; right += 1) if (board[right] && board[left] > board[right]) inversions += 1;
  }
  if (size % 2) return inversions % 2 === 0;
  const blankRowFromBottom = size - Math.floor(board.indexOf(0) / size);
  return (inversions + blankRowFromBottom) % 2 === 1;
}

export function moveSlidingTile(board, index, size) {
  if (!Array.isArray(board) || !Number.isInteger(size) || size < 2 || board.length !== size * size
      || [...board].sort((a, b) => a - b).some((value, position) => value !== position)
      || !Number.isInteger(index) || index < 0 || index >= board.length) return null;
  const empty = board.indexOf(0);
  if (empty < 0 || board.lastIndexOf(0) !== empty) return null;
  const row = Math.floor(index / size); const column = index % size;
  const emptyRow = Math.floor(empty / size); const emptyColumn = empty % size;
  if (Math.abs(row - emptyRow) + Math.abs(column - emptyColumn) !== 1) return null;
  const next = board.slice(); [next[index], next[empty]] = [next[empty], next[index]];
  return next;
}

export function newSlidingPuzzle(size = 4, random = Math.random, shuffleMoves = size * size * 24) {
  if (!Number.isInteger(size) || size < 3 || size > 5) throw new RangeError('Puzzle size must be 3, 4 or 5.');
  if (typeof random !== 'function') throw new TypeError('Provide a random function.');
  if (!Number.isInteger(shuffleMoves) || shuffleMoves < 1 || shuffleMoves > 5000) throw new RangeError('Shuffle moves must be from 1 to 5000.');
  const board = Array.from({ length: size * size }, (_, index) => index === size * size - 1 ? 0 : index + 1);
  let empty = board.length - 1; let previousEmpty = -1;
  for (let turn = 0; turn < shuffleMoves; turn += 1) {
    const row = Math.floor(empty / size); const column = empty % size;
    const neighbors = [];
    if (row > 0) neighbors.push(empty - size);
    if (row < size - 1) neighbors.push(empty + size);
    if (column > 0) neighbors.push(empty - 1);
    if (column < size - 1) neighbors.push(empty + 1);
    const choices = neighbors.filter((index) => index !== previousEmpty);
    const moved = choices[Math.floor(validRandom(random) * choices.length)];
    [board[empty], board[moved]] = [board[moved], board[empty]];
    previousEmpty = empty; empty = moved;
  }
  if (isSlidingPuzzleSolved(board)) [board[empty], board[empty - 1]] = [board[empty - 1], board[empty]];
  return board;
}
