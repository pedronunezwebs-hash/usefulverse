import {
  createInitialState, exportFen, findBestMove, generateLegalMoves, isCheck,
  isCheckmate, isDraw, isGameOver, isStalemate, move,
} from './engine/index.mjs';

export { createInitialState, findBestMove, generateLegalMoves, isCheck, isCheckmate, isDraw, isGameOver, isStalemate, move };

export function readMakrukBoard(game) {
  const placement = exportFen(game).split(' ')[0];
  const board = Array(64).fill(null);
  const ranks = placement.split('/');
  if (ranks.length !== 8) throw new Error('Unexpected Makruk board position.');
  ranks.forEach((rankText, row) => {
    let file = 0;
    for (const token of rankText) {
      if (/^[1-8]$/u.test(token)) file += Number(token);
      else {
        if (file > 7) throw new Error('Unexpected Makruk board position.');
        const rank = 8 - row;
        board[(rank - 1) * 8 + file] = { piece: token.toLowerCase(), color: token === token.toUpperCase() ? 'white' : 'black' };
        file++;
      }
    }
    if (file !== 8) throw new Error('Unexpected Makruk board position.');
  });
  return board;
}

export function squareName(index) {
  return `${'abcdefgh'[index % 8]}${Math.floor(index / 8) + 1}`;
}

export function viewSquares(color) {
  const squares = [];
  const ranks = color === 'black' ? [...Array(8).keys()] : [...Array(8).keys()].reverse();
  const files = color === 'black' ? [...Array(8).keys()].reverse() : [...Array(8).keys()];
  for (const rankIndex of ranks) for (const file of files) squares.push(rankIndex * 8 + file);
  return squares;
}
