import { estimateBrazilThirteenth } from './logic.mjs';

const root = document.querySelector('[data-tool="brazil-thirteenth-salary"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const node = (tag, text) => { const element = document.createElement(tag); if (text !== undefined) element.textContent = String(text); return element; };
  const money = (value) => new Intl.NumberFormat(document.documentElement.lang || 'pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    content.replaceChildren();
    try {
      const estimate = estimateBrazilThirteenth({
        monthlyRemuneration: form.elements.namedItem('monthlyRemuneration').value,
        eligibleMonths: form.elements.namedItem('eligibleMonths').value,
        advancePaid: form.elements.namedItem('advancePaid').value || 0,
        inssWithheld: form.elements.namedItem('inssWithheld').value || 0,
        incomeTaxWithheld: form.elements.namedItem('incomeTaxWithheld').value || 0,
      });
      const list = node('dl');
      for (const [key, value] of [
        ['year', estimate.year], ['eligibleMonthsResult', estimate.eligibleMonths],
        ['grossEstimate', money(estimate.gross)], ['advanceResult', money(estimate.advance)],
        ['inssResult', money(estimate.inssWithheld)], ['incomeTaxResult', money(estimate.incomeTaxWithheld)],
        ['remainingEstimate', money(estimate.remainingEstimate)],
      ]) list.append(node('dt', copy.fields[key]), node('dd', value));
      content.append(list);
      for (const [key, url] of [
        ['officialAccrual', 'https://www.planalto.gov.br/ccivil_03/leis/l4090.htm'],
        ['officialPaymentRules', 'https://www.planalto.gov.br/ccivil_03/leis/l4749.htm'],
        ['officialGovernmentGuide', 'https://acesso.mte.gov.br/data/files/FF8080812CD2239D012CE0B8674478C6/manual_empregador_port.pdf'],
      ]) {
        const link = node('a', copy.fields[key]); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
        content.append(link, document.createElement('br'));
      }
      status.textContent = copy.messages.complete;
      status.classList.remove('status--error');
      result.hidden = false;
    } catch (error) {
      status.textContent = copy.messages[error?.code] ?? copy.messages.error;
      status.classList.add('status--error');
      result.hidden = false;
    }
  });
  form.addEventListener('reset', () => queueMicrotask(() => {
    content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error');
  }));
}
