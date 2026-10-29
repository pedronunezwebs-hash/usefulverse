import { searchEmoji } from './logic.mjs';

const root = document.querySelector('[data-tool="emoji-search"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  let entriesPromise;
  let composed = '';
  const node = (tag, text) => { const el = document.createElement(tag); if (text !== undefined) el.textContent = String(text); return el; };
  const loadEntries = () => {
    if (!entriesPromise) {
      const rawLocale = document.documentElement.lang.toLowerCase();
      const locale = rawLocale === 'zh-tw' || rawLocale === 'zh-hant' ? 'zh-Hant' : rawLocale.split('-')[0];
      const supported = new Set(['am','ar','bg','bn','ca','de','el','en','es','fa','fr','gu','ha','hi','id','it','ja','ko','mr','ms','nl','pl','pt','ru','sv','sw','ta','te','th','tl','tr','uk','ur','vi','zh','zh-Hant']);
      const dataLocale = supported.has(locale) ? locale : 'en';
      entriesPromise = fetch(`/assets/emoji-search-data/${encodeURIComponent(dataLocale)}.json`, { credentials: 'same-origin', cache: 'force-cache' })
        .then((response) => { if (!response.ok) throw new Error('data'); return response.json(); })
        .then((data) => { if (!Array.isArray(data.entries) || data.entries.length > 2500) throw new Error('data'); return data.entries; });
    }
    return entriesPromise;
  };
  const render = (matches) => {
    content.replaceChildren();
    const selected = node('div');
    selected.className = 'emoji-search-selected';
    const selectedLabel = node('label', copy.fields.selectedEmoji);
    selectedLabel.htmlFor = 'emoji-search-composed';
    const output = node('textarea');
    output.id = 'emoji-search-composed';
    output.rows = 2;
    output.maxLength = 200;
    output.value = composed;
    output.setAttribute('aria-label', copy.fields.selectedEmoji);
    selected.append(selectedLabel, output);
    const actions = node('div');
    actions.className = 'actions';
    const copyButton = node('button', copy.fields.copySequence);
    copyButton.type = 'button';
    copyButton.addEventListener('click', async () => {
      if (!composed) { status.textContent = copy.messages.emptySequence; return; }
      output.value = composed;
      output.focus(); output.select();
      try { await navigator.clipboard.writeText(composed); status.textContent = copy.messages.copied; }
      catch { status.textContent = composed ? copy.messages.copyManual : copy.messages.emptySequence; }
    });
    const clearButton = node('button', copy.fields.clearSequence);
    clearButton.type = 'button';
    clearButton.addEventListener('click', () => { composed = ''; output.value = ''; status.textContent = copy.messages.sequenceCleared; });
    actions.append(copyButton, clearButton);
    selected.append(actions);
    const count = node('p', `${matches.length} ${copy.fields.resultsLabel}`);
    const grid = node('div');
    grid.className = 'emoji-search-grid';
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-label', copy.fields.resultsLabel);
    for (const [index, item] of matches.entries()) {
      const button = node('button');
      button.type = 'button';
      button.className = 'emoji-search-option';
      button.setAttribute('aria-label', `${item.name}: ${copy.fields.addEmoji}`);
      const glyph = node('span', item.symbol); glyph.setAttribute('aria-hidden', 'true');
      const name = node('span', item.name);
      button.append(glyph, name);
      button.addEventListener('click', () => {
        if (composed.length + item.symbol.length <= 200) composed += item.symbol;
        output.value = composed;
        status.textContent = copy.messages.emojiAdded;
      });
      grid.append(button);
      if (index >= 79) break;
    }
    const source = node('a', copy.fields.dataSource);
    source.href = 'https://github.com/unicode-org/cldr-json/tree/91c267402229a59e3ef2774544f001bf959e8809/cldr-json/cldr-annotations-full';
    source.target = '_blank'; source.rel = 'noopener noreferrer';
    content.append(selected, count, grid, source);
  };
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    content.replaceChildren();
    status.classList.remove('status--error');
    try {
      const entries = await loadEntries();
      const matches = searchEmoji(entries, form.elements.namedItem('query').value);
      render(matches);
      status.textContent = matches.length ? copy.messages.complete : copy.messages.noMatches;
      result.hidden = false;
    } catch (error) {
      status.textContent = copy.messages[error?.code] ?? (error?.message === 'data' ? copy.messages.dataUnavailable : copy.messages.error);
      status.classList.add('status--error'); result.hidden = false;
    }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { content.replaceChildren(); status.textContent = ''; status.classList.remove('status--error'); result.hidden = true; composed = ''; }));
}
