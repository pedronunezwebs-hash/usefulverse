import { kanbanBoardEnglishCopy, kanbanBoardUiKeys } from './kanban-board-source.mjs';
import { kanbanBoardLocaleData } from './kanban-board.mjs';

const feedbackKeys = [
  'No cards on this board yet.', 'No cards in this column.', 'Card title is required.', 'Card added.', 'Card moved.',
  'Card removed.', 'Column added.', 'Column removed.', 'Column renamed.', 'Kanban board saved on this device.', 'No saved Kanban board was found.',
  'Kanban board loaded from this device.', 'Saved Kanban board deleted.', 'JSON download started.',
  'Changes undone.', 'Changes redone.', 'Column names must be different.', 'Keep at least two columns.',
  'Move or remove cards before removing this column.', 'The Kanban board is at its column limit.',
  'The Kanban board is at its card limit.', 'Kanban board storage is unavailable.', 'No changes to undo.',
  'No changes to redo.',
];

export const kanbanBoardRuntimeKeys = [...new Set([
  ...feedbackKeys,
  'Column', 'Rename column', 'Remove empty column', 'Move to previous column', 'Move to next column', 'Remove card',
  'Column names must be different.', 'Keep at least two columns.', 'Move or remove cards before removing this column.',
  'The Kanban board is at its column limit.', 'The Kanban board is at its card limit.', 'Kanban board storage is unavailable.',
])];

export function kanbanBoardContent(language = 'en') {
  if (language === 'en') {
    return {
      ui: Object.fromEntries([...kanbanBoardUiKeys, ...kanbanBoardEnglishCopy].map((value) => [value, value])),
      copy: kanbanBoardEnglishCopy,
    };
  }
  return kanbanBoardLocaleData[language] ?? { ui: {}, copy: [] };
}
