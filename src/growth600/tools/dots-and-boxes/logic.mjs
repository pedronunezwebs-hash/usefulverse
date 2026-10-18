export const DOTS_BOXES_SIZES = Object.freeze([3, 4, 5]);

function boardIndex(row, column, columns) { return row * columns + column; }
function checkRandom(random) {
  if (typeof random !== 'function') throw new TypeError('A random-number function is required.');
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random values must be from 0 inclusive to 1 exclusive.');
  return value;
}

export function createDotsBoxesGame({ size = 4, mode = 'computer' } = {}) {
  if (!DOTS_BOXES_SIZES.includes(size)) throw new RangeError('Choose a board with 3, 4 or 5 boxes per side.');
  if (!['computer', 'two-player'].includes(mode)) throw new RangeError('Choose computer or two-player mode.');
  return {
    size,
    mode,
    horizontal: Array((size + 1) * size).fill(0),
    vertical: Array(size * (size + 1)).fill(0),
    boxes: Array(size * size).fill(0),
    scores: [0, 0],
    turn: 0,
    moves: 0,
    finished: false,
  };
}

function edgeTaken(game, edge) {
  return edge.orientation === 'h'
    ? game.horizontal[boardIndex(edge.row, edge.column, game.size)] !== 0
    : game.vertical[boardIndex(edge.row, edge.column, game.size + 1)] !== 0;
}
function adjacentBoxes(game, edge) {
  if (edge.orientation === 'h') return [[edge.row - 1, edge.column], [edge.row, edge.column]]
    .filter(([row, column]) => row >= 0 && row < game.size && column >= 0 && column < game.size);
  return [[edge.row, edge.column - 1], [edge.row, edge.column]]
    .filter(([row, column]) => row >= 0 && row < game.size && column >= 0 && column < game.size);
}
function boxEdges(row, column) {
  return [
    { orientation: 'h', row, column },
    { orientation: 'h', row: row + 1, column },
    { orientation: 'v', row, column },
    { orientation: 'v', row, column: column + 1 },
  ];
}
export function getDotsBoxesLegalEdges(game) {
  if (!game || !DOTS_BOXES_SIZES.includes(game.size)) throw new TypeError('Invalid Dots and Boxes game.');
  const result = [];
  for (let row = 0; row <= game.size; row++) for (let column = 0; column < game.size; column++) {
    const edge = { orientation: 'h', row, column };
    if (!edgeTaken(game, edge)) result.push(Object.freeze(edge));
  }
  for (let row = 0; row < game.size; row++) for (let column = 0; column <= game.size; column++) {
    const edge = { orientation: 'v', row, column };
    if (!edgeTaken(game, edge)) result.push(Object.freeze(edge));
  }
  return result;
}

export function playDotsBoxesEdge(game, edge) {
  if (!game || game.finished) return Object.freeze({ ok: false, reason: 'finished', captured: [] });
  if (!edge || !['h', 'v'].includes(edge.orientation) || !Number.isInteger(edge.row) || !Number.isInteger(edge.column)
    || edge.row < 0 || edge.column < 0 || edge.orientation === 'h' && (edge.row > game.size || edge.column >= game.size)
    || edge.orientation === 'v' && (edge.row >= game.size || edge.column > game.size)) {
    return Object.freeze({ ok: false, reason: 'invalid-edge', captured: [] });
  }
  if (edgeTaken(game, edge)) return Object.freeze({ ok: false, reason: 'already-drawn', captured: [] });
  const player = game.turn;
  if (edge.orientation === 'h') game.horizontal[boardIndex(edge.row, edge.column, game.size)] = player + 1;
  else game.vertical[boardIndex(edge.row, edge.column, game.size + 1)] = player + 1;
  game.moves += 1;
  const captured = [];
  for (const [row, column] of adjacentBoxes(game, edge)) {
    const index = boardIndex(row, column, game.size);
    if (game.boxes[index] === 0 && boxEdges(row, column).every((candidate) => edgeTaken(game, candidate))) {
      game.boxes[index] = player + 1;
      game.scores[player] += 1;
      captured.push(Object.freeze({ row, column }));
    }
  }
  if (!captured.length) game.turn = 1 - player;
  game.finished = game.boxes.every(Boolean);
  return Object.freeze({ ok: true, player, captured: Object.freeze(captured), turn: game.turn, finished: game.finished, scores: Object.freeze([...game.scores]) });
}

export function chooseDotsBoxesComputerEdge(game, { random = Math.random } = {}) {
  const legal = getDotsBoxesLegalEdges(game);
  if (!legal.length) return null;
  const scored = legal.map((edge) => {
    const adjacent = adjacentBoxes(game, edge);
    const completed = adjacent.filter(([row, column]) => boxEdges(row, column).filter((candidate) => {
      const isProposedEdge = candidate.orientation === edge.orientation
        && candidate.row === edge.row
        && candidate.column === edge.column;
      return isProposedEdge || edgeTaken(game, candidate);
    }).length === 4).length;
    return { edge, completed, givesThirdSide: adjacent.some(([row, column]) => {
      const drawn = boxEdges(row, column).filter((candidate) => edgeTaken(game, candidate)).length;
      return drawn === 2;
    }) };
  });
  const captures = scored.filter(({ completed }) => completed > 0);
  if (captures.length) return captures[0].edge;
  const safe = scored.filter(({ givesThirdSide }) => !givesThirdSide);
  const choices = safe.length ? safe : scored;
  return choices[Math.floor(checkRandom(random) * choices.length)].edge;
}
