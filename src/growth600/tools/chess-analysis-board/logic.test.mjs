import assert from 'node:assert/strict';
import test from 'node:test';
import { chessAnalysisUciToSan, createChessAnalysisSession, getChessAnalysisState, loadChessAnalysisInput, playChessAnalysisMove, resetChessAnalysisSession, setChessAnalysisCursor } from './logic.mjs';

test('standard legal moves can be replayed, exported and navigated locally', () => {
  const session = createChessAnalysisSession();
  assert.equal(playChessAnalysisMove(session, 'e2', 'e4').san, 'e4');
  assert.equal(playChessAnalysisMove(session, 'e7', 'e5').san, 'e5');
  assert.equal(setChessAnalysisCursor(session, 1).state.cursor, 1);
  assert.equal(getChessAnalysisState(session).pgn.includes('1. e4'), true);
  setChessAnalysisCursor(session, 2);
  assert.equal(loadChessAnalysisInput(session, { pgn: getChessAnalysisState(session).pgn }).state.total, 2);
});

test('illegal move, malformed FEN or PGN, excessive PGN and invalid cursor are rejected', () => {
  const session = createChessAnalysisSession();
  assert.equal(playChessAnalysisMove(session, 'e2', 'e5').reason, 'illegal-move');
  assert.equal(loadChessAnalysisInput(session, { fen: 'not a FEN' }).reason, 'invalid-fen');
  assert.equal(loadChessAnalysisInput(session, { pgn: '[bad' }).reason, 'invalid-pgn');
  assert.equal(loadChessAnalysisInput(session, { pgn: 'x'.repeat(12_001) }).reason, 'too-large');
  assert.equal(setChessAnalysisCursor(session, -1).reason, 'out-of-range');
});

test('imported move history can branch at the current position and reset', () => {
  const session = createChessAnalysisSession();
  loadChessAnalysisInput(session, { pgn: '1. e4 e5 2. Nf3 Nc6' });
  setChessAnalysisCursor(session, 2);
  assert.equal(playChessAnalysisMove(session, 'f1', 'c4').san, 'Bc4');
  assert.equal(getChessAnalysisState(session).pgn.includes('Nc6'), false);
  assert.equal(getChessAnalysisState(session).total, 3);
  assert.equal(resetChessAnalysisSession(session).cursor, 0);
});

test('engine UCI variations are converted to legal SAN and stop at invalid moves', () => {
  const start = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  assert.deepEqual(chessAnalysisUciToSan(start, ['e2e4', 'e7e5', 'g1f3']), ['e4', 'e5', 'Nf3']);
  assert.deepEqual(chessAnalysisUciToSan(start, ['e2e5', 'e7e5']), []);
  assert.deepEqual(chessAnalysisUciToSan('invalid FEN', ['e2e4']), []);
});
