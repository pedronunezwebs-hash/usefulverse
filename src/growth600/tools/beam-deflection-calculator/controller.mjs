import { calculateBeamDeflection } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="beam-deflection-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = () => document.documentElement.lang || 'en';
  const format = (value) => numberFormat(locale(), value, 8);
  let outputText = '';

  function syncLoadHint() {
    const uniform = form.elements.namedItem('loadCase').value === 'uniform';
    root.querySelector('#beam-load-label').textContent = uniform ? copy.fields.uniformLoad : copy.fields.pointLoad;
    root.querySelector('#beam-load-hint').textContent = `${copy.fields.loadUnitHint} ${uniform ? `${form.elements.namedItem('forceUnit').value}/${form.elements.namedItem('spanUnit').value}` : form.elements.namedItem('forceUnit').value}.`;
  }

  function drawCurve(result) {
    const content = root.querySelector('[data-result-content]');
    const figure = document.createElement('figure');
    figure.className = 'beam-deflection-diagram';
    const caption = document.createElement('figcaption'); caption.textContent = copy.messages.curveLabel;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 360 160'); svg.setAttribute('width', '100%'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', copy.messages.curveLabel);
    const line = (x1, y1, x2, y2, width = 2) => {
      const node = document.createElementNS(svg.namespaceURI, 'line');
      for (const [key, value] of Object.entries({ x1, y1, x2, y2 })) node.setAttribute(key, String(value));
      node.setAttribute('stroke', 'currentColor'); node.setAttribute('stroke-width', String(width)); svg.append(node);
    };
    const path = document.createElementNS(svg.namespaceURI, 'polyline');
    const max = Math.max(result.maxDeflection, Number.EPSILON);
    const coordinates = result.profile.map(({ x, deflection }) => `${24 + x / result.span * 312},${28 + deflection / max * 104}`).join(' ');
    path.setAttribute('points', coordinates); path.setAttribute('fill', 'none'); path.setAttribute('stroke', 'currentColor'); path.setAttribute('stroke-width', '3'); path.setAttribute('stroke-linejoin', 'round'); svg.append(path);
    line(24, 28, 336, 28, 3);
    if (result.support === 'simply-supported') {
      for (const x of [24, 336]) {
        const support = document.createElementNS(svg.namespaceURI, 'path'); support.setAttribute('d', `M ${x - 10} 48 L ${x + 10} 48 L ${x} 30 Z`); support.setAttribute('fill', 'currentColor'); svg.append(support);
      }
    } else {
      line(20, 18, 20, 55, 5); for (let y = 18; y < 55; y += 8) line(12, y + 5, 20, y, 1);
    }
    figure.append(caption, svg); content.append(figure);
  }

  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const read = (name) => form.elements.namedItem(name).value.trim();
      const result = calculateBeamDeflection({ support: read('support'), loadCase: read('loadCase'), span: read('span'), spanUnit: read('spanUnit'), load: read('load'), forceUnit: read('forceUnit'), modulus: read('modulus'), modulusUnit: read('modulusUnit'), inertia: read('inertia'), inertiaUnit: read('inertiaUnit') });
      const momentUnit = result.forceUnit === 'lbf' ? 'lbf·ft' : `${result.forceUnit}·${result.spanUnit}`;
      const momentShown = result.forceUnit === 'lbf'
        ? `${format(result.maxMomentNm / 1.3558179483314)} lbf·ft`
        : `${format(result.maxMomentNm / (result.forceUnit === 'kN' ? 1000 : 1) / (result.spanUnit === 'mm' ? 0.001 : result.spanUnit === 'cm' ? 0.01 : result.spanUnit === 'ft' ? 0.3048 : result.spanUnit === 'in' ? 0.0254 : 1))} ${momentUnit}`;
      const rows = [
        [copy.messages.maxDeflection, `${format(result.maxDeflection)} ${result.deflectionUnit}`],
        [copy.messages.location, `${format(result.maxLocation)} ${result.spanUnit}`],
        [copy.messages.maxMoment, momentShown],
        [copy.messages.flexuralRigidity, `${format(result.flexuralRigidity)} N·m²`],
      ];
      // Keep mixed Arabic/Latin unit strings in left-to-right order inside an
      // RTL result list (for example, "0.00083 m" and "1,000 N·m").
      showRows(root, rows.map(([label, value]) => [label, `\u2066${value}\u2069`])); drawCurve(result);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.elements.namedItem('loadCase').addEventListener('change', syncLoadHint);
  for (const name of ['forceUnit', 'spanUnit']) form.elements.namedItem(name).addEventListener('change', syncLoadHint);
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); syncLoadHint(); announce(root, ''); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ support: 'simply-supported', loadCase: 'point', span: '4', spanUnit: 'm', load: '1000', forceUnit: 'N', modulus: '200', modulusUnit: 'GPa', inertia: '0.000008', inertiaUnit: 'm⁴' })) form.elements.namedItem(name).value = value;
    syncLoadHint(); calculate(); announce(root, copy.messages.exampleLoaded, 'status');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  syncLoadHint();
}
