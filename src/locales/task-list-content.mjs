import { taskListLocaleData } from './task-list.mjs';
import { taskListStatusLocales } from './task-list-status.mjs';
import { taskListLocaleFixes } from './task-list-fixes.mjs';

const uiKeys = [
  'Task name', 'Priority', 'Low', 'Medium', 'High', 'Due date (optional)',
  'Subtasks (one per line, optional)', 'Add task', 'All tasks', 'Active', 'Completed',
  'Mark complete', 'Mark active', 'Remove task', 'Save tasks on this device',
  'Load saved tasks', 'Delete saved tasks', 'Download JSON', 'At least one task needs a name.',
  'No tasks yet.', 'Task added.', 'Tasks saved on this device.', 'No saved task list found.',
  'Tasks cleared from this page.',
];
const feedbackKeys = ['No tasks match this filter.', 'Tasks loaded from this device.', 'Saved tasks deleted from this device.', 'JSON download started.'];

export const taskListRuntimeKeys = [
  'No tasks yet.', ...feedbackKeys, 'Task added.', 'Tasks saved on this device.',
  'No saved task list found.', 'Every task needs a name.', 'Check your inputs and try again.',
  'Browser storage is unavailable.',
];

export function taskListContent(language = 'en') {
  if (language === 'en') {
    return {
      ui: Object.fromEntries([...uiKeys, 'One task per line', ...feedbackKeys, 'Every task needs a name.', 'Check your inputs and try again.', 'Browser storage is unavailable.'].map((key) => [key, key])),
      copy: [],
    };
  }
  const data = taskListLocaleData[language];
  if (!data) return { ui: {}, copy: [] };
  const ui = {
    ...data.ui,
    'One task per line': data.copy['task-list'][0],
    ...Object.fromEntries(feedbackKeys.map((key, index) => [key, taskListStatusLocales[language][index]])),
    ...taskListLocaleFixes[language],
  };
  return { ui, copy: data.copy['task-list'].slice(1) };
}
