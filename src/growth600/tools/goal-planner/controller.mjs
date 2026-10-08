import { createGoalPlan, goalDaysRemaining, recordGoalProgress, restoreGoalPlan, setGoalMilestoneComplete } from './logic.mjs';
import { announce, clearResult, copyText, readToolCopy } from '../controller-helpers.mjs';

const STORAGE_KEY = 'usefulverse:goal-planner:v1';
const root = document.querySelector('[data-tool="goal-planner"]');

if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const resultSection = root.querySelector('[data-result]');
  const summary = root.querySelector('[data-summary]');
  const progressBar = root.querySelector('[data-progress-bar]');
  const progressCopy = root.querySelector('[data-progress-copy]');
  const milestoneList = root.querySelector('[data-milestones]');
  let plan = null;

  const localToday = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };
  const addDays = (dateText, amount) => {
    const date = new Date(`${dateText}T12:00:00`);
    date.setDate(date.getDate() + amount);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  const formatNumber = (value) => new Intl.NumberFormat(document.documentElement.lang || 'en', { maximumFractionDigits: 2 }).format(value);

  function saveLocal() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
      announce(root, copy.messages.saved, 'success');
    } catch {
      announce(root, copy.messages.storageUnavailable, 'error');
    }
  }

  function fillForm(value) {
    for (const key of ['title', 'outcome', 'metric', 'unit', 'startValue', 'targetValue', 'currentValue', 'startDate', 'currentDate', 'dueDate']) {
      form.elements.namedItem(key).value = value[key] ?? '';
    }
    form.elements.namedItem('milestones').value = value.milestones.map(({ date, label }) => `${date} | ${label}`).join('\n');
  }

  function showPlan() {
    if (!plan) return;
    resultSection.hidden = false;
    summary.textContent = `${plan.title}: ${plan.outcome}`;
    progressBar.value = plan.progressPercent;
    progressBar.setAttribute('aria-valuetext', `${formatNumber(plan.progressPercent)}%`);
    const remaining = goalDaysRemaining(plan, localToday());
    progressCopy.textContent = `${copy.messages.current}: ${formatNumber(plan.currentValue)} ${plan.unit} · ${formatNumber(plan.progressPercent)}% · ${remaining} ${remaining === 1 ? copy.messages.day : copy.messages.days} ${copy.messages.remaining}`;
    const milestoneItems = plan.milestones.map((milestone, index) => {
      const item = document.createElement('li');
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = milestone.complete;
      checkbox.dataset.milestoneIndex = String(index);
      const text = document.createElement('span');
      text.textContent = `${milestone.date} — ${milestone.label}`;
      label.append(checkbox, text);
      item.append(label);
      return item;
    });
    milestoneList.replaceChildren(...milestoneItems);
  }

  function generate(event) {
    event?.preventDefault();
    clearResult(root);
    try {
      plan = createGoalPlan({
        title: form.elements.namedItem('title').value,
        outcome: form.elements.namedItem('outcome').value,
        metric: form.elements.namedItem('metric').value,
        unit: form.elements.namedItem('unit').value,
        startValue: form.elements.namedItem('startValue').value,
        targetValue: form.elements.namedItem('targetValue').value,
        currentValue: form.elements.namedItem('currentValue').value,
        startDate: form.elements.namedItem('startDate').value,
        currentDate: form.elements.namedItem('currentDate').value,
        dueDate: form.elements.namedItem('dueDate').value,
        milestones: form.elements.namedItem('milestones').value,
      });
      showPlan();
      saveLocal();
    } catch {
      plan = null;
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    const start = localToday();
    const due = addDays(start, 90);
    fillForm({
      title: 'Run a 10K', outcome: 'Finish a 10K race in under 60 minutes', metric: 'Race time', unit: 'minutes',
      startValue: 75, targetValue: 60, currentValue: 75, startDate: start, currentDate: start, dueDate: due,
      milestones: [30, 60].map((days, index) => ({ date: addDays(start, days), label: index ? 'Complete an 8K training run' : 'Complete a 5K training run' })),
    });
  });

  form.addEventListener('submit', generate);
  form.addEventListener('reset', () => setTimeout(() => {
    plan = null;
    clearResult(root);
    milestoneList.replaceChildren();
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* The in-memory form remains usable. */ }
    announce(root, '');
  }, 0));

  root.querySelector('[data-action="update-progress"]')?.addEventListener('click', () => {
    if (!plan) return;
    try {
      plan = recordGoalProgress(plan, form.elements.namedItem('currentValue').value, form.elements.namedItem('currentDate').value);
      fillForm(plan);
      showPlan();
      saveLocal();
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  });

  milestoneList.addEventListener('change', (event) => {
    const checkbox = event.target.closest('input[data-milestone-index]');
    if (!checkbox || !plan) return;
    try {
      plan = setGoalMilestoneComplete(plan, checkbox.dataset.milestoneIndex, checkbox.checked);
      showPlan();
      saveLocal();
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  });

  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (!plan) return;
    const text = [`${plan.title}: ${plan.outcome}`, `${plan.metric}: ${plan.currentValue} ${plan.unit} → ${plan.targetValue} ${plan.unit}`, `${plan.progressPercent.toFixed(1)}%`, ...plan.milestones.map(({ date, label, complete }) => `${complete ? '✓' : '○'} ${date} — ${label}`)].join('\n');
    copyText(root, text, copy);
  });

  root.querySelector('[data-action="download"]')?.addEventListener('click', () => {
    if (!plan) return;
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'usefulverse-goal-plan.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce(root, copy.messages.downloaded, 'success');
  });

  form.elements.namedItem('backupFile').addEventListener('change', async (event) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    if (file.size > 100_000) {
      event.currentTarget.value = '';
      announce(root, copy.messages.importFailed, 'error');
      return;
    }
    try {
      const restored = restoreGoalPlan(JSON.parse(await file.text()));
      plan = restored;
      fillForm(plan);
      showPlan();
      saveLocal();
    } catch {
      announce(root, copy.messages.importFailed, 'error');
    } finally {
      event.currentTarget.value = '';
    }
  });

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      plan = restoreGoalPlan(JSON.parse(saved));
      fillForm(plan);
      showPlan();
    }
  } catch {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* Storage can be unavailable in private contexts. */ }
    plan = null;
  }
}
