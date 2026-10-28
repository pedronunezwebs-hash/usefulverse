// Used only by the local composer; the ordinary source builds stay unchanged.
const grid = document.querySelector('#tool-grid[data-search-index]');
const search = document.querySelector('#tool-search');
let state = 'idle';
if (grid && search) search.addEventListener('input', async () => {
  if (state !== 'idle' || !search.value.trim()) return;
  state = 'loading'; grid.setAttribute('aria-busy', 'true');
  try {
    const url = new URL(grid.dataset.searchIndex, location.href);
    if (url.origin !== location.origin) throw Error('Search index must be local');
    const response = await fetch(url, { credentials: 'omit', redirect: 'error', cache: 'force-cache' });
    if (!response.ok) throw Error('Search index unavailable');
    const data = await response.json();
    if (!data || Array.isArray(data) || typeof data !== 'object') throw Error('Invalid search index');
    for (const card of grid.querySelectorAll('.tool-card')) {
      const value = Object.hasOwn(data, card.getAttribute('href')) && data[card.getAttribute('href')];
      if (typeof value === 'string') card.dataset.search = value;
    }
  } catch {
    // Names and slugs remain searchable offline or after a failed request.
  } finally {
    state = 'settled'; grid.removeAttribute('aria-busy');
    search.dispatchEvent(new Event('input', { bubbles: true }));
  }
});
