import { lookupCmuWords, parseCmuDictionary, validateTranscriptionInput } from './logic.mjs';

const root = document.querySelector('[data-ipa-transcriber]');
if (root) {
  const form = root.querySelector('form');
  const status = root.querySelector('[data-status]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  let dictionaryPromise;

  const announce = (message, error = false) => {
    status.textContent = message;
    status.classList.toggle('status--error', error);
  };
  const node = (tag, text) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = String(text);
    return element;
  };
  const loadDictionary = () => {
    if (!dictionaryPromise) {
      dictionaryPromise = fetch(new URL('/assets/ipa-transcriber/cmudict-2026-10-20.dict', location.origin), {
        method: 'GET', mode: 'same-origin', credentials: 'same-origin', redirect: 'error',
        referrerPolicy: 'no-referrer', cache: 'force-cache', signal: AbortSignal.timeout(15_000),
      }).then(async (response) => {
        if (!response.ok) throw new Error('data');
        const length = Number(response.headers.get('content-length'));
        if (Number.isFinite(length) && length > 6 * 1024 * 1024) throw new Error('size');
        const reader = response.body?.getReader();
        if (!reader) throw new Error('data');
        const chunks = [];
        let size = 0;
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            size += value.byteLength;
            if (size > 6 * 1024 * 1024) {
              await reader.cancel();
              throw new Error('size');
            }
            chunks.push(value);
          }
        } finally {
          reader.releaseLock();
        }
        const bytes = new Uint8Array(size);
        let offset = 0;
        for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
        const source = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
        return parseCmuDictionary(source);
      }).catch((error) => {
        dictionaryPromise = null;
        throw error;
      });
    }
    return dictionaryPromise;
  };

  form.addEventListener('reset', () => {
    content.replaceChildren();
    result.hidden = true;
    announce('');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = form.querySelector('[data-input="text"]');
    content.replaceChildren();
    result.hidden = true;
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
      validateTranscriptionInput(input.value);
      announce(copy.messages.loadingData);
      const dictionary = await loadDictionary();
      const lookup = lookupCmuWords(dictionary, input.value);
      const summary = node('p', copy.messages.coverage);
      summary.className = 'hint';
      content.append(summary);
      for (const entry of lookup.words) {
        const group = node('section');
        const heading = node('h3', entry.word.toLocaleLowerCase('en-US'));
        group.append(heading);
        if (entry.pronunciations.length) {
          const list = node('ol');
          for (const pronunciation of entry.pronunciations) {
            const line = node('li');
            const ipa = node('span', `/${pronunciation.ipa}/`);
            const arpabet = node('code', pronunciation.arpabet);
            line.append(ipa, document.createTextNode(' — '), arpabet);
            list.append(line);
          }
          group.append(list);
        } else {
          const missing = node('p', copy.messages.notFound);
          missing.className = 'hint';
          group.append(missing);
        }
        content.append(group);
      }
      result.hidden = false;
      announce(lookup.unsupported.length ? copy.messages.partial : copy.messages.complete);
    } catch (error) {
      const code = error?.code;
      announce(code === 'invalid-input' ? copy.messages.invalid : error?.message === 'size' ? copy.messages.dataTooLarge : copy.messages.dataUnavailable, true);
    } finally {
      submit.disabled = false;
    }
  });
}
