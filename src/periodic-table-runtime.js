import { checkElementAnswer, chooseQuizElement, compareElements as validateComparison, elements, filterElements } from './periodic-table-logic.mjs';

export function setupPeriodicTable(root) {
  const messages = (() => { try { return JSON.parse(root.dataset.plannerMessages || '{}'); } catch { return {}; } })();
  const t = (key) => messages[key] ?? key;
  const $ = (selector) => root.querySelector(selector);
  const search = $('[data-periodic-search]'); const family = $('[data-periodic-family]'); const group = $('[data-periodic-group]');
  const grid = $('[data-periodic-grid]'); const detail = $('[data-periodic-details]'); const compare = $('[data-periodic-compare]');
  const count = $('[data-periodic-count]'); const status = $('#op-status');
  const selectedForCompare = new Set(); let activeQuestion = null;
  const node = (tag, text, className) => { const item = document.createElement(tag); if (text !== undefined) item.textContent = text; if (className) item.className = className; return item; };
  const localizedName = (element) => t(element.name);
  const refreshCompare = () => {
    compare.replaceChildren();
    for (const element of (selectedForCompare.size >= 2 ? validateComparison([...selectedForCompare]) : [])) {
      const row = node('p', `${element.number}. ${element.symbol} — ${localizedName(element)}`); compare.append(row);
    }
  };
  const renderDetails = (element) => {
    detail.replaceChildren();
    const dl = node('dl', undefined, 'periodic-table__details');
    for (const [label, value] of [['Atomic number', element.number], ['Symbol', element.symbol], ['Name', localizedName(element)], ['Group', element.group], ['Period', element.period], ['Family', t(element.family)]]) {
      dl.append(node('dt', t(label)), node('dd', String(value)));
    }
    const button = node('button', t(selectedForCompare.has(element.number) ? 'Remove from comparison' : 'Add to comparison'), 'button button--ghost');
    button.type = 'button'; button.dataset.periodicCompareOne = String(element.number);
    button.disabled = !selectedForCompare.has(element.number) && selectedForCompare.size >= 3;
    detail.append(dl, button);
  };
  const render = () => {
    const filtered = filterElements({ query: search.value, family: family.value, group: group.value }, Object.fromEntries(elements.map((element) => [element.name, localizedName(element)])));
    grid.replaceChildren();
    for (const element of filtered) {
      const item = node('div'); item.setAttribute('role', 'listitem');
      item.style.gridColumnStart = String(element.number >= 57 && element.number <= 71 ? element.number - 54 : element.number >= 89 && element.number <= 103 ? element.number - 86 : element.group);
      item.style.gridRowStart = String(element.number >= 57 && element.number <= 71 ? 8 : element.number >= 89 && element.number <= 103 ? 9 : element.period);
      const card = node('button', undefined, `periodic-table__element periodic-table__element--${element.family.toLowerCase()}`);
      card.type = 'button'; card.dataset.periodicElement = String(element.number);
      card.setAttribute('aria-label', `${element.number}. ${localizedName(element)} (${element.symbol}), ${t('Group')} ${element.group}, ${t('Period')} ${element.period}`);
      card.append(node('span', String(element.number), 'periodic-table__number'), node('strong', element.symbol, 'periodic-table__symbol'), node('span', localizedName(element), 'periodic-table__name'));
      item.append(card); grid.append(item);
    }
    count.textContent = `${filtered.length} / 118`;
    if (!filtered.length) status.textContent = t('No elements match these filters.');
    else if (!detail.querySelector('dl')) status.textContent = t('Use a group or period to explore the table.');
  };
  const showQuestion = () => {
    activeQuestion = chooseQuizElement();
    $('[data-periodic-question]').textContent = t('What is the symbol for atomic number {number}?').replace('{number}', String(activeQuestion.number));
    $('[data-periodic-answer]').value = '';
    $('[data-periodic-answer]').focus();
    status.textContent = '';
  };
  search.addEventListener('input', render); family.addEventListener('change', render); group.addEventListener('change', render);
  $('[data-periodic-reset]').addEventListener('click', () => { search.value = ''; family.value = 'all'; group.value = 'all'; render(); search.focus(); });
  grid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-periodic-element]'); if (!button) return;
    const element = elements[Number(button.dataset.periodicElement) - 1]; renderDetails(element);
    status.textContent = `${localizedName(element)} (${element.symbol})`;
  });
  detail.addEventListener('click', (event) => {
    const button = event.target.closest('[data-periodic-compare-one]'); if (!button) return;
    const number = Number(button.dataset.periodicCompareOne);
    if (selectedForCompare.has(number)) selectedForCompare.delete(number);
    else if (selectedForCompare.size < 3) selectedForCompare.add(number);
    renderDetails(elements[number - 1]); refreshCompare();
  });
  $('[data-periodic-compare-clear]').addEventListener('click', () => { selectedForCompare.clear(); compare.replaceChildren(); const selected = detail.querySelector('[data-periodic-compare-one]'); if (selected) renderDetails(elements[Number(selected.dataset.periodicCompareOne) - 1]); });
  $('[data-periodic-quiz-start]').addEventListener('click', () => { $('[data-periodic-quiz]').hidden = false; showQuestion(); });
  $('[data-periodic-next]').addEventListener('click', showQuestion);
  $('[data-periodic-check]').addEventListener('click', () => {
    const answer = $('[data-periodic-answer]').value;
    if (checkElementAnswer(activeQuestion, answer)) status.textContent = t('Correct!');
    else status.textContent = t('Try again. The symbol is {symbol}.').replace('{symbol}', activeQuestion.symbol);
  });
  $('[data-periodic-answer]').addEventListener('keydown', (event) => { if (event.key === 'Enter') $('[data-periodic-check]').click(); });
  render();
}
