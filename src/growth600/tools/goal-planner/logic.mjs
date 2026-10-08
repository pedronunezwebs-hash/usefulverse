const MAX_TITLE = 120;
const MAX_OUTCOME = 240;
const MAX_METRIC = 100;
const MAX_UNIT = 30;
const MAX_MILESTONES = 40;
const MAX_PROGRESS_ENTRIES = 366;
const DAY_MS = 86_400_000;

function text(value, label, maxLength) {
  const normalized = String(value ?? '').trim();
  if (!normalized || normalized.length > maxLength) throw new RangeError(`${label} must contain 1 to ${maxLength} characters.`);
  return normalized;
}

function date(value, label) {
  const normalized = String(value ?? '');
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(normalized)) throw new TypeError(`${label} must be a calendar date.`);
  const parsed = new Date(`${normalized}T00:00:00.000Z`);
  if (!Number.isFinite(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== normalized) throw new RangeError(`${label} is not a valid calendar date.`);
  return normalized;
}

function numeric(value, label) {
  if (value === '' || value === null || value === undefined) throw new TypeError(`${label} is required.`);
  const result = Number(value);
  if (!Number.isFinite(result) || Math.abs(result) > 1e15) throw new RangeError(`${label} must be a finite number no larger than 1 quadrillion in magnitude.`);
  return result;
}

function dayNumber(value) {
  return Date.parse(`${value}T00:00:00.000Z`) / DAY_MS;
}

export function parseGoalMilestones(source, startDate, dueDate) {
  const lines = String(source ?? '').split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (lines.length > MAX_MILESTONES) throw new RangeError(`Use no more than ${MAX_MILESTONES} milestones.`);
  const seen = new Set();
  return lines.map((line, index) => {
    const match = line.match(/^(\d{4}-\d{2}-\d{2})\s*\|\s*(.+)$/u);
    if (!match) throw new SyntaxError(`Milestone ${index + 1} must use YYYY-MM-DD | description.`);
    const milestoneDate = date(match[1], `Milestone ${index + 1} date`);
    const label = text(match[2], `Milestone ${index + 1}`, 160);
    if (milestoneDate < startDate || milestoneDate > dueDate) throw new RangeError(`Milestone ${index + 1} must fall between the plan start and deadline.`);
    const key = `${milestoneDate}\u0000${label.toLocaleLowerCase()}`;
    if (seen.has(key)) throw new RangeError(`Milestone ${index + 1} duplicates another milestone.`);
    seen.add(key);
    return Object.freeze({ date: milestoneDate, label, complete: false });
  }).sort((left, right) => left.date.localeCompare(right.date) || left.label.localeCompare(right.label));
}

export function createGoalPlan({ title, outcome, metric, unit = '', startValue, targetValue, currentValue, startDate: startInput, currentDate: currentInput, dueDate: dueInput, milestones = '' } = {}) {
  const normalizedTitle = text(title, 'Goal title', MAX_TITLE);
  const normalizedOutcome = text(outcome, 'Measurable outcome', MAX_OUTCOME);
  const normalizedMetric = text(metric, 'Progress measure', MAX_METRIC);
  const normalizedUnit = String(unit ?? '').trim();
  if (normalizedUnit.length > MAX_UNIT) throw new RangeError(`Unit must be ${MAX_UNIT} characters or fewer.`);
  const startDate = date(startInput, 'Start date');
  const currentDate = date(currentInput, 'Progress date');
  const dueDate = date(dueInput, 'Deadline');
  if (dueDate < startDate) throw new RangeError('Deadline must be on or after the start date.');
  if (currentDate < startDate || currentDate > dueDate) throw new RangeError('Progress date must fall inside the plan dates.');
  const baseline = numeric(startValue, 'Starting value');
  const target = numeric(targetValue, 'Target value');
  if (baseline === target) throw new RangeError('Target must differ from the starting value.');
  const current = numeric(currentValue, 'Current value');
  const normalizedMilestones = parseGoalMilestones(milestones, startDate, dueDate);
  return Object.freeze({
    schemaVersion: 1,
    title: normalizedTitle,
    outcome: normalizedOutcome,
    metric: normalizedMetric,
    unit: normalizedUnit,
    startValue: baseline,
    targetValue: target,
    currentValue: current,
    startDate,
    currentDate,
    dueDate,
    milestones: Object.freeze(normalizedMilestones),
    progressEntries: Object.freeze([Object.freeze({ date: currentDate, value: current })]),
    progressPercent: Math.min(100, Math.max(0, ((current - baseline) / (target - baseline)) * 100)),
    daysTotal: dayNumber(dueDate) - dayNumber(startDate),
  });
}

export function goalDaysRemaining(plan, todayInput) {
  if (!plan || plan.schemaVersion !== 1) throw new TypeError('A valid goal plan is required.');
  return Math.max(0, dayNumber(plan.dueDate) - dayNumber(date(todayInput, 'Today')));
}

export function recordGoalProgress(plan, valueInput, dateInput) {
  if (!plan || plan.schemaVersion !== 1 || !Array.isArray(plan.progressEntries)) throw new TypeError('A valid goal plan is required.');
  const entryDate = date(dateInput, 'Progress date');
  if (entryDate < plan.startDate || entryDate > plan.dueDate) throw new RangeError('Progress date must fall inside the plan dates.');
  const value = numeric(valueInput, 'Progress value');
  const entries = plan.progressEntries.filter((entry) => entry.date !== entryDate).map((entry) => ({ ...entry }));
  if (entries.length >= MAX_PROGRESS_ENTRIES) throw new RangeError(`Keep no more than ${MAX_PROGRESS_ENTRIES} progress entries.`);
  entries.push({ date: entryDate, value });
  entries.sort((left, right) => left.date.localeCompare(right.date));
  const latest = entries.at(-1);
  return Object.freeze({
    ...plan,
    currentValue: latest.value,
    currentDate: latest.date,
    progressEntries: Object.freeze(entries.map((entry) => Object.freeze(entry))),
    progressPercent: Math.min(100, Math.max(0, ((value - plan.startValue) / (plan.targetValue - plan.startValue)) * 100)),
  });
}

export function setGoalMilestoneComplete(plan, indexInput, complete) {
  if (!plan || plan.schemaVersion !== 1 || !Array.isArray(plan.milestones)) throw new TypeError('A valid goal plan is required.');
  const index = Number(indexInput);
  if (!Number.isInteger(index) || index < 0 || index >= plan.milestones.length) throw new RangeError('Choose a valid milestone.');
  const milestones = plan.milestones.map((item, itemIndex) => Object.freeze(itemIndex === index ? { ...item, complete: Boolean(complete) } : { ...item }));
  return Object.freeze({ ...plan, milestones: Object.freeze(milestones) });
}

export function restoreGoalPlan(value) {
  if (!value || value.schemaVersion !== 1 || !Array.isArray(value.milestones) || value.milestones.length > MAX_MILESTONES || !Array.isArray(value.progressEntries) || value.progressEntries.length < 1 || value.progressEntries.length > MAX_PROGRESS_ENTRIES) throw new TypeError('This is not a supported goal-plan backup.');
  if (value.milestones.some((milestone) => !milestone || typeof milestone.label !== 'string' || typeof milestone.complete !== 'boolean')) throw new TypeError('The goal-plan backup contains an invalid milestone.');
  if (value.progressEntries.some((entry) => !entry || typeof entry.date !== 'string') || new Set(value.progressEntries.map(({ date: entryDate }) => entryDate)).size !== value.progressEntries.length) throw new TypeError('The goal-plan backup contains invalid progress entries.');
  const plan = createGoalPlan({
    title: value.title, outcome: value.outcome, metric: value.metric, unit: value.unit,
    startValue: value.startValue, targetValue: value.targetValue, currentValue: value.currentValue,
    startDate: value.startDate, currentDate: value.currentDate, dueDate: value.dueDate,
    milestones: value.milestones.map(({ date: milestoneDate, label }) => `${milestoneDate} | ${label}`).join('\n'),
  });
  let restored = plan;
  for (const entry of value.progressEntries) restored = recordGoalProgress(restored, entry?.value, entry?.date);
  value.milestones.forEach((milestone, index) => {
    if (milestone?.complete) restored = setGoalMilestoneComplete(restored, index, true);
  });
  const lastEntry = restored.progressEntries.at(-1);
  if (lastEntry?.date !== value.currentDate || lastEntry.value !== value.currentValue) throw new TypeError('The goal-plan backup has inconsistent current progress.');
  return restored;
}
