const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export function ticTacToeResult(board) {
  if (!Array.isArray(board) || board.length !== 9 || board.some((value) => ![null, 'X', 'O'].includes(value))) throw new TypeError('Use a nine-cell tic-tac-toe board with X, O or empty cells.');
  for (const [a, b, c] of winningLines) if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  return board.every(Boolean) ? 'draw' : null;
}

export function chooseTicTacToeMove(board, random = Math.random) {
  if (!Array.isArray(board) || board.length !== 9 || board.some((value) => ![null, 'X', 'O'].includes(value))) throw new TypeError('Use a nine-cell tic-tac-toe board with X, O or empty cells.');
  if (typeof random !== 'function') throw new TypeError('Provide a random function.');
  const available = board.flatMap((value, index) => value === null ? [index] : []);
  if (!available.length || ticTacToeResult(board)) return null;
  const score = (turn, depth) => {
    const result = ticTacToeResult(board);
    if (result === 'O') return 10 - depth;
    if (result === 'X') return depth - 10;
    if (result === 'draw') return 0;
    const moves = board.flatMap((value, index) => value === null ? [index] : []);
    const outcomes = moves.map((index) => {
      board[index] = turn;
      const next = score(turn === 'O' ? 'X' : 'O', depth + 1);
      board[index] = null;
      return next;
    });
    return turn === 'O' ? Math.max(...outcomes) : Math.min(...outcomes);
  };
  const candidates = available.map((index) => {
    board[index] = 'O';
    const value = score('X', 0);
    board[index] = null;
    return { index, value };
  });
  const best = Math.max(...candidates.map(({ value }) => value));
  const tied = candidates.filter(({ value }) => value === best);
  const sample = random();
  if (!Number.isFinite(sample) || sample < 0 || sample >= 1) throw new RangeError('Random source must return a number from 0 (inclusive) to 1 (exclusive).');
  return tied[Math.floor(sample * tied.length)].index;
}
