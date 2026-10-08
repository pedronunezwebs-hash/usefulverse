import { Chess } from 'chess.js';

// Short, hand-curated sample lines; these are teaching examples, not exhaustive theory.
export const OPENING_LINES = Object.freeze([
  Object.freeze({ id: 'italian', name: 'Italian Game', moves: Object.freeze(['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd4']) }),
  Object.freeze({ id: 'sicilian', name: 'Sicilian Defense', moves: Object.freeze(['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3']) }),
  Object.freeze({ id: 'ruy-lopez', name: 'Ruy Lopez', moves: Object.freeze(['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7']) }),
  Object.freeze({ id: 'french', name: 'French Defense', moves: Object.freeze(['e4', 'e6', 'd4', 'd5', 'Nc3', 'Nf6', 'e5', 'Nfd7']) }),
  Object.freeze({ id: 'caro-kann', name: 'Caro-Kann Defense', moves: Object.freeze(['e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4', 'Bf5']) }),
  Object.freeze({ id: 'queens-gambit', name: "Queen's Gambit Declined", moves: Object.freeze(['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Nf3', 'Be7']) }),
  Object.freeze({ id: 'london', name: 'London System', moves: Object.freeze(['d4', 'Nf6', 'Bf4', 'e6', 'e3', 'd5', 'Nf3', 'Bd6']) }),
  Object.freeze({ id: 'scandinavian', name: 'Scandinavian Defense', moves: Object.freeze(['e4', 'd5', 'exd5', 'Qxd5', 'Nc3', 'Qa5', 'd4', 'Nf6']) }),
  Object.freeze({ id: 'english', name: 'English Opening', moves: Object.freeze(['c4', 'e5', 'Nc3', 'Nf6', 'g3', 'd5', 'cxd5', 'Nxd5']) }),
  Object.freeze({ id: 'kings-indian', name: "King's Indian Defense", moves: Object.freeze(['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6']) }),
]);

export function validateOpeningLines(lines = OPENING_LINES) {
  if (!Array.isArray(lines) || !lines.length) throw new TypeError('Opening lines must be a non-empty list.');
  return lines.map((line) => {
    if (!line?.id || !line.name || !Array.isArray(line.moves) || line.moves.length < 2) throw new TypeError('Each opening needs an id, name and move sequence.');
    const game = new Chess();
    const replay = [];
    for (const san of line.moves) {
      const move = game.move(san);
      if (!move) throw new Error(`Illegal move ${san} in ${line.id}.`);
      replay.push(move.san);
    }
    return Object.freeze({ id: line.id, plies: replay.length, finalFen: game.fen(), moves: Object.freeze(replay) });
  });
}

export function createOpeningSession(openingId, side = 'w', lines = OPENING_LINES) {
  if (!['w', 'b'].includes(side)) throw new RangeError('Side must be w (White) or b (Black).');
  const line = lines.find((candidate) => candidate.id === openingId);
  if (!line) throw new RangeError('Choose a listed opening.');
  const game = new Chess();
  return { line, side, game, ply: 0, mistakes: 0, completed: false };
}

export function playOpponentMoves(session) {
  const played = [];
  while (!session.completed && session.ply < session.line.moves.length && session.game.turn() !== session.side) {
    const san = session.line.moves[session.ply];
    const move = session.game.move(san);
    if (!move) throw new Error(`Illegal move ${san} in ${session.line.id}.`);
    session.ply += 1;
    played.push(move.san);
  }
  session.completed = session.ply >= session.line.moves.length;
  return Object.freeze({ played: Object.freeze(played), completed: session.completed, expected: session.completed ? null : session.line.moves[session.ply], fen: session.game.fen() });
}

export function submitOpeningMove(session, from, to, promotion = 'q') {
  if (session.completed || session.game.turn() !== session.side) return Object.freeze({ ok: false, reason: 'not-your-turn', expected: null });
  const expected = session.line.moves[session.ply];
  const legal = session.game.moves({ square: from, verbose: true }).find((candidate) => candidate.to === to && candidate.promotion === (expected?.includes('=') ? promotion : undefined));
  if (!legal) return Object.freeze({ ok: false, reason: 'illegal', expected });
  if (legal.san !== expected) { session.mistakes += 1; return Object.freeze({ ok: false, reason: 'off-line', expected, played: legal.san }); }
  const move = session.game.move({ from, to, promotion });
  session.ply += 1;
  session.completed = session.ply >= session.line.moves.length;
  return Object.freeze({ ok: true, san: move.san, completed: session.completed, expected: session.completed ? null : session.line.moves[session.ply], fen: session.game.fen() });
}

export function getExpectedMoveDetails(session) {
  if (session.completed) return null;
  const san = session.line.moves[session.ply];
  return session.game.moves({ verbose: true }).find((move) => move.san === san) ?? null;
}
