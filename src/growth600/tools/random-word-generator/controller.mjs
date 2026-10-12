import { announce, readToolCopy } from '../controller-helpers.mjs';
import { createRandomWordSeed, generateRandomWords } from './logic.mjs';

const root = document.querySelector('[data-tool="random-word-generator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const list = root.querySelector('[data-word-results]');
  const result = root.querySelector('[data-result]');
  const copyButton = root.querySelector('[data-action="copy"]');
  const downloadButton = root.querySelector('[data-action="download"]');
  const locale = document.documentElement.lang;
  let dictionary;
  let dictionaryPromise;
  let latest = [];

  function loadDictionary() {
    if (dictionary) return Promise.resolve(dictionary);
    if (!dictionaryPromise) {
      dictionaryPromise = import(new URL('/assets/vendor/random-word-generator-dictionaries.mjs', location.origin).href).then(({ RANDOM_WORD_DICTIONARIES }) => {
        dictionary = RANDOM_WORD_DICTIONARIES[locale] ?? null;
        return dictionary;
      });
    }
    return dictionaryPromise;
  }

  function clearResult() {
    latest = [];
    list.replaceChildren();
    result.hidden = true;
    copyButton.disabled = true;
    downloadButton.disabled = true;
  }

  async function generate(event) {
    event?.preventDefault();
    clearResult();
    try {
      const words = await loadDictionary();
      if (!words) return announce(root, copy.messages.localeUnavailable, 'error');
      const seedField = form.elements.namedItem('seed');
      const seed = seedField.value.trim() || createRandomWordSeed();
      seedField.value = seed;
      const draw = generateRandomWords({
        words,
        category: form.elements.namedItem('category').value,
        minLength: Number(form.elements.namedItem('minLength').value),
        maxLength: Number(form.elements.namedItem('maxLength').value),
        count: Number(form.elements.namedItem('count').value),
        seed,
        locale,
      });
      latest = draw.words;
      list.replaceChildren(...latest.map((word) => {
        const item = document.createElement('li');
        item.textContent = word;
        return item;
      }));
      result.hidden = false;
      copyButton.disabled = false;
      downloadButton.disabled = false;
      announce(root, copy.messages.generated, 'success');
    } catch (error) {
      if (error.code === 'not-enough-matches') announce(root, copy.messages.notEnoughWords, 'error');
      else if (error.message === 'secure-random-unavailable') announce(root, copy.messages.seedUnavailable, 'error');
      else if (error.message === 'dictionary-unavailable' || error instanceof TypeError) announce(root, copy.messages.localeUnavailable, 'error');
      else announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.addEventListener('submit', generate);
  form.addEventListener('reset', () => setTimeout(() => { clearResult(); announce(root, ''); }, 0));
  form.addEventListener('input', (event) => {
    if (event.target.matches('input, select')) { clearResult(); announce(root, ''); }
  });
  root.querySelector('[data-action="example"]').addEventListener('click', () => {
    const example = copy.example;
    form.elements.namedItem('category').value = example.category;
    form.elements.namedItem('minLength').value = String(example.minLength);
    form.elements.namedItem('maxLength').value = String(example.maxLength);
    form.elements.namedItem('count').value = String(example.count);
    form.elements.namedItem('seed').value = '';
    generate();
  });
  copyButton.addEventListener('click', async () => {
    if (!latest.length) return;
    try { await navigator.clipboard.writeText(latest.join('\n')); announce(root, copy.messages.copied, 'success'); }
    catch { announce(root, copy.messages.copyUnavailable, 'error'); }
  });
  downloadButton.addEventListener('click', () => {
    if (!latest.length) return;
    const url = URL.createObjectURL(new Blob([`${latest.join('\n')}\n`], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'random-words.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce(root, copy.messages.downloaded, 'success');
  });
  clearResult();
}
