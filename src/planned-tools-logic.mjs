export const moleculeCatalog = Object.freeze([
  { id: 'water', name: 'Water', formula: 'H₂O', atoms: [{ e: 'O', x: 160, y: 100 }, { e: 'H', x: 104, y: 145 }, { e: 'H', x: 216, y: 145 }], bonds: [[0, 1], [0, 2]] },
  { id: 'carbon-dioxide', name: 'Carbon dioxide', formula: 'CO₂', atoms: [{ e: 'O', x: 80, y: 110 }, { e: 'C', x: 160, y: 110 }, { e: 'O', x: 240, y: 110 }], bonds: [[0, 1, 2], [1, 2, 2]] },
  { id: 'methane', name: 'Methane', formula: 'CH₄', atoms: [{ e: 'C', x: 160, y: 110 }, { e: 'H', x: 160, y: 40 }, { e: 'H', x: 235, y: 110 }, { e: 'H', x: 160, y: 180 }, { e: 'H', x: 85, y: 110 }], bonds: [[0, 1], [0, 2], [0, 3], [0, 4]] },
  { id: 'ammonia', name: 'Ammonia', formula: 'NH₃', atoms: [{ e: 'N', x: 160, y: 105 }, { e: 'H', x: 160, y: 35 }, { e: 'H', x: 230, y: 145 }, { e: 'H', x: 90, y: 145 }], bonds: [[0, 1], [0, 2], [0, 3]] },
  { id: 'oxygen', name: 'Oxygen', formula: 'O₂', atoms: [{ e: 'O', x: 118, y: 110 }, { e: 'O', x: 202, y: 110 }], bonds: [[0, 1, 2]] },
  { id: 'nitrogen', name: 'Nitrogen', formula: 'N₂', atoms: [{ e: 'N', x: 118, y: 110 }, { e: 'N', x: 202, y: 110 }], bonds: [[0, 1, 3]] },
  { id: 'ethanol', name: 'Ethanol', formula: 'C₂H₆O', atoms: [{ e: 'C', x: 75, y: 110 }, { e: 'C', x: 155, y: 110 }, { e: 'O', x: 235, y: 110 }, { e: 'H', x: 275, y: 75 }], bonds: [[0, 1], [1, 2], [2, 3]] },
  { id: 'glucose', name: 'Glucose', formula: 'C₆H₁₂O₆', atoms: [{ e: 'C', x: 80, y: 80 }, { e: 'C', x: 150, y: 65 }, { e: 'C', x: 220, y: 90 }, { e: 'C', x: 235, y: 155 }, { e: 'C', x: 165, y: 170 }, { e: 'C', x: 95, y: 150 }, { e: 'O', x: 155, y: 110 }], bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [1, 6]] },
]);

export function validateAudioLoop(start, end, duration, repeats = 2) {
  const [from, to, total, count] = [start, end, duration, repeats].map(Number);
  if (![from, to, total, count].every(Number.isFinite)) throw new TypeError('Loop settings must be finite numbers.');
  if (total <= 0 || from < 0 || to > total || from >= to) throw new RangeError('Choose a loop range inside the audio duration.');
  if (!Number.isInteger(count) || count < 2 || count > 8 || (to - from) * count > 120) throw new RangeError('The repeated audio must be 120 seconds or less.');
  return { start: from, end: to, repeats: count, duration: (to - from) * count };
}

export function validateLocalImage(file, maxBytes, maxPixels) {
  if (!file || !Number.isFinite(file.size) || file.size <= 0) throw new TypeError('Choose an image file.');
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) throw new TypeError('Choose a PNG, JPEG or WebP image.');
  if (file.size > maxBytes) throw new RangeError('The image file is too large.');
  return { maxPixels, maxBytes };
}

export function validatePixelDimensions(width, height, maxPixels) {
  const w = Number(width); const h = Number(height);
  if (!Number.isInteger(w) || !Number.isInteger(h) || w < 1 || h < 1 || w * h > maxPixels) throw new RangeError('The image dimensions are not supported.');
  return { width: w, height: h, pixels: w * h };
}

export function shuffledPuzzle(size, random = Math.random) {
  const n = Number(size);
  if (!Number.isInteger(n) || n < 2 || n > 5 || typeof random !== 'function') throw new RangeError('Choose a puzzle size from 2 to 5.');
  const board = Array.from({ length: n * n }, (_, index) => index);
  for (let index = board.length - 1; index > 0; index -= 1) {
    const sample = random(); if (!Number.isFinite(sample) || sample < 0 || sample >= 1) throw new TypeError('Random values must be from 0 to 1.');
    const target = Math.floor(sample * (index + 1)); [board[index], board[target]] = [board[target], board[index]];
  }
  if (board.every((piece, index) => piece === index)) [board[0], board[1]] = [board[1], board[0]];
  return board;
}

export function moveJigsawPiece(board, size, from, to) {
  const n = Number(size); const source = Number(from); const target = Number(to);
  if (!Array.isArray(board) || board.length !== n * n || board.some((piece, index) => !Number.isInteger(piece) || piece < 0 || piece >= board.length || board.indexOf(piece) !== index)) throw new TypeError('The puzzle board is invalid.');
  if (![source, target].every(Number.isInteger) || source < 0 || target < 0 || source >= board.length || target >= board.length) return board;
  if (source === target) return board;
  const next = [...board]; [next[source], next[target]] = [next[target], next[source]]; return next;
}

export function scoreNotes(notes) {
  if (!Array.isArray(notes) || notes.length > 32) throw new RangeError('A score can contain up to 32 notes.');
  return notes.map(({ pitch, octave, duration }) => {
    if (!['C', 'D', 'E', 'F', 'G', 'A', 'B'].includes(pitch) || ![3, 4, 5].includes(Number(octave)) || !['q', 'h', 'w'].includes(duration)) throw new TypeError('Use a natural note, octave 3–5 and supported duration.');
    return { pitch, octave: Number(octave), duration };
  });
}

const tangramPieces = Object.freeze([
  { id: 'large-a', shape: 'triangle-large', points: '-40,-35 40,-35 -40,45' },
  { id: 'large-b', shape: 'triangle-large', points: '-40,-35 40,-35 -40,45' },
  { id: 'medium', shape: 'triangle-medium', points: '-35,-20 35,-20 0,30' },
  { id: 'small-a', shape: 'triangle-small', points: '-22,-22 22,-22 -22,22' },
  { id: 'small-b', shape: 'triangle-small', points: '-22,-22 22,-22 -22,22' },
  { id: 'square', shape: 'square', points: '0,-22 22,0 0,22 -22,0' },
  { id: 'parallelogram', shape: 'parallelogram', points: '-28,-20 12,-20 28,20 -12,20' },
]);
const tangramLayouts = Object.freeze({
  house: [{ x: 125, y: 95, r: 0 }, { x: 205, y: 95, r: 90 }, { x: 165, y: 135, r: 180 }, { x: 125, y: 205, r: 270 }, { x: 205, y: 205, r: 90 }, { x: 165, y: 205, r: 0 }, { x: 165, y: 255, r: 0 }],
  boat: [{ x: 95, y: 165, r: 180 }, { x: 175, y: 165, r: 90 }, { x: 255, y: 165, r: 0 }, { x: 105, y: 225, r: 270 }, { x: 175, y: 225, r: 90 }, { x: 245, y: 225, r: 0 }, { x: 175, y: 95, r: 90 }],
  bird: [{ x: 95, y: 130, r: 315 }, { x: 175, y: 130, r: 45 }, { x: 255, y: 130, r: 135 }, { x: 95, y: 220, r: 225 }, { x: 255, y: 220, r: 135 }, { x: 175, y: 200, r: 0 }, { x: 315, y: 185, r: 90 }],
});
export function createTangramPuzzle(shape = 'house', random = Math.random) {
  if (!Object.hasOwn(tangramLayouts, shape)) throw new TypeError('Choose a supported tangram silhouette.');
  const layout = tangramLayouts[shape];
  return tangramPieces.map((piece, index) => {
    const sample = random(); if (!Number.isFinite(sample) || sample < 0 || sample >= 1) throw new TypeError('Random values must be from 0 to 1.');
    const turn = Math.floor(sample * 4) * 90;
    const flipSample = random(); if (!Number.isFinite(flipSample) || flipSample < 0 || flipSample >= 1) throw new TypeError('Random values must be from 0 to 1.');
    const xSample = random(); const ySample = random();
    if (![xSample, ySample].every((value) => Number.isFinite(value) && value >= 0 && value < 1)) throw new TypeError('Random values must be from 0 to 1.');
    return { ...piece, x: Math.round(55 + xSample * 290), y: Math.round(55 + ySample * 190), rotation: turn, flip: flipSample < 0.5, target: { ...layout[index] } };
  });
}
export function moveTangramPiece(pieces, index, patch) {
  if (!Array.isArray(pieces) || pieces.length !== 7 || !Number.isInteger(index) || index < 0 || index >= pieces.length) throw new TypeError('The tangram piece selection is invalid.');
  const next = pieces.map((piece) => ({ ...piece, target: { ...piece.target } })); const current = next[index];
  const x = patch.x === undefined ? current.x : Number(patch.x); const y = patch.y === undefined ? current.y : Number(patch.y); const rotation = patch.rotation === undefined ? current.rotation : Number(patch.rotation); const flip = patch.flip === undefined ? current.flip : Boolean(patch.flip);
  if (![x, y, rotation].every(Number.isFinite) || x < 0 || x > 400 || y < 0 || y > 300 || Math.abs(rotation) > 36000) throw new RangeError('Tangram placement is outside the board.');
  next[index] = { ...current, x, y, rotation: ((rotation % 360) + 360) % 360, flip }; return next;
}
export function tangramIsSolved(pieces, shape) {
  if (!Array.isArray(pieces) || pieces.length !== 7 || !Object.hasOwn(tangramLayouts, shape)) return false;
  return pieces.every((piece, index) => !piece.flip && Math.hypot(piece.x - tangramLayouts[shape][index].x, piece.y - tangramLayouts[shape][index].y) <= 9 && Math.abs((((piece.rotation - tangramLayouts[shape][index].r) + 540) % 360) - 180) <= 5);
}

const initialPoints = () => {
  const points = Array.from({ length: 24 }, () => [0, 0]);
  [[23, 2], [12, 5], [7, 3], [5, 5]].forEach(([point, count]) => { points[point][0] = count; });
  [[0, 2], [11, 5], [16, 3], [18, 5]].forEach(([point, count]) => { points[point][1] = count; });
  return points;
};
export function newBackgammonGame() { return { points: initialPoints(), bar: [0, 0], off: [0, 0], turn: 0, dice: [], winner: null, selected: null }; }
export function rollBackgammon(game, dice) {
  if (game.winner !== null || game.dice.length) return game;
  const values = dice.map(Number);
  if (values.length !== 2 || values.some((value) => !Number.isInteger(value) || value < 1 || value > 6)) throw new RangeError('Dice values must be from 1 to 6.');
  return { ...game, dice: values[0] === values[1] ? Array(4).fill(values[0]) : values };
}
function rawBackgammonMoves(game) {
  if (!game.dice.length || game.winner !== null) return [];
  const player = game.turn; const dir = player === 0 ? -1 : 1; const home = player === 0 ? [0, 5] : [18, 23];
  const allInHome = game.bar[player] === 0 && game.points.every((point, index) => point[player] === 0 || (index >= home[0] && index <= home[1]));
  const sources = game.bar[player] ? ['bar'] : game.points.flatMap((point, index) => point[player] ? [index] : []);
  const moves = [];
  for (const die of new Set(game.dice)) for (const from of sources) {
    const source = from === 'bar' ? (player === 0 ? 24 : -1) : from;
    const target = source + dir * die;
    if (from === 'bar' && (target < 0 || target > 23)) continue;
    if (from !== 'bar' && !allInHome && (target < 0 || target > 23)) continue;
    if (target >= 0 && target < 24) {
      if (game.points[target][1 - player] >= 2) continue;
      moves.push({ from, to: target, die });
    } else if (allInHome && (target < 0 || target > 23)) {
      const overshoot = player === 0 ? target < 0 : target > 23;
      const farther = game.points.some((point, index) => point[player] && (player === 0 ? index > from : index < from));
      if (!overshoot || !farther) moves.push({ from, to: 'off', die });
    }
  }
  return moves;
}
function applyBackgammonMove(game, move) {
  const next = { ...game, points: game.points.map((point) => [...point]), bar: [...game.bar], off: [...game.off], dice: [...game.dice] };
  if (move.from === 'bar') next.bar[game.turn] -= 1; else next.points[move.from][game.turn] -= 1;
  if (move.to === 'off') next.off[game.turn] += 1;
  else { if (next.points[move.to][1 - game.turn] === 1) { next.points[move.to][1 - game.turn] = 0; next.bar[1 - game.turn] += 1; } next.points[move.to][game.turn] += 1; }
  next.dice.splice(next.dice.indexOf(move.die), 1);
  if (next.off[game.turn] === 15) next.winner = game.turn;
  return next;
}
function maxBackgammonPlies(game) {
  if (!game.dice.length || game.winner !== null) return 0;
  const moves = rawBackgammonMoves(game); if (!moves.length) return 0;
  return Math.max(...moves.map((move) => 1 + maxBackgammonPlies(applyBackgammonMove(game, move))));
}
const backgammonMoveCache = new WeakMap();
export function getBackgammonMoves(game) {
  if (backgammonMoveCache.has(game)) return backgammonMoveCache.get(game);
  const moves = rawBackgammonMoves(game); if (moves.length < 2 || game.dice.length < 2) return moves;
  const maxPlies = maxBackgammonPlies(game);
  let allowed = moves.filter((move) => 1 + maxBackgammonPlies(applyBackgammonMove(game, move)) === maxPlies);
  if (maxPlies === 1 && game.dice.length === 2 && game.dice[0] !== game.dice[1]) {
    const higher = Math.max(...game.dice); const higherMoves = allowed.filter((move) => move.die === higher); if (higherMoves.length) allowed = higherMoves;
  }
  backgammonMoveCache.set(game, allowed); return allowed;
}
export function moveBackgammonChecker(game, from, to, die) {
  const move = getBackgammonMoves(game).find((item) => item.from === from && item.to === to && item.die === Number(die));
  if (!move) return game;
  const next = applyBackgammonMove(game, move);
  if (!next.dice.length || !getBackgammonMoves(next).length) { next.turn = 1 - game.turn; next.dice = []; }
  return next;
}
