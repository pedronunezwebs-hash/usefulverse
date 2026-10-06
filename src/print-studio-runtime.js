import { makePrintDesign, printDesignHasContent } from './print-studio-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);
const messages = (root) => JSON.parse(root.dataset.plannerMessages || '{}');

function setupPrintStudio(root) {
  const studio = $('[data-print-studio]', root); const kind = studio.dataset.printKind;
  const preview = $('[data-print-preview]', studio); const status = $('#op-status', root);
  const say = (key) => messages(root)[key] ?? key;
  const values = () => Object.fromEntries([...studio.querySelectorAll('[data-print-field]')].map((control) => [control.dataset.printField, control.value]));
  const settings = () => ({ paper: studio.querySelector('[data-print-field="paper"]')?.value, theme: studio.querySelector('[data-print-field="theme"]')?.value });
  const render = () => {
    const data = values();
    if (!printDesignHasContent(kind, data)) { preview.textContent = say('Enter some text to create your design.'); return; }
    preview.innerHTML = makePrintDesign(kind, data, settings());
  };
  const clearStatus = () => { status.classList.remove('is-success', 'is-error'); status.textContent = ''; };
  studio.addEventListener('input', () => { clearStatus(); render(); });
  studio.addEventListener('change', () => { clearStatus(); render(); });
  $('[data-print-download]', studio).addEventListener('click', () => {
    const data = values();
    if (!printDesignHasContent(kind, data)) { status.textContent = say('Enter some text to create your design.'); status.classList.add('is-error'); return; }
    try {
      const svg = makePrintDesign(kind, data, settings()); const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }); const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = `${kind}.svg`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = say('SVG design downloaded.'); status.classList.remove('is-error'); status.classList.add('is-success');
    } catch {
      status.textContent = say('Could not create the SVG file.'); status.classList.add('is-error');
    }
  });
  $('[data-print-print]', studio).addEventListener('click', () => {
    if (!printDesignHasContent(kind, values())) { status.textContent = say('Enter some text to create your design.'); status.classList.add('is-error'); return; }
    render(); window.print();
  });
  render();
}

export function setupPrintStudioTool(root) { setupPrintStudio(root); }
