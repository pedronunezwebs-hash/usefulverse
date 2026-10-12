import { createNameGeneratorSeed, generateNames } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="name-generator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const type = form.elements.type;
  const count = form.elements.count;
  const keyword = form.elements.keyword;
  const seed = form.elements.seed;
  const result = root.querySelector('[data-result]');
  const list = root.querySelector('[data-name-results]');
  const seedOutput = root.querySelector('[data-name-seed]');
  const copyButton = root.querySelector('[data-action="copy"]');
  const downloadButton = root.querySelector('[data-action="download"]');
  let generated = null;

  function renderNames() {
    list.replaceChildren();
    for (const name of generated?.names ?? []) {
      const item = document.createElement('li');
      item.textContent = name;
      list.append(item);
    }
    seedOutput.textContent = `${copy.fields.seed}: ${generated?.seed ?? ''}`;
    result.hidden = !generated;
    copyButton.disabled = !generated?.names.length;
    downloadButton.disabled = !generated?.names.length;
  }

  function run() {
    try {
      if (!seed.value.trim()) seed.value = createNameGeneratorSeed();
      generated = generateNames({ type: type.value, count: Number(count.value), keyword: keyword.value, seed: seed.value });
      renderNames();
      announce(root, copy.messages.generated.replace('{count}', String(generated.names.length)), 'success');
      return true;
    } catch (error) {
      generated = null;
      renderNames();
      const message = error.message === 'secure-random-unavailable' ? copy.messages.seedUnavailable : copy.messages.checkInputs;
      announce(root, message, 'error');
      return false;
    }
  }

  function saveText(filename) {
    if (!generated?.names.length) return;
    const blob = new Blob([generated.names.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  form.addEventListener('submit', (event) => { event.preventDefault(); run(); });
  form.addEventListener('reset', () => {
    generated = null;
    setTimeout(() => {
      type.value = 'fantasy'; count.value = '10'; keyword.value = '';
      try { seed.value = createNameGeneratorSeed(); } catch { seed.value = ''; }
      renderNames();
      announce(root, '', 'info');
    }, 0);
  });
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    type.value = 'business'; count.value = '10'; keyword.value = 'Copper & Pine'; seed.value = 'example-brand-2026';
    run();
    announce(root, copy.messages.exampleLoaded, 'info');
  });
  copyButton.addEventListener('click', async () => {
    if (!generated?.names.length) return;
    try {
      await navigator.clipboard.writeText(generated.names.join('\n'));
      announce(root, copy.messages.copied, 'success');
    } catch { announce(root, copy.messages.copyUnavailable, 'error'); }
  });
  downloadButton.addEventListener('click', () => {
    saveText('usefulverse-name-ideas.txt');
    announce(root, copy.messages.downloaded, 'success');
  });

  try { seed.value = createNameGeneratorSeed(); } catch { seed.value = ''; }
  renderNames();
}
