import { checkDivisibility, commonDivisorList } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="divisibility-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const result = root.querySelector('[data-divisibility-result]');
  const summary = root.querySelector('[data-divisibility-summary]');
  const integer = form.elements.namedItem('integer');
  const divisors = form.elements.namedItem('divisors');
  let latestSummary = '';
  const numberFormat = new Intl.NumberFormat(document.documentElement.lang || undefined, { maximumFractionDigits: 0 });

  function clearStaleResult() {
    result.hidden = true;
    summary.textContent = '';
    latestSummary = '';
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    try {
      const report = checkDivisibility({ integer: integer.value, divisors: divisors.value });
      const rows = report.results.map((item) => {
        const rule = copy.fields[item.ruleKey] ?? copy.fields.ruleGeneric;
        return `${item.divisor}: ${item.divisible ? copy.messages.divisible : copy.messages.notDivisible}; ${copy.fields.remainder}: ${item.remainder}${item.quotient === null ? '' : `; ${copy.fields.quotient}: ${item.quotient}`}; ${copy.fields.rule}: ${rule}`;
      });
      latestSummary = `${copy.fields.resultSummary}: ${numberFormat.format(BigInt(report.integer))}\n${rows.join('\n')}`;
      summary.textContent = latestSummary;
      result.hidden = false;
      announce(root, copy.messages.calculated, 'success');
    } catch {
      clearStaleResult();
      announce(root, copy.messages.checkInputs, 'error');
    }
  });

  form.addEventListener('input', clearStaleResult);
  form.addEventListener('change', clearStaleResult);

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    integer.value = '123';
    divisors.value = '2, 3';
    clearStaleResult();
    announce(root, copy.messages.exampleLoaded, 'info');
  });

  root.querySelector('[data-action="common-divisors"]')?.addEventListener('click', () => {
    divisors.value = commonDivisorList();
    clearStaleResult();
    announce(root, copy.messages.commonDivisorsLoaded, 'info');
  });

  root.querySelector('[data-action="copy"]')?.addEventListener('click', async () => {
    if (!latestSummary) return announce(root, copy.messages.calculateFirst, 'error');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(latestSummary);
      announce(root, copy.messages.copied, 'success');
    } catch {
      announce(root, copy.messages.copyUnavailable, 'error');
    }
  });

  form.addEventListener('reset', () => {
    queueMicrotask(clearStaleResult);
    announce(root, '');
  });
}
