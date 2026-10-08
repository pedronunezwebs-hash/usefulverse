export const WORK_ORDER_LIMITS = Object.freeze({
  text: 240,
  details: 4000,
  lines: 40,
  hours: 100000,
  quantity: 100000000,
});

function localToday() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function text(value, label, max = WORK_ORDER_LIMITS.text, { required = false } = {}) {
  const result = String(value ?? '').trim();
  if (required && !result) throw new TypeError(`${label} is required.`);
  if ([...result].length > max) throw new RangeError(`${label} must be ${max} characters or fewer.`);
  return result;
}

function date(value, label, { required = false } = {}) {
  const result = String(value ?? '').trim();
  if (required && !result) throw new TypeError(`${label} is required.`);
  if (!result) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(result) || new Date(`${result}T00:00:00Z`).toISOString().slice(0, 10) !== result) {
    throw new TypeError(`${label} must be a valid date.`);
  }
  return result;
}

function parseLines(value, label, limit = WORK_ORDER_LIMITS.lines) {
  const lines = String(value ?? '').split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (lines.length > limit) throw new RangeError(`${label} supports up to ${limit} lines.`);
  return lines;
}

export function createWorkOrder(input, { today = localToday() } = {}) {
  if (!input || typeof input !== 'object') throw new TypeError('Enter work order details.');
  const issuedDate = date(input.issuedDate || today, 'Issue date', { required: true });
  const scheduledDate = date(input.scheduledDate, 'Scheduled date');
  const completedDate = date(input.completedDate, 'Completion date');
  const status = String(input.status ?? 'open');
  if (!['open', 'in-progress', 'completed'].includes(status)) throw new TypeError('Choose a supported work status.');
  if (scheduledDate && scheduledDate < issuedDate) throw new RangeError('Scheduled date cannot be before the issue date.');
  if (status === 'completed' && !completedDate) throw new TypeError('A completion date is required when the work is complete.');
  if (completedDate && completedDate < issuedDate) throw new RangeError('Completion date cannot be before the issue date.');

  const taskLines = parseLines(input.tasks, 'Checklist');
  const materialLines = parseLines(input.materials, 'Materials');
  const laborLines = parseLines(input.labor, 'Labor');
  if (taskLines.length + materialLines.length + laborLines.length === 0) throw new TypeError('Add at least one task, material or labor entry.');
  const tasks = taskLines.map((line, index) => ({ id: `task-${index + 1}`, description: text(line, `Task ${index + 1}`), done: Boolean(input.completedTasks?.includes?.(index)) }));
  const materials = materialLines.map((line, index) => {
    const parts = line.split('|').map((part) => part.trim());
    if (parts.length < 2 || parts.length > 3) throw new TypeError(`Material ${index + 1}: use description | quantity | unit.`);
    const [name, rawQuantity, unit = ''] = parts;
    const quantity = Number(rawQuantity);
    if (!name || !rawQuantity || !Number.isFinite(quantity) || quantity <= 0 || quantity > WORK_ORDER_LIMITS.quantity) throw new TypeError(`Material ${index + 1}: use description | quantity | unit, with a positive quantity.`);
    return { description: text(name, `Material ${index + 1}`), quantity, unit: text(unit, `Material unit ${index + 1}`, 48) };
  });
  const labor = laborLines.map((line, index) => {
    const parts = line.split('|').map((part) => part.trim());
    if (parts.length !== 2) throw new TypeError(`Labor ${index + 1}: use activity | hours.`);
    const [activity, rawHours] = parts;
    const hours = Number(rawHours);
    if (!activity || !rawHours || !Number.isFinite(hours) || hours < 0 || hours > WORK_ORDER_LIMITS.hours) throw new TypeError(`Labor ${index + 1}: use activity | hours, with hours from 0 to ${WORK_ORDER_LIMITS.hours}.`);
    return { activity: text(activity, `Labor activity ${index + 1}`), hours };
  });
  const totalLaborHours = labor.reduce((sum, entry) => sum + entry.hours, 0);
  if (!Number.isFinite(totalLaborHours)) throw new RangeError('Total labor hours are too large.');

  return Object.freeze({
    number: text(input.number, 'Work order number', 48),
    issuedDate,
    scheduledDate,
    completedDate,
    status,
    customer: text(input.customer, 'Customer', WORK_ORDER_LIMITS.text, { required: true }),
    contact: text(input.contact, 'Contact'),
    location: text(input.location, 'Service location'),
    assignedTo: text(input.assignedTo, 'Assigned technician'),
    title: text(input.title, 'Work summary', 160, { required: true }),
    details: text(input.details, 'Work details', WORK_ORDER_LIMITS.details),
    tasks,
    materials,
    labor,
    totalLaborHours,
    notes: text(input.notes, 'Notes', WORK_ORDER_LIMITS.details),
  });
}

export function workOrderToCsv(order, labels = {}) {
  const quote = (value) => {
    const source = String(value ?? '');
    const safe = /^[\s]*[=+\-@]/u.test(source) ? `'${source}` : source;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  const rows = [
    [labels.workOrder ?? 'Work order', order.number],
    [labels.status ?? 'Status', labels[order.status] ?? order.status],
    [labels.customer ?? 'Customer', order.customer],
    [labels.issuedDate ?? 'Issue date', order.issuedDate],
    [labels.scheduledDate ?? 'Scheduled date', order.scheduledDate],
    [labels.completedDate ?? 'Completion date', order.completedDate],
    [labels.title ?? 'Summary', order.title],
    [labels.details ?? 'Details', order.details],
    [],
    [labels.tasks ?? 'Checklist', labels.description ?? 'Description', labels.done ?? 'Done'],
    ...order.tasks.map((task) => [labels.tasks ?? 'Checklist', task.description, task.done ? 'Yes' : 'No']),
    [],
    [labels.materials ?? 'Materials', labels.description ?? 'Description', labels.quantity ?? 'Quantity', labels.unit ?? 'Unit'],
    ...order.materials.map((item) => [labels.materials ?? 'Materials', item.description, item.quantity, item.unit]),
    [],
    [labels.labor ?? 'Labor', labels.activity ?? 'Activity', labels.hours ?? 'Hours'],
    ...order.labor.map((item) => [labels.labor ?? 'Labor', item.activity, item.hours]),
    [labels.totalLaborHours ?? 'Total labor hours', order.totalLaborHours],
    [labels.notes ?? 'Notes', order.notes],
  ];
  return rows.map((row) => row.map(quote).join(',')).join('\r\n');
}
