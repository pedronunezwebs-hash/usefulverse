import { ganttPlanToCsv, parseGanttTasks, positionGanttTasks } from './gantt-chart-logic.mjs';

const STORAGE_KEY = 'usefulverse:gantt-plan:v1';
const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');

export function setupGanttChart(root) {
  const $ = (selector) => root.querySelector(selector);
  const input = $('[data-gantt-input]');
  const results = $('[data-gantt-results]');
  const status = $('[data-gantt-status]');
  const download = $('[data-gantt-download]');
  const print = $('[data-gantt-print]');
  const language = document.documentElement.lang || 'en';
  const say = (key, values = {}) => (window.usefulverseLocale?.runtime?.[key] ?? window.usefulverseLocale?.messages?.[key] ?? key)
    .replace(/\{(\w+)\}/gu, (match, name) => Object.hasOwn(values, name) ? String(values[name]) : match);
  let plan = null;
  let csv = '';

  const setStatus = (message, kind = 'success') => {
    status.textContent = message;
    status.className = `tool-status is-${kind}`;
  };
  const render = () => {
    const positioned = positionGanttTasks(plan);
    const dateFormat = new Intl.DateTimeFormat(language, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
    const startText = dateFormat.format(new Date(plan.start));
    const endText = dateFormat.format(new Date(plan.end));
    results.innerHTML = `<div class="gantt-maker__summary"><strong>${escapeHtml(say('Project timeline'))}</strong><span>${escapeHtml(startText)} – ${escapeHtml(endText)}</span><span>${escapeHtml(say('{count} tasks', { count: plan.tasks.length }))}</span></div><div class="gantt-maker__axis" aria-hidden="true"><span>${escapeHtml(startText)}</span><span>${escapeHtml(endText)}</span></div><ol class="gantt-maker__rows">${positioned.map((task) => `<li class="gantt-maker__row"><div class="gantt-maker__task"><span class="gantt-maker__number">${task.id}</span><strong>${escapeHtml(task.name)}</strong><small>${escapeHtml(dateFormat.format(new Date(task.startMs)))} · ${escapeHtml(say('{count} days', { count: task.duration }))}${task.dependencyTask ? ` · ${escapeHtml(say('Depends on {task}', { task: task.dependencyTask }))}` : ''}</small></div><div class="gantt-maker__track" aria-label="${escapeHtml(task.name)}: ${escapeHtml(task.start)} to ${escapeHtml(task.end)}"><span class="gantt-maker__bar" style="inset-inline-start:${task.leftPercent}%;width:${task.widthPercent}%" title="${escapeHtml(task.start)} – ${escapeHtml(task.end)}"></span></div></li>`).join('')}</ol>`;
    csv = ganttPlanToCsv(plan);
    download.disabled = false;
    print.disabled = false;
  };
  const create = () => {
    try {
      plan = parseGanttTasks(input.value);
      render();
      setStatus(say('Gantt chart created in this browser.'));
    } catch (error) {
      plan = null;
      csv = '';
      download.disabled = true;
      print.disabled = true;
      setStatus(say(error.message) === error.message ? error.message : say(error.message), 'error');
      results.innerHTML = `<p class="tool-hint">${escapeHtml(say('Check the task lines and dates, then try again.'))}</p>`;
    }
  };
  $('[data-gantt-create]').addEventListener('click', create);
  $('[data-gantt-example]').addEventListener('click', () => {
    const base = new Date();
    base.setUTCHours(0, 0, 0, 0);
    const addDays = (offset) => new Date(base.getTime() + offset * 86_400_000).toISOString().slice(0, 10);
    input.value = `${say('Research')} | ${addDays(0)} | 2\n${say('Design')} | ${addDays(2)} | 3 | 1\n${say('Build')} | ${addDays(5)} | 5 | 2\n${say('Review')} | ${addDays(10)} | 2 | 3`;
    create();
  });
  $('[data-gantt-save]').addEventListener('click', () => {
    try {
      parseGanttTasks(input.value);
      localStorage.setItem(STORAGE_KEY, input.value);
      setStatus(say('Plan saved on this device.'));
    } catch (error) { setStatus(say(error.message), 'error'); }
  });
  $('[data-gantt-load]').addEventListener('click', () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return setStatus(say('No saved plan was found on this device.'), 'error');
      input.value = saved;
      create();
      if (plan) setStatus(say('Saved plan loaded.'));
    } catch { setStatus(say('Could not load the saved plan in this browser.'), 'error'); }
  });
  $('[data-gantt-delete]').addEventListener('click', () => {
    if (!confirm(say('Delete the saved plan from this device?'))) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      setStatus(say('Saved plan deleted from this device.'));
    } catch { setStatus(say('Could not delete the saved plan in this browser.'), 'error'); }
  });
  download.addEventListener('click', () => {
    if (!csv) return setStatus(say('Create a Gantt chart before downloading it.'), 'error');
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'usefulverse-gantt-plan.csv';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(say('CSV download started.'));
  });
  print.addEventListener('click', () => {
    if (!plan) return setStatus(say('Create a Gantt chart before printing it.'), 'error');
    const printWindow = window.open('', '_blank', 'width=1000,height=800');
    if (!printWindow) return setStatus(say('Allow this click to open a print preview, then try again.'), 'error');
    const title = say('Gantt chart');
    printWindow.document.write(`<!doctype html><html lang="${escapeHtml(language)}"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title><style>body{font:15px/1.5 system-ui,sans-serif;color:#172033;margin:32px}h1{font-size:24px}.gantt-maker__row{display:grid;grid-template-columns:minmax(230px,34%) 1fr;gap:16px;padding:10px 0;border-bottom:1px solid #ddd}.gantt-maker__track{position:relative;height:14px;background:#eef1f6;border-radius:9px}.gantt-maker__bar{position:absolute;top:0;bottom:0;background:#a9db32;border-radius:9px}.gantt-maker__task small{display:block;color:#626b7a}@media print{body{margin:12mm}}</style><h1>${escapeHtml(title)}</h1>${results.innerHTML}`);
    printWindow.addEventListener('load', () => printWindow.print(), { once: true });
    printWindow.document.close();
  });
}
