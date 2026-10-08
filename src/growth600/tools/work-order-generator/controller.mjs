import { announce, readToolCopy } from '../controller-helpers.mjs';
import { createWorkOrder, workOrderToCsv } from './logic.mjs';

const root = document.querySelector('[data-tool="work-order-generator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const result = root.querySelector('[data-result]');
  const copy = readToolCopy(root);
  let order = null;

  function addText(parent, tag, value, className = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = String(value ?? '');
    parent.append(element);
    return element;
  }

  function field(name) {
    return form.elements.namedItem(name)?.value ?? '';
  }

  function collect() {
    return {
      number: field('number'), issuedDate: field('issuedDate'), scheduledDate: field('scheduledDate'), completedDate: field('completedDate'),
      status: field('status'), customer: field('customer'), contact: field('contact'), location: field('location'), assignedTo: field('assignedTo'),
      title: field('title'), details: field('details'), tasks: field('tasks'), materials: field('materials'), labor: field('labor'), notes: field('notes'),
      completedTasks: [...root.querySelectorAll('[data-task-done]:checked')].map((input) => Number(input.dataset.taskDone)),
    };
  }

  function render() {
    if (!order) return;
    const panel = root.querySelector('[data-work-order-preview]');
    panel.replaceChildren();
    const meta = document.createElement('dl');
    const rows = [
      [copy.fields.workOrderNumber, order.number], [copy.fields.status, copy.actions[order.status]], [copy.fields.customer, order.customer],
      [copy.fields.contact, order.contact], [copy.fields.location, order.location], [copy.fields.assignedTo, order.assignedTo],
      [copy.fields.issuedDate, order.issuedDate], [copy.fields.scheduledDate, order.scheduledDate], [copy.fields.completedDate, order.completedDate],
    ];
    for (const [label, value] of rows) {
      if (!value) continue;
      addText(meta, 'dt', label);
      addText(meta, 'dd', value);
    }
    panel.append(meta);
    addText(panel, 'h3', order.title);
    if (order.details) addText(panel, 'p', order.details);

    if (order.tasks.length) {
      addText(panel, 'h4', copy.fields.checklist);
      const list = document.createElement('ul');
      for (const [index, task] of order.tasks.entries()) {
        const item = document.createElement('li');
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = `work-order-task-${index + 1}`;
        input.name = `task-${index + 1}`;
        input.checked = task.done;
        input.dataset.taskDone = String(index);
        const text = document.createElement('span');
        text.textContent = task.description;
        label.append(input, text);
        item.append(label);
        list.append(item);
      }
      panel.append(list);
    }

    if (order.materials.length) {
      addText(panel, 'h4', copy.fields.materialsLabel);
      const scroll = document.createElement('div');
      scroll.className = 'work-order-table-scroll';
      const table = document.createElement('table');
      const head = table.createTHead().insertRow();
      for (const value of [copy.fields.description, copy.fields.quantity, copy.fields.unit]) addText(head, 'th', value);
      const body = table.createTBody();
      for (const entry of order.materials) {
        const row = body.insertRow();
        for (const value of [entry.description, entry.quantity, entry.unit]) addText(row, 'td', value);
      }
      scroll.append(table);
      panel.append(scroll);
    }

    if (order.labor.length) {
      addText(panel, 'h4', copy.fields.laborLabel);
      const scroll = document.createElement('div');
      scroll.className = 'work-order-table-scroll';
      const table = document.createElement('table');
      const head = table.createTHead().insertRow();
      for (const value of [copy.fields.activity, copy.fields.hours]) addText(head, 'th', value);
      const body = table.createTBody();
      for (const entry of order.labor) {
        const row = body.insertRow();
        addText(row, 'td', entry.activity);
        addText(row, 'td', entry.hours);
      }
      scroll.append(table);
      panel.append(scroll);
      addText(panel, 'p', `${copy.fields.totalLaborHours}: ${order.totalLaborHours}`);
    }
    if (order.notes) {
      addText(panel, 'h4', copy.fields.notes);
      addText(panel, 'p', order.notes);
    }
    result.hidden = false;
  }

  function build() {
    try {
      order = createWorkOrder(collect());
      render();
      announce(root, copy.messages.ready, 'success');
      return true;
    } catch (error) {
      announce(root, copy.messages.invalid, 'error');
      return false;
    }
  }

  function printOrder() {
    if (!order) {
      announce(root, copy.messages.createFirst, 'error');
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      announce(root, copy.messages.printBlocked, 'error');
      return;
    }
    const document = printWindow.document;
    document.documentElement.lang = window.document.documentElement.lang || 'en';
    document.documentElement.dir = root.dir || window.document.documentElement.dir || 'ltr';
    const title = document.createElement('title');
    title.textContent = copy.name;
    const style = document.createElement('style');
    style.textContent = 'body{font:11pt/1.5 system-ui,sans-serif;color:#111;margin:16mm}h1,h2,h3,h4{margin:0 0 4mm}section{break-inside:avoid;margin:0 0 8mm}dl{display:grid;grid-template-columns:1fr 2fr;gap:2mm 5mm}dt{font-weight:700}dd{margin:0}table{border-collapse:collapse;width:100%;margin:3mm 0 6mm}th,td{border:1px solid #888;padding:2mm;text-align:start}li{padding:1mm 0}@page{size:A4;margin:12mm}';
    document.head.replaceChildren(title, style);
    const heading = document.createElement('h1');
    heading.textContent = copy.name;
    const content = root.querySelector('[data-work-order-preview]').cloneNode(true);
    for (const input of content.querySelectorAll('input')) {
      const mark = document.createElement('span');
      mark.textContent = input.checked ? '☑ ' : '☐ ';
      input.replaceWith(mark);
    }
    document.body.replaceChildren(heading, content);
    printWindow.addEventListener('afterprint', () => printWindow.close(), { once: true });
    printWindow.focus();
    setTimeout(() => printWindow.print(), 100);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    build();
  });
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    const issued = new Date();
    const scheduled = new Date(issued.getFullYear(), issued.getMonth(), issued.getDate() + 1);
    const localDate = (value) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
    form.elements.namedItem('number').value = 'WO-1042';
    form.elements.namedItem('issuedDate').value = localDate(issued);
    form.elements.namedItem('scheduledDate').value = localDate(scheduled);
    form.elements.namedItem('customer').value = 'Northwind Workshop';
    form.elements.namedItem('contact').value = 'Alex Morgan';
    form.elements.namedItem('location').value = '12 Market Street';
    form.elements.namedItem('assignedTo').value = 'Taylor Lee';
    form.elements.namedItem('title').value = 'Repair the side gate';
    form.elements.namedItem('details').value = 'Inspect the hinges, replace damaged hardware and confirm that the gate closes securely.';
    form.elements.namedItem('tasks').value = 'Inspect hinges\nReplace damaged hardware\nTest gate closure';
    form.elements.namedItem('materials').value = 'Gate hinge | 2 | each\nExterior screws | 8 | each';
    form.elements.namedItem('labor').value = 'Inspection | 0.5\nRepair and test | 1.25';
    form.elements.namedItem('notes').value = 'Contact customer before arrival.';
    form.elements.namedItem('status').value = 'in-progress';
    form.elements.namedItem('completedDate').value = '';
    build();
    announce(root, copy.messages.exampleLoaded, 'success');
  });
  root.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
    setTimeout(() => { order = null; result.hidden = true; root.querySelector('[data-work-order-preview]').replaceChildren(); announce(root, ''); }, 0);
  });
  root.querySelector('[data-action="downloadCsv"]')?.addEventListener('click', () => {
    if (!order) {
      announce(root, copy.messages.createFirst, 'error');
      return;
    }
    try {
      order = createWorkOrder({ ...collect(), completedTasks: [...root.querySelectorAll('[data-task-done]:checked')].map((input) => Number(input.dataset.taskDone)) });
      const blob = new Blob([`\uFEFF${workOrderToCsv(order, copy.fields)}`], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'work-order.csv';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      announce(root, copy.messages.downloaded, 'success');
    } catch (error) {
      announce(root, copy.messages.downloadFailed, 'error');
    }
  });
  root.querySelector('[data-action="print"]')?.addEventListener('click', printOrder);
  root.addEventListener('change', (event) => {
    const input = event.target.closest('[data-task-done]');
    if (input && order?.tasks[Number(input.dataset.taskDone)]) order.tasks[Number(input.dataset.taskDone)].done = input.checked;
  });
}
