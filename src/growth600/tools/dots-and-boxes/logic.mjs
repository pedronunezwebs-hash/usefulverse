export const DOTS_AND_BOXES_LIMITS = Object.freeze({ minSize: 2, maxSize: 7 });

function assertGame(game) {
  if (!game || !Number.isInteger(game.size) || game.size < DOTS_AND_BOXES_LIMITS.minSize || game.size > DOTS_AND_BOXES_LIMITS.maxSize) throw new RangeError('Choose a supported board size.');
  const edgeCount = 2 * game.size * (game.size + 1);
  if (!Array.isArray(game.edges) || game.edges.length !== edgeCount || game.edges.some((edge) => typeof edge !== 'boolean')) throw new RangeError('The board edges are invalid.');
  if (!Array.isArray(game.boxes) || game.boxes.length !== game.size ** 2 || game.boxes.some((owner) => owner !== null && owner !== 0 && owner !== 1)) throw new RangeError('The box owners are invalid.');
  if (!Array.isArray(game.scores) || game.scores.length !== 2 || game.scores.some((score) => !Number.isInteger(score) || score < 0)) throw new RangeError('The scores are invalid.');
  if (game.currentPlayer !== 0 && game.currentPlayer !== 1) throw new RangeError('The current player is invalid.');
}

export function createDotsAndBoxesGame(size = 4, mode = 'computer') {
  if (!Number.isInteger(size) || size < DOTS_AND_BOXES_LIMITS.minSize || size > DOTS_AND_BOXES_LIMITS.maxSize) throw new RangeError('Choose a board from 2 to 7 boxes per side.');
  if (!['computer', 'two-player'].includes(mode)) throw new RangeError('Choose a supported game mode.');
  const boxCount = size * size;
  return Object.freeze({ size, mode, edges: Object.freeze(Array(2 * size * (size + 1)).fill(false)), boxes: Object.freeze(Array(boxCount).fill(null)), scores: Object.freeze([0, 0]), currentPlayer: 0, moves: 0, gameOver: false, winner: null });
}

function horizontalIndex(size, row, col) { return row * size + col; }
function verticalIndex(size, row, col) { return size * (size + 1) + row * (size + 1) + col; }
function boxIndex(size, row, col) { return row * size + col; }

function edgeFor(game, orientation, row, col) {
  const { size } = game;
  if (!Number.isInteger(row) || !Number.isInteger(col)) throw new RangeError('Choose a valid edge.');
  if (orientation === 'h' && row >= 0 && row <= size && col >= 0 && col < size) return horizontalIndex(size, row, col);
  if (orientation === 'v' && row >= 0 && row < size && col >= 0 && col <= size) return verticalIndex(size, row, col);
  throw new RangeError('Choose a valid edge.');
}

export function adjacentBoxIndices(game, orientation, row, col) {
  assertGame(game);
  edgeFor(game, orientation, row, col);
  const { size } = game;
  const positions = orientation === 'h'
    ? [[row - 1, col], [row, col]]
    : [[row, col - 1], [row, col]];
  return positions.filter(([boxRow, boxCol]) => boxRow >= 0 && boxRow < size && boxCol >= 0 && boxCol < size).map(([boxRow, boxCol]) => boxIndex(size, boxRow, boxCol));
}

export function playDotsAndBoxesEdge(game, orientation, row, col) {
  assertGame(game);
  if (game.gameOver) throw new RangeError('This game is already over.');
  const edgeIndex = edgeFor(game, orientation, row, col);
  if (game.edges[edgeIndex]) throw new RangeError('That line is already drawn.');
  const edges = [...game.edges];
  const boxes = [...game.boxes];
  const scores = [...game.scores];
  edges[edgeIndex] = true;
  const completed = [];
  for (const index of adjacentBoxIndices(game, orientation, row, col)) {
    if (boxes[index] !== null) continue;
    const boxRow = Math.floor(index / game.size);
    const boxCol = index % game.size;
    const fourSides = [
      edges[horizontalIndex(game.size, boxRow, boxCol)],
      edges[horizontalIndex(game.size, boxRow + 1, boxCol)],
      edges[verticalIndex(game.size, boxRow, boxCol)],
      edges[verticalIndex(game.size, boxRow, boxCol + 1)],
    ];
    if (fourSides.every(Boolean)) { boxes[index] = game.currentPlayer; completed.push(index); }
  }
  scores[game.currentPlayer] += completed.length;
  const moves = game.moves + 1;
  const gameOver = moves === edges.length;
  const winner = gameOver ? (scores[0] === scores[1] ? 'tie' : scores[0] > scores[1] ? 0 : 1) : null;
  const currentPlayer = completed.length || gameOver ? game.currentPlayer : 1 - game.currentPlayer;
  return Object.freeze({ ...game, edges: Object.freeze(edges), boxes: Object.freeze(boxes), scores: Object.freeze(scores), moves, gameOver, winner, currentPlayer, lastMove: Object.freeze({ orientation, row, col, completed: Object.freeze(completed) }) });
}

export function listOpenDotsAndBoxesEdges(game) {
  assertGame(game);
  const { size } = game;
  const available = [];
  for (let row = 0; row <= size; row += 1) for (let col = 0; col < size; col += 1) if (!game.edges[horizontalIndex(size, row, col)]) available.push(Object.freeze({ orientation: 'h', row, col }));
  for (let row = 0; row < size; row += 1) for (let col = 0; col <= size; col += 1) if (!game.edges[verticalIndex(size, row, col)]) available.push(Object.freeze({ orientation: 'v', row, col }));
  return available;
}

export function chooseDotsAndBoxesBotMove(game, random = Math.random) {
  assertGame(game);
  if (game.gameOver) throw new RangeError('This game is already over.');
  if (typeof random !== 'function') throw new TypeError('Provide a random function.');
  const moves = listOpenDotsAndBoxesEdges(game);
  if (!moves.length) throw new RangeError('No lines remain.');
  const completedBoxes = [];
  const safeMoves = [];
  for (const move of moves) {
    const adjacent = adjacentBoxIndices(game, move.orientation, move.row, move.col);
    const closes = adjacent.filter((index) => {
      const row = Math.floor(index / game.size);
      const col = index % game.size;
      return [game.edges[horizontalIndex(game.size, row, col)], game.edges[horizontalIndex(game.size, row + 1, col)], game.edges[verticalIndex(game.size, row, col)], game.edges[verticalIndex(game.size, row, col + 1)]].filter(Boolean).length === 3;
    });
    if (closes.length) completedBoxes.push({ move, count: closes.length });
    else if (adjacent.every((index) => {
      const row = Math.floor(index / game.size);
      const col = index % game.size;
      return [game.edges[horizontalIndex(game.size, row, col)], game.edges[horizontalIndex(game.size, row + 1, col)], game.edges[verticalIndex(game.size, row, col)], game.edges[verticalIndex(game.size, row, col + 1)]].filter(Boolean).length < 2;
    })) safeMoves.push(move);
  }
  if (completedBoxes.length) return completedBoxes.sort((a, b) => b.count - a.count)[0].move;
  if (safeMoves.length) return safeMoves[Math.floor(Math.max(0, Math.min(0.999999999, random())) * safeMoves.length)];
  return moves[Math.floor(Math.max(0, Math.min(0.999999999, random())) * moves.length)];
}
