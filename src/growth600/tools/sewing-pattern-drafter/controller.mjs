import { createHalfCircleSkirtSvg, draftHalfCircleSkirt } from './logic.mjs';

const root = document.querySelector('[data-sewing-pattern]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('[data-pattern-form]');
  const status = root.querySelector('[data-status]');
  const result = root.querySelector('[data-result]');
  const measurements = root.querySelector('[data-measurements]');
  const preview = root.querySelector('[data-preview]');
  const download = root.querySelector('[data-download]');
  let svgSource = '';
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const get = (name) => Number(form.elements.namedItem(name)?.value);
      const draft = draftHalfCircleSkirt({ waistMm: get('waistMm'), easeMm: get('easeMm'), lengthMm: get('lengthMm'), seamAllowanceMm: get('seamAllowanceMm'), hemAllowanceMm: get('hemAllowanceMm') });
      svgSource = createHalfCircleSkirtSvg(draft, copy.name, copy.fields.svgDescription, copy.fields.calibrationLabel);
      const svg = new DOMParser().parseFromString(svgSource, 'image/svg+xml').documentElement;
      if (svg.localName !== 'svg') throw new Error('invalid-pattern');
      preview.replaceChildren(document.importNode(svg, true));
      measurements.textContent = copy.messages.summary.replace('{waist}', String(Math.round(draft.finishedWaistMm))).replace('{radius}', draft.radiusMm.toFixed(1)).replace('{length}', form.elements.namedItem('lengthMm').value);
      result.hidden = false; status.textContent = copy.messages.complete;
    } catch {
      svgSource = ''; preview.replaceChildren(); result.hidden = true; status.textContent = copy.messages.invalid;
    }
  });
  download.addEventListener('click', () => {
    if (!svgSource) return;
    const url = URL.createObjectURL(new Blob([svgSource], { type: 'image/svg+xml;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'usefulverse-half-circle-skirt-pattern.svg'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  form.addEventListener('reset', () => { svgSource = ''; preview.replaceChildren(); result.hidden = true; status.textContent = ''; });
}
