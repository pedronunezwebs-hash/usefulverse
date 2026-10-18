import { calculateAquariumMix } from './aquarium-water-mixing.mjs';

export function initAquariumWaterMixing(documentRef = document) {
  const root = documentRef.querySelector('[data-aquarium-mix]');
  if (!root) return;
  let copy;
  try { copy = JSON.parse(documentRef.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields; } catch { return; }
  if (!copy) return;
  const q = (selector) => root.querySelector(selector);
  const status = q('[data-aquarium-status]'); const output = q('[data-aquarium-output]');
  const fmt = (value) => Number(value).toLocaleString(documentRef.documentElement.lang, { maximumFractionDigits: 3 });
  const row = (label, value) => { const line = documentRef.createElement('div'); const term = documentRef.createElement('dt'); const detail = documentRef.createElement('dd'); term.textContent = label; detail.textContent = value; line.append(term, detail); return line; };
  q('[data-aquarium-calculate]').addEventListener('click', () => {
    output.replaceChildren();
    try {
      const unit = q('[data-aquarium-unit]').value;
      const result = calculateAquariumMix({
        sourceA: { gh: q('[data-aquarium-a-gh]').value, kh: q('[data-aquarium-a-kh]').value },
        sourceB: { gh: q('[data-aquarium-b-gh]').value, kh: q('[data-aquarium-b-kh]').value },
        target: { gh: q('[data-aquarium-target-gh]').value, kh: q('[data-aquarium-target-kh]').value },
        volume: q('[data-aquarium-volume]').value, unit,
      });
      if (result.status === 'unreachable') {
        status.textContent = copy.unreachable;
        const checks = documentRef.createElement('dl'); checks.className = 'aquarium-mix-results';
        checks.append(row(copy.ghRatio, result.ghFraction === null ? '—' : `${fmt(result.ghFraction * 100)}%`), row(copy.khRatio, result.khFraction === null ? '—' : `${fmt(result.khFraction * 100)}%`)); output.append(checks); return;
      }
      if (result.status === 'incompatible') {
        status.textContent = copy.incompatible;
        const checks = documentRef.createElement('dl'); checks.className = 'aquarium-mix-results';
        checks.append(row(copy.ghRatio, `${fmt(result.ghFraction * 100)}%`), row(copy.khRatio, `${fmt(result.khFraction * 100)}%`), row(copy.predictedGh, `${fmt(result.predictedGh)} ${unit}`), row(copy.predictedKh, `${fmt(result.predictedKh)} ${unit}`), row(copy.tolerance, `±${fmt(result.tolerance)} ${unit}`)); output.append(checks); return;
      }
      status.textContent = copy.compatible;
      const details = documentRef.createElement('dl'); details.className = 'aquarium-mix-results';
      details.append(row(copy.sourceAPercent, `${fmt(result.percentA)}%`), row(`${copy.sourceAAmount} · ${q('[data-aquarium-a-name]').value || copy.sourceA}`, `${fmt(result.litresA)} L`), row(`${copy.sourceBAmount} · ${q('[data-aquarium-b-name]').value || copy.sourceB}`, `${fmt(result.litresB)} L`), row(copy.predictedGh, `${fmt(result.predictedGh)} ${unit}`), row(copy.predictedKh, `${fmt(result.predictedKh)} ${unit}`), row(copy.tolerance, `±${fmt(result.tolerance)} ${unit}`)); output.append(details);
      const note = documentRef.createElement('p'); note.className = 'hint'; note.textContent = copy.exactNote; output.append(note);
    } catch { status.textContent = copy.invalid; }
  });
  q('[data-aquarium-clear]').addEventListener('click', () => { for (const field of root.querySelectorAll('input')) field.value = field.defaultValue; q('[data-aquarium-unit]').value = 'dH'; output.replaceChildren(); status.textContent = copy.ready; });
}

if (typeof document !== 'undefined') initAquariumWaterMixing(document);
