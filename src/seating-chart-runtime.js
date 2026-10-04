import { createSeatingPlan, moveGuestToTable, parseGuestNames, validateSeatingPlan } from './seating-chart-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);
const STORAGE_KEY = 'usefulverse-seating-chart-v1';
const say = (phrase) => window.usefulverseLocale?.runtime?.[phrase] ?? window.usefulverseLocale?.messages?.[phrase] ?? phrase;

export function setupSeatingChart(root) {
  const guestInput = $('[data-seating-guests]', root);
  const tableCount = $('[data-seating-table-count]', root);
  const seatsInput = $('[data-seating-seats]', root);
  const createButton = $('[data-seating-create]', root);
  const shuffleButton = $('[data-seating-shuffle]', root);
  const saveButton = $('[data-seating-save]', root);
  const loadButton = $('[data-seating-load]', root);
  const deleteButton = $('[data-seating-delete]', root);
  const downloadButton = $('[data-seating-download]', root);
  const printButton = $('[data-seating-print]', root);
  const status = $('[data-seating-status]', root);
  const results = $('[data-seating-results]', root);
  let plan = null;

  function setActions(enabled) {
    shuffleButton.disabled = !enabled;
    saveButton.disabled = !enabled;
    downloadButton.disabled = !enabled;
    printButton.disabled = !enabled;
  }

  function drawPlan() {
    results.replaceChildren();
    if (!plan) {
      const empty = document.createElement('p');
      empty.className = 'tool-hint';
      empty.textContent = say('Your seating plan will appear here.');
      results.append(empty);
      setActions(false);
      return;
    }
    const allGuests = plan.tables.flatMap((table) => table.guests);
    for (const table of plan.tables) {
      const card = document.createElement('article');
      card.className = 'seating-chart__table';
      const heading = document.createElement('h3');
      heading.textContent = `${say('Table')} ${table.id}`;
      const summary = document.createElement('p');
      summary.className = 'tool-hint';
      summary.textContent = `${table.guests.length} / ${plan.seatsPerTable} ${say('seats filled')}`;
      const list = document.createElement('ul');
      list.className = 'seating-chart__guest-list';
      for (const guest of table.guests) {
        const item = document.createElement('li');
        const name = document.createElement('span');
        name.textContent = guest.name;
        const move = document.createElement('select');
        move.className = 'tool-input seating-chart__move';
        move.setAttribute('aria-label', `${say('Move guest')} ${guest.name} ${say('to table')}`);
        for (const optionTable of plan.tables) {
          const option = document.createElement('option');
          option.value = String(optionTable.id);
          option.textContent = `${say('Table')} ${optionTable.id}`;
          option.selected = optionTable.id === table.id;
          option.disabled = optionTable.id !== table.id && optionTable.guests.length >= plan.seatsPerTable;
          move.append(option);
        }
        move.addEventListener('change', () => {
          try {
            plan = moveGuestToTable(plan, guest.id, move.value);
            guestInput.value = plan.tables.flatMap((entry) => entry.guests).map((entry) => entry.name).join('\n');
            drawPlan();
            status.textContent = '';
          } catch {
            move.value = String(table.id);
            status.textContent = say('That table is full.');
          }
        });
        item.append(name, move);
        list.append(item);
      }
      if (!table.guests.length) {
        const empty = document.createElement('li');
        empty.className = 'tool-hint';
        empty.textContent = say('No guests assigned.');
        list.append(empty);
      }
      card.append(heading, summary, list);
      results.append(card);
    }
    guestInput.value = allGuests.map(({ name }) => name).join('\n');
    tableCount.value = String(plan.tables.length);
    seatsInput.value = String(plan.seatsPerTable);
    setActions(true);
  }

  function arrange(guests = guestInput.value) {
    try {
      plan = createSeatingPlan({ guests, tableCount: tableCount.value, seatsPerTable: seatsInput.value });
      drawPlan();
      status.textContent = say('Seating plan created. You can move guests between tables.');
    } catch (error) {
      const message = String(error?.message ?? '');
      if (/at least one guest/u.test(message)) status.textContent = say('Add at least one guest name, one per line.');
      else if (/no more than/u.test(message)) status.textContent = say('Use no more than 200 guests.');
      else if (/100 characters/u.test(message)) status.textContent = say('Guest names must be 100 characters or fewer.');
      else if (/Table count/u.test(message)) status.textContent = say('Table count must be a whole number from 1 to 40.');
      else if (/Seats per table/u.test(message)) status.textContent = say('Seats per table must be a whole number from 1 to 20.');
      else if (/Capacity is/u.test(message)) {
        const [, capacity, guestsCount] = message.match(/Capacity is (\d+); there are (\d+) guests/u) ?? [];
        status.textContent = capacity ? `${say('Capacity')}: ${capacity}. ${say('Guests')}: ${guestsCount}.` : say('Check the guest list and table sizes, then try again.');
      } else status.textContent = say('Check the guest list and table sizes, then try again.');
    }
  }

  createButton.addEventListener('click', () => arrange());
  shuffleButton.addEventListener('click', () => {
    if (plan) arrange(plan.tables.flatMap((table) => table.guests));
  });
  saveButton.addEventListener('click', () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validateSeatingPlan(plan)));
      status.textContent = say('Plan saved on this device.');
    } catch {
      status.textContent = say('Could not save the plan in this browser. Check available storage.');
    }
  });
  loadButton.addEventListener('click', () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) { status.textContent = say('No saved plan was found on this device.'); return; }
      plan = validateSeatingPlan(JSON.parse(saved));
      drawPlan();
      status.textContent = say('Saved plan loaded.');
    } catch {
      status.textContent = say('The saved plan could not be read.');
    }
  });
  deleteButton.addEventListener('click', () => {
    try {
      if (!window.confirm(say('Delete the saved seating plan from this device?'))) return;
      localStorage.removeItem(STORAGE_KEY);
      status.textContent = say('Saved plan deleted from this device.');
    } catch {
      status.textContent = say('Could not delete the saved plan in this browser.');
    }
  });
  downloadButton.addEventListener('click', () => {
    try {
      const safePlan = validateSeatingPlan(plan);
      const url = URL.createObjectURL(new Blob([JSON.stringify(safePlan, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'usefulverse-seating-plan.json';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = say('Plan download started.');
    } catch {
      status.textContent = say('The seating plan is not ready to download.');
    }
  });
  printButton.addEventListener('click', () => window.print());
  drawPlan();
}
