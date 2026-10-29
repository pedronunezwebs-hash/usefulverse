import { calculatePanchangSnapshot } from './logic.mjs';

export function mountPanchangCalendar() {
  const form = document.querySelector('#tool-form.panchang-calendar'); if (!form) return;
  let copy = {}; try { copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}'); } catch { return; }
  const f = copy.fields ?? {}; const output = form.querySelector('[data-panchang-result]'); const status = form.querySelector('[data-panchang-status]');
  const dateInput = form.elements.namedItem('date'); const zoneInput = form.elements.namedItem('timeZone');
  const now = new Date(); dateInput.value = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  try { zoneInput.value = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'; } catch { zoneInput.value = 'Asia/Kolkata'; }
  const add = (label, value) => { const row = document.createElement('div'); const strong = document.createElement('strong'); strong.textContent = `${label}: `; const span = document.createElement('span'); span.textContent = String(value); row.append(strong, span); output.append(row); };
  form.addEventListener('submit', (event) => {
    event.preventDefault(); output.replaceChildren();
    try {
      const snapshot = calculatePanchangSnapshot({ date: dateInput.value, latitude: form.elements.namedItem('latitude').value, longitude: form.elements.namedItem('longitude').value, timeZone: zoneInput.value.trim() });
      const sunrise = new Intl.DateTimeFormat(document.documentElement.lang || 'en', { timeZone: snapshot.timeZone, hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(new Date(snapshot.sunriseUtc));
      add(f.localDate, new Intl.DateTimeFormat(document.documentElement.lang || 'en', { timeZone: snapshot.timeZone, dateStyle: 'full' }).format(new Date(snapshot.sunriseUtc)));
      add(f.sunrise, sunrise); add(f.paksha, snapshot.paksha === 'bright' ? f.brightPaksha : f.darkPaksha); add(f.tithi, snapshot.tithiNumber);
      add(f.nakshatra, snapshot.nakshatra); add(f.yoga, snapshot.yoga); add(f.karana, snapshot.karana); add(f.ayanamsa, `${snapshot.ayanamsaDegrees.toFixed(3)}°`);
      status.textContent = f.complete; status.dataset.state = 'success';
    } catch (error) { status.textContent = error.message.includes('Sun does not rise') ? f.noSunrise : f.invalidInput; status.dataset.state = 'error'; }
  });
}

mountPanchangCalendar();
