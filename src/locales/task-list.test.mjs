import test from 'node:test';
import assert from 'node:assert/strict';
import { taskListLocaleData } from './task-list.mjs';
import { taskListContent } from './task-list-content.mjs';
import { packs } from '../locales.mjs';
import { opportunityToolMarkup } from '../opportunity-template.mjs';

const requiredUi = [
  'Task name', 'Priority', 'Low', 'Medium', 'High', 'Due date (optional)',
  'Subtasks (one per line, optional)', 'Add task', 'All tasks', 'Active', 'Completed',
  'Mark complete', 'Mark active', 'Remove task', 'Save tasks on this device',
  'Load saved tasks', 'Delete saved tasks', 'Download JSON', 'At least one task needs a name.',
  'No tasks yet.', 'Task added.', 'Tasks saved on this device.', 'No saved task list found.',
  'Tasks cleared from this page.', 'One task per line', 'No tasks match this filter.',
  'Tasks loaded from this device.', 'Saved tasks deleted from this device.', 'JSON download started.',
];

test('task list copy and controls are translated for all 36 site locales', () => {
  assert.equal(Object.keys(taskListLocaleData).length, 35);
  for (const language of ['en', ...Object.keys(taskListLocaleData)]) {
    const { ui, copy } = taskListContent(language);
    for (const key of requiredUi) {
      const value = ui[key];
      assert.ok(value?.trim(), `${language} has ${key}`);
      if (language !== 'en') assert.notEqual(value, key, `${language} translates ${key}`);
      assert.ok(!value.includes('###'), `${language} has no marker residue in ${key}`);
    }
    if (language !== 'en') {
      assert.equal(copy.length, 6, `${language} has complete page copy`);
      assert.ok(copy.every((value) => value.trim()), `${language} copy is non-empty`);
    }
    if (packs[language]) assert.ok(packs[language].seo['task-list']?.title, `${language} has localized task-list metadata`);
  }
});

test('task-specific labels override ambiguous shared translations', () => {
  const markup = opportunityToolMarkup('task-list', 'ja', { High: '高画質' }, 'タスクリスト');
  assert.match(markup, /<option value="high">高<\/option>/u);
  assert.doesNotMatch(markup, /<option value="high">高画質<\/option>/u);
});
