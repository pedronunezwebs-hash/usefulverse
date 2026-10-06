import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addKanbanCard, addKanbanColumn, createKanbanBoard, moveKanbanCard,
  removeKanbanCard, removeKanbanColumn, renameKanbanColumn,
  serializeKanbanBackup, validateKanbanBackup,
} from './kanban-board-logic.mjs';

test('creates a localized board with bounded, non-empty columns', () => {
  assert.deepEqual(createKanbanBoard(['Por hacer', 'En curso', 'Listo']).columns.map(({ name }) => name), ['Por hacer', 'En curso', 'Listo']);
  assert.throws(() => createKanbanBoard(['Solo']), /between 2/u);
  assert.throws(() => createKanbanBoard(Array(9).fill('Column')), /between 2/u);
  assert.throws(() => createKanbanBoard(['Todo', 'todo']), /different/u);
});

test('adds cards, moves them between neighboring columns, and removes them without mutating prior state', () => {
  const board = createKanbanBoard();
  const withCard = addKanbanCard(board, 'column-1', 'Plan launch', 'card-1');
  const moved = moveKanbanCard(withCard, 'card-1', 1);
  assert.equal(board.columns[0].cards.length, 0);
  assert.equal(withCard.columns[0].cards[0].title, 'Plan launch');
  assert.equal(moved.columns[0].cards.length, 0);
  assert.deepEqual(moved.columns[1].cards.map(({ id }) => id), ['card-1']);
  assert.equal(moveKanbanCard(moved, 'card-1', -1).columns[0].cards[0].id, 'card-1');
  assert.equal(moveKanbanCard(board, 'missing', 1), board);
  assert.equal(removeKanbanCard(moved, 'card-1').columns[1].cards.length, 0);
  assert.throws(() => addKanbanCard(withCard, 'column-2', 'Duplicate ID', 'card-1'), /unique/u);
  assert.throws(() => moveKanbanCard(board, 'x', 0), /direction/u);
});

test('adds, renames and safely deletes only empty, non-essential columns', () => {
  const board = createKanbanBoard();
  const expanded = addKanbanColumn(board, 'Review', 'review');
  assert.equal(renameKanbanColumn(expanded, 'review', 'QA').columns[3].name, 'QA');
  assert.equal(removeKanbanColumn(expanded, 'review').columns.length, 3);
  assert.throws(() => addKanbanColumn(board, 'TO DO'), /different/u);
  assert.throws(() => addKanbanColumn(expanded, 'More', 'review'), /unique/u);
  assert.throws(() => removeKanbanColumn(createKanbanBoard(['A', 'B']), 'column-1'), /at least two/u);
  const occupied = addKanbanCard(expanded, 'review', 'Check output', 'card-2');
  assert.throws(() => removeKanbanColumn(occupied, 'review'), /Move or remove/u);
});

test('validates and round-trips bounded Unicode JSON backups', () => {
  const board = addKanbanCard(createKanbanBoard(['待辦', '進行中', '完成']), 'column-1', 'Revisar la traducción ✓', 'unicode-card');
  const restored = validateKanbanBackup(serializeKanbanBackup(board));
  assert.equal(restored.columns[0].cards[0].title, 'Revisar la traducción ✓');
  assert.throws(() => validateKanbanBackup('{'), SyntaxError);
  assert.throws(() => validateKanbanBackup({ version: 2, columns: [] }), /supported/u);
  assert.throws(() => validateKanbanBackup({ version: 1, columns: [{ id: 'x', name: 'A', cards: [] }, { id: 'y', name: 'a', cards: [] }] }), /different/u);
});
