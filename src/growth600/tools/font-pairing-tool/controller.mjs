import { FONT_PRESETS, fontFaceFamily, typographyCss, validateFontFiles } from './logic.mjs';
import { announce, copyText, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="font-pairing-tool"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const preset = form.elements.namedItem('preset');
  const headingSelect = form.elements.namedItem('headingFont');
  const bodySelect = form.elements.namedItem('bodyFont');
  const fileInput = root.querySelector('[data-font-files]');
  const headingPreview = root.querySelector('[data-font-heading]');
  const bodyPreview = root.querySelector('[data-font-body]');
  const files = new Map();

  function updatePreview() {
    const settings = {
      headingFamily: headingSelect.value,
      bodyFamily: bodySelect.value,
      headingSize: form.elements.namedItem('headingSize').value,
      bodySize: form.elements.namedItem('bodySize').value,
      headingWeight: form.elements.namedItem('headingWeight').value,
      bodyWeight: form.elements.namedItem('bodyWeight').value,
      lineHeight: form.elements.namedItem('lineHeight').value,
    };
    const css = typographyCss(settings);
    headingPreview.style.fontFamily = settings.headingFamily;
    headingPreview.style.fontSize = `${settings.headingSize}px`;
    headingPreview.style.fontWeight = settings.headingWeight;
    bodyPreview.style.fontFamily = settings.bodyFamily;
    bodyPreview.style.fontSize = `${settings.bodySize}px`;
    bodyPreview.style.fontWeight = settings.bodyWeight;
    bodyPreview.style.lineHeight = settings.lineHeight;
    return css;
  }

  function clearFonts(announceStatus = true) {
    for (const { face, options } of files.values()) {
      document.fonts.delete(face);
      for (const option of options) option.remove();
    }
    files.clear();
    fileInput.value = '';
    if (headingSelect.value.startsWith('uv-local-font-')) headingSelect.value = FONT_PRESETS[0].heading;
    if (bodySelect.value.startsWith('uv-local-font-')) bodySelect.value = FONT_PRESETS[0].body;
    updatePreview();
    if (announceStatus) announce(root, copy.messages.fontsCleared, 'success');
  }

  root.querySelector('[data-action="apply-preset"]')?.addEventListener('click', () => {
    const selected = FONT_PRESETS.find((item) => item.id === preset.value) ?? FONT_PRESETS[0];
    headingSelect.value = selected.heading;
    bodySelect.value = selected.body;
    updatePreview();
    announce(root, copy.messages.presetApplied, 'success');
  });

  root.querySelector('[data-action="swap"]')?.addEventListener('click', () => {
    [headingSelect.value, bodySelect.value] = [bodySelect.value, headingSelect.value];
    updatePreview();
    announce(root, copy.messages.rolesSwapped, 'success');
  });

  root.querySelector('[data-action="copy-css"]')?.addEventListener('click', () => {
    try { copyText(root, updatePreview(), copy); }
    catch { announce(root, copy.messages.copyUnavailable, 'error'); }
  });

  fileInput.addEventListener('change', async () => {
    const selection = Array.from(fileInput.files ?? []);
    if (!selection.length) return;
    const validation = validateFontFiles(selection, files.size, [...files.values()].reduce((sum, item) => sum + item.bytes, 0));
    fileInput.value = '';
    if (!validation.ok) { announce(root, copy.messages[validation.error] ?? copy.messages.fontLoadFailed, 'error'); return; }
    for (const file of validation.files) {
      const slot = files.size + 1;
      const family = fontFaceFamily(slot);
      try {
        const face = new FontFace(family, await file.arrayBuffer());
        await face.load();
        document.fonts.add(face);
        for (const select of [headingSelect, bodySelect]) {
          const option = document.createElement('option');
          option.value = family;
          option.textContent = file.name.slice(0, 120);
          select.append(option);
        }
        const options = [headingSelect, bodySelect].map((select) => [...select.options].find((option) => option.value === family));
        files.set(family, { face, options, bytes: file.size });
        headingSelect.value = family;
        bodySelect.value = family;
      } catch {
        announce(root, copy.messages.fontLoadFailed, 'error');
        continue;
      }
    }
    if (files.size) { updatePreview(); announce(root, copy.messages.fontLoaded, 'success'); }
  });

  for (const name of ['headingFont', 'bodyFont']) form.elements.namedItem(name).addEventListener('change', updatePreview);
  for (const name of ['headingSize', 'bodySize', 'headingWeight', 'bodyWeight', 'lineHeight']) form.elements.namedItem(name).addEventListener('input', updatePreview);
  root.querySelector('[data-action="clear-fonts"]')?.addEventListener('click', () => clearFonts());
  form.addEventListener('reset', () => {
    clearFonts(false);
    requestAnimationFrame(() => {
      const initial = FONT_PRESETS[0];
      preset.value = initial.id;
      headingSelect.value = initial.heading;
      bodySelect.value = initial.body;
      updatePreview();
      announce(root, '');
    });
  });
  const initialPreset = FONT_PRESETS.find((item) => item.id === preset.value) ?? FONT_PRESETS[0];
  headingSelect.value = initialPreset.heading;
  bodySelect.value = initialPreset.body;
  updatePreview();
}
