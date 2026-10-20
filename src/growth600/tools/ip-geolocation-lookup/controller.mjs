import { lookupIpRegistration } from './logic.mjs';

const root = document.querySelector('[data-tool="ip-geolocation-lookup"]');
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
  let requestId = 0;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const currentRequest = ++requestId;
    const button = form.querySelector('[data-action="run"]');
    button.disabled = true;
    content.replaceChildren();
    result.hidden = true;
    status.textContent = m.loading;
    status.classList.remove('status--error');
    try {
      const data = await lookupIpRegistration(form.elements.namedItem('ip').value);
      if (currentRequest !== requestId) return;
      const stateKey = ({ ok: 'queryOk', 'no-registry': 'noRegistry', 'not-found': 'notFound', unavailable: 'registryUnavailable', 'rate-limited': 'rateLimited', 'response-too-large': 'responseTooLarge', 'invalid-response': 'invalidResponse' })[data.queryState];
      const list = node('dl');
      const add = (label, value) => list.append(node('dt', label), node('dd', value));
      add(f.ipAddress, data.address);
      add(f.queryStatus, f[stateKey] ?? f.invalidResponse);
      if (data.registryHost) add(f.registry, data.registryHost);
      if (data.queryState === 'ok') {
        if (data.networkName) add(f.networkName, data.networkName);
        if (data.handle) add(f.networkHandle, data.handle);
        if (data.startAddress || data.endAddress) add(f.addressRange, `${data.startAddress || '—'} – ${data.endAddress || '—'}`);
        if (data.country) add(f.registrationCountry, data.country);
        if (data.networkType) add(f.networkType, data.networkType);
        if (data.status.length) add(f.registrationStatus, data.status.join(' · '));
      }
      content.append(list);
      const note = node('p', f.limitNote, 'hint');
      content.append(note);
      const source = node('a', f.ianaSource);
      source.href = 'https://www.iana.org/assignments/rdap-ipv4';
      source.target = '_blank';
      source.rel = 'noopener noreferrer';
      content.append(source);
      const source6 = node('a', f.ianaSourceIPv6);
      source6.href = 'https://www.iana.org/assignments/rdap-ipv6';
      source6.target = '_blank';
      source6.rel = 'noopener noreferrer';
      content.append(node('span', ' · '), source6);
      status.textContent = m.complete;
      result.hidden = false;
    } catch (error) {
      if (currentRequest !== requestId) return;
      status.textContent = error instanceof RangeError ? m.invalid : m.registryUnavailable;
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
