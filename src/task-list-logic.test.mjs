import test from 'node:test';
import assert from 'node:assert/strict';
import { filterTasks, makeTask, serializeTaskBackup, validateTaskBackup } from './task-list-logic.mjs';

test('task creation trims names, validates priority, date and bounded subtasks', () => {
  const task = makeTask({ name: '  Plan trip  ', priority: 'high', dueDate: '2026-10-20', subtasks: 'Book train\n\nPack bag', id: 'a1', createdAt: 42 });
  assert.equal(task.name, 'Plan trip');
  assert.deepEqual(task.subtasks.map(({ text }) => text), ['Book train', 'Pack bag']);
  assert.equal(task.id, 'a1');
  assert.throws(() => makeTask({ name: '  ' }), /name/u);
  assert.throws(() => makeTask({ name: 'Task', priority: 'urgent' }), /priority/u);
  assert.throws(() => makeTask({ name: 'Task', dueDate: '20/10/2026' }), /date/u);
  assert.throws(() => makeTask({ name: 'Task', subtasks: Array(41).fill('step') }), /40/u);
});

test('filters do not mutate the list and include the expected task states', () => {
  const tasks = [{ id: 'a', completed: false }, { id: 'b', completed: true }];
  assert.deepEqual(filterTasks(tasks, 'active').map(({ id }) => id), ['a']);
  assert.deepEqual(filterTasks(tasks, 'completed').map(({ id }) => id), ['b']);
  assert.equal(filterTasks(tasks, 'all'), tasks);
  assert.deepEqual(filterTasks(null), []);
});

test('JSON backup round-trips completion, subtasks, unicode and dates', () => {
  const task = makeTask({ name: '日本語の準備', priority: 'low', dueDate: '2026-11-01', subtasks: ['Résumé', 'شراء تذاكر'], id: 'task-2' });
  task.completed = true;
  task.subtasks[0].completed = true;
  const json = serializeTaskBackup([task]);
  const restored = validateTaskBackup(json);
  assert.equal(restored[0].name, task.name);
  assert.equal(restored[0].completed, true);
  assert.equal(restored[0].subtasks[0].completed, true);
  assert.equal(restored[0].dueDate, task.dueDate);
  assert.throws(() => validateTaskBackup('{'), SyntaxError);
  assert.throws(() => validateTaskBackup({ version: 2, tasks: [] }), /supported/u);
});
