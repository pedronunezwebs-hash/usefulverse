import {
  PRODUCT_LANGUAGES,
  fromBrowserLanguage,
  validateTranslationRequest,
  MAX_TEXT_LENGTH,
} from './logic.mjs';

const root = document.querySelector('[data-tool="text-translator"]');
if (root) {
  const form = root.querySelector('[data-text-translator-form]');
  const sourceSelect = form.elements.namedItem('source');
  const targetSelect = form.elements.namedItem('target');
  const input = form.elements.namedItem('text');
  const output = root.querySelector('[data-translation-output]');
  const status = root.querySelector('[data-status]');
  const progress = root.querySelector('[data-progress]');
  const length = form.querySelector('[data-length]');
  const translateButton = form.querySelector('[data-translate]');
  const copyButton = form.querySelector('[data-copy]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const names = new Intl.DisplayNames([document.documentElement.lang || 'en'], { type: 'language' });
  let requestId = 0;
  let activeTranslator;

  function fillLanguages() {
    sourceSelect.replaceChildren(new Option(copy.fields.autoDetect, 'auto'));
    targetSelect.replaceChildren(new Option(copy.fields.chooseTarget, ''));
    for (const locale of PRODUCT_LANGUAGES) {
      const name = names.of(locale) || locale;
      sourceSelect.append(new Option(name, locale));
      targetSelect.append(new Option(name, locale));
    }
    sourceSelect.value = 'auto';
    targetSelect.value = 'es';
  }

  function announce(message, isError = false) {
    status.textContent = message;
    status.classList.toggle('status--error', isError);
    status.classList.toggle('status--success', Boolean(message) && !isError);
  }

  fillLanguages();
  input.maxLength = MAX_TEXT_LENGTH;
  form.addEventListener('input', (event) => {
    if (event.target === input) {
      output.value = '';
      copyButton.disabled = true;
      length.textContent = String(input.value.length);
    }
  });
  form.addEventListener('change', () => {
    output.value = '';
    copyButton.disabled = true;
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const thisRequest = ++requestId;
    activeTranslator?.destroy?.();
    activeTranslator = undefined;
    translateButton.disabled = true;
    copyButton.disabled = true;
    output.value = '';
    progress.textContent = '';

    try {
      announce(copy.messages.preparing);
      if (!input.value.trim()) throw Object.assign(new Error(), { code: 'empty-text' });
      if (input.value.length > MAX_TEXT_LENGTH) throw Object.assign(new Error(), { code: 'text-too-long' });
      if (!('Translator' in self)) throw Object.assign(new Error(), { code: 'api-unavailable' });
      let sourceLocale = sourceSelect.value;
      if (sourceLocale === 'auto') {
        if (!('LanguageDetector' in self)) throw Object.assign(new Error(), { code: 'detector-unavailable' });
        const detector = await LanguageDetector.create({
          monitor(monitor) {
            monitor.addEventListener('downloadprogress', (downloadEvent) => {
              if (thisRequest !== requestId) return;
              progress.textContent = copy.messages.detectionDownloading.replace('{percent}', String(Math.round(downloadEvent.loaded * 100)));
            });
          },
        });
        let detected;
        try {
          detected = await detector.detect(input.value);
        } finally {
          detector.destroy?.();
        }
        if (thisRequest !== requestId) return;
        sourceLocale = fromBrowserLanguage(detected?.[0]?.detectedLanguage);
        if (!sourceLocale || Number(detected?.[0]?.confidence ?? 0) < 0.35) {
          throw Object.assign(new Error(), { code: 'detection-failed' });
        }
      }
      const request = validateTranslationRequest({ text: input.value, source: sourceLocale, target: targetSelect.value });
      announce(copy.messages.preparing);
      const availability = await Translator.availability({
        sourceLanguage: request.sourceCode,
        targetLanguage: request.targetCode,
      });
      if (thisRequest !== requestId) return;
      if (availability === 'unavailable') throw Object.assign(new Error(), { code: 'pair-unavailable' });
      const translator = await Translator.create({
        sourceLanguage: request.sourceCode,
        targetLanguage: request.targetCode,
        monitor(monitor) {
          monitor.addEventListener('downloadprogress', (downloadEvent) => {
            if (thisRequest !== requestId) return;
            progress.textContent = copy.messages.downloading.replace('{percent}', String(Math.round(downloadEvent.loaded * 100)));
          });
        },
      });
      activeTranslator = translator;
      if (thisRequest !== requestId) {
        translator.destroy?.();
        return;
      }
      output.value = await translator.translate(request.text);
      if (thisRequest !== requestId) {
        output.value = '';
        return;
      }
      copyButton.disabled = !output.value;
      announce(copy.messages.complete);
    } catch (error) {
      if (thisRequest !== requestId) return;
      const messages = {
        'api-unavailable': copy.messages.apiUnavailable,
        'detector-unavailable': copy.messages.detectorUnavailable,
        'detection-failed': copy.messages.detectionFailed,
        'pair-unavailable': copy.messages.pairUnavailable,
        'empty-text': copy.messages.emptyText,
        'text-too-long': copy.messages.tooLong,
        'same-language': copy.messages.sameLanguage,
        'unsupported-language': copy.messages.unsupportedLanguage,
      };
      announce(messages[error?.code] ?? copy.messages.failed, true);
    } finally {
      if (thisRequest === requestId) translateButton.disabled = false;
    }
  });

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(output.value);
      announce(copy.messages.copied);
    } catch {
      announce(copy.messages.copyFailed, true);
    }
  });

  form.addEventListener('reset', () => {
    requestId += 1;
    activeTranslator?.destroy?.();
    activeTranslator = undefined;
    queueMicrotask(() => {
      output.value = '';
      progress.textContent = '';
      length.textContent = '0';
      copyButton.disabled = true;
      translateButton.disabled = false;
      announce('');
      sourceSelect.value = 'auto';
      targetSelect.value = 'es';
    });
  });
}
