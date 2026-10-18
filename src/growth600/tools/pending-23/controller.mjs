import { announce, copyText } from '../controller-helpers.mjs';

const NS = 'http://www.w3.org/2000/svg';
const IMAGE_TOOLS = new Set(['color-palette-from-image', 'image-histogram']);
const FILE_TOOLS = new Set([...IMAGE_TOOLS, 'mockup-generator']);

function node(tag, text, className) {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = String(text);
  if (className) el.className = className;
  return el;
}

function svgElement(tag, attrs = {}) {
  const el = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, String(value));
  return el;
}

function roundedRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function collect(form) {
  const value = {};
  for (const control of form.querySelectorAll('[data-input]')) {
    if (control.type === 'file') value.file = control.files?.[0] ?? null;
    else if (control.type === 'number') value[control.dataset.input] = control.value === '' ? '' : Number(control.value);
    else value[control.dataset.input] = control.value;
  }
  return value;
}

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = node('a'); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function addActions(content, copy, value) {
  const actions = node('div', undefined, 'actions pending-result-actions');
  const serialized = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  const copyButton = node('button', copy.actions.copy, 'button button--secondary');
  copyButton.type = 'button';
  copyButton.addEventListener('click', () => copyText(content.closest('.pending-tool'), serialized, copy));
  const downloadButton = node('button', copy.actions.download, 'button button--secondary');
  downloadButton.type = 'button';
  downloadButton.addEventListener('click', () => saveBlob(new Blob([serialized], { type: 'text/plain;charset=utf-8' }), 'usefulverse-result.txt'));
  actions.append(copyButton, downloadButton); content.append(actions);
}

function appendTree(parent, tree) {
  const li = node('li', tree.name);
  if (tree.reports?.length) { const ul = node('ul'); for (const child of tree.reports) appendTree(ul, child); li.append(ul); }
  parent.append(li);
}

function appendDecisionTree(parent, branch, copy) {
  const li = node('li');
  if (branch.outcome) { li.textContent = branch.outcome; parent.append(li); return; }
  li.append(node('strong', branch.question));
  const branches = node('ul');
  for (const [label, child] of [[copy.fields.yes, branch.yes], [copy.fields.no, branch.no]]) {
    const item = node('li'); item.append(node('span', `${label}: `));
    const childList = node('ul'); appendDecisionTree(childList, child, copy); item.append(childList); branches.append(item);
  }
  li.append(branches); parent.append(li);
}

function renderRiskMatrix(content, entries, copy) {
  const f = copy.fields;
  const table = node('table', undefined, 'pending-risk-grid');
  table.setAttribute('aria-label', f.matrixLabel);
  const thead = node('thead'); const header = node('tr');
  header.append(node('th', f.impact));
  for (let likelihood = 1; likelihood <= 5; likelihood++) header.append(node('th', `${f.likelihood} ${likelihood}`));
  thead.append(header); table.append(thead);
  const body = node('tbody');
  for (let impact = 5; impact >= 1; impact--) {
    const row = node('tr'); row.append(node('th', `${f.impact} ${impact}`));
    for (let likelihood = 1; likelihood <= 5; likelihood++) {
      const risks = entries.filter((risk) => risk.impact === impact && risk.likelihood === likelihood);
      const level = likelihood * impact >= 15 ? 'high' : likelihood * impact >= 6 ? 'medium' : 'low';
      const cell = node('td', undefined, `pending-risk-grid__cell pending-risk-grid__cell--${level}`);
      cell.setAttribute('aria-label', `${f.likelihood} ${likelihood}, ${f.impact} ${impact}: ${risks.map((risk) => risk.name).join(', ') || '—'}`);
      for (const risk of risks) cell.append(node('span', risk.name, 'pending-risk-grid__risk'));
      if (!risks.length) cell.textContent = '—';
      row.append(cell);
    }
    body.append(row);
  }
  table.append(body); content.append(table);
}

function renderRadar(content, entries, copy) {
  const size = 320; const center = size / 2; const radius = 112;
  const chart = svgElement('svg', { viewBox: `0 0 ${size} ${size}`, role: 'img', 'aria-label': copy.fields.radarChartLabel, class: 'pending-chart' });
  for (const level of [25, 50, 75, 100]) {
    const points = entries.map((_, i) => { const a = (Math.PI * 2 * i / entries.length) - Math.PI / 2; return `${center + Math.cos(a) * radius * level / 100},${center + Math.sin(a) * radius * level / 100}`; }).join(' ');
    chart.append(svgElement('polygon', { points, fill: 'none', stroke: 'currentColor', 'stroke-opacity': '.2' }));
  }
  const values = entries.map((entry, i) => { const a = (Math.PI * 2 * i / entries.length) - Math.PI / 2; const x = center + Math.cos(a) * radius * entry.score / 100; const y = center + Math.sin(a) * radius * entry.score / 100; chart.append(svgElement('text', { x: center + Math.cos(a) * 140, y: center + Math.sin(a) * 140, 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'pending-chart-label' })).lastChild.textContent = `${entry.label} (${entry.score})`; return `${x},${y}`; }).join(' ');
  chart.append(svgElement('polygon', { points: values, fill: 'var(--accent,#c6f45b)', 'fill-opacity': '.35', stroke: 'currentColor', 'stroke-width': '2' }));
  content.append(chart);
}

function renderSankey(content, result, copy) {
  const width = 720; const rowHeight = 44; const height = Math.max(100, result.entries.length * rowHeight + 24);
  const svg = svgElement('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': copy.fields.sankeyLabel, class: 'pending-chart pending-sankey' });
  const max = Math.max(1, ...result.entries.map(({ value }) => value));
  result.entries.forEach((flow, index) => {
    const y = 28 + index * rowHeight; const thickness = Math.max(2, 24 * flow.value / max);
    svg.append(svgElement('path', { d: `M 205 ${y} C 330 ${y}, 390 ${y}, 515 ${y}`, fill: 'none', stroke: 'currentColor', 'stroke-opacity': '.28', 'stroke-width': thickness }));
    const source = svgElement('text', { x: 12, y, 'dominant-baseline': 'middle', class: 'pending-chart-label' }); source.textContent = flow.source; svg.append(source);
    const target = svgElement('text', { x: 708, y, 'text-anchor': 'end', 'dominant-baseline': 'middle', class: 'pending-chart-label' }); target.textContent = flow.target; svg.append(target);
    const amount = svgElement('text', { x: 360, y: y - 4, 'text-anchor': 'middle', class: 'pending-chart-label pending-chart-label--small' }); amount.textContent = String(flow.value); svg.append(amount);
  });
  content.append(svg);
}

function renderHistogram(content, histogram, copy) {
  const chart = svgElement('svg', { viewBox: '0 0 360 170', role: 'img', 'aria-label': copy.fields.histogramLabel, class: 'pending-chart' });
  const colors = { red: '#d53b3b', green: '#188b48', blue: '#276bd1', luminance: '#414655' };
  for (const [name, bins] of Object.entries(histogram.channels)) {
    const max = Math.max(1, ...bins);
    bins.forEach((count, i) => chart.append(svgElement('rect', { x: i * 22 + 5, y: 155 - (count / max) * 135, width: 19, height: Math.max(0, (count / max) * 135), fill: colors[name], 'fill-opacity': name === 'luminance' ? '.35' : '.72' })));
  }
  content.append(chart, node('p', `${copy.fields.sampledPixels}: ${histogram.total}`));
  const legend = node('ul', undefined, 'pending-histogram-legend');
  for (const [key, color] of Object.entries(colors)) {
    const item = node('li', copy.fields[key]);
    item.style.setProperty('--histogram-color', color);
    legend.append(item);
  }
  content.append(legend);
}

async function renderImageMockup(content, input, copy) {
  if (!input.file) throw new RangeError(copy.messages.chooseFile);
  if (input.file.size > 20 * 1024 * 1024) throw new RangeError(copy.messages.imageTooLarge);
  const image = await createImageBitmap(input.file);
  try {
    const scale = Math.min(1, 1400 / image.width, 1800 / image.height);
    const width = Math.max(1, Math.round(image.width * scale)); const height = Math.max(1, Math.round(image.height * scale));
    const padding = input.frame === 'phone' ? 32 : 22; const header = input.frame === 'browser' ? 34 : 0;
    const canvas = document.createElement('canvas'); canvas.width = width + padding * 2; canvas.height = height + padding * 2 + header;
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error(copy.messages.canvasUnavailable);
    ctx.fillStyle = input.background; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#161923'; ctx.beginPath(); roundedRectPath(ctx, padding - 8, padding - 8, width + 16, height + 16 + header, input.frame === 'phone' ? 26 : 12); ctx.fill();
    if (header) { ctx.fillStyle = '#f7f8fa'; ctx.fillRect(padding, padding, width, header); for (let i = 0; i < 3; i++) { ctx.fillStyle = ['#f16a64','#f0c64f','#59bb6c'][i]; ctx.beginPath(); ctx.arc(padding + 12 + i * 16, padding + header / 2, 4, 0, Math.PI * 2); ctx.fill(); } }
    ctx.drawImage(image, padding, padding + header, width, height);
    canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', copy.fields.previewImageLabel);
    const preview = node('div', undefined, 'pending-preview'); preview.append(canvas); content.append(preview);
    const actions = node('div', undefined, 'actions pending-result-actions'); const button = node('button', copy.actions.download, 'button button--secondary'); button.type = 'button'; button.addEventListener('click', () => canvas.toBlob((blob) => { if (blob) saveBlob(blob, 'usefulverse-mockup.png'); }, 'image/png')); actions.append(button); content.append(actions);
    return { width: image.width, height: image.height, frame: input.frame };
  } finally { image.close(); }
}

function renderResult(content, id, result, copy) {
  const f = copy.fields; const rows = [];
  const add = (label, value) => rows.push([label, value === null || value === undefined ? copy.messages.noEvent : String(value)]);
  if (id === 'project-risk-matrix') {
    renderRiskMatrix(content, result, copy);
    const table = node('table', undefined, 'pending-table'); const head = node('tr'); for (const label of [f.risk, f.likelihood, f.impact, f.score, f.level]) head.append(node('th', label)); table.append(node('thead')).firstChild.append(head); const body = node('tbody'); for (const risk of result) { const tr = node('tr'); for (const value of [risk.name, risk.likelihood, risk.impact, risk.score, f[risk.level.toLowerCase()]]) tr.append(node('td', value)); body.append(tr); } table.append(body); content.append(table); return result;
  }
  if (id === 'org-chart-maker') { const ul = node('ul', undefined, 'pending-org-tree'); appendTree(ul, result); content.append(ul); return result; }
  if (id === 'radar-chart-maker') { renderRadar(content, result, copy); const table = node('ul'); for (const row of result) table.append(node('li', `${row.label}: ${row.score}`)); content.append(table); return result; }
  if (id === 'image-histogram') { renderHistogram(content, result, copy); return result; }
  if (id === 'color-palette-from-image') { const palette = node('div', undefined, 'pending-palette'); for (const color of result) { const swatch = node('button', `${color.hex} · ${color.count}`); swatch.type = 'button'; swatch.style.setProperty('--swatch', color.hex); swatch.addEventListener('click', async () => { try { await navigator.clipboard.writeText(color.hex); announce(content.closest('.pending-tool'), copy.messages.copied, 'success'); } catch { announce(content.closest('.pending-tool'), copy.messages.copyUnavailable, 'error'); } }); palette.append(swatch); } content.append(palette); return result; }
  if (id === 'decision-tree-maker') { const list = node('ol', undefined, 'pending-decision-tree'); appendDecisionTree(list, result.root, copy); content.append(list); const paths=node('details'); paths.append(node('summary',f.allPaths)); const listPaths=node('ul'); for(const path of result.paths) listPaths.append(node('li',path)); paths.append(listPaths); content.append(paths); addActions(content,copy,result.paths); return result; }
  if (id === 'sankey-diagram-generator') { renderSankey(content,result,copy); const list = node('ol'); for (const flow of result.entries) list.append(node('li', `${flow.source} → ${flow.target}: ${flow.value}`)); content.append(list); add(f.totalFlow, result.total); }
  else if (id === 'event-budget-calculator') { const table = node('table', undefined, 'pending-table'); const head = node('tr'); [f.category,f.planned,f.actual,f.variance].forEach((label) => head.append(node('th',label))); const thead=node('thead'); thead.append(head); table.append(thead); const body=node('tbody'); for (const row of result.entries) { const tr=node('tr'); [row.category,row.planned,row.actual,row.planned-row.actual].forEach(v=>tr.append(node('td',v))); body.append(tr); } table.append(body); content.append(table); add(f.plannedTotal,result.planned); add(f.actualTotal,result.actual); add(f.variance,result.variance); }
  else if (id === 'shift-scheduler') { const list=node('ul'); for (const shift of result.entries) list.append(node('li',`${f[`weekday${shift.day}`] ?? shift.day} · ${shift.person} · ${shift.start}–${shift.end} · ${shift.hours} h`)); content.append(list); add(f.totalHours,result.totalHours); }
  else if (id === 'subscription-tracker') { const list=node('ul'); for (const sub of result.entries) { const periodKey=`period${sub.period[0].toUpperCase()}${sub.period.slice(1)}`; list.append(node('li',`${sub.name} · ${sub.amount} (${f[periodKey] ?? sub.period}) · ${sub.monthly.toFixed(2)} ${f.perMonth}`)); } content.append(list); add(f.monthlyTotal,result.monthly.toFixed(2)); add(f.yearlyTotal,result.yearly.toFixed(2)); }
  else if (id === 'word-frequency-counter') { add(f.totalWords,result.totalWords); add(f.uniqueWords,result.uniqueWords); const list=node('ol'); for (const entry of result.entries) list.append(node('li',`${entry.word}: ${entry.count}`)); content.append(list); }
  else if (id === 'acrostic-poem-maker') { const list=node('ol'); for (const line of result) list.append(node('li',`${line.letter}${line.suggestion ? ` — ${line.suggestion}` : ''}`)); content.append(list); }
  else if (id === 'bra-size-calculator') { add(f.approximateSize,result.estimate); add(f.cup,result.cup); add(f.band,result.approximateBandCm); }
  else if (id === 'sunrise-sunset-calculator' || id === 'moonrise-moonset-calculator') { for (const [key,value] of Object.entries(result.events ?? result)) add(f[key] ?? key,value); }
  else if (id === 'persian-calendar-converter') { add(f.gregorianDate,result.gregorian); add(f.persianDate,result.persian); }
  else if (id === 'packing-box-calculator') { add(f.itemsPerBox,result.perBox); add(f.fitStatus,result.fits ? f.fits : f.doesNotFit); add(f.volumeUpperBound,result.volumeUpperBound); }
  else if (id === 'car-running-cost-calculator') { add(f.fuelCost,result.fuel.toFixed(2)); add(f.maintenanceCost,result.maintenance.toFixed(2)); add(f.fixedCosts,result.fixed.toFixed(2)); add(f.annualTotal,result.annualTotal.toFixed(2)); add(f.monthlyAverage,result.monthlyAverage.toFixed(2)); }
  else if (id === 'text-summarizer') { add(f.summary,result.summary); add(f.sentencesKept,result.sentenceCount); }
  else if (id === 'speed-reading-app') { renderReader(content, result, copy); return result; }
  else if (id === 'logo-maker') { renderLogo(content, result, copy); return result; }
  else { for (const [key,value] of Object.entries(result)) if (typeof value !== 'object' && value !== null) add(f[key] ?? key,value); }
  const dl=node('dl'); for (const [label,value] of rows) { dl.append(node('dt',label),node('dd',value)); } content.prepend(dl);
  addActions(content,copy,result); return result;
}

function renderLogo(content, input, copy) {
  const stacked = input.layout === 'stacked'; const svg = svgElement('svg',{viewBox:stacked?'0 0 360 300':'0 0 640 220',role:'img','aria-label':copy.fields.logoPreviewLabel,class:'pending-logo'});
  const width = stacked ? 360 : 640; const height = stacked ? 300 : 220;
  svg.append(svgElement('rect',{x:0,y:0,width,height,rx:24,fill:input.background}));
  const cx = stacked ? 180 : 92; const cy = stacked ? 112 : 110;
  if (input.shape === 'round') svg.append(svgElement('circle',{cx,cy,r:stacked?58:48,fill:input.color}));
  if (input.shape === 'square') svg.append(svgElement('rect',{x:cx-(stacked?52:44),y:cy-(stacked?52:44),width:stacked?104:88,height:stacked?104:88,rx:stacked?16:14,fill:input.color}));
  const mark = input.shape === 'none' ? '' : (String(input.text ?? '').trim().slice(0,1).toLocaleUpperCase() || 'U');
  if(mark){const markText=svgElement('text',{x:cx,y:cy,'text-anchor':'middle','dominant-baseline':'middle',fill:input.background,'font-family':'system-ui,sans-serif','font-size':stacked?'54':'44','font-weight':'800'});markText.textContent=mark;svg.append(markText);}
  const text=svgElement('text',{x:stacked?180:164,y:stacked?236:112,'text-anchor':stacked?'middle':'start','dominant-baseline':'middle',fill:input.color,'font-family':'system-ui,sans-serif','font-size':stacked?'32':'46','font-weight':'700'}); text.textContent=input.text || 'Logo'; svg.append(text); content.append(svg);
  const actions=node('div',undefined,'actions pending-result-actions'); const button=node('button',copy.actions.download,'button button--secondary'); button.type='button'; button.addEventListener('click',()=>saveBlob(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'}),'usefulverse-logo.svg')); actions.append(button); content.append(actions);
}

function renderReader(content, stats, copy) {
  const root=content.closest('.pending-tool'); const form=root.querySelector('form'); const text=form.elements.namedItem('text').value.trim(); const words=text.split(/\s+/u); let index=0; let timer=null;
  const display=node('p',copy.fields.readerReady,'pending-reader-word'); display.setAttribute('aria-live','polite');
  const controls=node('div',undefined,'actions'); const play=node('button',copy.actions.start,'button button--primary'); const pause=node('button',copy.actions.pause,'button button--secondary'); const resume=node('button',copy.actions.resume,'button button--secondary'); const restart=node('button',copy.actions.restart,'button button--secondary');
  for(const button of [play,pause,resume,restart]) button.type='button';
  const stop=()=>{clearTimeout(timer);timer=null;}; const tick=()=>{if(index>=words.length){stop();display.textContent=copy.messages.readerFinished;return;}display.textContent=words[index++];timer=setTimeout(tick,60000/stats.wpm);};
  play.addEventListener('click',()=>{index=0;stop();tick();}); pause.addEventListener('click',stop); resume.addEventListener('click',()=>{if(!timer)tick();}); restart.addEventListener('click',()=>{stop();index=0;display.textContent=copy.fields.readerReady;});
  const visibilityHandler=()=>{if(document.hidden)stop();}; document.addEventListener('visibilitychange',visibilityHandler,{once:false});
  controls.append(play,pause,resume,restart); content.append(display,controls,node('p',`${stats.words} · ${stats.minutes.toFixed(1)} ${copy.fields.minutes}`));
  const observer=new MutationObserver(()=>{if(!root.isConnected){stop();document.removeEventListener('visibilitychange',visibilityHandler);observer.disconnect();}}); observer.observe(document.documentElement,{childList:true,subtree:true});
}

export function mountPendingTool(id, calculate, getPixels) {
  const root=document.querySelector(`[data-tool="${CSS.escape(id)}"]`); if(!root)return;
  const area=root.querySelector('[data-pending-tool]'); const form=area?.querySelector('[data-pending-form]'); const result=root.querySelector('[data-result]'); const content=root.querySelector('[data-result-content]');
  const copy=JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}'); if(!form||!result||!content) return;
  const clear=()=>{content.replaceChildren();result.hidden=true;root.querySelector('[data-status]').textContent='';};
  async function run(event){event?.preventDefault();clear();try{const input=collect(form);if(id==='writing-prompt-generator'&&!input.seed){input.seed=String(crypto.getRandomValues(new Uint32Array(2)).join('-'));}if(id==='subscription-tracker'){const aliases=new Map([[copy.fields.periodWeekly,'weekly'],[copy.fields.periodMonthly,'monthly'],[copy.fields.periodQuarterly,'quarterly'],[copy.fields.periodYearly,'yearly']].map(([key,value])=>[String(key).trim().toLocaleLowerCase(),value]));input.rows=String(input.rows).split(/\r?\n/u).map(line=>{const parts=line.split('|');if(parts.length>=3){const last=parts[parts.length-1].trim().toLocaleLowerCase();parts[parts.length-1]=aliases.get(last)??parts.at(-1).trim();}return parts.join('|');}).join('\n');}let data=input;if(IMAGE_TOOLS.has(id)){if(!input.file)throw new RangeError(copy.messages.chooseFile);data={pixels:await getPixels(input.file),colors:6};}const output=await calculate(data);if(id==='mockup-generator'){const meta=await renderImageMockup(content,input,copy);result.hidden=false;announce(root,copy.messages.complete,'success');return meta;}renderResult(content,id,output,copy);result.hidden=false;announce(root,copy.messages.complete,'success');return output;}catch(error){announce(root,error instanceof RangeError?copy.messages.error:copy.messages.fileError,'error');return null;}}
  form.addEventListener('submit',run);form.addEventListener('reset',()=>queueMicrotask(clear));
  root.querySelector('[data-action="example"]')?.addEventListener('click',()=>{if(id==='writing-prompt-generator'){const seed=form.elements.namedItem('seed');seed.value=String(Date.now());} if(id==='color-palette-from-image'||id==='image-histogram'||id==='mockup-generator')return;run();});
  for(const control of form.querySelectorAll('[data-input]')) control.addEventListener('input',clear);
}
