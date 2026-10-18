import { calculateSleepTime } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="sleep-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const direction = root.querySelector('[data-direction]');
  const time = root.querySelector('[data-time]');
  const timeLabel = root.querySelector('[for="sleep-time"]');
  const durationHours = root.querySelector('[data-duration-hours]');
  const durationMinutes = root.querySelector('[data-duration-minutes]');
  const latency = root.querySelector('[data-latency]');
  const output = root.querySelector('[data-output]');
  const details = root.querySelector('[data-result-details]');

  function calculate() {
    try {
      const result = calculateSleepTime({ time: time.value, durationHours: Number(durationHours.value), durationMinutes: Number(durationMinutes.value), latencyMinutes: Number(latency.value), direction: direction.value });
      output.textContent = result.time;
      const dayLabel = result.dayOffset < 0 ? copy.messages.previousDay : result.dayOffset > 0 ? copy.messages.nextDay : copy.messages.sameDay;
      details.textContent = copy.messages.result.replace('{day}', dayLabel).replace('{duration}', String(result.sleepMinutes / 60)).replace('{latency}', String(result.latencyMinutes));
      announce(root, copy.messages.calculated.replace('{time}', result.time), 'success');
    } catch {
      output.textContent = '—';
      details.textContent = '';
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    time.value = direction.value === 'bedtime' ? '07:00' : '23:00';
    durationHours.value = '8'; durationMinutes.value = '0'; latency.value = '0'; calculate();
  });
  root.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
    direction.value = 'bedtime'; time.value = '07:00'; durationHours.value = '8'; durationMinutes.value = '0'; latency.value = '15';
    output.textContent = '—'; details.textContent = ''; announce(root, copy.messages.reset, 'info');
  });
  direction.addEventListener('change', () => {
    const bedtimeMode = direction.value === 'bedtime';
    time.value = bedtimeMode ? '07:00' : '23:00';
    timeLabel.textContent = bedtimeMode ? copy.fields.wakeReference : copy.fields.bedReference;
  });
  durationHours.addEventListener('input', () => {
    const atMaximum = Number(durationHours.value) >= 16;
    for (const option of durationMinutes.options) {
      option.disabled = atMaximum && Number(option.value) > 0;
    }
    if (atMaximum) durationMinutes.value = '0';
  });
  root.querySelector('form')?.addEventListener('submit', (event) => { event.preventDefault(); calculate(); });
  calculate();
}
