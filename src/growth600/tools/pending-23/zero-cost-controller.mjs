const node = (tag, text, className) => {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = String(text);
  if (className) element.className = className;
  return element;
};

function save(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = node('a'); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function collect(form) {
  const values = {};
  for (const input of form.querySelectorAll('[data-input]')) {
    if (input.type === 'file') values[input.dataset.input] = input.files?.[0] ?? null;
    else if (input.type === 'number') values[input.dataset.input] = input.value === '' ? '' : Number(input.value);
    else values[input.dataset.input] = input.value;
  }
  return values;
}

function show(root, result, copy, kind) {
  const content = root.querySelector('[data-result-content]'); content.replaceChildren();
  const fields = copy.fields;
  if (kind === 'local-image-generator') {
    const image = node('img'); image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(result.svg)}`; image.alt = fields.preview; image.style.cssText = 'width:100%;height:auto;border-radius:1rem'; content.append(image);
    content.append(node('p', `${fields.seed}: ${result.seed}`));
    const button = node('button', copy.actions.download, 'button button--secondary'); button.type = 'button'; button.addEventListener('click', () => save(new Blob([result.svg], { type: 'image/svg+xml;charset=utf-8' }), 'usefulverse-vector.svg')); content.append(button);
    return;
  }
  if (kind === 'plant-identifier') {
    const details = node('dl');
    for (const [key, value] of Object.entries(result.observations)) if (value) details.append(node('dt', fields[key]), node('dd', value));
    content.append(node('p', `${fields.recordedClues}: ${result.recordedClues}`), details, node('p', fields.safetyNote, 'hint'));
    return;
  }
  if (kind === 'ptsd-questionnaire' || kind === 'perceived-stress-questionnaire') {
    const details = node('dl');
    for (const [key, value] of Object.entries(result.reflection)) details.append(node('dt', fields[key]), node('dd', fields[value === 'not-today' ? 'notToday' : value === 'a-lot' ? 'aLot' : value]));
    content.append(details, node('p', fields.scoreNote, 'hint'), node('p', fields.nextStep, 'hint'));
    return;
  }
  if (kind === 'tls-site-checker') {
    const details = node('dl');
    for (const [key, value] of Object.entries(result)) {
      if (key === 'dnsNames') continue;
      const display = key === 'hostnameMatch' ? (value ? fields.matchYes : fields.matchNo)
        : typeof value === 'boolean' ? (value ? fields.yes : fields.no)
          : value;
      details.append(node('dt', fields[key] ?? key), node('dd', display));
    }
    details.append(node('dt', fields.dnsNames), node('dd', result.dnsNames.join(', ') || fields.noDnsNames));
    content.append(details, node('p', fields.trustNoteText, 'hint'));
    return;
  }
  if (kind === 'sheet-music-scanner' || kind === 'equation-photo-reader') {
    if (kind === 'sheet-music-scanner') content.append(node('p', `${fields.measureCount}: ${result.measureCount} · ${fields.noteCount}: ${result.noteCount}`));
    const value = kind === 'sheet-music-scanner' ? result.musicXml : result.latex;
    const preview = node('pre', value, 'pending-code-preview'); preview.setAttribute('aria-label', kind === 'sheet-music-scanner' ? fields.musicXml : fields.latex); content.append(preview);
    if (kind === 'equation-photo-reader') content.append(node('p', `${fields.reference}: ${result.reference || fields.noReferenceNote}`));
    const button = node('button', copy.actions.download, 'button button--secondary'); button.type = 'button';
    button.addEventListener('click', () => save(new Blob([value], { type: kind === 'sheet-music-scanner' ? 'application/vnd.recordare.musicxml+xml;charset=utf-8' : 'text/plain;charset=utf-8' }), kind === 'sheet-music-scanner' ? 'score.musicxml' : 'equation.tex'));
    content.append(button); return;
  }
  const details = node('dl');
  for (const [key, value] of Object.entries(result)) {
    if (value === null || value === undefined || typeof value === 'object') continue;
    const description = node('dd');
    if (String(value).includes('\n')) description.append(node('pre', String(value), 'pending-code-preview'));
    else description.textContent = String(value);
    details.append(node('dt', fields[key] ?? key), description);
  }
  content.append(details);
  if (kind === 'bird-sound-identifier') content.append(node('p', fields.noteText, 'hint'));
  if (kind === 'inheritance-shares-calculator') content.append(node('p', fields.noteText, 'hint'));
}

export function mountZeroCostTool(id, calculate) {
  const root = document.querySelector(`[data-tool="${CSS.escape(id)}"]`); if (!root) return;
  const area = root.querySelector('[data-pending-tool]'); const form = area?.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]'); const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}'); if (!form || !result || !status) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); status.textContent = '';
    try {
      const values = collect(form);
      if (id === 'sheet-music-scanner') { values.title ||= copy.fields.defaultTitle; values.partName ||= copy.fields.defaultPartName; }
      const output = await calculate(values); show(root, output, copy, id); result.hidden = false;
      status.textContent = copy.messages.complete;
    } catch (error) {
      result.querySelector('[data-result-content]')?.replaceChildren(); result.hidden = true;
      status.textContent = error instanceof RangeError ? (error.message || copy.messages.error) : copy.messages.error;
      status.className = 'status status--error'; return;
    }
    status.className = 'status status--success';
  });
  form.addEventListener('reset', () => { queueMicrotask(() => { result.querySelector('[data-result-content]')?.replaceChildren(); result.hidden = true; status.textContent = ''; status.className = 'status'; }); });
}
