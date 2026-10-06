import { parseChartCsv } from './chart-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);
const addSvgElement = (parent, name, attrs = {}, text = '') => {
  const node = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  if (text) node.textContent = text;
  parent.append(node);
  return node;
};

function drawChart(root, rows, type) {
  const svg = $('[data-op-svg]', root);
  const points = rows.map(({ label, value }) => [label, value]);
  const max = Math.max(0, ...points.map(([, value]) => value));
  const min = Math.min(0, ...points.map(([, value]) => value));
  const range = max - min || 1;
  const y = (value) => 280 - (value - min) / range * 230;
  svg.replaceChildren();
  svg.setAttribute('viewBox', '0 0 640 360');
  addSvgElement(svg, 'title', {}, 'Chart preview');
  addSvgElement(svg, 'path', { d: 'M56 24V300H624', fill: 'none', stroke: 'currentColor', opacity: '.45' });
  if (type === 'line') {
    const x = (index) => 72 + index * 536 / (points.length - 1);
    addSvgElement(svg, 'path', { d: points.map(([, value], i) => `${i ? 'L' : 'M'}${x(i)},${y(value)}`).join(' '), fill: 'none', stroke: '#2563eb', 'stroke-width': 4 });
    points.forEach(([label, value], i) => {
      addSvgElement(svg, 'circle', { cx: x(i), cy: y(value), r: 5, fill: '#2563eb' });
      addSvgElement(svg, 'text', { x: x(i), y: 320, 'text-anchor': 'middle', 'font-size': 12 }, label);
    });
  } else {
    const width = Math.min(64, 500 / points.length);
    const gap = (536 - width * points.length) / (points.length + 1);
    points.forEach(([label, value], i) => {
      const x = 62 + gap + i * (width + gap); const valueY = y(value); const zeroY = y(0);
      addSvgElement(svg, 'rect', { x, y: Math.min(valueY, zeroY), width, height: Math.max(1, Math.abs(zeroY - valueY)), fill: '#2563eb', rx: 3 });
      addSvgElement(svg, 'text', { x: x + width / 2, y: 320, 'text-anchor': 'middle', 'font-size': 12 }, label);
    });
  }
  $('#op-output', root).textContent = points.map(([label, value]) => `${label},${value}`).join('\n');
  const link = $('[data-op-download]', root);
  if (link.dataset.objectUrl) URL.revokeObjectURL(link.dataset.objectUrl);
  link.href = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' }));
  link.dataset.objectUrl = link.href;
  link.download = 'usefulverse-chart.svg';
  link.hidden = false;
}

export function setupChartMaker(root) {
  const bundle = window.usefulverseLocale ?? { runtime: {}, messages: {} };
  const say = (text) => bundle.runtime?.[text] ?? bundle.messages?.[text] ?? text;
  const status = (message, type = '') => {
    const node = $('[role="status"]', root);
    if (node) { node.textContent = say(message); node.className = `tool-status${type ? ` is-${type}` : ''}`; }
  };
  const clearResult = () => {
    const svg = $('[data-op-svg]', root); const link = $('[data-op-download]', root);
    svg.replaceChildren(); $('#op-output', root).textContent = '—';
    if (link.dataset.objectUrl) URL.revokeObjectURL(link.dataset.objectUrl);
    link.removeAttribute('href'); delete link.dataset.objectUrl; link.hidden = true;
  };
  root.addEventListener('click', async (event) => {
    if (event.target.closest('[data-op-calculate]')) {
      try {
        const rows = parseChartCsv($('[data-op-field="csv"]', root).value);
        drawChart(root, rows, $('[data-op-field="type"]', root).value);
        status('Chart created locally in this browser.', 'success');
      } catch (error) {
        clearResult();
        status(error instanceof Error ? error.message : 'Check your inputs and try again.', 'error');
      }
      return;
    }
    if (event.target.closest('[data-op-clear]')) {
      $('[data-op-field="csv"]', root).value = '';
      $('[data-op-field="type"]', root).value = 'bar';
      clearResult(); status('Fields cleared.'); $('[data-op-field="csv"]', root).focus();
      return;
    }
    if (event.target.closest('[data-op-copy]')) {
      const text = $('#op-output', root).textContent;
      if (!text || text === '—') return status('There is nothing to copy yet.', 'error');
      try { await navigator.clipboard.writeText(text); status('Copied to your clipboard.', 'success'); }
      catch { status('Copy was blocked. Select the result and copy it manually.', 'error'); }
    }
  });
  window.addEventListener('pagehide', () => {
    const link = $('[data-op-download]', root);
    if (link.dataset.objectUrl) URL.revokeObjectURL(link.dataset.objectUrl);
  }, { once: true });
}
