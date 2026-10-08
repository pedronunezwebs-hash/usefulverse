const MAX_PIECES = 300;
const MAX_BOARDS = 300;
const MAX_LENGTH = 100_000_000;

function positive(name, value, { allowZero = false } = {}) {
  if (!Number.isFinite(value) || value < (allowZero ? 0 : Number.EPSILON) || value > MAX_LENGTH) {
    throw new RangeError(`${name} is outside its allowed range.`);
  }
  return value;
}

export function parseCutList(text) {
  if (typeof text !== 'string' || !text.trim()) throw new TypeError('Enter at least one cut length.');
  const lines = text.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  const cuts = [];
  let totalPieces = 0;
  for (const [index, line] of lines.entries()) {
    const match = line.match(/^([0-9]+(?:[.,][0-9]+)?)\s*(?:[xX*×,;]\s*([0-9]+))?$/u);
    if (!match) throw new TypeError(`Check cut line ${index + 1}. Use a length, optionally followed by × quantity.`);
    const length = Number(match[1].replace(',', '.'));
    const quantity = match[2] === undefined ? 1 : Number(match[2]);
    positive('Cut length', length);
    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > MAX_PIECES) throw new RangeError(`Quantity on line ${index + 1} must be a whole number from 1 to ${MAX_PIECES}.`);
    totalPieces += quantity;
    if (totalPieces > MAX_PIECES) throw new RangeError(`Enter no more than ${MAX_PIECES} pieces in total.`);
    cuts.push(Object.freeze({ length, quantity }));
  }
  return Object.freeze(cuts);
}

export function optimizeLumberCuts({ stockLength, kerf = 0, cuts } = {}) {
  positive('Stock length', stockLength);
  positive('Saw kerf', kerf, { allowZero: true });
  if (!Array.isArray(cuts) || cuts.length === 0) throw new TypeError('Enter at least one cut.');
  const pieces = [];
  for (const cut of cuts) {
    positive('Cut length', cut?.length);
    if (!Number.isSafeInteger(cut?.quantity) || cut.quantity < 1) throw new RangeError('Cut quantities must be positive whole numbers.');
    for (let i = 0; i < cut.quantity; i += 1) pieces.push(cut.length);
  }
  if (pieces.length > MAX_PIECES) throw new RangeError(`Enter no more than ${MAX_PIECES} pieces.`);
  pieces.sort((a, b) => b - a);
  const boards = [];
  for (const length of pieces) {
    const required = length + kerf;
    if (required > stockLength + Number.EPSILON * stockLength) throw new RangeError(`A ${length} cut plus kerf does not fit the ${stockLength} stock length.`);
    let bestIndex = -1;
    let smallestRemainder = Infinity;
    for (let i = 0; i < boards.length; i += 1) {
      const remainder = stockLength - boards[i].consumed - required;
      if (remainder >= -Number.EPSILON * stockLength && remainder < smallestRemainder) {
        smallestRemainder = Math.max(0, remainder);
        bestIndex = i;
      }
    }
    if (bestIndex === -1) {
      if (boards.length >= MAX_BOARDS) throw new RangeError(`This cut list needs more than ${MAX_BOARDS} stock boards.`);
      boards.push({ cuts: [], consumed: 0 });
      bestIndex = boards.length - 1;
    }
    const board = boards[bestIndex];
    board.cuts.push(length);
    board.consumed += required;
  }
  const plan = boards.map((board, index) => Object.freeze({
    number: index + 1,
    cuts: Object.freeze([...board.cuts].sort((a, b) => b - a)),
    cutCount: board.cuts.length,
    cutLength: board.cuts.reduce((sum, length) => sum + length, 0),
    kerfUsed: board.cuts.length * kerf,
    remainder: Math.max(0, stockLength - board.consumed),
    usedLength: board.consumed,
  }));
  const totalCutLength = pieces.reduce((sum, length) => sum + length, 0);
  const totalKerf = pieces.length * kerf;
  return Object.freeze({
    stockLength, kerf, pieceCount: pieces.length, boardCount: plan.length, totalCutLength, totalKerf,
    totalStockLength: plan.length * stockLength,
    totalOffcut: plan.reduce((sum, board) => sum + board.remainder, 0),
    theoreticalLowerBound: Math.ceil((totalCutLength + totalKerf) / stockLength),
    boards: Object.freeze(plan),
  });
}
