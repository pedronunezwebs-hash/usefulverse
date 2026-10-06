const priorities = new Set(['low', 'medium', 'high']);

export function makeTask({ name, priority = 'medium', dueDate = '', subtasks = [], id = '', createdAt = 0 }) {
  const cleanName = String(name ?? '').trim();
  if (!cleanName) throw new TypeError('Every task needs a name.');
  if (cleanName.length > 160) throw new RangeError('Task names must be 160 characters or fewer.');
  if (!priorities.has(priority)) throw new RangeError('Choose a valid task priority.');
  if (dueDate) {
    const date = new Date(`${dueDate}T00:00:00.000Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/u.test(dueDate) || !Number.isFinite(date.valueOf()) || date.toISOString().slice(0, 10) !== dueDate) {
      throw new TypeError('Choose a valid due date.');
    }
  }
  const cleanSubtasks = (Array.isArray(subtasks) ? subtasks : String(subtasks ?? '').split(/\r?\n/u))
    .map((item) => String(item && typeof item === 'object' ? item.text ?? '' : item).trim()).filter(Boolean);
  if (cleanSubtasks.length > 40 || cleanSubtasks.some((item) => item.length > 160)) {
    throw new RangeError('Use up to 40 subtasks, with 160 characters or fewer each.');
  }
  return {
    id: String(id), name: cleanName, priority, dueDate, completed: false,
    subtasks: cleanSubtasks.map((text) => ({ text, completed: false })),
    createdAt: Number.isFinite(Number(createdAt)) ? Number(createdAt) : 0,
  };
}

export function filterTasks(tasks, filter = 'all') {
  if (!Array.isArray(tasks)) return [];
  if (filter === 'active') return tasks.filter((task) => !task.completed);
  if (filter === 'completed') return tasks.filter((task) => task.completed);
  return tasks;
}

export function validateTaskBackup(value) {
  const data = typeof value === 'string' ? JSON.parse(value) : value;
  if (!data || data.version !== 1 || !Array.isArray(data.tasks) || data.tasks.length > 500) {
    throw new TypeError('This is not a supported task-list backup.');
  }
  return data.tasks.map((task) => {
    const normalized = makeTask(task);
    normalized.completed = Boolean(task.completed);
    normalized.subtasks = normalized.subtasks.map((subtask, index) => ({
      ...subtask,
      completed: Boolean(task.subtasks?.[index]?.completed),
    }));
    return normalized;
  });
}

export function serializeTaskBackup(tasks) {
  const safeTasks = validateTaskBackup({ version: 1, tasks });
  return JSON.stringify({ version: 1, tasks: safeTasks }, null, 2);
}
