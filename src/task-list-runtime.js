import { filterTasks, makeTask, serializeTaskBackup, validateTaskBackup } from './task-list-logic.mjs';

const text = (root, selector, value) => { const element = root.querySelector(selector); if (element) element.textContent = value; };

export function setupTaskList(root) {
  let messages = {};
  try { messages = JSON.parse(root.dataset.taskMessages ?? '{}'); } catch { /* Static trusted markup only; use bundle messages if unavailable. */ }
  const say = (key) => messages[key] ?? window.usefulverseLocale?.runtime?.[key] ?? window.usefulverseLocale?.messages?.[key] ?? key;
  const form = root.querySelector('[data-task-form]');
  const nameInput = root.querySelector('[data-task-name]');
  const priorityInput = root.querySelector('[data-task-priority]');
  const dueInput = root.querySelector('[data-task-due]');
  const subtasksInput = root.querySelector('[data-task-subtasks]');
  const list = root.querySelector('[data-task-items]');
  const empty = root.querySelector('[data-task-empty]');
  const status = root.querySelector('[data-task-status]');
  const storageKey = 'usefulverse:task-list:v1';
  let tasks = [];
  let currentFilter = 'all';

  const announce = (message, kind = '') => {
    status.textContent = say(message);
    status.className = `tool-status${kind ? ` is-${kind}` : ''}`;
  };
  const render = () => {
    list.replaceChildren();
    const visibleTasks = filterTasks(tasks, currentFilter);
    empty.hidden = visibleTasks.length > 0;
    if (!tasks.length) empty.textContent = say('No tasks yet.');
    else if (!visibleTasks.length) {
      empty.hidden = false;
      empty.textContent = say('No tasks match this filter.');
    }
    for (const task of visibleTasks) {
      const item = document.createElement('li');
      item.className = `task-list__item${task.completed ? ' is-complete' : ''}`;
      const main = document.createElement('div');
      main.className = 'task-list__main';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox'; checkbox.checked = task.completed;
      checkbox.setAttribute('aria-label', say(task.completed ? 'Mark active' : 'Mark complete'));
      checkbox.addEventListener('change', () => { task.completed = checkbox.checked; render(); });
      const title = document.createElement('strong'); title.textContent = task.name;
      const meta = document.createElement('span');
      meta.className = `task-list__priority task-list__priority--${task.priority}`;
      meta.textContent = say(task.priority === 'low' ? 'Low' : task.priority === 'high' ? 'High' : 'Medium');
      main.append(checkbox, title, meta);
      if (task.dueDate) {
        const due = document.createElement('time'); due.dateTime = task.dueDate; due.textContent = task.dueDate;
        due.className = 'task-list__due'; main.append(due);
      }
      item.append(main);
      if (task.subtasks.length) {
        const subList = document.createElement('ul'); subList.className = 'task-list__subtasks';
        for (const subtask of task.subtasks) {
          const subItem = document.createElement('li');
          const subCheckbox = document.createElement('input'); subCheckbox.type = 'checkbox'; subCheckbox.checked = subtask.completed;
          subCheckbox.setAttribute('aria-label', say(subtask.completed ? 'Mark active' : 'Mark complete'));
          subCheckbox.addEventListener('change', () => { subtask.completed = subCheckbox.checked; render(); });
          const subText = document.createElement('span'); subText.textContent = subtask.text;
          if (subtask.completed) subText.className = 'is-complete';
          subItem.append(subCheckbox, subText); subList.append(subItem);
        }
        item.append(subList);
      }
      const remove = document.createElement('button');
      remove.type = 'button'; remove.className = 'button button--ghost';
      remove.textContent = say('Remove task'); remove.setAttribute('aria-label', `${say('Remove task')}: ${task.name}`);
      remove.addEventListener('click', () => { tasks = tasks.filter(({ id }) => id !== task.id); render(); });
      item.append(remove); list.append(item);
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const task = makeTask({ name: nameInput.value, priority: priorityInput.value, dueDate: dueInput.value, subtasks: subtasksInput.value, id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${tasks.length}`, createdAt: Date.now() });
      tasks.push(task); currentFilter = 'all';
      root.querySelector('[data-task-filter="all"]').click();
      form.reset(); priorityInput.value = 'medium'; nameInput.focus(); render(); announce('Task added.', 'success');
    } catch (error) {
      announce(error.message.includes('name') ? 'Every task needs a name.' : 'Check your inputs and try again.', 'error');
      nameInput.focus();
    }
  });
  for (const button of root.querySelectorAll('[data-task-filter]')) {
    button.addEventListener('click', () => {
      currentFilter = button.dataset.taskFilter;
      for (const filterButton of root.querySelectorAll('[data-task-filter]')) filterButton.setAttribute('aria-pressed', String(filterButton === button));
      render();
    });
  }
  root.querySelector('[data-task-save]').addEventListener('click', () => {
    try { localStorage.setItem(storageKey, serializeTaskBackup(tasks)); announce('Tasks saved on this device.', 'success'); }
    catch { announce('Browser storage is unavailable.', 'error'); }
  });
  root.querySelector('[data-task-load]').addEventListener('click', () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return announce('No saved task list found.', 'error');
      tasks = validateTaskBackup(saved); currentFilter = 'all';
      root.querySelector('[data-task-filter="all"]').click(); render(); announce('Tasks loaded from this device.', 'success');
    } catch { announce('Browser storage is unavailable.', 'error'); }
  });
  root.querySelector('[data-task-delete-saved]').addEventListener('click', () => {
    try { localStorage.removeItem(storageKey); announce('Saved tasks deleted from this device.', 'success'); }
    catch { announce('Browser storage is unavailable.', 'error'); }
  });
  root.querySelector('[data-task-download]').addEventListener('click', () => {
    try {
      const blob = new Blob([serializeTaskBackup(tasks)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob); const link = document.createElement('a');
      link.href = url; link.download = 'usefulverse-tasks.json'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); announce('JSON download started.', 'success');
    } catch { announce('At least one task needs a name.', 'error'); }
  });
  render();
}
