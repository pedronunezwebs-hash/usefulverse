import { comparePetAges } from './pet-age.mjs';

const root = document.querySelector('[data-market-tool="petAge"]');
const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
const fields = copy.fields;
const rows = root.querySelector('[data-pet-rows]');
const template = root.querySelector('[data-pet-template]');
const output = root.querySelector('[data-pet-results]');
const rowsNow = () => [...rows.querySelectorAll('[data-pet-row]')];

function refreshRows() {
  const current = rowsNow();
  current.forEach((row, index) => {
    row.querySelector('[data-pet-legend]').textContent = `${fields.pet} ${index + 1}`;
    row.querySelector('[data-dog-lifespan-field]').hidden = row.querySelector('[data-pet-species]').value !== 'dog';
    row.querySelector('[data-action="removePet"]').hidden = current.length === 1;
  });
}

function cell(text, tag = 'td') {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
}

function renderResults(results) {
  const table = document.createElement('table');
  const heading = document.createElement('tr');
  for (const label of [fields.tableName, fields.tableAnimal, fields.tableAge, fields.tableStage, fields.tableHuman, fields.tableExpectedLife]) heading.append(cell(label, 'th'));
  const head = document.createElement('thead'); head.append(heading); table.append(head);
  const body = document.createElement('tbody');
  const number = new Intl.NumberFormat(document.documentElement.lang, { maximumFractionDigits: 1 });
  for (const result of results) {
    const row = document.createElement('tr');
    const age = `${Math.floor(result.ageMonths / 12)} ${fields.ageYears} ${result.ageMonths % 12} ${fields.ageMonths}`;
    const comparison = result.humanEquivalentYears === null ? fields.noDogHumanYears : `${number.format(result.humanEquivalentYears)} ${fields.humanAge}`;
    const expectedLife = result.expectedLifespanYears === undefined ? '—' : `${number.format(result.expectedLifespanYears)} ${fields.ageYears}`;
    row.append(cell(result.name), cell(fields[result.species]), cell(age), cell(fields[result.lifeStage]), cell(comparison), cell(expectedLife));
    body.append(row);
  }
  table.append(body);
  const note = document.createElement('p'); note.className = 'hint';
  note.textContent = results.some(({ species }) => species === 'dog') ? fields.dogStageNote : fields.catStageNote;
  if (results.some(({ species }) => species === 'cat')) note.textContent += ` ${fields.interpolated}`;
  output.replaceChildren(table, note); output.hidden = false;
}

root.querySelector('[data-action="addPet"]').addEventListener('click', () => {
  if (rowsNow().length >= 5) return;
  const row = template.content.firstElementChild.cloneNode(true);
  rows.append(row); refreshRows(); row.querySelector('[data-pet-name]').focus();
});

rows.addEventListener('change', (event) => { if (event.target.matches('[data-pet-species]')) refreshRows(); });
rows.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action="removePet"]');
  if (button && rowsNow().length > 1) { button.closest('[data-pet-row]').remove(); refreshRows(); }
});

root.querySelector('[data-action="comparePets"]').addEventListener('click', () => {
  try {
    const pets = rowsNow().map((row) => {
      const years = Number(row.querySelector('[data-pet-years]').value);
      const months = Number(row.querySelector('[data-pet-months]').value);
      if (!Number.isInteger(years) || years < 0 || years > 25 || !Number.isInteger(months) || months < 0 || months > 11) throw new RangeError('Invalid age.');
      return { name: row.querySelector('[data-pet-name]').value, species: row.querySelector('[data-pet-species]').value, ageMonths: years * 12 + months, expectedLifespanYears: Number(row.querySelector('[data-pet-lifespan]').value) };
    });
    renderResults(comparePetAges(pets));
  } catch { output.hidden = false; output.textContent = copy.messages.invalid; }
});

refreshRows();
