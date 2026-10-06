import { csvCell, decisionTotals, normalizeDecisionMatrix, packingEssentials, validateWorkoutExercise } from './local-planners-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);
const fallbackSay = (key) => window.usefulverseLocale?.runtime?.[key] ?? window.usefulverseLocale?.messages?.[key] ?? key;
const setStatus = (root, message, type = '') => { const status = $('#op-status', root); if (status) { status.textContent = root.plannerSay?.(message) ?? fallbackSay(message); status.className = 'tool-status' + (type ? ' is-' + type : ''); } };
const downloadText = (text, filename, type = 'text/plain;charset=utf-8') => {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export function setupLocalPlanningTools(root) {
  const engine = root.dataset.opEngine;
  const localMessages = JSON.parse(root.dataset.plannerMessages || '{}');
  const say = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), localMessages[key] ?? fallbackSay(key));
  root.plannerSay = say;
  const status = (message, type = '') => setStatus(root, message, type);
  if (engine === 'packing-list') {
    let items = [];
    const render = () => {
      const list = $('[data-packing-list]', root); list.replaceChildren();
      items.forEach((item, index) => {
        const li = document.createElement('li'); li.className = 'op-planner__row';
        const label = document.createElement('label'); label.className = 'checkbox-label';
        const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.checked = item.packed; checkbox.dataset.packingToggle = String(index);
        const text = document.createElement('span'); text.textContent = `${item.name} · ${item.category}`;
        label.append(checkbox, text); li.append(label);
        const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'button button--ghost'; remove.dataset.packingRemove = String(index); remove.textContent = say('Remove'); li.append(remove); list.append(li);
      });
      $('[data-packing-progress]', root).textContent = `${items.filter((item) => item.packed).length} / ${items.length}`;
    };
    $('[data-packing-form]', root).addEventListener('submit', (event) => {
      event.preventDefault();
      const name = $('[data-packing-item]', root).value.trim();
      if (!name || [...name].length > 120) return status('Enter an item name up to 120 characters.', 'error');
      if (items.length >= 200) return status('A checklist can contain up to 200 items.', 'error');
      items.push({ name, category: $('[data-packing-category]', root).value, packed: false });
      $('[data-packing-item]', root).value = ''; render(); status('Item added to your list.', 'success');
    });
    root.addEventListener('click', (event) => {
      const toggle = event.target.closest('[data-packing-toggle]'); if (toggle) { items[Number(toggle.dataset.packingToggle)].packed = toggle.checked; render(); }
      const remove = event.target.closest('[data-packing-remove]'); if (remove) { items.splice(Number(remove.dataset.packingRemove), 1); render(); }
      if (event.target.closest('[data-packing-sample]')) { for (const [name, category] of packingEssentials) if (!items.some((item) => item.name === name)) items.push({ name, category, packed: false }); render(); status('Common essentials added. Review this list for your trip.', 'success'); }
      if (event.target.closest('[data-packing-clear]')) { items = []; render(); status('Checklist cleared.'); }
      if (event.target.closest('[data-packing-export]')) {
        if (!items.length) return status('Add at least one item before downloading.', 'error');
        const trip = $('[data-packing-trip]', root).value.trim() || 'packing-list';
        const rows = [['Item', 'Category', 'Packed'], ...items.map(({ name, category, packed }) => [name, category, packed ? 'yes' : 'no'])];
        downloadText(rows.map((row) => row.map(csvCell).join(',')).join('\r\n'), `${trip.replace(/[^\p{L}\p{N}-]+/gu, '-').slice(0, 50)}.csv`, 'text/csv;charset=utf-8'); status('Checklist download started.', 'success');
      }
    });
    return;
  }
  if (engine === 'decision-matrix') {
    let matrix = null;
    const render = () => {
      const head = $('[data-decision-head]', root); const body = $('[data-decision-body]', root); head.replaceChildren(); body.replaceChildren();
      if (!matrix) return;
      const header = document.createElement('tr');
      for (const value of [say('Option'), ...matrix.criteria.map((criterion) => `${criterion.name} (×${criterion.weight})`), say('Weighted score')]) { const th = document.createElement('th'); th.scope = 'col'; th.textContent = value; header.append(th); }
      head.append(header);
      const totals = decisionTotals(matrix);
      matrix.options.forEach((option, rowIndex) => {
        const row = document.createElement('tr'); const name = document.createElement('th'); name.scope = 'row'; name.textContent = option; row.append(name);
        matrix.criteria.forEach((criterion, columnIndex) => {
          const cell = document.createElement('td'); const input = document.createElement('input'); input.type = 'number'; input.min = '0'; input.max = '10'; input.step = '1'; input.value = String(matrix.scores[rowIndex][columnIndex]); input.dataset.decisionScore = `${rowIndex}:${columnIndex}`; input.setAttribute('aria-label', `${option}: ${criterion.name}, ${say('score from 0 to 10')}`); input.className = 'tool-input'; cell.append(input); row.append(cell);
        });
        const total = document.createElement('td'); total.textContent = `${totals[rowIndex].toFixed(2)} / 10`; row.append(total); body.append(row);
      });
      $('[data-decision-result]', root).hidden = false;
    };
    $('[data-decision-build]', root).addEventListener('click', () => {
      try { matrix = normalizeDecisionMatrix($('[data-decision-options]', root).value, $('[data-decision-criteria]', root).value); render(); status('Comparison created. Change scores from 0 to 10.', 'success'); }
      catch (error) { matrix = null; $('[data-decision-result]', root).hidden = true; status(error instanceof Error ? error.message : 'Check your options and criteria.', 'error'); }
    });
    root.addEventListener('input', (event) => {
      const input = event.target.closest('[data-decision-score]'); if (!input || !matrix) return;
      const [row, column] = input.dataset.decisionScore.split(':').map(Number); const score = Number(input.value);
      if (!Number.isInteger(score) || score < 0 || score > 10) { input.setAttribute('aria-invalid', 'true'); return; }
      input.removeAttribute('aria-invalid'); matrix.scores[row][column] = score;
      input.closest('tr').lastElementChild.textContent = `${decisionTotals(matrix)[row].toFixed(2)} / 10`;
    });
    root.addEventListener('click', (event) => {
      if (!event.target.closest('[data-decision-export]')) return;
      if (!matrix) return status('Build a comparison first.', 'error');
      const totals = decisionTotals(matrix); const rows = [[say('Option'), ...matrix.criteria.map((item) => `${item.name} (weight ${item.weight})`), say('Weighted score')], ...matrix.options.map((name, index) => [name, ...matrix.scores[index], totals[index].toFixed(2)])];
      downloadText(rows.map((row) => row.map(csvCell).join(',')).join('\r\n'), 'decision-matrix.csv', 'text/csv;charset=utf-8'); status('CSV download started.', 'success');
    });
    return;
  }
  if (engine === 'workout-planner') {
    let exercises = [];
    const list = $('[data-workout-list]', root);
    const render = () => {
      list.replaceChildren();
      exercises.forEach((item, index) => {
        const li = document.createElement('li'); li.className = 'op-planner__row';
        const text = document.createElement('span'); text.textContent = `${item.name} — ${item.sets} × ${item.reps} · ${item.rest}s ${say('rest')}`; li.append(text);
        const remove = document.createElement('button'); remove.className = 'button button--ghost'; remove.type = 'button'; remove.dataset.workoutRemove = String(index); remove.textContent = say('Remove'); li.append(remove); list.append(li);
      });
    };
    $('[data-workout-form]', root).addEventListener('submit', (event) => {
      event.preventDefault();
      try {
        exercises.push(validateWorkoutExercise({ name: $('[data-workout-name]', root).value, sets: $('[data-workout-sets]', root).value, reps: $('[data-workout-reps]', root).value, rest: $('[data-workout-rest]', root).value }));
        if (exercises.length > 80) { exercises.pop(); throw new RangeError('A workout can contain up to 80 exercises.'); }
        $('[data-workout-name]', root).value = ''; render(); status('Exercise added to your workout.', 'success');
      } catch (error) { status(error instanceof Error ? error.message : 'Check the exercise details.', 'error'); }
    });
    root.addEventListener('click', (event) => {
      const remove = event.target.closest('[data-workout-remove]'); if (remove) { exercises.splice(Number(remove.dataset.workoutRemove), 1); render(); }
      if (event.target.closest('[data-workout-clear]')) { exercises = []; render(); status('Workout cleared.'); }
      if (event.target.closest('[data-workout-export]')) {
        if (!exercises.length) return status('Add an exercise before downloading.', 'error');
        const rows = [['Exercise', 'Sets', 'Reps per set', 'Rest seconds'], ...exercises.map(({ name, sets, reps, rest }) => [name, sets, reps, rest])]; downloadText(rows.map((row) => row.map(csvCell).join(',')).join('\r\n'), 'workout-plan.csv', 'text/csv;charset=utf-8'); status('Workout download started.', 'success');
      }
      if (event.target.closest('[data-workout-print]')) {
        if (!exercises.length) return status('Add an exercise before printing.', 'error');
        const lines = exercises.map((item, index) => `${index + 1}. ${item.name} — ${item.sets} × ${item.reps}, ${item.rest}s rest`).join('\n');
        const w = window.open('', '_blank', 'width=780,height=800'); if (!w) return status('Allow this click to open the print view, then try again.', 'error');
        const pre = w.document.createElement('pre'); pre.textContent = lines; w.document.title = say('Workout plan'); w.document.body.append(pre); w.addEventListener('load', () => w.print(), { once: true });
      }
    });
  }
}
