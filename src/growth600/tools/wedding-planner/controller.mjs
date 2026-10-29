import { buildWeddingPlan } from './logic.mjs';

const root = document.querySelector('[data-tool="wedding-planner"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const node = (tag, text) => { const el = document.createElement(tag); if (text !== undefined) el.textContent = String(text); return el; };
  const table = (labels, rows) => {
    const output = node('table'); output.className = 'pending-table';
    const head = node('tr'); for (const label of labels) head.append(node('th', label));
    const thead = node('thead'); thead.append(head); output.append(thead);
    const body = node('tbody'); for (const values of rows) { const row = node('tr'); for (const value of values) row.append(node('td', value)); body.append(row); }
    output.append(body); return output;
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault(); content.replaceChildren();
    try {
      const input = Object.fromEntries(['currency', 'guests', 'vendors', 'tasks'].map((key) => [key, form.elements.namedItem(key).value]));
      const plan = buildWeddingPlan(input);
      const summary = node('dl');
      const add = (label, value) => summary.append(node('dt', label), node('dd', value));
      add(copy.fields.guestCount, plan.guests.length);
      for (const key of ['yes', 'no', 'pending']) add(copy.fields[`rsvp_${key}`], plan.attendance[key]);
      add(copy.fields.vendorCount, plan.vendors.length);
      const money = (value) => { try { return new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: plan.currency || 'XXX', maximumFractionDigits: 2 }).format(value); } catch { return `${value.toLocaleString(document.documentElement.lang || 'en', { maximumFractionDigits: 2 })} ${plan.currency || copy.fields.currencyNote}`; } };
      add(copy.fields.vendorTotal, money(plan.vendorTotal)); add(copy.fields.depositsPaid, money(plan.depositsPaid)); add(copy.fields.remaining, money(plan.remaining));
      add(copy.fields.tasksDone, plan.tasksDone); add(copy.fields.tasksOpen, plan.tasksOpen); content.append(summary);
      if (plan.guests.length) content.append(node('h3', copy.fields.guestList), table([copy.fields.guestName, copy.fields.rsvp, copy.fields.meal, copy.fields.table], plan.guests.map((guest) => [guest.name, copy.fields[`rsvp_${guest.rsvp}`], guest.meal, guest.table])));
      if (plan.vendors.length) content.append(node('h3', copy.fields.vendorList), table([copy.fields.vendorName, copy.fields.contact, copy.fields.total, copy.fields.deposit, copy.fields.dueDate], plan.vendors.map((vendor) => [vendor.name, vendor.contact, money(vendor.total), money(vendor.deposit), vendor.dueDate])));
      if (plan.tasks.length) content.append(node('h3', copy.fields.taskList), table([copy.fields.taskName, copy.fields.dueDate, copy.fields.status], plan.tasks.map((task) => [task.name, task.dueDate, task.done ? copy.fields.done : copy.fields.open])));
      const button = node('button', copy.actions.download); button.type = 'button'; button.className = 'button button--secondary';
      button.addEventListener('click', () => { const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = node('a'); link.href = url; link.download = 'wedding-plan.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); });
      content.append(button); status.textContent = copy.messages.complete; status.classList.remove('status--error'); result.hidden = false;
    } catch (error) { status.textContent = copy.messages[error?.code] ?? copy.messages.error; status.classList.add('status--error'); result.hidden = false; }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
