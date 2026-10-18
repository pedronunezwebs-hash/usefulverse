import { analyzeResume, pdfItemsToStructure } from './resume-structure.mjs';

const MAX_FILE_BYTES = 20 * 1024 * 1024;
const MAX_PDF_PAGES = 50;
const MAX_EXTRACTED_CHARS = 200_000;

export function initResumeStructure(documentRef = document, windowRef = window) {
  const root = documentRef.querySelector('[data-resume-checker]');
  if (!root) return () => {};
  let copy;
  try { copy = JSON.parse(documentRef.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields; } catch { return () => {}; }
  if (!copy) return () => {};
  const q = (selector) => root.querySelector(selector);
  const fileInput = q('[data-resume-file]'); const jobInput = q('[data-resume-job]'); const analyzeButton = q('[data-resume-analyze]'); const clearButton = q('[data-resume-clear]');
  const status = q('[data-resume-status]'); const output = q('[data-resume-output]');
  let pdfTask; let docxWorker; let cancelled = false;
  const say = (text) => { status.textContent = text; };
  const setBusy = (busy) => { analyzeButton.disabled = busy || !fileInput.files?.[0]; clearButton.disabled = false; fileInput.disabled = busy; jobInput.disabled = busy; };

  function textNode(tag, text, parent = output) { const node = documentRef.createElement(tag); node.textContent = String(text); parent.append(node); return node; }
  function renderReport(report) {
    output.replaceChildren();
    const sectionLabels = { summary: copy.summarySection, experience: copy.experienceSection, education: copy.educationSection, skills: copy.skillsSection, contact: copy.contactSection };
    const summary = documentRef.createElement('dl'); summary.className = 'resume-report-grid';
    for (const [label, value] of [[copy.source, report.source.toUpperCase()], [copy.characters, report.characters.toLocaleString()], [copy.words, report.words.toLocaleString()], [copy.headings, report.headings.length], [copy.links, report.links], [copy.bullets, report.bullets]]) {
      const group = documentRef.createElement('div'); textNode('dt', label, group); textNode('dd', value, group); summary.append(group);
    }
    output.append(summary);
    const contact = documentRef.createElement('ul'); contact.className = 'resume-check-list';
    textNode('li', report.emailPresent ? copy.email : copy.noEmail, contact);
    textNode('li', report.phonePresent ? copy.phone : copy.noPhone, contact);
    output.append(contact);
    textNode('h3', copy.sections);
    const sections = documentRef.createElement('ul'); sections.className = 'resume-check-list';
    for (const item of report.sections) textNode('li', `${sectionLabels[item.key]}: ${item.found ? copy.detected : copy.notDetected}`, sections);
    output.append(sections); textNode('p', copy.sectionSummary, output);
    textNode('h3', copy.headings);
    if (!report.headings.length) textNode('p', copy.noHeadings);
    else { const list = documentRef.createElement('ol'); for (const heading of report.headings) textNode('li', heading, list); output.append(list); }
    textNode('h3', copy.termHeading);
    if (!report.jobTerms.length) textNode('p', copy.noTerms);
    else {
      const table = documentRef.createElement('table'); table.className = 'resume-term-table';
      const head = documentRef.createElement('thead'); const headerRow = documentRef.createElement('tr');
      for (const label of [copy.term, copy.inJob, copy.inResume]) textNode('th', label, headerRow);
      head.append(headerRow); table.append(head); const body = documentRef.createElement('tbody');
      for (const row of report.jobTerms) { const tr = documentRef.createElement('tr'); textNode('th', row.term, tr); textNode('td', row.inJob, tr); textNode('td', row.inResume, tr); body.append(tr); }
      table.append(body); output.append(table);
    }
  }

  async function readPdf(file, jobText) {
    const pdfjs = await import('/assets/vendor/pdf.min.mjs');
    if (cancelled) throw new Error('cancelled');
    pdfjs.GlobalWorkerOptions.workerSrc = '/assets/vendor/pdf.worker.min.mjs';
    const buffer = await file.arrayBuffer(); if (cancelled) throw new Error('cancelled');
    pdfTask = pdfjs.getDocument({ data: new Uint8Array(buffer), isEvalSupported: false, enableXfa: false, useSystemFonts: false,
      cMapUrl: '/assets/vendor/cmaps/', cMapPacked: true, standardFontDataUrl: '/assets/vendor/standard_fonts/' });
    const pdf = await pdfTask.promise;
    if (pdf.numPages > MAX_PDF_PAGES) throw new RangeError('pdf-pages');
    const pages = []; const links = []; let characters = 0;
    for (let index = 1; index <= pdf.numPages; index += 1) {
      if (cancelled) throw new Error('cancelled');
      say(`${copy.reading} ${index}/${pdf.numPages}`);
      const page = await pdf.getPage(index); const content = await page.getTextContent();
      characters += content.items.reduce((sum, item) => sum + String(item.str ?? '').length, 0);
      if (characters > MAX_EXTRACTED_CHARS) throw new RangeError('pdf-text');
      pages.push(content.items);
      const annotations = await page.getAnnotations({ intent: 'display' });
      for (const annotation of annotations) if (/^(?:https?:|mailto:)/iu.test(annotation.url ?? '')) links.push(annotation.url);
      page.cleanup();
    }
    return analyzeResume({ ...pdfItemsToStructure(pages), links, jobText });
  }

  async function readDocx(file, jobText) {
    return new Promise((resolve, reject) => {
      docxWorker = new Worker('/assets/resume-structure-worker.mjs', { type: 'module', name: 'Local resume DOCX reader' });
      docxWorker.onmessage = ({ data }) => {
        docxWorker?.terminate(); docxWorker = undefined;
        if (data.type === 'complete') resolve(data.report); else reject(new Error(data.message || 'docx'));
      };
      docxWorker.onerror = () => { docxWorker?.terminate(); docxWorker = undefined; reject(new Error('docx')); };
      file.arrayBuffer().then((buffer) => {
        if (!docxWorker || cancelled) { reject(new Error('cancelled')); return; }
        docxWorker.postMessage({ type: 'analyze-docx', bytes: buffer, jobText }, [buffer]);
      }, reject);
    });
  }

  analyzeButton.addEventListener('click', async () => {
    const file = fileInput.files?.[0]; if (!file) { say(copy.empty); return; }
    if (file.size > MAX_FILE_BYTES || !/\.(?:pdf|docx)$/iu.test(file.name)) { say(copy.badFile); return; }
    const ext = file.name.split('.').at(-1).toLowerCase(); if (ext === 'docx' && !file.type.includes('wordprocessingml') && file.type && file.type !== 'application/octet-stream') { say(copy.badFile); return; }
    cancelled = false; setBusy(true); output.replaceChildren(); say(copy.reading);
    try {
      const report = ext === 'pdf' ? await readPdf(file, jobInput.value.slice(0, 30_000)) : await readDocx(file, jobInput.value.slice(0, 30_000));
      if (!cancelled) { renderReport(report); say(copy.complete); }
    } catch (error) {
      if (error?.message === 'cancelled' || cancelled) say(copy.empty);
      else if (error?.message === 'No selectable resume text was found.') say(copy.noText);
      else if (error?.message === 'pdf-pages' || error?.message === 'pdf-text') say(copy.badFile);
      else say(ext === 'pdf' ? copy.pdfError : copy.docxError);
    } finally {
      try { await pdfTask?.destroy(); } catch { /* PDF worker may already be gone. */ }
      pdfTask = undefined; setBusy(false);
    }
  });
  fileInput.addEventListener('change', () => { analyzeButton.disabled = !fileInput.files?.[0]; if (fileInput.files?.[0]) say(copy.analyze); });
  clearButton.addEventListener('click', () => {
    cancelled = true; try { pdfTask?.destroy(); } catch { /* Best-effort cancellation. */ }
    pdfTask = undefined; docxWorker?.terminate(); docxWorker = undefined; fileInput.value = ''; jobInput.value = ''; output.replaceChildren(); setBusy(false); say(copy.empty);
  });
  const destroy = () => { cancelled = true; try { pdfTask?.destroy(); } catch {} docxWorker?.terminate(); fileInput.value = ''; jobInput.value = ''; };
  windowRef.addEventListener('pagehide', destroy, { once: true });
  setBusy(false); analyzeButton.disabled = true; say(copy.empty);
  return destroy;
}

if (typeof document !== 'undefined') initResumeStructure();
