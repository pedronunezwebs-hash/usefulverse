import { announce } from '../controller-helpers.mjs';
import { addWeeklyBlock, exportWeeklyPlan, findWeeklyOverlaps, importWeeklyPlan, removeWeeklyBlock } from './logic.mjs';

const root = document.querySelector('[data-tool="weekly-planner"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
  const status = root.querySelector('[data-status]');
  const list = root.querySelector('[data-weekly-blocks]');
  const inputFile = form.elements.namedItem('backupFile');
  let blocks = [];

  function render() {
    list.replaceChildren();
    if (!blocks.length) { const empty = document.createElement('p'); empty.textContent = copy.fields.empty; list.append(empty); return; }
    const overlaps = findWeeklyOverlaps(blocks);
    const overlapIds = new Set(overlaps.flatMap(({ blockIds }) => blockIds));
    for (let day = 0; day < 7; day += 1) {
      const dayBlocks = blocks.filter((block) => block.day === day).sort((a, b) => a.startMinutes - b.startMinutes);
      if (!dayBlocks.length) continue;
      const section = document.createElement('section'); section.className = 'weekly-planner__day';
      const heading = document.createElement('h3'); heading.textContent = copy.fields[['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][day]]; section.append(heading);
      const items = document.createElement('ul');
      for (const block of dayBlocks) {
        const item = document.createElement('li'); item.dataset.overlap = String(overlapIds.has(block.id));
        const summary = document.createElement('span');
        const category = copy.fields[block.category] ?? copy.fields.other;
        summary.textContent = `${block.start}–${block.end}${block.overnight ? ` · ${copy.fields.overnight}` : ''} · ${block.title} · ${category}${overlapIds.has(block.id) ? ` · ${copy.fields.overlap}` : ''}`;
        const remove = document.createElement('button'); remove.type = 'button'; remove.dataset.removeId = block.id; remove.textContent = copy.actions.removeBlock;
        item.append(summary, remove); items.append(item);
      }
      section.append(items); list.append(section);
    }
  }

  function announceSchedule() {
    const overlap = findWeeklyOverlaps(blocks).length > 0;
    announce(root, overlap ? copy.messages.overlapFound : copy.messages.noOverlap, overlap ? 'warning' : 'success');
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      blocks = [...addWeeklyBlock(blocks, {
        day: form.elements.namedItem('day').value,
        title: form.elements.namedItem('title').value,
        start: form.elements.namedItem('start').value,
        end: form.elements.namedItem('end').value,
        category: form.elements.namedItem('category').value,
      })];
      form.elements.namedItem('title').value = '';
      render(); announceSchedule();
    } catch { announce(root, copy.messages.checkInputs, 'error'); }
  });
  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove-id]');
    if (!button) return;
    blocks = [...removeWeeklyBlock(blocks, button.dataset.removeId)]; render();
    announce(root, copy.messages.removed, 'success');
  });
  root.querySelector('[data-action="download"]')?.addEventListener('click', () => {
    try {
      const url = URL.createObjectURL(new Blob([exportWeeklyPlan(blocks)], { type: 'application/json;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = 'usefulverse-weekly-plan.json'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 0); announce(root, copy.messages.downloaded, 'success');
    } catch { announce(root, copy.messages.checkInputs, 'error'); }
  });
  root.querySelector('[data-action="import"]')?.addEventListener('click', () => inputFile.click());
  inputFile.addEventListener('change', async () => {
    const file = inputFile.files?.[0]; if (!file) return;
    try {
      if (file.size > 100_000) throw new RangeError('large');
      blocks = [...importWeeklyPlan(await file.text())]; render();
      announce(root, copy.messages.imported, 'success');
    } catch { announce(root, copy.messages.importFailed, 'error'); }
    finally { inputFile.value = ''; }
  });
  root.querySelector('[data-action="print"]')?.addEventListener('click', () => window.print());
  root.querySelector('[data-action="reset"]')?.addEventListener('click', () => { blocks = []; render(); announce(root, copy.messages.cleared, 'success'); });
  render();
}
