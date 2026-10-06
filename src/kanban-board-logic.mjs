const MAX_COLUMNS = 8;
const MAX_CARDS = 300;
const MAX_COLUMN_NAME = 32;
const MAX_CARD_TITLE = 160;

const cleanText = (value, max, label) => {
  const text = String(value ?? '').trim();
  if (!text) throw new TypeError(`${label} is required.`);
  if (text.length > max) throw new RangeError(`${label} is too long.`);
  return text;
};

export function createKanbanBoard(labels = ['To do', 'In progress', 'Done']) {
  if (!Array.isArray(labels) || labels.length < 2 || labels.length > MAX_COLUMNS) {
    throw new RangeError(`Use between 2 and ${MAX_COLUMNS} columns.`);
  }
  const names = labels.map((name) => cleanText(name, MAX_COLUMN_NAME, 'Column name').toLocaleLowerCase());
  if (new Set(names).size !== names.length) throw new TypeError('Column names must be different.');
  return {
    version: 1,
    columns: labels.map((name, index) => ({
      id: `column-${index + 1}`,
      name: cleanText(name, MAX_COLUMN_NAME, 'Column name'),
      cards: [],
    })),
  };
}

function withColumns(board, columns) { return { version: 1, columns }; }

export function addKanbanCard(board, columnId, title, id = '') {
  const cleanTitle = cleanText(title, MAX_CARD_TITLE, 'Card title');
  const cardId = String(id).trim();
  if (!cardId || board.columns.some((column) => column.cards.some((card) => card.id === cardId))) throw new TypeError('Card IDs must be unique.');
  const total = board.columns.reduce((count, column) => count + column.cards.length, 0);
  if (total >= MAX_CARDS) throw new RangeError(`Use no more than ${MAX_CARDS} cards.`);
  if (!board.columns.some((column) => column.id === columnId)) throw new RangeError('Choose a board column.');
  return withColumns(board, board.columns.map((column) => column.id === columnId
    ? { ...column, cards: [...column.cards, { id: cardId, title: cleanTitle }] }
    : column));
}

export function moveKanbanCard(board, cardId, direction) {
  if (![-1, 1].includes(direction)) throw new RangeError('Choose a valid move direction.');
  const sourceIndex = board.columns.findIndex((column) => column.cards.some((card) => card.id === cardId));
  const targetIndex = sourceIndex + direction;
  if (sourceIndex < 0 || targetIndex < 0 || targetIndex >= board.columns.length) return board;
  const source = board.columns[sourceIndex];
  const target = board.columns[targetIndex];
  const card = source.cards.find((item) => item.id === cardId);
  return withColumns(board, board.columns.map((column, index) => index === sourceIndex
    ? { ...column, cards: column.cards.filter((item) => item.id !== cardId) }
    : index === targetIndex ? { ...column, cards: [...column.cards, card] } : column));
}

export function removeKanbanCard(board, cardId) {
  return withColumns(board, board.columns.map((column) => ({
    ...column,
    cards: column.cards.filter((card) => card.id !== cardId),
  })));
}

export function addKanbanColumn(board, name, id = '') {
  if (board.columns.length >= MAX_COLUMNS) throw new RangeError(`Use no more than ${MAX_COLUMNS} columns.`);
  const cleanName = cleanText(name, MAX_COLUMN_NAME, 'Column name');
  const columnId = String(id || `column-${board.columns.length + 1}`).trim();
  if (!columnId || board.columns.some((column) => column.id === columnId)) throw new TypeError('Column IDs must be unique.');
  if (board.columns.some((column) => column.name.toLocaleLowerCase() === cleanName.toLocaleLowerCase())) {
    throw new TypeError('Column names must be different.');
  }
  return withColumns(board, [...board.columns, { id: columnId, name: cleanName, cards: [] }]);
}

export function renameKanbanColumn(board, columnId, name) {
  const cleanName = cleanText(name, MAX_COLUMN_NAME, 'Column name');
  if (!board.columns.some((column) => column.id === columnId)) throw new RangeError('Choose a board column.');
  if (board.columns.some((column) => column.id !== columnId && column.name.toLocaleLowerCase() === cleanName.toLocaleLowerCase())) {
    throw new TypeError('Column names must be different.');
  }
  return withColumns(board, board.columns.map((column) => column.id === columnId ? { ...column, name: cleanName } : column));
}

export function removeKanbanColumn(board, columnId) {
  const column = board.columns.find((item) => item.id === columnId);
  if (!column) return board;
  if (board.columns.length <= 2) throw new RangeError('Keep at least two columns.');
  if (column.cards.length) throw new TypeError('Move or remove cards before removing this column.');
  return withColumns(board, board.columns.filter((item) => item.id !== columnId));
}

export function validateKanbanBackup(value) {
  const data = typeof value === 'string' ? JSON.parse(value) : value;
  if (!data || data.version !== 1 || !Array.isArray(data.columns) || data.columns.length < 2 || data.columns.length > MAX_COLUMNS) {
    throw new TypeError('This is not a supported Kanban board backup.');
  }
  const ids = new Set();
  const names = new Set();
  let cardCount = 0;
  const columns = data.columns.map((column) => {
    const id = String(column?.id ?? '');
    const name = cleanText(column?.name, MAX_COLUMN_NAME, 'Column name');
    if (!id || ids.has(id)) throw new TypeError('Column IDs must be unique.');
    if (names.has(name.toLocaleLowerCase())) throw new TypeError('Column names must be different.');
    ids.add(id); names.add(name.toLocaleLowerCase());
    if (!Array.isArray(column.cards)) throw new TypeError('Board cards must be a list.');
    const cards = column.cards.map((card) => {
      cardCount += 1;
      const cardId = String(card?.id ?? '');
      const title = cleanText(card?.title, MAX_CARD_TITLE, 'Card title');
      if (!cardId) throw new TypeError('Card IDs must be unique.');
      return { id: cardId, title };
    });
    return { id, name, cards };
  });
  const cardIds = columns.flatMap((column) => column.cards.map((card) => card.id));
  if (cardCount > MAX_CARDS || new Set(cardIds).size !== cardCount) throw new RangeError('This board has too many cards or repeated card IDs.');
  return { version: 1, columns };
}

export function serializeKanbanBackup(board) {
  return JSON.stringify(validateKanbanBackup(board), null, 2);
}
