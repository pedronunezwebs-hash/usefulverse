import { analyzeReadability, MAX_READABILITY_CHARS } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="readability-checker"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const input = form.elements.namedItem('text');
  const language = form.elements.namedItem('language');
  const result = root.querySelector('[data-readability-result]');
  const score = root.querySelector('[data-readability-score]');
  const exampleButton = root.querySelector('[data-action="example"]');
  const outputSelectors = {
    wordCount: '[data-readability-words]',
    sentenceCount: '[data-readability-sentences]',
    characterCount: '[data-readability-characters]',
    characterCountNoSpaces: '[data-readability-characters-no-spaces]',
    letterCount: '[data-readability-letters]',
    syllableEstimate: '[data-readability-syllables]',
    averageSentenceLength: '[data-readability-average-sentence]',
    averageWordLength: '[data-readability-average-word]',
    averageSyllablesPerWord: '[data-readability-average-syllables]',
    longWordCount: '[data-readability-long-words]',
  };
  const examples = {
    en: 'Clear writing uses short sentences. It keeps each idea easy to follow.',
    es: 'Un texto claro usa frases cortas. Así cada idea se entiende mejor.',
    fr: 'Un texte clair utilise des phrases courtes. Chaque idée devient plus simple à suivre.',
    de: 'Ein klarer Text nutzt kurze Sätze. So lässt sich jeder Gedanke leichter verstehen.',
    it: 'Un testo chiaro usa frasi brevi. Così ogni idea è più facile da seguire.',
  };
  let latestSummary = '';
  const pageLanguage = document.documentElement.lang.split('-')[0].toLowerCase();
  if (['en', 'es', 'fr', 'de', 'it'].includes(pageLanguage)) language.value = pageLanguage;
  const numberFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });

  function clearStaleResult() {
    result.hidden = true;
    latestSummary = '';
  }

  input.addEventListener('input', clearStaleResult);
  language.addEventListener('change', clearStaleResult);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = input.value;
    if (!text.trim()) {
      input.setAttribute('aria-invalid', 'true');
      announce(root, copy.messages.emptyInput, 'error');
      input.focus();
      return;
    }
    if (text.length > MAX_READABILITY_CHARS) {
      input.setAttribute('aria-invalid', 'true');
      announce(root, copy.messages.inputTooLarge, 'error');
      input.focus();
      return;
    }
    input.removeAttribute('aria-invalid');
    const report = analyzeReadability(text, language.value);
    const scoreText = report.score === null
      ? copy.messages.noScore
      : `${report.formula.name}: ${numberFormatter.format(report.score)}`;
    const shortSampleNote = report.needsLongerSample ? ` ${copy.messages.shortSample}` : '';
    score.textContent = `${scoreText}${shortSampleNote}`;
    for (const [key, selector] of Object.entries(outputSelectors)) {
      root.querySelector(selector).textContent = numberFormatter.format(report[key]);
    }
    root.querySelector('[data-readability-formula]').textContent = `${copy.fields.formula}: ${report.formula.name}. ${copy.fields.accuracyNote}`;
    result.hidden = false;
    latestSummary = `${scoreText}\n${Object.entries(outputSelectors).map(([key, selector]) => `${copy.fields[key]}: ${root.querySelector(selector).textContent}`).join('\n')}`;
    announce(root, copy.messages.analyzed, 'success');
  });

  exampleButton?.addEventListener('click', () => {
    input.value = examples[language.value] ?? examples.en;
    input.removeAttribute('aria-invalid');
    result.hidden = true;
    input.focus();
    announce(root, copy.messages.exampleLoaded, 'info');
  });

  root.querySelector('[data-action="copy"]')?.addEventListener('click', async () => {
    if (!latestSummary) {
      announce(root, copy.messages.analyzeFirst, 'error');
      return;
    }
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable.');
      await navigator.clipboard.writeText(latestSummary);
      announce(root, copy.messages.copied, 'success');
    } catch {
      announce(root, copy.messages.copyUnavailable, 'error');
    }
  });

  form.addEventListener('reset', () => {
    input.removeAttribute('aria-invalid');
    clearStaleResult();
    announce(root, '');
  });
}
