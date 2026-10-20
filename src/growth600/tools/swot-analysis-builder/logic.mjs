const SECTION_KEYS = Object.freeze(['strengths', 'weaknesses', 'opportunities', 'threats']);

export function createSwotSummary(input = {}) {
  const sections = Object.fromEntries(SECTION_KEYS.map((key) => {
    const value = String(input[key] ?? '').trim();
    if (value.length > 4000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value)) {
      throw Object.assign(new RangeError('Section is too long.'), { code: 'section-too-long' });
    }
    return [key, value];
  }));
  if (!Object.values(sections).some(Boolean)) throw Object.assign(new RangeError('Add at least one observation.'), { code: 'empty-input' });
  return Object.freeze(sections);
}
