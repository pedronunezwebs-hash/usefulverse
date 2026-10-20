import { inspectEmailAddress } from './logic.mjs';

const root = document.querySelector('[data-tool="email-address-validator"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  form.addEventListener('submit', (event) => {
    event.preventDefault(); content.replaceChildren(); status.textContent = ''; status.classList.remove('status--error');
    const checked = inspectEmailAddress(form.querySelector('[data-input="address"]').value);
    if (!checked.valid) {
      const message = document.createElement('p'); message.textContent = copy.fields[checked.reason] ?? copy.fields.invalid; message.className = 'status status--error'; content.append(message);
    } else {
      const heading = document.createElement('h3'); heading.textContent = copy.fields.syntaxPlausible; content.append(heading);
      for (const [label, value] of [[copy.fields.address, checked.address], [copy.fields.asciiDomain, checked.asciiDomain]]) {
        const row = document.createElement('p'); const strong = document.createElement('strong'); strong.textContent = `${label}: `; row.append(strong, document.createTextNode(value)); content.append(row);
      }
      const limits = document.createElement('p'); limits.textContent = copy.fields.notVerified; content.append(limits);
    }
    result.hidden = false;
  });
  form.addEventListener('reset', () => queueMicrotask(() => { content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
