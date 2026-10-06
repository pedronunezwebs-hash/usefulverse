import {
  addKanbanCard, addKanbanColumn, createKanbanBoard, moveKanbanCard,
  removeKanbanCard, removeKanbanColumn, renameKanbanColumn,
  serializeKanbanBackup, validateKanbanBackup,
} from './kanban-board-logic.mjs';

const clone = (value) => structuredClone(value);
const makeId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function setupKanbanBoard(root) {
  let messages = {};
  try { messages = JSON.parse(root.dataset.kanbanMessages ?? '{}'); } catch { /* fall back to visible source labels */ }
  const say = (key) => messages[key] ?? window.usefulverseLocale?.runtime?.[key] ?? window.usefulverseLocale?.messages?.[key] ?? key;
  const boardColumns = root.querySelector('[data-kanban-columns]');
  const cardForm = root.querySelector('[data-kanban-card-form]');
  const cardTitle = root.querySelector('[data-kanban-card-title]');
  const cardColumn = root.querySelector('[data-kanban-card-column]');
  const columnForm = root.querySelector('[data-kanban-column-form]');
  const newColumnName = root.querySelector('[data-kanban-new-column]');
  const status = root.querySelector('[data-kanban-status]');
  const storageKey = 'usefulverse:kanban-board:v1';
  const localizedColumns = [...root.querySelectorAll('[data-kanban-default-column]')].map((item) => item.dataset.kanbanDefaultColumn);
  let board;
  try { board = createKanbanBoard(localizedColumns.length >= 2 ? localizedColumns : undefined); }
  catch { board = createKanbanBoard(); }
  let past = [];
  let future = [];

  const announce = (message, kind = '') => {
    status.textContent = say(message);
    status.className = `tool-status${kind ? ` is-${kind}` : ''}`;
  };
  const remember = (next) => {
    if (JSON.stringify(next) === JSON.stringify(board)) return false;
    past.push(clone(board));
    if (past.length > 50) past.shift();
    board = next;
    future = [];
    render();
    return true;
  };
  const restoreCardFocus = (cardId) => boardColumns.querySelector(`[data-kanban-card="${CSS.escape(cardId)}"]`)?.focus();
  const render = () => {
    const selectedColumn = cardColumn.value;
    cardColumn.replaceChildren();
    for (const column of board.columns) {
      const option = document.createElement('option');
      option.value = column.id; option.textContent = column.name; cardColumn.append(option);
    }
    if (board.columns.some(({ id }) => id === selectedColumn)) cardColumn.value = selectedColumn;
    boardColumns.replaceChildren();
    for (const [columnIndex, column] of board.columns.entries()) {
      const section = document.createElement('li'); section.className = 'kanban-board__column';
      const header = document.createElement('form'); header.className = 'kanban-board__column-header'; header.dataset.kanbanRenameForm = column.id;
      const label = document.createElement('label'); label.className = 'visually-hidden';
      const input = document.createElement('input'); input.className = 'tool-input'; input.maxLength = 32; input.required = true; input.value = column.name;
      input.setAttribute('aria-label', `${say('Rename column')}: ${column.name}`); label.append(input);
      const count = document.createElement('span'); count.className = 'kanban-board__count'; count.textContent = String(column.cards.length);
      const rename = document.createElement('button'); rename.type = 'submit'; rename.className = 'button button--ghost'; rename.textContent = say('Rename column');
      header.append(label, count, rename);
      header.addEventListener('submit', (event) => {
        event.preventDefault();
        try {
          if (remember(renameKanbanColumn(board, column.id, input.value))) announce('Column renamed.', 'success');
        } catch (error) { announce(error.message.includes('different') ? 'Column names must be different.' : 'Check your inputs and try again.', 'error'); input.focus(); }
      });
      section.append(header);
      const removeColumn = document.createElement('button'); removeColumn.type = 'button'; removeColumn.className = 'button button--ghost kanban-board__remove-column';
      removeColumn.textContent = say('Remove empty column');
      removeColumn.disabled = board.columns.length <= 2 || column.cards.length > 0;
      removeColumn.addEventListener('click', () => {
        try { if (remember(removeKanbanColumn(board, column.id))) announce('Column removed.', 'success'); }
        catch (error) { announce(say(error.message), 'error'); }
      });
      section.append(removeColumn);
      const list = document.createElement('ul'); list.className = 'kanban-board__cards';
      if (!column.cards.length) {
        const empty = document.createElement('li'); empty.className = 'kanban-board__empty'; empty.textContent = say('No cards in this column.'); list.append(empty);
      }
      for (const card of column.cards) {
        const item = document.createElement('li'); item.className = 'kanban-board__card-item';
        const cardElement = document.createElement('article'); cardElement.className = 'kanban-board__card';
        cardElement.tabIndex = 0; cardElement.dataset.kanbanCard = card.id;
        cardElement.setAttribute('aria-label', `${card.title}, ${column.name}. ${say('Focus a card and press the left or right arrow to move it, or use its buttons.')}`);
        const title = document.createElement('p'); title.className = 'kanban-board__card-title'; title.textContent = card.title; cardElement.append(title);
        const actions = document.createElement('div'); actions.className = 'tool-actions';
        const previous = document.createElement('button'); previous.type = 'button'; previous.className = 'button button--ghost'; previous.textContent = '←';
        previous.setAttribute('aria-label', `${say('Move to previous column')}: ${column.name}`); previous.disabled = columnIndex === 0;
        previous.addEventListener('click', () => { if (remember(moveKanbanCard(board, card.id, -1))) { announce('Card moved.', 'success'); restoreCardFocus(card.id); } });
        const next = document.createElement('button'); next.type = 'button'; next.className = 'button button--ghost'; next.textContent = '→';
        next.setAttribute('aria-label', `${say('Move to next column')}: ${column.name}`); next.disabled = columnIndex === board.columns.length - 1;
        next.addEventListener('click', () => { if (remember(moveKanbanCard(board, card.id, 1))) { announce('Card moved.', 'success'); restoreCardFocus(card.id); } });
        const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'button button--ghost'; remove.textContent = say('Remove card');
        remove.addEventListener('click', () => { remember(removeKanbanCard(board, card.id)); announce('Card removed.', 'success'); });
        actions.append(previous, next, remove); cardElement.append(actions); item.append(cardElement); list.append(item);
      }
      section.append(list); boardColumns.append(section);
    }
    root.querySelector('[data-kanban-undo]').disabled = !past.length;
    root.querySelector('[data-kanban-redo]').disabled = !future.length;
    newColumnName.disabled = board.columns.length >= 8;
    columnForm.querySelector('button[type="submit"]').disabled = board.columns.length >= 8;
  };

  cardForm.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      remember(addKanbanCard(board, cardColumn.value, cardTitle.value, makeId()));
      cardTitle.value = ''; cardTitle.focus(); announce('Card added.', 'success');
    } catch (error) {
      announce(error.message.includes('limit') ? 'The Kanban board is at its card limit.' : 'Card title is required.', 'error');
      cardTitle.focus();
    }
  });
  columnForm.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      remember(addKanbanColumn(board, newColumnName.value, makeId()));
      newColumnName.value = ''; newColumnName.focus(); announce('Column added.', 'success');
    } catch (error) {
      announce(error.message.includes('different') ? 'Column names must be different.' : error.message.includes('limit') ? 'The Kanban board is at its column limit.' : 'Check your inputs and try again.', 'error');
      newColumnName.focus();
    }
  });
  root.querySelector('[data-kanban-undo]').addEventListener('click', () => {
    if (!past.length) return announce('No changes to undo.');
    future.push(clone(board)); board = past.pop(); render(); announce('Changes undone.', 'success');
  });
  root.querySelector('[data-kanban-redo]').addEventListener('click', () => {
    if (!future.length) return announce('No changes to redo.');
    past.push(clone(board)); board = future.pop(); render(); announce('Changes redone.', 'success');
  });
  root.addEventListener('keydown', (event) => {
    if (!(event.metaKey || event.ctrlKey) || event.altKey || event.target.matches('input, textarea, select')) return;
    if (event.key.toLowerCase() === 'z') {
      event.preventDefault(); root.querySelector(event.shiftKey ? '[data-kanban-redo]' : '[data-kanban-undo]').click();
    } else if (event.key.toLowerCase() === 'y') {
      event.preventDefault(); root.querySelector('[data-kanban-redo]').click();
    }
  });
  boardColumns.addEventListener('keydown', (event) => {
    const card = event.target.closest('[data-kanban-card]');
    if (!card || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    if (remember(moveKanbanCard(board, card.dataset.kanbanCard, event.key === 'ArrowLeft' ? -1 : 1))) {
      announce('Card moved.', 'success'); restoreCardFocus(card.dataset.kanbanCard);
    }
  });
  root.querySelector('[data-kanban-save]').addEventListener('click', () => {
    try { localStorage.setItem(storageKey, serializeKanbanBackup(board)); announce('Kanban board saved on this device.', 'success'); }
    catch { announce('Kanban board storage is unavailable.', 'error'); }
  });
  root.querySelector('[data-kanban-load]').addEventListener('click', () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return announce('No saved Kanban board was found.', 'error');
      board = validateKanbanBackup(saved); past = []; future = []; render(); announce('Kanban board loaded from this device.', 'success');
    } catch { announce('Kanban board storage is unavailable.', 'error'); }
  });
  root.querySelector('[data-kanban-delete]').addEventListener('click', () => {
    try { localStorage.removeItem(storageKey); announce('Saved Kanban board deleted.', 'success'); }
    catch { announce('Kanban board storage is unavailable.', 'error'); }
  });
  root.querySelector('[data-kanban-download]').addEventListener('click', () => {
    try {
      const blob = new Blob([serializeKanbanBackup(board)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob); const link = document.createElement('a');
      link.href = url; link.download = 'usefulverse-kanban-board.json'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); announce('JSON download started.', 'success');
    } catch { announce('Kanban board storage is unavailable.', 'error'); }
  });
  render();
}
