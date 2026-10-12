import { announce, readToolCopy } from '../controller-helpers.mjs';
import { createWorldClockSnapshot, getDefaultWorldClockZones, MAX_WORLD_CLOCKS, normalizeWorldClockZones, WORLD_CLOCK_ZONES } from './logic.mjs';

const root = document.querySelector('[data-tool="world-clock"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const zoneSelect = form.elements.namedItem('zone');
  const formatSelect = form.elements.namedItem('hourFormat');
  const list = root.querySelector('[data-world-clocks]');
  const addButton = root.querySelector('[data-action="add"]');
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const locale = document.documentElement.lang || 'en';
  let zones = getDefaultWorldClockZones(localZone);
  let ticker = 0;

  function cityLabel(zone) {
    if (zone === localZone) return copy.fields.yourLocalTime;
    const item = WORLD_CLOCK_ZONES.find(({ id }) => id === zone);
    if (!item) return zone;
    if (!item.country) return item.city;
    try {
      const country = new Intl.DisplayNames([locale], { type: 'region' }).of(item.country);
      return `${item.city}, ${country}`;
    } catch { return `${item.city}, ${item.country}`; }
  }

  function updateZoneChoices() {
    const available = WORLD_CLOCK_ZONES.filter(({ id }) => !zones.includes(id));
    zoneSelect.replaceChildren();
    for (const item of available) zoneSelect.add(new Option(cityLabel(item.id), item.id));
    zoneSelect.disabled = available.length === 0 || zones.length >= MAX_WORLD_CLOCKS;
    addButton.disabled = zoneSelect.disabled;
  }

  function renderCards() {
    list.replaceChildren();
    for (const zone of zones) {
      const item = document.createElement('li');
      item.className = 'world-clock__item';
      item.dataset.zone = zone;
      const card = document.createElement('article');
      const header = document.createElement('div');
      header.className = 'world-clock__header';
      const heading = document.createElement('h3');
      heading.dataset.city = '';
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'button button--secondary world-clock__remove';
      remove.dataset.action = 'remove';
      remove.textContent = copy.actions.remove;
      remove.setAttribute('aria-label', `${copy.actions.remove}: ${cityLabel(zone)}`);
      remove.disabled = zone === localZone;
      header.append(heading, remove);
      const time = document.createElement('time');
      time.className = 'world-clock__time';
      time.dataset.clockTime = '';
      const date = document.createElement('p');
      date.dataset.clockDate = '';
      const details = document.createElement('dl');
      details.className = 'world-clock__details';
      const offsetLabel = document.createElement('dt');
      offsetLabel.textContent = copy.fields.utcOffset;
      const offset = document.createElement('dd');
      offset.dataset.utcOffset = '';
      const differenceLabel = document.createElement('dt');
      differenceLabel.textContent = copy.fields.difference;
      const difference = document.createElement('dd');
      difference.dataset.clockDifference = '';
      details.append(offsetLabel, offset, differenceLabel, difference);
      card.append(header, time, date, details);
      item.append(card);
      list.append(item);
    }
    updateZoneChoices();
    updateClocks();
  }

  function updateClocks() {
    const snapshot = createWorldClockSnapshot({ date: new Date(), zones, localZone, locale, hour12: formatSelect.value === '12' });
    for (const clock of snapshot.clocks) {
      const item = [...list.children].find((candidate) => candidate.dataset.zone === clock.timeZone);
      if (!item) continue;
      item.querySelector('[data-city]').textContent = cityLabel(clock.timeZone);
      const time = item.querySelector('[data-clock-time]');
      time.textContent = clock.time;
      time.dateTime = snapshot.instant;
      item.querySelector('[data-clock-date]').textContent = clock.date;
      item.querySelector('[data-utc-offset]').textContent = clock.utcOffset;
      item.querySelector('[data-clock-difference]').textContent = clock.isLocal ? '—' : clock.difference;
    }
  }

  function scheduleTicker() {
    clearInterval(ticker);
    ticker = 0;
    if (!document.hidden) {
      updateClocks();
      ticker = setInterval(updateClocks, 1_000);
    }
  }

  addButton.addEventListener('click', () => {
    if (zones.length >= MAX_WORLD_CLOCKS) return announce(root, copy.messages.maxReached, 'error');
    const zone = zoneSelect.value;
    try {
      zones = normalizeWorldClockZones([...zones, zone], localZone);
      renderCards();
      announce(root, copy.messages.added, 'success');
    } catch {
      announce(root, copy.messages.invalidZone, 'error');
    }
  });

  list.addEventListener('click', (event) => {
    const remove = event.target.closest('[data-action="remove"]');
    if (!remove) return;
    const item = remove.closest('[data-zone]');
    const zone = item?.dataset.zone;
    if (!zone || zone === localZone) return;
    zones = zones.filter((value) => value !== zone);
    renderCards();
    announce(root, copy.messages.removed, 'success');
  });

  formatSelect.addEventListener('change', updateClocks);
  root.querySelector('[data-action="reset"]').addEventListener('click', () => {
    zones = getDefaultWorldClockZones(localZone);
    formatSelect.value = '24';
    renderCards();
    announce(root, copy.messages.reset, 'success');
  });
  document.addEventListener('visibilitychange', scheduleTicker);
  renderCards();
  scheduleTicker();
}
