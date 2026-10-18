import { Chess, DEFAULT_POSITION } from 'chess.js';

export const CHESS_ANALYSIS_DEFAULT_FEN = DEFAULT_POSITION;
export const CHESS_ANALYSIS_MAX_PGN_LENGTH = 12000;
export const CHESS_ANALYSIS_MAX_PLIES = 400;

function rebuild(session, cursor) {
  const game = new Chess(session.startFen);
  for (const san of session.moves.slice(0, cursor)) game.move(san);
  session.game = game;
  session.cursor = cursor;
  return Object.freeze({ cursor, total: session.moves.length, fen: game.fen(), turn: game.turn(), check: game.isCheck(), checkmate: game.isCheckmate(), draw: game.isDraw() });
}

export function createChessAnalysisSession() {
  return { startFen: DEFAULT_POSITION, moves: [], cursor: 0, game: new Chess() };
}

export function getChessAnalysisState(session) {
  if (!session?.game || !Array.isArray(session.moves)) throw new TypeError('Invalid chess analysis session.');
  return Object.freeze({ cursor: session.cursor, total: session.moves.length, fen: session.game.fen(), turn: session.game.turn(), check: session.game.isCheck(), checkmate: session.game.isCheckmate(), draw: session.game.isDraw(), pgn: session.game.pgn() });
}

export function loadChessAnalysisInput(session, { fen = '', pgn = '' } = {}) {
  if (!session || typeof fen !== 'string' || typeof pgn !== 'string' || fen.length > 160 || pgn.length > CHESS_ANALYSIS_MAX_PGN_LENGTH) return Object.freeze({ ok: false, reason: 'too-large' });
  try {
    if (pgn.trim()) {
      const parsed = new Chess();
      parsed.loadPgn(pgn.trim(), { strict: true });
      const moves = parsed.history();
      if (moves.length > CHESS_ANALYSIS_MAX_PLIES) return Object.freeze({ ok: false, reason: 'too-many-moves' });
      const headers = parsed.getHeaders();
      session.startFen = headers.FEN || DEFAULT_POSITION;
      session.moves = moves;
      rebuild(session, moves.length);
      return Object.freeze({ ok: true, state: getChessAnalysisState(session) });
    }
    const parsed = fen.trim() ? new Chess(fen.trim()) : new Chess();
    session.startFen = parsed.fen();
    session.moves = [];
    rebuild(session, 0);
    return Object.freeze({ ok: true, state: getChessAnalysisState(session) });
  } catch {
    return Object.freeze({ ok: false, reason: pgn.trim() ? 'invalid-pgn' : 'invalid-fen' });
  }
}

export function playChessAnalysisMove(session, from, to, promotion = 'q') {
  if (!session?.game || !/^[a-h][1-8]$/u.test(from) || !/^[a-h][1-8]$/u.test(to) || !['q', 'r', 'b', 'n'].includes(promotion)) return Object.freeze({ ok: false, reason: 'invalid-move' });
  const legal = session.game.moves({ square: from, verbose: true }).find((move) => move.to === to && (!move.promotion || move.promotion === promotion));
  if (!legal) return Object.freeze({ ok: false, reason: 'illegal-move' });
  const move = session.game.move({ from, to, ...(legal.promotion ? { promotion } : {}) });
  session.moves = session.moves.slice(0, session.cursor);
  session.moves.push(move.san);
  session.cursor = session.moves.length;
  return Object.freeze({ ok: true, san: move.san, state: getChessAnalysisState(session) });
}

export function setChessAnalysisCursor(session, cursor) {
  if (!session || !Number.isInteger(cursor)) throw new TypeError('Move index must be an integer.');
  if (cursor < 0 || cursor > session.moves.length) return Object.freeze({ ok: false, reason: 'out-of-range' });
  return Object.freeze({ ok: true, state: rebuild(session, cursor) });
}

export function resetChessAnalysisSession(session) {
  if (!session) throw new TypeError('A chess analysis session is required.');
  session.startFen = DEFAULT_POSITION;
  session.moves = [];
  return rebuild(session, 0);
}

export function chessAnalysisUciToSan(fen, uciMoves) {
  if (typeof fen !== 'string' || !Array.isArray(uciMoves) || uciMoves.length > CHESS_ANALYSIS_MAX_PLIES) return Object.freeze([]);
  try {
    const game = new Chess(fen); const san = [];
    for (const token of uciMoves) {
      if (typeof token !== 'string' || !/^[a-h][1-8][a-h][1-8][qrbn]?$/u.test(token)) break;
      const move = game.move({ from: token.slice(0, 2), to: token.slice(2, 4), ...(token[4] ? { promotion: token[4] } : {}) });
      if (!move) break;
      san.push(move.san);
    }
    return Object.freeze(san);
  } catch { return Object.freeze([]); }
}
