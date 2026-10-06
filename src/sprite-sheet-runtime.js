import { layoutSpriteFrames, spriteSheetMetadata, MAX_SPRITE_FRAMES } from './sprite-sheet-logic.mjs';

const MAX_SOURCE_PIXELS = 50_000_000;
const SUPPORTED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif', 'image/bmp']);

export function setupSpriteSheetMaker(root) {
  const $ = (selector) => root.querySelector(selector);
  const t = (key, values = {}) => String(window.usefulverseLocale?.runtime?.[key] ?? window.usefulverseLocale?.messages?.[key] ?? key)
    .replace(/\{(\w+)\}/gu, (match, name) => Object.hasOwn(values, name) ? String(values[name]) : match);
  const input = $('[data-sprite-files]');
  const list = $('[data-sprite-list]');
  const status = $('[data-sprite-status]');
  const canvas = $('[data-sprite-preview]');
  const preview = canvas.getContext('2d', { alpha: true });
  const downloadPng = $('[data-sprite-download]');
  const downloadJson = $('[data-sprite-json]');
  const copyCss = $('[data-sprite-copy-css]');
  const cssOutput = $('[data-sprite-css]');
  let files = [];
  let objectUrls = [];
  let currentLayout = null;
  let generation = 0;
  let cssText = '';

  const setStatus = (message, kind = 'success') => {
    status.textContent = message;
    status.className = `tool-status is-${kind}`;
  };
  const localizeError = (message) => {
    if (message.startsWith('Choose between 1 and ')) return t('Choose between 1 and {count} images.', { count: MAX_SPRITE_FRAMES });
    const badImage = /^Image (\d+) has unsupported dimensions\.$/u.exec(message);
    if (badImage) return t('Image {count} has unsupported dimensions.', { count: badImage[1] });
    return t(message);
  };
  const revokePreviews = () => {
    objectUrls.forEach((url) => URL.revokeObjectURL(url));
    objectUrls = [];
  };
  const download = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const renderList = () => {
    revokePreviews();
    list.replaceChildren();
    files.forEach((item, index) => {
      const row = document.createElement('li');
      row.className = 'sprite-sheet__file';
      const image = document.createElement('img');
      image.alt = '';
      image.width = 48;
      image.height = 48;
      image.src = URL.createObjectURL(item.file);
      objectUrls.push(image.src);
      const copy = document.createElement('span');
      copy.className = 'sprite-sheet__file-copy';
      const name = document.createElement('strong');
      name.textContent = item.file.name;
      const dimensions = document.createElement('small');
      dimensions.textContent = `${item.width} × ${item.height}`;
      copy.append(name, dimensions);
      const controls = document.createElement('span');
      controls.className = 'sprite-sheet__file-controls';
      for (const [direction, label, disabled] of [
        [-1, t('Move frame up'), index === 0],
        [1, t('Move frame down'), index === files.length - 1],
      ]) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'button button--ghost';
        button.textContent = direction < 0 ? '↑' : '↓';
        button.setAttribute('aria-label', label);
        button.disabled = disabled;
        button.addEventListener('click', () => {
          const target = index + direction;
          [files[index], files[target]] = [files[target], files[index]];
          currentLayout = null;
          downloadPng.disabled = downloadJson.disabled = copyCss.disabled = true;
          renderList();
          setStatus(t('Frame order changed. Create the sprite sheet again.'));
        });
        controls.append(button);
      }
      row.append(image, copy, controls);
      list.append(row);
    });
  };
  const readFiles = async (selected) => {
    generation += 1;
    const thisGeneration = generation;
    files = [];
    currentLayout = null;
    downloadPng.disabled = downloadJson.disabled = copyCss.disabled = true;
    canvas.hidden = true;
    list.replaceChildren();
    revokePreviews();
    const candidates = [...selected];
    if (!candidates.length) return setStatus(t('Choose image files to begin.'), 'error');
    if (candidates.length > MAX_SPRITE_FRAMES) return setStatus(t('Choose between 1 and {count} images.', { count: MAX_SPRITE_FRAMES }), 'error');
    const unsupported = candidates.find((file) => !SUPPORTED_TYPES.has(file.type));
    if (unsupported) return setStatus(t('Use PNG, JPG, WebP, GIF, AVIF or BMP image files.'), 'error');
    setStatus(t('Reading image dimensions on this device…'));
    const decoded = [];
    try {
      let sourcePixels = 0;
      for (const file of candidates) {
        const bitmap = await createImageBitmap(file);
        sourcePixels += bitmap.width * bitmap.height;
        if (sourcePixels > MAX_SOURCE_PIXELS || bitmap.width > 8192 || bitmap.height > 8192) {
          bitmap.close();
          decoded.forEach(({ bitmap: opened }) => opened.close());
          decoded.length = 0;
          return setStatus(t('The selected images are too large to process reliably in this browser. Choose fewer or smaller images.'), 'error');
        }
        decoded.push({ file, width: bitmap.width, height: bitmap.height, bitmap });
      }
      if (thisGeneration !== generation) {
        decoded.forEach(({ bitmap }) => bitmap.close());
        return;
      }
      files = decoded.map(({ file, width, height, bitmap }) => { bitmap.close(); return { file, name: file.name, width, height }; });
      decoded.length = 0;
      const first = files[0];
      $('[data-sprite-width]').value = Math.min(first.width, 512);
      $('[data-sprite-height]').value = Math.min(first.height, 512);
      $('[data-sprite-columns]').value = Math.ceil(Math.sqrt(files.length));
      renderList();
      setStatus(t('{count} images ready. Choose frame size and create the sheet.', { count: files.length }));
    } catch {
      decoded.forEach(({ bitmap }) => bitmap.close());
      setStatus(t('One or more images could not be read by this browser. Try PNG, JPG or WebP.'), 'error');
    }
  };

  input.addEventListener('change', () => readFiles(input.files));
  $('[data-sprite-create]').addEventListener('click', async () => {
    const thisGeneration = ++generation;
    let images = [];
    try {
      if (!files.length) throw new Error(t('Choose image files to begin.'));
      const settings = {
        frameWidth: Number($('[data-sprite-width]').value),
        frameHeight: Number($('[data-sprite-height]').value),
        columns: Number($('[data-sprite-columns]').value),
        gap: Number($('[data-sprite-gap]').value),
        padding: Number($('[data-sprite-padding]').value),
      };
      let sourcePixels = 0;
      for (const file of files) {
        const bitmap = await createImageBitmap(file.file);
        sourcePixels += bitmap.width * bitmap.height;
        if (sourcePixels > MAX_SOURCE_PIXELS) {
          bitmap.close();
          images.forEach(({ bitmap: opened }) => opened.close());
          images = [];
          throw new Error(t('The selected images are too large to process reliably in this browser. Choose fewer or smaller images.'));
        }
        images.push({ ...file, bitmap });
      }
      if (thisGeneration !== generation) {
        images.forEach(({ bitmap }) => bitmap.close());
        images = [];
        return;
      }
      const layout = layoutSpriteFrames(images, settings);
      canvas.width = layout.width;
      canvas.height = layout.height;
      preview.clearRect(0, 0, layout.width, layout.height);
      layout.items.forEach((item, index) => preview.drawImage(images[index].bitmap, item.drawX, item.drawY, item.drawWidth, item.drawHeight));
      images.forEach(({ bitmap }) => bitmap.close());
      images = [];
      currentLayout = layout;
      cssText = layout.items.map((item) => `.sprite-frame-${item.index + 1} { width: ${item.width}px; height: ${item.height}px; background-position: -${item.x}px -${item.y}px; }`).join('\n');
      cssOutput.value = `/* Set the element background-image to usefulverse-sprite-sheet.png */\n${cssText}`;
      canvas.hidden = false;
      downloadPng.disabled = downloadJson.disabled = copyCss.disabled = false;
      setStatus(t('Sprite sheet created: {width} × {height} pixels, {count} frames.', { width: layout.width, height: layout.height, count: layout.items.length }));
    } catch (error) {
      images.forEach(({ bitmap }) => bitmap.close());
      images = [];
      currentLayout = null;
      downloadPng.disabled = downloadJson.disabled = copyCss.disabled = true;
      setStatus(error.message ? localizeError(error.message) : t('The sprite sheet could not be created. Check the settings and try again.'), 'error');
    }
  });
  downloadPng.addEventListener('click', () => canvas.toBlob((blob) => {
    if (!blob) return setStatus(t('The PNG could not be created. Try again.'), 'error');
    download(blob, 'usefulverse-sprite-sheet.png');
    setStatus(t('PNG download started.'));
  }, 'image/png'));
  downloadJson.addEventListener('click', () => {
    if (!currentLayout) return;
    download(new Blob([JSON.stringify(spriteSheetMetadata(currentLayout), null, 2)], { type: 'application/json' }), 'usefulverse-sprite-coordinates.json');
    setStatus(t('Coordinates JSON download started.'));
  });
  copyCss.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(cssText);
      setStatus(t('CSS coordinates copied.'));
    } catch { setStatus(t('Copy was blocked. Use the CSS coordinates box below.'), 'error'); }
  });
}
