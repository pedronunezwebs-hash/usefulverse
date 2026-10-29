// Static pagination works without JavaScript; search loads all tools on demand.
const grid = document.querySelector('#tool-grid[data-search-index]');
const search = document.querySelector('#tool-search');
if (grid && search) {
  const categories = [...document.querySelectorAll('[data-category-filter]')];
  const all = categories[0]?.dataset.categoryFilter ?? '';
  const category = () => categories.find(button => button.classList.contains('is-active'))?.dataset.categoryFilter ?? all;
  const initial = new Set([...grid.querySelectorAll('.tool-card')].map(card => card.getAttribute('href')));
  const empty = document.querySelector('#empty-state'), pagination = document.querySelector('[data-directory-pages]');
  const language = globalThis.usefulverseLocale?.tag ?? document.documentElement.lang ?? 'en';
  const key = text => text.normalize('NFKD').replace(/[\u0300-\u036f\u093c]/gu, '').normalize('NFC').toLocaleLowerCase(language);
  let state = 'idle', pending, cards;
  function render() {
    if (state !== 'ready') return;
    const term = key(search.value.trim()), selected = category(), normalPage = !term && selected === all;
    const matches = cards.filter(card => normalPage ? initial.has(card.href) : (selected === all || card.category === selected) && (!term || key(card.search).includes(term)));
    grid.replaceChildren(...matches.map(card => {
      const anchor = document.createElement('a'), title = document.createElement('h3');
      anchor.className = 'tool-card tool-card--compact'; anchor.href = card.href; anchor.lang = card.language;
      anchor.dataset.search = card.search; anchor.dataset.category = card.category;
      title.textContent = card.title; anchor.append(title); return anchor;
    }));
    if (empty) empty.hidden = matches.length !== 0;
    if (pagination) pagination.hidden = !normalPage;
  }
  async function load() {
    if (state !== 'idle') return pending;
    state = 'loading'; grid.setAttribute('aria-busy', 'true');
    pending = (async () => {
      try {
        const url = new URL(grid.dataset.searchIndex, location.href);
        if (url.origin !== location.origin) throw Error('Search index must be local');
        const response = await fetch(url, { credentials: 'omit', redirect: 'error', cache: 'force-cache' });
        if (!response.ok) throw Error('Search index unavailable');
        const data = await response.json();
        if (data?.schemaVersion !== 2 || !Array.isArray(data.cards) || data.cards.length > 2000 || data.cards.some(card =>
          !/^\/(?:[a-z\d-]+\/)?tools\/[a-z\d-]+\/$/u.test(card.href) || !['title', 'search', 'category', 'language'].every(field => typeof card[field] === 'string'))) throw Error('Invalid search index');
        cards = data.cards; state = 'ready';
      } catch { state = 'failed'; }
      finally { grid.removeAttribute('aria-busy'); }
    })();
    return pending;
  }
  async function changed() {
    if (state === 'idle' && !search.value.trim() && category() === all) return;
    await load();
    // Apply after the original page listeners so their cached subset cannot
    // override the full-index results or empty-state message.
    queueMicrotask(render);
  }
  search.addEventListener('input', changed);
  for (const button of categories) button.addEventListener('click', changed);
}
