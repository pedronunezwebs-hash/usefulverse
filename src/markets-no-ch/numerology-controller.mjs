import { calculateNumerology } from './numerology.mjs';

const root = document.querySelector('[data-market-tool="numerology"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent).fields;
  const input = (id) => root.querySelector(`#${id}`);
  const status = root.querySelector('[data-numerology-status]');
  const results = root.querySelector('[data-numerology-results]');
  const tableBody = root.querySelector('[data-numerology-table] tbody');
  const unsupported = root.querySelector('[data-numerology-unsupported]');
  const download = root.querySelector('[data-action="downloadNumerology"]');
  const print = root.querySelector('[data-action="printNumerology"]');
  let rows = [];

  function addRow(label, result, mappedLetters = []) {
    const tr = document.createElement('tr');
    const heading = document.createElement('th'); heading.scope = 'row'; heading.textContent = label;
    const value = document.createElement('td');
    const reduction = result.steps.join(' → ');
    const mapping = mappedLetters.length
      ? `${mappedLetters.map(({ letter, value: number }) => `${letter}=${number}`).join(' + ')} = ${mappedLetters.reduce((sum, item) => sum + item.value, 0)}`
      : '';
    const details = [reduction, mapping].filter(Boolean).join('; ');
    value.textContent = `${result.value} — ${details}`;
    tr.append(heading, value);
    tableBody.append(tr);
    rows.push([label, String(result.value), details]);
  }

  function calculate() {
    if (!input('numerology-birth-date').checkValidity()) {
      input('numerology-birth-date').reportValidity();
      status.textContent = copy.invalid;
      status.classList.add('result--error');
      return;
    }
    try {
      const result = calculateNumerology({ birthDate: input('numerology-birth-date').value, name: input('numerology-name').value });
      tableBody.replaceChildren(); rows = [];
      addRow(copy.lifePath, result.lifePath);
      addRow(copy.birthday, result.birthday);
      if (result.nameNumbers) {
        addRow(copy.expression, result.nameNumbers.expression, result.nameNumbers.letterValues);
        addRow(copy.soulUrge, result.nameNumbers.soulUrge, result.nameNumbers.letterValues.filter(({ kind }) => kind === 'vowel'));
        addRow(copy.personality, result.nameNumbers.personality, result.nameNumbers.letterValues.filter(({ kind }) => kind === 'consonant'));
      }
      const unsupportedText = result.unsupportedLetters.length
        ? `${copy.unsupported} ${result.unsupportedLetters.join(' ')}`
        : result.nameWasProvided && !result.nameNumbers ? copy.noSupportedName : '';
      unsupported.textContent = unsupportedText;
      unsupported.hidden = !unsupportedText;
      results.hidden = false;
      status.textContent = copy.results;
      status.classList.remove('result--error');
      download.disabled = false;
      print.disabled = false;
    } catch {
      results.hidden = true;
      status.textContent = copy.invalid;
      status.classList.add('result--error');
      download.disabled = true;
      print.disabled = true;
    }
  }

  function csvCell(value) { return `"${String(value).replaceAll('"', '""')}"`; }

  root.querySelector('[data-action="calculateNumerology"]').addEventListener('click', calculate);
  root.querySelector('[data-action="sampleNumerology"]').addEventListener('click', () => {
    input('numerology-birth-date').value = '1990-06-15';
    input('numerology-name').value = 'Anna';
    calculate();
  });
  root.querySelector('[data-action="clearNumerology"]').addEventListener('click', () => {
    input('numerology-birth-date').value = '';
    input('numerology-name').value = '';
    tableBody.replaceChildren(); rows = [];
    results.hidden = true;
    unsupported.hidden = true;
    status.textContent = copy.ready;
    status.classList.remove('result--error');
    download.disabled = true;
    print.disabled = true;
    input('numerology-birth-date').focus();
  });
  download.addEventListener('click', () => {
    if (!rows.length) return;
    const content = [copy.csvHeader, ...rows.map((row) => row.map(csvCell).join(','))].join('\r\n');
    const url = URL.createObjectURL(new Blob([`\uFEFF${content}\r\n`], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'numerology-calculation.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  });
  print.addEventListener('click', () => { if (rows.length) window.print(); });
}
