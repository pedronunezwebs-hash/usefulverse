const MAX_LINE = 500;
const printable = (value) => String(value ?? '').trim().replaceAll('\r', '');
function rows(value, limit, name) {
  const lines = printable(value).split('\n').map((line) => line.trim()).filter(Boolean);
  if (lines.length > limit) throw Object.assign(new RangeError('Too many rows.'), { code: 'too-many-rows', section: name });
  return lines.map((line) => line.split('|').map((part) => part.trim()));
}
function validDate(value) { if (!value) return true; if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false; const date = new Date(`${value}T12:00:00Z`); return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value; }
function amount(value, section) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 1_000_000_000) throw Object.assign(new RangeError('Invalid amount.'), { code: 'invalid-amount', section });
  return number;
}
export function buildWeddingPlan(input = {}) {
  const currency = String(input.currency ?? '').trim().toUpperCase();
  if (input.vendors && String(input.vendors).trim() && !/^[A-Z]{3}$/u.test(currency)) throw Object.assign(new RangeError('Choose a three-letter currency code.'), { code: 'invalid-currency' });
  const guests = rows(input.guests, MAX_LINE, 'guests').map((parts) => {
    const [name, rsvp = 'pending', meal = '', table = ''] = parts;
    if (!name || name.length > 120 || meal.length > 120 || table.length > 80 || parts.length > 4 || !['yes','no','pending'].includes(rsvp.toLowerCase())) throw Object.assign(new RangeError('Invalid guest row.'), { code: 'invalid-guest' });
    return { name, rsvp: rsvp.toLowerCase(), meal: meal.slice(0, 120), table: table.slice(0, 80) };
  });
  const vendors = rows(input.vendors, 200, 'vendors').map((parts) => {
    const [name, contact = '', totalRaw = '0', depositRaw = '0', dueDate = ''] = parts;
    const total = amount(totalRaw, 'vendors'); const deposit = amount(depositRaw, 'vendors');
    if (!name || name.length > 120 || contact.length > 160 || parts.length > 5 || deposit > total || !validDate(dueDate)) throw Object.assign(new RangeError('Invalid vendor row.'), { code: 'invalid-vendor' });
    return { name, contact: contact.slice(0, 160), total, deposit, dueDate };
  });
  const tasks = rows(input.tasks, 300, 'tasks').map((parts) => {
    const [name, dueDate = '', doneRaw = 'no'] = parts;
    const done = doneRaw.toLowerCase();
    if (!name || name.length > 160 || parts.length > 3 || !validDate(dueDate) || !['yes','no'].includes(done)) throw Object.assign(new RangeError('Invalid task row.'), { code: 'invalid-task' });
    return { name, dueDate, done: done === 'yes' };
  });
  if (!guests.length && !vendors.length && !tasks.length) throw Object.assign(new RangeError('Add at least one entry.'), { code: 'empty-plan' });
  const attendance = Object.fromEntries(['yes','no','pending'].map((key) => [key, guests.filter((guest) => guest.rsvp === key).length]));
  const total = vendors.reduce((sum, vendor) => sum + vendor.total, 0);
  const paid = vendors.reduce((sum, vendor) => sum + vendor.deposit, 0);
  return Object.freeze({ currency, guests, attendance, vendors, vendorTotal: total, depositsPaid: paid, remaining: total - paid, tasks, tasksDone: tasks.filter((task) => task.done).length, tasksOpen: tasks.filter((task) => !task.done).length });
}
