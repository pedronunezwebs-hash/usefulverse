import { parseLocalizedNumber } from '../../../advanced-logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';
import { calculateFourierSeries } from './logic.mjs';

const root = document.querySelector('[data-tool="fourier-series-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  let outputText = '';
  const locale = () => document.documentElement.lang || 'en';
  const format = (value, digits = 7) => numberFormat(locale(), value, digits);

  function createChart(result) {
    const namespace = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(namespace, 'svg');
    svg.setAttribute('viewBox', '0 0 640 240');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', copy.fields.chartLabel);
    svg.classList.add('fourier-series-chart');
    const title = document.createElementNS(namespace, 'title');
    title.textContent = copy.fields.chartLabel;
    svg.append(title);

    const allValues = [...result.samples, ...result.reconstruction];
    let min = Math.min(...allValues);
    let max = Math.max(...allValues);
    const padding = Math.max((max - min) * 0.08, Math.abs(max) * 0.04, Math.abs(min) * 0.04, 1e-9);
    min -= padding;
    max += padding;
    const y = (value) => 220 - ((value - min) / (max - min)) * 200;
    const xFor = (index, count) => 20 + (index / count) * 600;
    const pathFor = (values) => values.map((value, index) => `${index ? 'L' : 'M'}${xFor(index, values.length).toFixed(2)},${y(value).toFixed(2)}`).join(' ');
    const reconstruction = document.createElementNS(namespace, 'path');
    reconstruction.setAttribute('d', pathFor(result.reconstruction));
    reconstruction.classList.add('fourier-series-chart__reconstruction');
    reconstruction.setAttribute('fill', 'none');
    const samples = document.createElementNS(namespace, 'path');
    samples.setAttribute('d', pathFor(result.samples));
    samples.classList.add('fourier-series-chart__samples');
    samples.setAttribute('fill', 'none');
    svg.append(reconstruction, samples);
    result.samples.forEach((value, index) => {
      const point = document.createElementNS(namespace, 'circle');
      point.setAttribute('cx', xFor(index, result.samples.length).toFixed(2));
      point.setAttribute('cy', y(value).toFixed(2));
      point.setAttribute('r', '3.5');
      point.classList.add('fourier-series-chart__point');
      svg.append(point);
    });
    return svg;
  }

  function parseInputs() {
    const language = locale();
    const sampleText = form.elements.namedItem('samples').value;
    const samples = sampleText.split(/[;\n]+/u).map((value) => value.trim()).filter(Boolean).map((value) => parseLocalizedNumber(value, language));
    return {
      samples,
      period: parseLocalizedNumber(form.elements.namedItem('period').value, language),
      harmonics: parseLocalizedNumber(form.elements.namedItem('harmonics').value, language),
    };
  }

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const result = calculateFourierSeries(parseInputs());
      const rows = [
        [copy.fields.resultDc, format(result.dc)],
        [copy.fields.resultFrequency, `${format(result.fundamentalFrequency)} ${copy.fields.frequencyUnit}`],
        [copy.fields.resultHarmonics, `${result.harmonics} / ${result.maxHarmonics}`],
        [copy.fields.resultRms, format(result.rmsError)],
      ];
      for (const coefficient of result.coefficients) {
        rows.push([
          `${copy.fields.coefficient} ${format(coefficient.harmonic, 0)}`,
          `${copy.fields.coefficientA}: ${format(coefficient.a)}; ${copy.fields.coefficientB}: ${format(coefficient.b)}; ${copy.fields.coefficientAmplitude}: ${format(coefficient.amplitude)}; ${copy.fields.phase}: ${format(coefficient.phaseRadians)} ${copy.fields.radians}`,
        ]);
      }
      showRows(root, rows);
      const content = root.querySelector('[data-result-content]');
      const figure = document.createElement('figure');
      figure.className = 'fourier-series-figure';
      figure.append(createChart(result));
      const caption = document.createElement('figcaption');
      caption.textContent = `${copy.fields.samplesLegend} · ${copy.fields.reconstructionLegend}`;
      figure.append(caption);
      content.append(figure);
      outputText = `${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\n${copy.fields.formula}`;
      announce(root, result.isConstant ? copy.messages.calculatedConstant : copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  function setExample(values, harmonicCount) {
    form.elements.namedItem('samples').value = values.join('\n');
    form.elements.namedItem('period').value = '1';
    form.elements.namedItem('harmonics').value = String(harmonicCount);
    calculate();
  }

  form.addEventListener('submit', calculate);
  form.addEventListener('input', () => { clearResult(root); outputText = ''; announce(root, ''); });
  form.addEventListener('reset', () => setTimeout(() => { clearResult(root); outputText = ''; announce(root, ''); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    const count = 16;
    setExample(Array.from({ length: count }, (_, index) => 2 + 3 * Math.sin(2 * Math.PI * index / count)), 3);
  });
  root.querySelector('[data-action="constant"]')?.addEventListener('click', () => setExample(Array(16).fill(5), 7));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
