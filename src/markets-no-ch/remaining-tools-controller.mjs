import { calculateRemainingTool, escapeRemainingHtml } from './remaining-tools.mjs';
const root = document.querySelector('[data-remaining-tool]');
if (root) {
  const mode = root.dataset.remainingTool;
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields; const form = root.querySelector('form'); const result = root.querySelector('[data-remaining-result]'); const status = root.querySelector('[data-remaining-status]');
  const money = (value) => new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'currency', currency: 'CHF', maximumFractionDigits: 2 }).format(value);
  const setRows = (rows) => `<h3>${escapeRemainingHtml(f.resultHeading)}</h3><dl>${rows.map(([label, value]) => `<dt>${escapeRemainingHtml(f[label])}</dt><dd>${money(value)}</dd>`).join('')}</dl>`;
  const values = () => Object.fromEntries(new FormData(form).entries());
  const readFile = async (file) => {
    if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) return file.text();
    if (file.name.toLowerCase().endsWith('.docx')) {
      const { unzipSync, strFromU8 } = await import('fflate');
      const xml = strFromU8(unzipSync(new Uint8Array(await file.arrayBuffer()))['word/document.xml']);
      if (!xml) throw new Error('Missing Word document text');
      const parsed = new DOMParser().parseFromString(xml, 'application/xml');
      return [...parsed.getElementsByTagName('w:p')].map((p) => [...p.getElementsByTagName('w:t')].map((t) => t.textContent).join('')).join('\n');
    }
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), disableWorker: true }).promise;
      const pages = [];
      for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
        const page = await pdf.getPage(pageNo); const content = await page.getTextContent();
        pages.push(content.items.map((item) => item.str).join(' '));
      }
      return pages.join('\n');
    }
    throw new Error('Unsupported file');
  };
  root.addEventListener('change', async (event) => {
    if (mode === 'spellcheck' && event.target.name === 'language') { form.elements.text.lang = event.target.value.trim() || 'en'; return; }
    if (mode === 'resume' && event.target.name === 'file' && event.target.files[0]) {
      try { form.elements.text.value = await readFile(event.target.files[0]); status.textContent = copy.messages.done; }
      catch { status.textContent = copy.messages.invalid; }
    }
  });
  root.addEventListener('click', async (event) => {
    if (event.target.closest('[type="reset"]')) { result && (result.hidden = true); status.textContent = copy.messages.ready; return; }
    if (mode === 'swissTenancy' && event.target.closest('[data-remaining-copy]')) { try { await navigator.clipboard.writeText(result.querySelector('textarea').value); status.textContent = copy.messages.done; } catch { status.textContent = copy.messages.invalid; } return; }
    if (mode === 'spellcheck' && event.target.closest('[data-remaining-copy]')) { try { await navigator.clipboard.writeText(form.elements.text.value); status.textContent = f.done; } catch { status.textContent = f.invalid; } return; }
    if (mode === 'hyphenation' && event.target.closest('[data-remaining-preview]')) {
      const v = values(); const lang = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/u.test(v.language) ? v.language : '';
      if (!lang || !v.text.trim()) { status.textContent = copy.messages.invalid; result.hidden = true; return; }
      result.lang = lang; result.textContent = v.text; result.style.maxWidth = `${Math.max(20, Math.min(100, Number(v.width) || 48))}ch`; result.style.hyphens = 'auto'; result.style.overflowWrap = 'normal'; result.style.whiteSpace = 'normal'; result.style.lineHeight = '1.8'; result.hidden = false; status.textContent = f.done; return;
    }
    if (mode === 'resume' && event.target.closest('[data-remaining-analyze]')) {
      const text = form.elements.text.value.trim(); if (!text) { status.textContent = copy.messages.invalid; return; }
      const sections = ['experience','employment','work history','education','skills','projects','certifications','languages','summary','profile'];
      const normalized = text.normalize('NFKC').toLocaleLowerCase(); const found = sections.filter((section) => new RegExp(`(?:^|\\n|\\b)${section}(?:\\b|\\s*:|\\n)`, 'iu').test(normalized));
      const words = text.match(/[\p{L}\p{N}][\p{L}\p{N}'’+-]*/gu) ?? []; const links = (text.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|https?:\/\/\S+/gu) ?? []).length;
      const jobWords = [...new Set((form.elements.job.value.match(/[\p{L}][\p{L}\p{N}-]{3,}/gu) ?? []).map((w) => w.toLocaleLowerCase()))].slice(0, 100);
      const present = jobWords.filter((word) => normalized.includes(word)); const missing = jobWords.filter((word) => !normalized.includes(word));
      result.innerHTML = `<h3>${escapeRemainingHtml(f.resultHeading)}</h3><p>${escapeRemainingHtml(f.words)}: ${words.length}</p><p>${escapeRemainingHtml(f.sections)}: ${found.length ? found.map(escapeRemainingHtml).join(', ') : '—'}</p><p>${escapeRemainingHtml(f.links)}: ${links}</p><p>${escapeRemainingHtml(f.matches)}: ${present.length ? present.map(escapeRemainingHtml).join(', ') : '—'}</p><p>${escapeRemainingHtml(f.missing)}: ${missing.length ? missing.map(escapeRemainingHtml).join(', ') : '—'}</p>`;
      result.hidden = false; status.textContent = copy.messages.done; return;
    }
    if (!event.target.closest('[data-remaining-calculate]')) return;
    try {
      const out = calculateRemainingTool(mode, values());
      if (out.rows) result.innerHTML = setRows(out.rows);
      else if (mode === 'swissTenancy') result.innerHTML = `<h3>${escapeRemainingHtml(f.resultHeading)}: ${escapeRemainingHtml(out.date)}</h3><label class="field">${escapeRemainingHtml(f.letter)}<textarea rows="12">${escapeRemainingHtml(out.letter)}</textarea></label><button type="button" data-remaining-copy>${escapeRemainingHtml(f.copy)}</button>`;
      else if (mode === 'swissPropertyGain') result.innerHTML = setRows([['gain', out.gain], ['tax', out.tax]]);
      else if (mode === 'swissInheritance') result.innerHTML = setRows([['taxable', out.taxable], ['tax', out.tax]]);
      else result.innerHTML = setRows([['shareA', out.shareA], ['shareB', out.shareB], ['total', out.total]]);
      result.hidden = false; status.textContent = copy.messages.done;
    } catch { result.hidden = true; status.textContent = copy.messages.invalid; }
  });
  form.addEventListener('reset', () => setTimeout(() => { result && (result.hidden = true); status.textContent = copy.messages.ready; }, 0));
}
