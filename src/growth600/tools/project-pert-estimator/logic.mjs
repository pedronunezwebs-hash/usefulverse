const MAX_ACTIVITIES = 100;
const MAX_DURATION = 1_000_000_000_000;

function fail(code) {
  throw Object.assign(new RangeError(code), { code });
}

function numberParts(locale) {
  const formatter = new Intl.NumberFormat(locale);
  const parts = formatter.formatToParts(12345.6);
  const decimal = parts.find(({ type }) => type === 'decimal')?.value ?? '.';
  const group = parts.find(({ type }) => type === 'group')?.value ?? ',';
  const digitsFormatter = new Intl.NumberFormat(locale, { useGrouping: false });
  const digits = new Map();
  for (let digit = 0; digit <= 9; digit++) digits.set(digitsFormatter.format(digit), String(digit));
  return { decimal, group, digits };
}

function parseEstimate(value, parts) {
  if (value === '' || value === null || value === undefined) fail('invalid-estimate');
  let normalized = String(value).trim().replaceAll('\u2212', '-');
  for (const [local, digit] of parts.digits) normalized = normalized.replaceAll(local, digit);
  const chunks = normalized.split(parts.decimal);
  if (chunks.length > 2) fail('invalid-estimate');
  let integer = chunks[0];
  if (integer.includes(parts.group)) {
    const groups = integer.split(parts.group);
    if (!/^[+-]?\d{1,3}$/u.test(groups[0]) || groups.slice(1).some((group) => !/^\d{3}$/u.test(group))) fail('invalid-estimate');
    integer = groups.join('');
  }
  if (chunks[1]?.includes(parts.group)) fail('invalid-estimate');
  normalized = `${integer}${chunks.length === 2 ? `.${chunks[1]}` : ''}`;
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(normalized)) fail('invalid-estimate');
  const number = Number(normalized);
  if (!Number.isFinite(number) || number < 0 || number > MAX_DURATION) fail('invalid-estimate');
  return number;
}

function estimateActivity(row, numberLocaleParts) {
  const [idRaw, optimisticRaw, likelyRaw, pessimisticRaw, predecessorRaw = ''] = row.split('|').map((part) => part.trim());
  const id = idRaw;
  if (!id || id.length > 24 || !/^[\p{L}\p{N}_.-]+$/u.test(id)) fail('invalid-activity');
  const optimistic = parseEstimate(optimisticRaw, numberLocaleParts);
  const mostLikely = parseEstimate(likelyRaw, numberLocaleParts);
  const pessimistic = parseEstimate(pessimisticRaw, numberLocaleParts);
  if (optimistic > mostLikely || mostLikely > pessimistic) fail('invalid-order');
  const predecessors = predecessorRaw ? [...new Set(predecessorRaw.split(',').map((item) => item.trim()).filter(Boolean))] : [];
  if (predecessors.length > 20 || predecessors.some((item) => item.length > 24 || !/^[\p{L}\p{N}_.-]+$/u.test(item))) fail('invalid-predecessor');
  const standardDeviation = (pessimistic - optimistic) / 6;
  return { id, optimistic, mostLikely, pessimistic, expected: (optimistic + 4 * mostLikely + pessimistic) / 6, standardDeviation, variance: standardDeviation ** 2, predecessors };
}

export function estimateProjectPERT({ tasks = '', unit = '', locale = 'en' } = {}) {
  const rows = String(tasks).split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (!rows.length) fail('empty-project');
  if (rows.length > MAX_ACTIVITIES) fail('too-many-activities');
  const parts = numberParts(locale);
  const activities = rows.map((row) => estimateActivity(row, parts));
  const byId = new Map();
  for (const activity of activities) {
    if (byId.has(activity.id)) fail('duplicate-activity');
    byId.set(activity.id, activity);
  }
  const successors = new Map(activities.map(({ id }) => [id, []]));
  for (const activity of activities) {
    for (const predecessor of activity.predecessors) {
      if (predecessor === activity.id) fail('cyclic-network');
      if (!byId.has(predecessor)) fail('unknown-predecessor');
      successors.get(predecessor).push(activity.id);
    }
  }

  const indegree = new Map(activities.map(({ id, predecessors }) => [id, predecessors.length]));
  const queue = activities.filter(({ id }) => indegree.get(id) === 0).map(({ id }) => id);
  const order = [];
  while (queue.length) {
    const id = queue.shift();
    order.push(id);
    for (const next of successors.get(id)) {
      indegree.set(next, indegree.get(next) - 1);
      if (indegree.get(next) === 0) queue.push(next);
    }
  }
  if (order.length !== activities.length) fail('cyclic-network');

  const earliestStart = new Map();
  const earliestFinish = new Map();
  const drivingPredecessor = new Map();
  for (const id of order) {
    const activity = byId.get(id);
    let driver = null;
    for (const parent of activity.predecessors) {
      if (driver === null || earliestFinish.get(parent) > earliestFinish.get(driver)) driver = parent;
    }
    const start = driver === null ? 0 : earliestFinish.get(driver);
    drivingPredecessor.set(id, driver);
    earliestStart.set(id, start);
    earliestFinish.set(id, start + activity.expected);
  }
  const projectDuration = Math.max(...earliestFinish.values());
  const latestStart = new Map();
  const latestFinish = new Map();
  for (const id of [...order].reverse()) {
    const activity = byId.get(id);
    const children = successors.get(id);
    const finish = children.length ? Math.min(...children.map((child) => latestStart.get(child))) : projectDuration;
    latestFinish.set(id, finish);
    latestStart.set(id, finish - activity.expected);
  }

  const results = activities.map((activity) => {
    const slack = Math.max(0, latestStart.get(activity.id) - earliestStart.get(activity.id));
    return Object.freeze({ ...activity, earliestStart: earliestStart.get(activity.id), earliestFinish: earliestFinish.get(activity.id), latestStart: latestStart.get(activity.id), latestFinish: latestFinish.get(activity.id), slack, critical: slack < 1e-9 });
  });
  const terminalActivities = activities.filter(({ id }) => successors.get(id).length === 0);
  let terminal = terminalActivities[0].id;
  for (const activity of terminalActivities.slice(1)) {
    if (earliestFinish.get(activity.id) > earliestFinish.get(terminal)) terminal = activity.id;
  }
  const criticalPath = [];
  for (let current = terminal; current !== null; current = drivingPredecessor.get(current)) criticalPath.push(current);
  criticalPath.reverse();
  const variance = criticalPath.reduce((total, id) => total + byId.get(id).variance, 0);
  return Object.freeze({ activities: Object.freeze(results), topologicalOrder: Object.freeze(order), criticalPath: Object.freeze(criticalPath), expectedDuration: projectDuration, variance, standardDeviation: Math.sqrt(variance), unit: String(unit ?? '').trim().slice(0, 20) });
}
