import { runInternetSpeedCheck } from './logic.mjs';

const root = document.querySelector('[data-tool="internet-speed-test"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const { fields: f, messages: m } = copy;
  const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = String(text);
    if (className) element.className = className;
    return element;
  };
  const number = (value, digits = 1) => new Intl.NumberFormat(document.documentElement.lang || 'en', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
  let requestId = 0;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const currentRequest = ++requestId;
    const button = form.querySelector('[data-action="run"]');
    button.disabled = true;
    result.hidden = true;
    content.replaceChildren();
    status.classList.remove('status--error');
    try {
      const data = await runInternetSpeedCheck((phase, current, total) => {
        if (currentRequest !== requestId) return;
        status.textContent = phase === 'latency' ? m.measuringLatency : phase === 'download' ? m.measuringDownload : m.downloadSample.replace('{current}', String(current)).replace('{total}', String(total));
      });
      if (currentRequest !== requestId) return;
      const list = node('dl');
      const add = (label, value) => list.append(node('dt', label), node('dd', value));
      add(f.downloadSpeed, `${number(data.downloadMbps)} Mbps`);
      add(f.medianLatency, `${number(data.latencyMs, 0)} ms`);
      add(f.jitter, `${number(data.jitterMs)} ms`);
      add(f.dataUsed, `${number(data.bytesReceived / (1024 * 1024), 2)} MiB`);
      add(f.measurementTime, new Intl.DateTimeFormat(document.documentElement.lang || 'en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(data.completedAt)));
      content.append(list);
      content.append(node('p', f.limitNote, 'hint'));
      const source = node('a', f.costSource);
      source.href = 'https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/';
      source.target = '_blank';
      source.rel = 'noopener noreferrer';
      content.append(source);
      status.textContent = m.complete;
      result.hidden = false;
    } catch (error) {
      if (currentRequest !== requestId) return;
      status.textContent = error?.name === 'TimeoutError' ? m.timeout : m.unavailable;
      status.classList.add('status--error');
      result.hidden = false;
    } finally {
      if (currentRequest === requestId) button.disabled = false;
    }
  });

  form.addEventListener('reset', () => queueMicrotask(() => {
    requestId += 1;
    content.replaceChildren();
    status.textContent = '';
    status.classList.remove('status--error');
    result.hidden = true;
    const button = form.querySelector('[data-action="run"]');
    if (button) button.disabled = false;
  }));
}
