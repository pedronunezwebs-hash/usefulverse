import { announce, readToolCopy } from '../controller-helpers.mjs';
import { parseRepeatingDecimal } from './logic.mjs';

const root = document.querySelector('[data-tool="repeating-decimal-to-fraction"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const input = form.elements.namedItem('decimal');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  let copyValue = '';

  function clear() {
    result.hidden = true;
    content.replaceChildren();
    copyValue = '';
  }

  function addLine(parent, label, value, className) {
    const p = document.createElement('p');
    if (className) p.className = className;
    const strong = document.createElement('strong');
    strong.textContent = `${label}: `;
    p.append(strong, document.createTextNode(value));
    parent.append(p);
  }

  function calculate(event) {
    event?.preventDefault();
    clear();
    try {
      const fraction = parseRepeatingDecimal(input.value);
      const sign = fraction.isNegative ? '−' : '';
      const exact = `${fraction.numerator}/${fraction.denominator}`;
      addLine(content, copy.fields.simplified, exact, 'repeating-fraction-result');
      if (!fraction.isInteger && fraction.whole !== '0') {
        addLine(content, copy.fields.mixedNumber, `${sign}${fraction.whole} ${fraction.remainder}/${fraction.denominator}`);
      }
      const rawNumerator = BigInt(fraction.rawNumerator);
      const rawDenominator = BigInt(fraction.rawDenominator);
      const signedSubtraction = fraction.isNegative ? `−(${fraction.upper} − ${fraction.lower})` : `(${fraction.upper} − ${fraction.lower})`;
      const subtraction = `${signedSubtraction} / [10^${fraction.nonrepeatingDigits} × (10^${fraction.repeatingDigits} − 1)] = ${rawNumerator}/${rawDenominator} = ${exact}`;
      addLine(content, copy.fields.derivation, subtraction);
      copyValue = exact;
      result.hidden = false;
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  input.addEventListener('input', () => { clear(); announce(root, ''); });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => queueMicrotask(() => { clear(); announce(root, ''); }));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    input.value = '0.1(6)';
    calculate();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', async () => {
    if (!copyValue) return announce(root, copy.messages.checkInputs, 'error');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(copyValue);
      announce(root, copy.messages.copied, 'success');
    } catch {
      announce(root, copy.messages.copyUnavailable, 'error');
    }
  });
}
