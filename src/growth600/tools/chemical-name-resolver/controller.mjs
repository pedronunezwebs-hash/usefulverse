import { readToolCopy } from '../controller-helpers.mjs';
import { createPubChemNameUrl, parsePubChemNameResults } from './logic.mjs';

const root = document.querySelector('[data-chemical-name-resolver]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('form');
  const queryInput = form.elements.namedItem('query');
  const status = root.querySelector('[data-status]');
  const results = root.querySelector('[data-results]');
  const resultSection = root.querySelector('[data-result]');
  const submit = form.querySelector('button[type="submit"]');
  const readBoundedText = async (response, maxBytes) => {
    const reader = response.body?.getReader();
    if (!reader) throw new TypeError('PubChem response stream is unavailable.');
    const chunks = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maxBytes) {
        await reader.cancel();
        const error = new RangeError('PubChem response exceeded its size limit.');
        error.code = 'response-too-large';
        throw error;
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return new TextDecoder().decode(bytes);
  };
  const element = (tag, value) => {
    const node = document.createElement(tag);
    if (value !== undefined) node.textContent = String(value);
    return node;
  };
  const showResults = (records) => {
    const fragment = document.createDocumentFragment();
    for (const record of records) {
      const article = element('article');
      article.className = 'chemical-name-resolver__record';
      const heading = element('h3', record.title || `${copy.fields.compound} ${record.cid}`);
      article.append(heading);
      const list = element('dl');
      const add = (label, value) => {
        if (value === '' || value === null) return;
        list.append(element('dt', label), element('dd', value));
      };
      add(copy.fields.cid, record.cid);
      add(copy.fields.iupacName, record.iupacName);
      add(copy.fields.formula, record.molecularFormula);
      add(copy.fields.molecularWeight, record.molecularWeight === null ? '' : `${record.molecularWeight} g/mol`);
      add(copy.fields.inchiKey, record.inchiKey);
      add(copy.fields.smiles, record.canonicalSmiles);
      article.append(list);
      fragment.append(article);
    }
    results.replaceChildren(fragment);
    resultSection.hidden = false;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    results.replaceChildren();
    resultSection.hidden = true;
    status.classList.remove('status--error');
    let url;
    try { url = createPubChemNameUrl(queryInput.value); }
    catch { status.textContent = copy.messages.invalidQuery; status.classList.add('status--error'); return; }
    submit.disabled = true;
    status.textContent = copy.messages.searching;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        redirect: 'error',
        signal: AbortSignal.timeout(10000),
      });
      if (response.status === 400 || response.status === 404) { status.textContent = copy.messages.noMatches; return; }
      if (response.status === 429 || response.status === 503) { status.textContent = copy.messages.rateLimited; return; }
      if (!response.ok) { status.textContent = copy.messages.unavailable; return; }
      const size = Number(response.headers.get('content-length') || 0);
      if (size > 256_000) { status.textContent = copy.messages.responseTooLarge; return; }
      let text;
      try { text = await readBoundedText(response, 256_000); }
      catch (error) {
        status.textContent = error?.code === 'response-too-large' ? copy.messages.responseTooLarge : copy.messages.unavailable;
        return;
      }
      let payload;
      try { payload = JSON.parse(text); }
      catch { status.textContent = copy.messages.invalidResponse; return; }
      const records = parsePubChemNameResults(payload);
      if (!records.length) { status.textContent = copy.messages.noMatches; return; }
      showResults(records);
      status.textContent = copy.messages.complete.replace('{count}', String(records.length));
    } catch (error) {
      status.textContent = error?.code === 'invalid-response' ? copy.messages.invalidResponse : copy.messages.unavailable;
      status.classList.add('status--error');
    } finally {
      submit.disabled = false;
    }
  });

  form.addEventListener('reset', () => queueMicrotask(() => {
    results.replaceChildren();
    resultSection.hidden = true;
    status.textContent = '';
    status.classList.remove('status--error');
  }));
}
