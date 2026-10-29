import { getColoringTemplate } from './logic.mjs';

const NS = 'http://www.w3.org/2000/svg';

function svgNode(tag, attributes = {}) {
  const element = document.createElementNS(NS, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
  return element;
}

function saveSvg(svg, filename, blank) {
  const copy = svg.cloneNode(true);
  copy.setAttribute('xmlns', NS);
  copy.setAttribute('width', '1000');
  copy.setAttribute('height', '1000');
  if (blank) for (const region of copy.querySelectorAll('[data-color-region]')) region.setAttribute('fill', '#FFFFFF');
  const source = `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(copy)}`;
  const url = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const root = document.querySelector('[data-tool="coloring-studio"]');
const form = root?.querySelector('[data-pending-form]');
const result = root?.querySelector('[data-result]');
const content = root?.querySelector('[data-result-content]');
const status = root?.querySelector('[data-status]');
const copy = JSON.parse(root?.querySelector('[data-tool-copy]')?.textContent ?? '{}');

if (form && result && content && status) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const templateId = String(form.elements.namedItem('template')?.value ?? '');
    const color = String(form.elements.namedItem('color')?.value ?? '');
    const template = getColoringTemplate(templateId);
    content.replaceChildren();
    const svg = svgNode('svg', { viewBox: template.viewBox, role: 'group', 'aria-label': copy.fields.resultTitle });
    svg.classList.add('coloring-studio__art');
    const title = svgNode('title');
    title.textContent = copy.fields.resultTitle;
    svg.append(title);
    const paths = [];
    for (const [index, region] of template.regions.entries()) {
      const path = svgNode('path', {
        d: region.d,
        fill: '#FFFFFF',
        stroke: '#202124',
        'stroke-width': 4,
        'stroke-linejoin': 'round',
        'stroke-linecap': 'round',
        role: 'button',
        tabindex: 0,
        'aria-label': `${copy.fields.region} ${index + 1}`,
        'data-color-region': String(index),
      });
      if (region.transform) path.setAttribute('transform', region.transform);
      const applyColor = () => {
        const selectedColor = String(form.elements.namedItem('color')?.value ?? color);
        if (!/^#[0-9a-f]{6}$/iu.test(selectedColor)) return;
        path.setAttribute('fill', selectedColor);
        status.textContent = copy.fields.colorChanged;
      };
      path.addEventListener('click', applyColor);
      path.addEventListener('keydown', (keyEvent) => {
        if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
          keyEvent.preventDefault();
          applyColor();
        }
      });
      paths.push(path);
    }
    for (const line of template.lines) {
      const path = svgNode('path', { d: line.d, fill: 'none', stroke: '#202124', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' });
      if (line.transform) path.setAttribute('transform', line.transform);
      paths.push(path);
    }
    svg.append(...paths);
    const instructions = document.createElement('p');
    instructions.className = 'hint';
    instructions.textContent = copy.fields.instructions;
    const actions = document.createElement('div');
    actions.className = 'actions coloring-studio__downloads';
    const blankButton = document.createElement('button');
    blankButton.type = 'button';
    blankButton.className = 'button button--secondary';
    blankButton.textContent = copy.fields.blankDownload;
    blankButton.addEventListener('click', () => saveSvg(svg, `usefulverse-${templateId}-blank.svg`, true));
    const coloredButton = document.createElement('button');
    coloredButton.type = 'button';
    coloredButton.className = 'button button--secondary';
    coloredButton.textContent = copy.fields.coloredDownload;
    coloredButton.addEventListener('click', () => saveSvg(svg, `usefulverse-${templateId}-colored.svg`, false));
    actions.append(blankButton, coloredButton);
    content.append(instructions, svg, actions);
    result.hidden = false;
    status.textContent = copy.messages.complete;
  });
  form.addEventListener('reset', () => queueMicrotask(() => {
    content.replaceChildren();
    result.hidden = true;
    status.textContent = '';
  }));
}
