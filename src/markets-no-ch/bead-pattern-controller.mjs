import { beadPatternSvg, buildBeadPattern } from './bead-pattern.mjs';

const root = document.querySelector('[data-bead-pattern-tool]');
if (root) {
  const copy = JSON.parse(root.closest('[data-market-tool]')?.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields;
  const q = (selector) => root.querySelector(selector);
  const file = q('#bead-pattern-image');
  const status = q('[data-bead-status]');
  const output = q('[data-bead-output]');
  const grid = q('[data-bead-grid]');
  const inkFor = (hex) => {
    const channels = hex.slice(1).match(/.{2}/gu).map((part) => parseInt(part, 16) / 255)
      .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722 > 0.42 ? '#111' : '#fff';
  };
  let pattern = null;
  let job = 0;
  let worker = null;
  let rejectWorker = null;

  function clearOutput() {
    pattern = null; output.hidden = true;
    grid.replaceChildren(); q('[data-bead-legend]').replaceChildren();
  }

  function render(result) {
    pattern = result;
    q('[data-bead-title]').textContent = q('#bead-pattern-craft').value === 'cross-stitch' ? f.crossStitch : f.beads;
    q('[data-bead-summary]').textContent = `${f.width}: ${result.columns} · ${f.height}: ${result.rows} · ${f.total}: ${new Intl.NumberFormat(document.documentElement.lang).format(result.filledCells)}`;
    grid.style.setProperty('--bead-columns', result.columns);
    grid.setAttribute('aria-rowcount', result.rows);
    grid.setAttribute('aria-colcount', result.columns);
    const colors = new Map(result.colors.map((color) => [color.index, color]));
    const fragment = document.createDocumentFragment();
    for (let row = 0; row < result.rows; row += 1) {
      for (let column = 0; column < result.columns; column += 1) {
        const index = result.cells[row * result.columns + column];
        const cell = document.createElement('span');
        cell.className = `bead-pattern-cell${index === null ? ' is-empty' : ''}`;
        cell.setAttribute('role', 'gridcell');
        if (index === null) {
          cell.textContent = '·'; cell.setAttribute('aria-label', `${f.row} ${row + 1}, ${f.column} ${column + 1}, ${f.empty}`);
        } else {
          const color = colors.get(index);
          cell.textContent = color.symbol;
          cell.style.setProperty('--bead-color', color.hex);
          cell.style.color = inkFor(color.hex);
          cell.setAttribute('aria-label', `${f.row} ${row + 1}, ${f.column} ${column + 1}, ${f.color} ${color.hex}, ${f.symbol} ${color.symbol}`);
        }
        fragment.append(cell);
      }
    }
    grid.replaceChildren(fragment);
    const legend = q('[data-bead-legend]');
    const rows = document.createDocumentFragment();
    for (const color of result.colors) {
      const tr = document.createElement('tr');
      for (const value of [color.symbol, color.hex, new Intl.NumberFormat(document.documentElement.lang).format(color.count)]) {
        const td = document.createElement('td'); td.textContent = value; tr.append(td);
      }
      const swatch = document.createElement('span'); swatch.className = 'bead-pattern-swatch'; swatch.style.setProperty('--bead-color', color.hex); swatch.setAttribute('aria-hidden', 'true');
      tr.children[1].prepend(swatch); rows.append(tr);
    }
    if (result.emptyCells) {
      const tr = document.createElement('tr');
      for (const value of ['·', f.empty, new Intl.NumberFormat(document.documentElement.lang).format(result.emptyCells)]) {
        const td = document.createElement('td'); td.textContent = value; tr.append(td);
      }
      const swatch = document.createElement('span'); swatch.className = 'bead-pattern-swatch is-empty'; swatch.setAttribute('aria-hidden', 'true');
      tr.children[1].prepend(swatch); rows.append(tr);
    }
    legend.replaceChildren(rows); output.hidden = false;
  }

  function save(name, type, data) {
    const url = URL.createObjectURL(new Blob([data], { type }));
    const link = document.createElement('a'); link.href = url; link.download = name; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const csvCell = (value) => {
    const text = String(value);
    const safe = /^[=+\-@\t\r]/u.test(text) ? `'${text}` : text;
    return `"${safe.replaceAll('"', '""')}"`;
  };

  function cancel() {
    job += 1;
    if (worker) { worker.terminate(); worker = null; rejectWorker?.(new Error('cancelled')); rejectWorker = null; }
  }

  async function createPattern() {
    cancel(); const currentJob = job;
    clearOutput();
    const selected = file.files?.[0];
    if (!selected) { status.textContent = f.chooseFirst; return; }
    const supportedName = /\.(?:png|jpe?g|webp)$/iu.test(selected.name);
    if ((!['image/png', 'image/jpeg', 'image/webp'].includes(selected.type) && !supportedName) || selected.size > 10_000_000) { status.textContent = f.invalid; return; }
    status.textContent = f.processing;
    try {
      const bitmap = await createImageBitmap(selected);
      if (currentJob !== job) { bitmap.close(); return; }
      if (bitmap.width * bitmap.height > 4_000_000 || bitmap.width > 8192 || bitmap.height > 8192) { bitmap.close(); throw new RangeError('image limit'); }
      const canvas = document.createElement('canvas'); canvas.width = bitmap.width; canvas.height = bitmap.height;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) { bitmap.close(); throw new Error('canvas unavailable'); }
      context.drawImage(bitmap, 0, 0); bitmap.close();
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const options = {
        rgba: pixels,
        sourceWidth: canvas.width,
        sourceHeight: canvas.height,
        columns: Number(q('#bead-pattern-columns').value),
        rows: Number(q('#bead-pattern-rows').value),
        paletteSize: Number(q('#bead-pattern-palette').value),
        dither: q('#bead-pattern-dither').checked,
        preserveTransparency: q('#bead-pattern-transparency').checked,
      };
      canvas.width = 0; canvas.height = 0;
      if (typeof Worker === 'function') {
        const active = new Worker(new URL('./bead-pattern-worker.mjs', import.meta.url), { type: 'module' });
        worker = active;
        const result = await new Promise((resolve, reject) => {
          rejectWorker = reject;
          active.addEventListener('message', ({ data }) => data.ok ? resolve(data.pattern) : reject(new Error(data.error)), { once: true });
          active.addEventListener('error', () => reject(new Error('worker failed')), { once: true });
          active.postMessage({ ...options, id: currentJob, rgba: pixels }, [pixels.buffer]);
        });
        if (worker === active) { worker = null; active.terminate(); }
        rejectWorker = null;
        if (currentJob !== job) return;
        render(result);
      } else {
        render(buildBeadPattern(options));
      }
      if (currentJob === job) status.textContent = f.generated;
    } catch {
      if (worker) { worker.terminate(); worker = null; rejectWorker = null; }
      if (currentJob === job) { clearOutput(); status.textContent = f.invalid; }
    }
  }

  file.addEventListener('change', () => { cancel(); clearOutput(); status.textContent = f.ready; });
  q('[data-bead-generate]').addEventListener('click', createPattern);
  q('[data-bead-clear]').addEventListener('click', () => { cancel(); file.value = ''; clearOutput(); status.textContent = f.ready; });
  q('[data-bead-svg]').addEventListener('click', () => {
    if (!pattern) { status.textContent = f.exportFirst; return; }
    save('craft-pattern.svg', 'image/svg+xml;charset=utf-8', beadPatternSvg(pattern, { title: f.imageTitle, emptyLabel: f.empty }));
  });
  q('[data-bead-png]').addEventListener('click', () => {
    if (!pattern) { status.textContent = f.exportFirst; return; }
    const cellSize = Math.max(6, Math.min(24, Math.floor(1800 / pattern.columns), Math.floor(1800 / pattern.rows)));
    const chartHeight = pattern.rows * cellSize;
    const legendRows = pattern.colors.length + (pattern.emptyCells ? 1 : 0);
    const canvas = document.createElement('canvas'); canvas.width = Math.max(pattern.columns * cellSize, 360); canvas.height = chartHeight + 30 + legendRows * 30;
    const context = canvas.getContext('2d'); if (!context) { status.textContent = f.invalid; return; }
    context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height);
    const colors = new Map(pattern.colors.map((color) => [color.index, color]));
    pattern.cells.forEach((index, cellIndex) => {
      const x = (cellIndex % pattern.columns) * cellSize; const y = Math.floor(cellIndex / pattern.columns) * cellSize;
      if (index !== null) {
        const color = colors.get(index); context.fillStyle = color.hex; context.fillRect(x, y, cellSize, cellSize);
        context.fillStyle = inkFor(color.hex); context.font = `${Math.max(8, Math.floor(cellSize * 0.55))}px sans-serif`; context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillText(color.symbol, x + cellSize / 2, y + cellSize / 2);
      }
      context.strokeStyle = '#888'; context.strokeRect(x, y, cellSize, cellSize);
    });
    context.textAlign = 'left'; context.textBaseline = 'middle'; context.font = '14px sans-serif';
    pattern.colors.forEach((color, index) => {
      const y = chartHeight + 30 + index * 30;
      context.fillStyle = color.hex; context.fillRect(8, y - 9, 18, 18); context.strokeStyle = '#555'; context.strokeRect(8, y - 9, 18, 18);
      context.fillStyle = '#111'; context.fillText(`${color.symbol} · ${color.hex} · ${color.count}`, 34, y);
    });
    if (pattern.emptyCells) {
      const y = chartHeight + 30 + pattern.colors.length * 30;
      context.strokeStyle = '#555'; context.strokeRect(8, y - 9, 18, 18);
      context.fillStyle = '#111'; context.fillText(`· · ${f.empty} · ${pattern.emptyCells}`, 34, y);
    }
    canvas.toBlob((blob) => {
      if (blob) save('craft-pattern.png', 'image/png', blob); else status.textContent = f.invalid;
      canvas.width = 0; canvas.height = 0;
    }, 'image/png');
  });
  q('[data-bead-csv]').addEventListener('click', () => {
    if (!pattern) { status.textContent = f.exportFirst; return; }
    const colors = new Map(pattern.colors.map((color) => [color.index, color]));
    const matrix = [[f.csvGridHeading, ...Array.from({ length: pattern.columns }, (_, column) => String(column + 1))], ...Array.from({ length: pattern.rows }, (_, row) => [`${f.row} ${row + 1}`, ...pattern.cells.slice(row * pattern.columns, (row + 1) * pattern.columns).map((index) => index === null ? '' : colors.get(index).symbol)])];
    const legend = [[f.csvLegendHeading, f.symbol, f.color, f.count], ...pattern.colors.map((color) => ['', color.symbol, color.hex, color.count])];
    if (pattern.emptyCells) legend.push(['', '·', f.empty, pattern.emptyCells]);
    const csv = `\uFEFF${[...matrix, [], ...legend].map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
    save('craft-pattern.csv', 'text/csv;charset=utf-8', csv);
  });
  q('[data-bead-print]').addEventListener('click', () => {
    if (!pattern) { status.textContent = f.exportFirst; return; }
    window.print();
  });
}
