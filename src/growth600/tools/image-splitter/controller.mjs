import { createImageTilePlan, formatTileName, MAX_SPLITTER_PIXELS } from './logic.mjs';
import { createStoredZip } from './zip.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="image-splitter"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const fileInput = form.elements.namedItem('imageFile');
  const canvas = root.querySelector('[data-splitter-preview]');
  const context = canvas.getContext('2d');
  const workbench = root.querySelector('[data-splitter-workbench]');
  const readyText = root.querySelector('[data-image-ready]');
  const exportButton = root.querySelector('[data-action="export"]');
  const cancelButton = root.querySelector('[data-action="cancel"]');
  const chooseButton = root.querySelector('[data-action="choose"]');
  const exportLink = root.querySelector('[data-export]');
  const modeSelect = form.elements.namedItem('mode');
  const gridControls = root.querySelector('[data-splitter-grid]');
  const sizeControls = root.querySelector('[data-splitter-size]');
  const allowedTypes = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif', 'image/bmp']);
  let bitmap = null;
  let requestId = 0;
  let exportId = 0;
  let exportUrl = '';

  function revokeExport() {
    if (exportUrl) URL.revokeObjectURL(exportUrl);
    exportUrl = '';
    exportLink.hidden = true;
    exportLink.removeAttribute('href');
  }
  function getPlan() {
    return createImageTilePlan({ width: bitmap.width, height: bitmap.height, mode: modeSelect.value,
      columns: Number(form.elements.namedItem('columns').value), rows: Number(form.elements.namedItem('rows').value),
      tileWidth: Number(form.elements.namedItem('tileWidth').value), tileHeight: Number(form.elements.namedItem('tileHeight').value),
      overlap: Number(form.elements.namedItem('overlap').value) });
  }
  function syncMode(refreshPreview = true) {
    const fixed = modeSelect.value === 'tile-size';
    gridControls.hidden = fixed; sizeControls.hidden = !fixed;
    for (const name of ['columns', 'rows']) form.elements.namedItem(name).disabled = fixed;
    for (const name of ['tileWidth', 'tileHeight']) form.elements.namedItem(name).disabled = !fixed;
    if (refreshPreview) drawPreview();
  }
  function numberLabel(value) {
    try { return new Intl.NumberFormat(copy.copyLanguage === 'zh_tw' ? 'zh-TW' : copy.copyLanguage).format(value); }
    catch { return new Intl.NumberFormat().format(value); }
  }
  function drawPreview() {
    revokeExport(); exportButton.disabled = !bitmap;
    if (!bitmap) return;
    const scale = Math.min(1, 1200 / bitmap.width, 700 / bitmap.height);
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    try {
      const plan = getPlan();
      context.save(); context.strokeStyle = '#d7fa63'; context.lineWidth = 2; context.setLineDash([7, 4]);
      const vertical = new Set(); const horizontal = new Set();
      for (const tile of plan.tiles) {
        const x = tile.x + tile.core.x + tile.core.width;
        const y = tile.y + tile.core.y + tile.core.height;
        if (x < bitmap.width) vertical.add(x);
        if (y < bitmap.height) horizontal.add(y);
      }
      for (const edge of vertical) { const x = edge * scale; context.beginPath(); context.moveTo(x, 0); context.lineTo(x, canvas.height); context.stroke(); }
      for (const edge of horizontal) { const y = edge * scale; context.beginPath(); context.moveTo(0, y); context.lineTo(canvas.width, y); context.stroke(); }
      context.restore();
      exportButton.disabled = false;
      readyText.textContent = `${copy.fields.imageReady}: ${bitmap.width} × ${bitmap.height} px · ${plan.tiles.length}`;
    } catch {
      exportButton.disabled = true;
      readyText.textContent = copy.messages.invalidGrid;
    }
  }

  fileInput.addEventListener('change', async () => {
    const request = ++requestId;
    revokeExport(); bitmap?.close?.(); bitmap = null; exportButton.disabled = true; workbench.hidden = true;
    const file = fileInput.files?.[0];
    if (!file) return;
    if (!allowedTypes.has(file.type)) { announce(root, copy.messages.unsupportedImage, 'error'); return; }
    let decoded;
    try { decoded = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
    catch { announce(root, copy.messages.unsupportedImage, 'error'); return; }
    if (request !== requestId) { decoded.close?.(); return; }
    if (!Number.isSafeInteger(decoded.width * decoded.height) || decoded.width * decoded.height > MAX_SPLITTER_PIXELS) {
      decoded.close?.(); announce(root, copy.messages.imageTooLarge, 'error'); return;
    }
    bitmap = decoded;
    workbench.hidden = false;
    drawPreview();
    announce(root, `${copy.fields.imageReady}: ${bitmap.width} × ${bitmap.height} px.`, 'success');
  });

  modeSelect.addEventListener('change', syncMode);
  for (const name of ['columns', 'rows', 'tileWidth', 'tileHeight', 'overlap']) form.elements.namedItem(name).addEventListener('input', drawPreview);
  syncMode();
  exportButton.addEventListener('click', async () => {
    if (!bitmap) { announce(root, copy.messages.selectImage, 'error'); return; }
    let plan;
    try { plan = getPlan(); } catch { announce(root, copy.messages.invalidGrid, 'error'); return; }
    exportButton.disabled = true; revokeExport(); announce(root, copy.messages.exporting);
    const currentExport = ++exportId;
    cancelButton.hidden = false; chooseButton.disabled = true; fileInput.disabled = true;
    for (const name of ['mode', 'columns', 'rows', 'tileWidth', 'tileHeight', 'overlap']) form.elements.namedItem(name).disabled = true;
    const scratch = document.createElement('canvas');
    try {
      const files = [];
      const manifest = { format: 'usefulverse-image-tiles-v1', source: { width: plan.width, height: plan.height }, split: { mode: plan.mode, columns: plan.columns, rows: plan.rows, tileWidth: plan.tileWidth, tileHeight: plan.tileHeight, overlap: plan.overlap }, assembly: 'Place each tile at x/y and crop it to core.x/core.y/core.width/core.height in tile coordinates. Core rectangles cover the source canvas exactly once.', tiles: [] };
      const tileContext = scratch.getContext('2d');
      if (!tileContext) throw new Error('Canvas unavailable');
      for (const tile of plan.tiles) {
        if (currentExport !== exportId) throw new Error('Cancelled');
        if (tile.index === 0 || (tile.index + 1) % 10 === 0) {
          announce(root, `${copy.messages.exporting} ${numberLabel(tile.index + 1)}/${numberLabel(plan.tiles.length)}`);
        }
        scratch.width = tile.width; scratch.height = tile.height;
        tileContext.clearRect(0, 0, tile.width, tile.height);
        tileContext.drawImage(bitmap, tile.x, tile.y, tile.width, tile.height, 0, 0, tile.width, tile.height);
        const blob = await new Promise((resolve, reject) => scratch.toBlob((value) => value ? resolve(value) : reject(new Error('PNG export failed')), 'image/png'));
        const filename = formatTileName(fileInput.files?.[0]?.name, tile.row, tile.column);
        files.push({ name: filename, data: new Uint8Array(await blob.arrayBuffer()) });
        manifest.tiles.push({ file: filename, row: tile.row, column: tile.column, x: tile.x, y: tile.y, width: tile.width, height: tile.height, core: tile.core });
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
      if (currentExport !== exportId) throw new Error('Cancelled');
      files.push({ name: 'manifest.json', data: new TextEncoder().encode(JSON.stringify(manifest, null, 2)) });
      const zip = await createStoredZip(files, { shouldCancel: () => currentExport !== exportId });
      exportUrl = URL.createObjectURL(zip);
      exportLink.href = exportUrl;
      exportLink.download = `${formatTileName(fileInput.files?.[0]?.name, 0, 0).replace(/-r01-c01\.png$/u, '')}-tiles.zip`;
      exportLink.textContent = copy.actions.download; exportLink.hidden = false;
      announce(root, copy.messages.exportReady, 'success');
    } catch {
      if (currentExport === exportId) announce(root, copy.messages.exportFailed, 'error');
    } finally {
      scratch.width = 0; scratch.height = 0; exportButton.disabled = !bitmap;
      cancelButton.hidden = true; chooseButton.disabled = false; fileInput.disabled = false;
      for (const name of ['mode', 'tileWidth', 'tileHeight', 'overlap']) form.elements.namedItem(name).disabled = false;
      modeSelect.disabled = false;
      syncMode(false);
    }
  });
  root.querySelector('[data-action="choose"]')?.addEventListener('click', () => fileInput.click());
  cancelButton.addEventListener('click', () => { exportId += 1; announce(root, copy.messages.cancelled, 'success'); });
  form.addEventListener('reset', () => setTimeout(() => {
    requestId += 1; exportId += 1; bitmap?.close?.(); bitmap = null; revokeExport(); workbench.hidden = true;
    canvas.width = 1; canvas.height = 1; exportButton.disabled = true; announce(root, '');
    syncMode();
  }, 0));
  window.addEventListener('pagehide', () => { exportId += 1; bitmap?.close?.(); revokeExport(); });
}
