import { choreScheduleToCsv, createChoreSchedule } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="chore-chart-maker"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const result = root.querySelector('[data-chore-result]');
  const scheduleElement = root.querySelector('[data-chore-schedule]');
  const loadsElement = root.querySelector('[data-chore-loads]');
  const summaryElement = root.querySelector('[data-chore-summary]');
  const spreadElement = root.querySelector('[data-chore-spread]');
  let currentSchedule;

  function addText(parent, tag, text, className) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text;
    parent.append(element);
    return element;
  }

  function renderSchedule(schedule) {
    scheduleElement.replaceChildren();
    for (const week of schedule.schedule) {
      const section = document.createElement('section');
      section.className = 'chore-week';
      addText(section, 'h3', `${copy.fields.weekLabel} ${week.week} · ${copy.fields.startsLabel}: ${week.startDate}`);
      const table = document.createElement('table');
      table.className = 'chore-table';
      const head = document.createElement('thead');
      const headerRow = document.createElement('tr');
      for (const title of [copy.fields.choreLabel, copy.fields.assignedToLabel, copy.fields.pointsLabel]) addText(headerRow, 'th', title);
      head.append(headerRow);
      const body = document.createElement('tbody');
      for (const assignment of week.assignments) {
        const row = document.createElement('tr');
        addText(row, 'td', assignment.chore);
        addText(row, 'td', assignment.person);
        addText(row, 'td', String(assignment.points));
        body.append(row);
      }
      table.append(head, body);
      section.append(table);
      scheduleElement.append(section);
    }
    loadsElement.replaceChildren();
    for (const load of schedule.loads) addText(loadsElement, 'li', `${load.person}: ${load.points}`);
    spreadElement.textContent = `${copy.fields.loadSpread}: ${schedule.loadSpread}`;
    summaryElement.textContent = `${schedule.people.length} ${copy.fields.people.toLocaleLowerCase()} · ${schedule.chores.length} ${copy.fields.chores.toLocaleLowerCase()} · ${schedule.weeks} ${copy.fields.weeks.toLocaleLowerCase()}`;
    result.hidden = false;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      currentSchedule = createChoreSchedule({
        people: form.elements.namedItem('people').value,
        chores: form.elements.namedItem('chores').value,
        startDate: form.elements.namedItem('startDate').value,
        weeks: form.elements.namedItem('weeks').value,
      });
      renderSchedule(currentSchedule);
      announce(root, copy.messages.generated, 'success');
    } catch (error) {
      const detail = String(error?.message ?? '');
      const message = /member|people|household/iu.test(detail) ? copy.messages.invalidPeople
        : /chore|effort|points/iu.test(detail) ? copy.messages.invalidChores
          : /week/iu.test(detail) ? copy.messages.invalidWeeks : copy.messages.invalidDate;
      announce(root, message, 'error');
    }
  });

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('people').value = copy.examplePeople;
    form.elements.namedItem('chores').value = copy.exampleChores;
    form.elements.namedItem('weeks').value = '4';
    const today = new Date();
    const daysUntilMonday = (8 - today.getDay()) % 7;
    today.setDate(today.getDate() + daysUntilMonday);
    form.elements.namedItem('startDate').value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    announce(root, copy.messages.generated, 'info');
  });

  form.addEventListener('reset', () => {
    currentSchedule = undefined;
    if (result) result.hidden = true;
    announce(root, '');
  });

  root.querySelector('[data-action="print"]')?.addEventListener('click', () => {
    if (currentSchedule) window.print();
  });

  root.querySelector('[data-action="download-csv"]')?.addEventListener('click', () => {
    if (!currentSchedule) return;
    const url = URL.createObjectURL(new Blob([choreScheduleToCsv(currentSchedule)], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chore-chart.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce(root, copy.messages.downloaded, 'success');
  });
}
