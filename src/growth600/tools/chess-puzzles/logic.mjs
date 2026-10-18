import { Chess } from 'chess.js';

export const CHESS_MATE_PUZZLES = Object.freeze([
  { id: 'queen-rook-01', fen: 'r7/8/5k2/5Q1K/8/7p/5R2/8 w - - 0 1', from: 'f5', to: 'f6', san: 'Qxf6#' },
  { id: 'queen-rook-02', fen: '1k6/7Q/r7/3p4/8/8/1R6/7K w - - 0 1', from: 'h7', to: 'b7', san: 'Qb7#' },
  { id: 'rook-file-01', fen: '3r4/4Q3/7k/5K2/p7/R7/8/8 w - - 0 1', from: 'a3', to: 'h3', san: 'Rh3#' },
  { id: 'rook-rank-01', fen: '1R6/7p/8/8/8/7r/2kQ2K1/8 w - - 0 1', from: 'b8', to: 'b2', san: 'Rb2#' },
  { id: 'rook-file-02', fen: '8/8/8/7p/8/r6k/3K1R1Q/8 w - - 0 1', from: 'f2', to: 'g2', san: 'Rg2#' },
  { id: 'queen-capture-01', fen: '8/1k6/1R5K/6r1/8/8/1p4Q1/8 w - - 0 1', from: 'g2', to: 'b7', san: 'Qxb7#' },
  { id: 'rook-rank-02', fen: '8/8/8/6R1/Q7/2p4k/5K2/6r1 w - - 0 1', from: 'g5', to: 'h5', san: 'Rh5#' },
  { id: 'queen-capture-02', fen: '8/8/8/8/4K1k1/8/1p4rR/6Q1 w - - 0 1', from: 'g1', to: 'g2', san: 'Qxg2#' },
  { id: 'queen-file-01', fen: '3r4/8/8/8/8/1KQ1Rp2/8/1k6 w - - 0 1', from: 'c3', to: 'b2', san: 'Qb2#' },
  { id: 'queen-rank-01', fen: '6r1/1p6/3K1k2/8/5R2/3Q4/8/8 w - - 0 1', from: 'd3', to: 'g3', san: 'Qg3#' },
].map((puzzle) => Object.freeze(puzzle)));

function validRandom(random) {
  if (typeof random !== 'function') throw new TypeError('A random-number function is required.');
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('The random source must return a value from 0 inclusive to 1 exclusive.');
  return value;
}

export function validateMatePuzzles(puzzles = CHESS_MATE_PUZZLES) {
  if (!Array.isArray(puzzles) || !puzzles.length) throw new TypeError('Provide a non-empty puzzle list.');
  const ids = new Set();
  return puzzles.map((puzzle) => {
    if (!puzzle?.id || ids.has(puzzle.id) || !puzzle.fen || !puzzle.from || !puzzle.to) throw new TypeError('Each puzzle needs a unique ID, FEN and solution move.');
    ids.add(puzzle.id);
    const game = new Chess(puzzle.fen);
    if (game.isCheck()) throw new Error(`${puzzle.id} starts with the side to move in check.`);
    const mates = game.moves({ verbose: true }).filter((move) => {
      game.move(move);
      const mate = game.isCheckmate();
      game.undo();
      return mate;
    });
    if (mates.length !== 1 || mates[0].from !== puzzle.from || mates[0].to !== puzzle.to || mates[0].san !== puzzle.san) throw new Error(`${puzzle.id} does not have the declared unique mate-in-one solution.`);
    return Object.freeze({ id: puzzle.id, fen: puzzle.fen, solution: puzzle.san, legalMoves: game.moves().length });
  });
}

export function createChessPuzzleSession({ previousId = '', puzzles = CHESS_MATE_PUZZLES, random = Math.random } = {}) {
  if (!Array.isArray(puzzles) || !puzzles.length) throw new TypeError('Provide a non-empty puzzle list.');
  const index = Math.floor(validRandom(random) * puzzles.length);
  const puzzle = puzzles.length > 1 && puzzles[index].id === previousId ? puzzles[(index + 1) % puzzles.length] : puzzles[index];
  const game = new Chess(puzzle.fen);
  return { puzzle, game, attempts: 0, hints: 0, solved: false };
}

export function getChessPuzzleBoard(session) {
  if (!session?.game || typeof session.game.board !== 'function') throw new TypeError('Invalid chess puzzle session.');
  return session.game.board();
}

export function getChessPuzzleHint(session) {
  if (!session?.puzzle || session.solved) return null;
  session.hints += 1;
  return Object.freeze({ from: session.puzzle.from, to: session.puzzle.to });
}

export function submitChessPuzzleMove(session, from, to) {
  if (!session?.game || session.solved) return Object.freeze({ ok: false, reason: 'finished' });
  if (!/^[a-h][1-8]$/u.test(from) || !/^[a-h][1-8]$/u.test(to)) return Object.freeze({ ok: false, reason: 'invalid-square' });
  session.attempts += 1;
  const move = session.game.moves({ square: from, verbose: true }).find((candidate) => candidate.to === to);
  if (!move) return Object.freeze({ ok: false, reason: 'illegal' });
  if (move.from !== session.puzzle.from || move.to !== session.puzzle.to || move.san !== session.puzzle.san) return Object.freeze({ ok: false, reason: 'not-solution' });
  const played = session.game.move({ from, to });
  if (!session.game.isCheckmate()) throw new Error('The verified puzzle move did not end in checkmate.');
  session.solved = true;
  return Object.freeze({ ok: true, san: played.san, attempts: session.attempts, hints: session.hints });
}
