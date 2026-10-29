import { announce, copyText, readToolCopy } from '../controller-helpers.mjs';
import { countMarkdown, insertMarkdown } from './logic.mjs';

const root = document.querySelector('[data-tool="markdown-editor"]');
if (root) {
  const copy = readToolCopy(root);
  const editor = root.querySelector('[data-editor]');
  const preview = root.querySelector('[data-preview]');
  const autosave = root.querySelector('[data-autosave]');
  const counts = root.querySelector('[data-counts]');
  const storageKey = 'usefulverse:markdown-editor:draft:v1';
  const history = [''];
  let historyIndex = 0;
  let historyTimer;
  let saveTimer;
  let previewLibraries;
  let savedPreview = false;

  function setHistoryButtons() {
    root.querySelector('[data-action="undo"]').disabled = historyIndex <= 0;
    root.querySelector('[data-action="redo"]').disabled = historyIndex >= history.length - 1;
  }

  function commitHistory() {
    clearTimeout(historyTimer);
    if (history[historyIndex] === editor.value) return;
    history.splice(historyIndex + 1);
    history.push(editor.value);
    if (history.length > 100) history.shift();
    historyIndex = history.length - 1;
    setHistoryButtons();
  }

  function updateCounts() {
    const result = countMarkdown(editor.value);
    counts.textContent = `${copy.fields.words}: ${result.words} · ${copy.fields.characters}: ${result.characters}`;
  }

  function saveDraft() {
    clearTimeout(saveTimer);
    if (!autosave.checked) return;
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, editor.value);
        announce(root, copy.messages.saved, 'success');
      } catch {
        announce(root, copy.messages.storageUnavailable, 'error');
      }
    }, 350);
  }

  function loadLibrary(file, globalName) {
    return new Promise((resolve, reject) => {
      if (window[globalName]) return resolve(window[globalName]);
      const existing = document.querySelector(`script[data-markdown-vendor="${file}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve(window[globalName]), { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }
      const script = document.createElement('script');
      script.dataset.markdownVendor = file;
      script.src = new URL(`/assets/vendor/${file}`, location.origin).href;
      script.async = true;
      script.onload = () => window[globalName] ? resolve(window[globalName]) : reject(new Error('Vendor global missing'));
      script.onerror = reject;
      document.head.append(script);
    });
  }

  async function renderPreview() {
    try {
      previewLibraries ??= Promise.all([loadLibrary('marked-18.0.14.umd.js', 'marked'), loadLibrary('purify-3.4.17.min.js', 'DOMPurify')]);
      const [marked, purifier] = await previewLibraries;
      const rendered = marked.parse(editor.value, { async: false, gfm: true, breaks: false });
      const clean = purifier.sanitize(rendered, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'img', 'audio', 'video', 'source', 'link', 'meta', 'base'],
        FORBID_ATTR: ['href', 'src', 'srcset', 'style', 'action', 'formaction', 'onerror', 'onclick'],
      });
      const policy = "default-src 'none'; style-src 'unsafe-inline'; img-src data: blob:; base-uri 'none'; form-action 'none'; frame-src 'none'; connect-src 'none'";
      const locale = document.documentElement.lang || 'en';
      const direction = document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';
      preview.srcdoc = `<!doctype html><html lang="${locale}" dir="${direction}"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font:16px/1.65 system-ui,sans-serif;color:#172033;margin:1rem;overflow-wrap:anywhere}pre{overflow:auto;padding:.8rem;background:#f1f4f8;border-radius:.5rem}table{border-collapse:collapse}td,th{border:1px solid #ccd3dd;padding:.35rem .6rem}blockquote{border-inline-start:3px solid #c4d852;padding-inline-start:1rem;color:#526075}code{background:#f1f4f8;padding:.1em .25em}hr{border:0;border-top:1px solid #ccd3dd}</style></head><body>${clean}</body></html>`;
      preview.hidden = false;
      savedPreview = true;
      root.querySelector('[data-action="preview"]').textContent = copy.actions.hidePreview;
      announce(root, copy.messages.previewReady, 'success');
    } catch {
      announce(root, copy.messages.previewFailed, 'error');
    }
  }

  try {
    const draft = localStorage.getItem(storageKey);
    if (draft && draft.length <= 500_000) {
      editor.value = draft;
      history[0] = draft;
      announce(root, copy.messages.restored, 'success');
    } else announce(root, copy.messages.ready);
  } catch {
    autosave.checked = false;
    announce(root, copy.messages.storageUnavailable, 'error');
  }
  updateCounts();
  setHistoryButtons();

  editor.addEventListener('input', () => {
    if (editor.value.length > 500_000) {
      editor.value = editor.value.slice(0, 500_000);
      announce(root, copy.messages.tooLong, 'error');
    }
    updateCounts();
    clearTimeout(historyTimer);
    historyTimer = setTimeout(commitHistory, 400);
    saveDraft();
    if (savedPreview) preview.hidden = true;
  });

  root.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      root.querySelector(`[data-action="${event.shiftKey ? 'redo' : 'undo'}"]`).click();
    }
  });

  root.addEventListener('click', async (event) => {
    const insertButton = event.target.closest('[data-insert]');
    if (insertButton) {
      commitHistory();
      try {
        const result = insertMarkdown(editor.value, editor.selectionStart, editor.selectionEnd, insertButton.dataset.insert);
        editor.value = result.value;
        editor.focus();
        editor.setSelectionRange(result.selectionStart, result.selectionEnd);
        commitHistory();
        updateCounts(); saveDraft();
      } catch { announce(root, copy.messages.tooLong, 'error'); }
      return;
    }
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (!action) return;
    if (action === 'undo' || action === 'redo') {
      commitHistory();
      const next = historyIndex + (action === 'undo' ? -1 : 1);
      if (next < 0 || next >= history.length) return announce(root, action === 'undo' ? copy.messages.undoUnavailable : copy.messages.redoUnavailable);
      historyIndex = next;
      editor.value = history[historyIndex]; updateCounts(); saveDraft();
      if (savedPreview) preview.hidden = true;
      setHistoryButtons(); editor.focus();
    } else if (action === 'preview') {
      if (savedPreview && !preview.hidden) {
        preview.hidden = true; root.querySelector('[data-action="preview"]').textContent = copy.actions.showPreview;
      } else if (!editor.value.trim()) announce(root, copy.messages.empty, 'error');
      else await renderPreview();
    } else if (action === 'copy') {
      if (!editor.value) return announce(root, copy.messages.empty, 'error');
      await copyText(root, editor.value, copy);
    } else if (action === 'download') {
      if (!editor.value) return announce(root, copy.messages.empty, 'error');
      const link = document.createElement('a');
      const url = URL.createObjectURL(new Blob([editor.value], { type: 'text/markdown;charset=utf-8' }));
      link.href = url; link.download = 'document.md'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      announce(root, copy.messages.downloaded, 'success');
    } else if (action === 'clear') {
      editor.value = ''; history.splice(0, history.length, ''); historyIndex = 0;
      clearTimeout(saveTimer);
      try { localStorage.removeItem(storageKey); } catch {}
      preview.hidden = true; savedPreview = false;
      root.querySelector('[data-action="preview"]').textContent = copy.actions.showPreview;
      updateCounts(); setHistoryButtons(); announce(root, copy.messages.cleared, 'success'); editor.focus();
    }
  });

  autosave.addEventListener('change', () => {
    if (autosave.checked) saveDraft();
    else {
      clearTimeout(saveTimer);
      try { localStorage.removeItem(storageKey); } catch {}
      announce(root, copy.messages.storageDisabled, 'info');
    }
  });
}
