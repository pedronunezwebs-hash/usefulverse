import { compareWheelOffset, wheelMovementCsv } from './swiss-wheel-offset.mjs';

const root = document.querySelector('[data-market-tool="swissWheelOffset"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
  const f = copy.fields;
  const value = (id) => root.querySelector(`#${id}`).value;
  const status = root.querySelector('[data-wheel-status]');
  const results = root.querySelector('[data-wheel-results]');
  const summary = root.querySelector('[data-wheel-summary]');
  const diagram = root.querySelector('[data-wheel-diagram]');
  const exportButton = root.querySelector('[data-action="exportWheelCsv"]');
  let latest = null;
  const format = (number) => {
    const normalized = Math.abs(number) < 0.05 ? 0 : number;
    return new Intl.NumberFormat(document.documentElement.lang, { maximumFractionDigits: 1 }).format(normalized);
  };
  const convertDisplayedValue = (value, factor) => String(Number((Number(value) * factor).toFixed(4)));
  const movement = (number, positive, negative) => number === 0 ? f.unchanged : `${format(Math.abs(number))} mm ${number > 0 ? positive : negative}`;
  const setStatus = (message, error = false) => { status.textContent = message; status.classList.toggle('result--error', error); };
  const svgNode = (name, attributes = {}, text = '') => {
    const node = document.createElementNS('http://www.w3.org/2000/svg', name);
    for (const [key, item] of Object.entries(attributes)) node.setAttribute(key, String(item));
    if (text) node.textContent = text;
    return node;
  };
  const drawDiagram = (result) => {
    const maximum = Math.max(result.currentWidthMm, result.newWidthMm, Math.abs(result.centerlineMovementMm) * 2, 100);
    const scale = Math.min(0.55, 150 / maximum);
    const currentX = 200;
    const proposedX = currentX + result.centerlineMovementMm * scale;
    const rows = [
      { y: 64, center: currentX, width: result.currentWidthMm, label: f.currentSetup, fill: '#8fa1ae' },
      { y: 128, center: proposedX, width: result.newWidthMm, label: f.newSetup, fill: '#71920d' },
    ];
    diagram.replaceChildren(
      svgNode('title', {}, f.diagram),
      svgNode('line', { x1: 200, y1: 20, x2: 200, y2: 165, stroke: '#536777', 'stroke-dasharray': '5 4' }),
      svgNode('text', { x: 15, y: 22, 'font-size': 12, fill: '#142a3b' }, f.suspension),
      svgNode('text', { x: 385, y: 22, 'font-size': 12, 'text-anchor': 'end', fill: '#142a3b' }, f.fender),
      ...rows.flatMap(({ y, center, width, label, fill }) => [
        svgNode('text', { x: 12, y: y + 4, 'font-size': 12, fill: '#142a3b' }, label),
        svgNode('line', { x1: center - width * scale / 2, y1: y - 17, x2: center - width * scale / 2, y2: y + 17, stroke: fill, 'stroke-width': 8, 'stroke-linecap': 'round' }),
        svgNode('line', { x1: center + width * scale / 2, y1: y - 17, x2: center + width * scale / 2, y2: y + 17, stroke: fill, 'stroke-width': 8, 'stroke-linecap': 'round' }),
        svgNode('line', { x1: center - width * scale / 2, y1: y, x2: center + width * scale / 2, y2: y, stroke: fill, 'stroke-width': 2 }),
        svgNode('circle', { cx: center, cy: y, r: 4, fill: '#142a3b' }),
      ]),
    );
  };
  const calculate = () => {
    try {
      latest = compareWheelOffset({
        currentWidth: value('wheel-current-width'), newWidth: value('wheel-new-width'), widthUnit: value('wheel-width-unit'),
        currentEt: value('wheel-current-et'), newEt: value('wheel-new-et'),
        currentSpacer: value('wheel-current-spacer'), newSpacer: value('wheel-new-spacer'), offsetUnit: value('wheel-offset-unit'),
        currentInnerClearance: value('wheel-inner-clearance'), currentOuterClearance: value('wheel-outer-clearance'), clearanceUnit: value('wheel-offset-unit'),
      });
      drawDiagram(latest);
      const rows = [
        [f.innerMovement, movement(latest.innerMovementMm, f.closer, f.away)],
        [f.outerMovement, movement(latest.outerMovementMm, f.towardFender, f.towardCenter)],
        [f.centerMovement, movement(latest.centerlineMovementMm, f.outward, f.inward)],
      ];
      if (latest.remainingInnerClearanceMm !== null) rows.push([f.remainingInner, `${new Intl.NumberFormat(document.documentElement.lang, { maximumFractionDigits: 1 }).format(latest.remainingInnerClearanceMm)} mm`]);
      if (latest.remainingOuterClearanceMm !== null) rows.push([f.remainingOuter, `${new Intl.NumberFormat(document.documentElement.lang, { maximumFractionDigits: 1 }).format(latest.remainingOuterClearanceMm)} mm`]);
      const table = document.createElement('table');
      const body = document.createElement('tbody');
      for (const [label, amount] of rows) {
        const row = document.createElement('tr'); const heading = document.createElement('th'); const cell = document.createElement('td');
        heading.scope = 'row'; heading.textContent = label; cell.textContent = amount; row.append(heading, cell); body.append(row);
      }
      table.append(body); summary.replaceChildren(table);
      if (latest.isInnerClearanceNegative || latest.isOuterClearanceNegative) {
        const warning = document.createElement('p'); warning.className = 'hint result--error'; warning.textContent = f.negativeClearance; summary.append(warning);
      }
      results.hidden = false; exportButton.disabled = false; setStatus(f.complete);
    } catch {
      latest = null; results.hidden = true; exportButton.disabled = true; summary.replaceChildren();
      setStatus(f.invalid, true);
    }
  };
  root.querySelector('[data-action="compareWheels"]').addEventListener('click', calculate);
  root.querySelector('#wheel-width-unit').addEventListener('change', (event) => {
    const next = event.currentTarget.value;
    for (const id of ['wheel-current-width', 'wheel-new-width']) {
      const input = root.querySelector(`#${id}`);
      if (input.value) input.value = convertDisplayedValue(input.value, next === 'mm' ? 25.4 : 1 / 25.4);
    }
  });
  root.querySelector('#wheel-offset-unit').addEventListener('change', (event) => {
    const next = event.currentTarget.value;
    for (const id of ['wheel-current-et', 'wheel-new-et', 'wheel-current-spacer', 'wheel-new-spacer', 'wheel-inner-clearance', 'wheel-outer-clearance']) {
      const input = root.querySelector(`#${id}`);
      if (input.value) input.value = convertDisplayedValue(input.value, next === 'mm' ? 25.4 : 1 / 25.4);
    }
  });
  root.querySelector('[data-action="sampleWheels"]').addEventListener('click', () => {
    root.querySelector('#wheel-width-unit').value = 'in'; root.querySelector('#wheel-offset-unit').value = 'mm';
    root.querySelector('#wheel-current-width').value = '8'; root.querySelector('#wheel-new-width').value = '8';
    root.querySelector('#wheel-current-et').value = '35'; root.querySelector('#wheel-new-et').value = '45';
    root.querySelector('#wheel-current-spacer').value = '0'; root.querySelector('#wheel-new-spacer').value = '0';
    root.querySelector('#wheel-inner-clearance').value = ''; root.querySelector('#wheel-outer-clearance').value = '';
    calculate();
  });
  root.querySelector('[data-action="clearWheels"]').addEventListener('click', () => {
    for (const id of ['wheel-current-width', 'wheel-current-et', 'wheel-current-spacer', 'wheel-new-width', 'wheel-new-et', 'wheel-new-spacer', 'wheel-inner-clearance', 'wheel-outer-clearance']) root.querySelector(`#${id}`).value = '';
    latest = null; results.hidden = true; exportButton.disabled = true; summary.replaceChildren(); setStatus(f.ready);
    root.querySelector('#wheel-current-width').focus();
  });
  exportButton.addEventListener('click', () => {
    if (!latest) { setStatus(f.noExport, true); return; }
    const url = URL.createObjectURL(new Blob([wheelMovementCsv(latest)], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'wheel-offset-comparison.csv'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}
