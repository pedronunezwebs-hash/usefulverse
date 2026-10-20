import { createFingerJointBox, downloadSvg } from './logic.mjs';

const root = document.querySelector('[data-tool="laser-box-designer"]');
if (root) {
  const form = root.querySelector('[data-laser-box-form]');
  const status = root.querySelector('[data-status]');
  const result = root.querySelector('[data-result]');
  const preview = root.querySelector('[data-preview]');
  const dimensions = root.querySelector('[data-dimensions]');
  const download = root.querySelector('[data-download]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  let current = null;
  let objectUrl = null;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const input = Object.fromEntries(['width', 'depth', 'height', 'thickness', 'clearance', 'fingers'].map((key) => [key, Number(form.elements.namedItem(key)?.value)]));
      current = createFingerJointBox(input);
      const parsed = new DOMParser().parseFromString(current.svg, 'image/svg+xml').documentElement;
      preview.replaceChildren(document.importNode(parsed, true));
      dimensions.textContent = `${copy.fields.fingerWidth}: ${current.fingerWidth} mm · ${copy.fields.slotWidth}: ${current.slotWidth} mm · ${copy.fields.sheet}: ${current.sheetWidth} × ${current.sheetHeight} mm`;
      result.hidden = false;
      download.disabled = false;
      status.textContent = copy.messages.generated;
      status.classList.remove('status--error');
    } catch (error) {
      current = null;
      download.disabled = true;
      status.textContent = error instanceof RangeError ? error.message : copy.messages.error;
      status.classList.add('status--error');
    }
  });
  download.addEventListener('click', () => {
    if (!current) return;
    const file = downloadSvg(current.svg);
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file.blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = file.filename;
    link.click();
    status.textContent = copy.messages.downloaded;
  });
  form.addEventListener('reset', () => {
    current = null;
    preview.replaceChildren();
    result.hidden = true;
    download.disabled = true;
    status.textContent = '';
    status.classList.remove('status--error');
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = null;
  });
}
