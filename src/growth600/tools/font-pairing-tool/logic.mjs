export const FONT_FILE_LIMITS = Object.freeze({ count: 8, fileBytes: 5 * 1024 * 1024, totalBytes: 15 * 1024 * 1024 });

export const FONT_PRESETS = Object.freeze([
  { id: 'editorial', label: 'Editorial', heading: 'Georgia, "Times New Roman", serif', body: 'Arial, Helvetica, sans-serif' },
  { id: 'modern', label: 'Modern', heading: 'Arial, Helvetica, sans-serif', body: 'Arial, Helvetica, sans-serif' },
  { id: 'classic', label: 'Classic', heading: '"Times New Roman", Times, serif', body: 'Georgia, "Times New Roman", serif' },
  { id: 'technical', label: 'Technical', heading: '"Courier New", Courier, monospace', body: 'Arial, Helvetica, sans-serif' },
  { id: 'friendly', label: 'Friendly', heading: 'Trebuchet MS, Arial, sans-serif', body: 'Verdana, Geneva, sans-serif' },
  { id: 'system', label: 'System', heading: 'system-ui, sans-serif', body: 'system-ui, sans-serif' },
]);

const SAFE_FAMILY_ID = /^uv-local-font-[1-8]$/u;

export function validateFontFiles(files, currentCount = 0, currentBytes = 0) {
  const selected = Array.from(files ?? []);
  if (!selected.length) return { ok: false, error: 'noFiles' };
  if (currentCount + selected.length > FONT_FILE_LIMITS.count) return { ok: false, error: 'tooMany' };
  let bytes = currentBytes;
  for (const file of selected) {
    if (!/\.(?:woff2?|ttf|otf)$/iu.test(file?.name ?? '')) return { ok: false, error: 'unsupported' };
    if (!Number.isSafeInteger(file.size) || file.size <= 0 || file.size > FONT_FILE_LIMITS.fileBytes) return { ok: false, error: 'fileTooLarge' };
    bytes += file.size;
  }
  if (bytes > FONT_FILE_LIMITS.totalBytes) return { ok: false, error: 'totalTooLarge' };
  return { ok: true, files: selected, totalBytes: bytes };
}

export function fontFaceFamily(index) {
  if (!Number.isInteger(index) || index < 1 || index > FONT_FILE_LIMITS.count) throw new RangeError('Local font slot must be from 1 to 8.');
  return `uv-local-font-${index}`;
}

export function cssFamilyValue(value) {
  if (typeof value !== 'string' || value.length > 180 || /[;{}<>\n\r]/u.test(value)) throw new TypeError('Invalid CSS font family value.');
  const trimmed = value.trim();
  if (SAFE_FAMILY_ID.test(trimmed)) return `"${trimmed}"`;
  const allowed = /^(?:(?:system-ui|ui-sans-serif|ui-serif|ui-monospace|Arial|Helvetica|Verdana|Geneva|Georgia|"Times New Roman"|Times|serif|sans-serif|monospace|"Courier New"|Courier|"Trebuchet MS")(?:\s*,\s*(?:system-ui|ui-sans-serif|ui-serif|ui-monospace|Arial|Helvetica|Verdana|Geneva|Georgia|"Times New Roman"|Times|serif|sans-serif|monospace|"Courier New"|Courier|"Trebuchet MS"))*)$/u;
  if (!allowed.test(trimmed)) throw new TypeError('Unsupported CSS font family value.');
  return trimmed;
}

export function typographyCss({ headingFamily, bodyFamily, headingSize, bodySize, headingWeight, bodyWeight, lineHeight }) {
  const numbers = [headingSize, bodySize, headingWeight, bodyWeight, lineHeight].map(Number);
  const [headingPx, bodyPx, headingW, bodyW, leading] = numbers;
  if (!Number.isFinite(headingPx) || headingPx < 20 || headingPx > 96
    || !Number.isFinite(bodyPx) || bodyPx < 12 || bodyPx > 32
    || !Number.isInteger(headingW) || headingW < 100 || headingW > 900
    || !Number.isInteger(bodyW) || bodyW < 100 || bodyW > 900
    || !Number.isFinite(leading) || leading < 1 || leading > 2.2) throw new RangeError('Typography settings are outside the supported range.');
  const heading = cssFamilyValue(headingFamily);
  const body = cssFamilyValue(bodyFamily);
  return `:root {\n  --heading-font: ${heading};\n  --body-font: ${body};\n}\nh1, h2, h3 { font-family: var(--heading-font); font-size: ${headingPx}px; font-weight: ${headingW}; }\nbody, p { font-family: var(--body-font); font-size: ${bodyPx}px; font-weight: ${bodyW}; line-height: ${leading}; }`;
}
