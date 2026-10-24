const DATE_FIELDS = Object.freeze(['effectiveFrom', 'checkedAt', 'reviewDue']);

function isIsoCalendarDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
  const time = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
}

export function assertRuleSnapshotsCurrent(tools, today = new Date().toISOString().slice(0, 10)) {
  if (!Array.isArray(tools) || !isIsoCalendarDate(today)) throw new TypeError('Tools and a valid ISO calendar date are required.');
  for (const tool of tools) {
    const hasMaintenanceDate = DATE_FIELDS.some((field) => tool?.[field] !== undefined);
    if (!hasMaintenanceDate) continue;
    if (!DATE_FIELDS.every((field) => isIsoCalendarDate(tool[field]))) throw new Error(`Growth600 release blocked: ${tool.id} has incomplete rule-maintenance dates.`);
    if (!(tool.effectiveFrom <= tool.checkedAt && tool.checkedAt <= tool.reviewDue)) throw new Error(`Growth600 release blocked: ${tool.id} has inconsistent rule-maintenance dates.`);
    if (today > tool.reviewDue) throw new Error(`Growth600 release blocked: ${tool.id} rule snapshot expired on ${tool.reviewDue}; review the official source before rebuilding.`);
  }
}
