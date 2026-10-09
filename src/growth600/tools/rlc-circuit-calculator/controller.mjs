import { calculateRlcCircuit } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="rlc-circuit-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 7);
  let output = '';

  function drawSweep(points) {
    const svg = root.querySelector('[data-rlc-response]');
    const chart = root.querySelector('[data-rlc-chart]');
    const ns = 'http://www.w3.org/2000/svg';
    const left = 42; const right = 535; const top = 18; const bottom = 198;
    const logs = points.map(({ impedanceOhms }) => Math.log10(impedanceOhms));
    const low = Math.min(...logs); const high = Math.max(...logs);
    const span = Math.max(high - low, 1e-12);
    const elements = [];
    const line = (x1, y1, x2, y2) => {
      const el = document.createElementNS(ns, 'line');
      for (const [key, value] of Object.entries({ x1, y1, x2, y2, stroke: 'currentColor', 'stroke-opacity': '0.45', 'stroke-width': '1' })) el.setAttribute(key, String(value));
      return el;
    };
    elements.push(line(left, top, left, bottom), line(left, bottom, right, bottom));
    const polyline = document.createElementNS(ns, 'polyline');
    const coordinates = points.map(({ impedanceOhms }, index) => {
      const x = left + (right - left) * index / (points.length - 1);
      const y = bottom - (bottom - top) * (Math.log10(impedanceOhms) - low) / span;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');
    polyline.setAttribute('points', coordinates);
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', 'currentColor');
    polyline.setAttribute('stroke-width', '3');
    polyline.setAttribute('vector-effect', 'non-scaling-stroke');
    elements.push(polyline);
    const title = document.createElementNS(ns, 'title'); title.textContent = copy.fields.chartTitle;
    const description = document.createElementNS(ns, 'desc'); description.textContent = copy.fields.chartDescription;
    svg.replaceChildren(title, description, ...elements);
    svg.setAttribute('aria-label', copy.fields.chartDescription);
    chart.hidden = false;
  }

  function calculate(event) {
    event?.preventDefault(); clearResult(root); output = '';
    try {
      const result = calculateRlcCircuit(Object.fromEntries(new FormData(form).entries()));
      const frequencyLabel = (value) => value >= 1000 ? `${format(value / 1000)} kHz` : `${format(value)} Hz`;
      const sign = result.impedanceImaginaryOhms < 0 ? '−' : '+';
      const modeName = result.mode === 'series' ? copy.fields.series : copy.fields.parallel;
      const rows = [
        [copy.messages.model, modeName],
        [copy.messages.resonance, frequencyLabel(result.resonanceHz)],
        [copy.messages.qualityFactor, format(result.q)],
        [copy.messages.bandwidth, frequencyLabel(result.bandwidthHz)],
        [copy.messages.inductiveReactance, `${format(result.xLOhms)} Ω`],
        [copy.messages.capacitiveReactance, `${format(result.xCOhms)} Ω`],
        [copy.messages.complexImpedance, `${format(result.impedanceRealOhms)} ${sign} j${format(Math.abs(result.impedanceImaginaryOhms))} Ω`],
        [copy.messages.impedanceMagnitudePhase, `${format(result.impedanceMagnitudeOhms)} Ω ∠ ${format(result.impedancePhaseDegrees)}°`],
        [copy.messages.current, `${format(result.currentRmsA)} A RMS`],
      ];
      showRows(root, rows);
      output = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      drawSweep(result.sweep);
      announce(root, copy.messages.calculated, 'success');
    } catch { announce(root, copy.messages.checkInputs, 'error'); }
  }

  form.addEventListener('input', () => { clearResult(root); output = ''; root.querySelector('[data-rlc-chart]').hidden = true; announce(root, ''); });
  form.addEventListener('change', () => { clearResult(root); output = ''; root.querySelector('[data-rlc-chart]').hidden = true; announce(root, ''); });
  form.addEventListener('submit', calculate);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('resistance').value = form.elements.namedItem('mode').value === 'series' ? '10' : '1000';
    form.elements.namedItem('inductance').value = '10'; form.elements.namedItem('inductanceUnit').value = 'mH';
    form.elements.namedItem('capacitance').value = '1'; form.elements.namedItem('capacitanceUnit').value = 'uF';
    form.elements.namedItem('frequency').value = '1.591549431'; form.elements.namedItem('frequencyUnit').value = 'kHz';
    form.elements.namedItem('voltage').value = '5'; calculate();
  });
  form.addEventListener('reset', () => setTimeout(() => { output = ''; clearResult(root); root.querySelector('[data-rlc-chart]').hidden = true; announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (output) copyText(root, output, copy); });
}
