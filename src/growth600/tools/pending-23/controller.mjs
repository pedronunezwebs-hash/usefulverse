import { announce, copyText } from '../controller-helpers.mjs';
import { moveHanoiDisk, createColorDifferenceRound } from './logic.mjs';

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
    if (control.type === 'file') value[control.dataset.input] = control.multiple ? Array.from(control.files ?? []) : (control.files?.[0] ?? null);
    else if (control.type === 'number') value[control.dataset.input] = control.value === '' ? '' : Number(control.value);
    else if (control.type === 'checkbox') value[control.dataset.input] = control.checked;
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

function renderOrbitalVisualizer(content, result, copy) {
  const canvas = document.createElement('canvas'); canvas.width = result.size; canvas.height = result.size;
  canvas.className = 'pending-orbital-canvas'; canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', copy.fields.orbitalImage);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable in this browser.');
  const image = context.createImageData(result.size, result.size);
  for (let i = 0; i < result.density.length; i++) {
    const intensity = Math.max(0, Math.min(1, result.density[i])); const offset = i * 4;
    image.data[offset] = Math.round(12 + 104 * intensity); image.data[offset + 1] = Math.round(22 + 190 * intensity); image.data[offset + 2] = Math.round(42 + 213 * intensity); image.data[offset + 3] = Math.round(255 * Math.min(1, intensity * 1.6));
  }
  context.putImageData(image, 0, 0);
  const number = new Intl.NumberFormat(document.documentElement.lang || 'en', { maximumSignificantDigits: 5 });
  const details = node('dl', undefined, 'pending-orbital-details');
  for (const [label, value] of [[copy.fields.quantumState, `n=${result.n}, l=${result.l}, m=${result.m}, Z=${result.z}`], [copy.fields.orbitalEnergy, `${number.format(result.energyEv)} eV`], [copy.fields.bohrRadiusExtent, number.format(result.extentBohr)]]) details.append(node('dt', label), node('dd', value));
  content.append(canvas, details);
}

function renderObjectRemover(content,result,copy){
  const root=content.closest('.pending-tool');const form=root.querySelector('form');const canvas=document.createElement('canvas');canvas.width=result.width;canvas.height=result.height;canvas.className='pending-object-remover-canvas';canvas.setAttribute('role','img');canvas.setAttribute('aria-label',copy.fields.maskCanvasLabel);
  const context=canvas.getContext('2d');const image=new ImageData(new Uint8ClampedArray(result.pixels),result.width,result.height);context.putImageData(image,0,0);const maskCanvas=document.createElement('canvas');maskCanvas.width=result.width;maskCanvas.height=result.height;const maskContext=maskCanvas.getContext('2d');root._objectMaskCanvas=maskCanvas;root._objectCurrentPixels=new Uint8ClampedArray(result.pixels);
  const paint=()=>{context.putImageData(new ImageData(new Uint8ClampedArray(root._objectCurrentPixels),result.width,result.height),0,0);context.save();context.drawImage(maskCanvas,0,0);context.restore();};
  let drawing=false;let last=null;const point=(event)=>{const rect=canvas.getBoundingClientRect();return{x:(event.clientX-rect.left)*canvas.width/rect.width,y:(event.clientY-rect.top)*canvas.height/rect.height};};
  const stroke=(event)=>{const current=point(event);maskContext.save();maskContext.globalCompositeOperation=form.elements.namedItem('mode').value==='erase'?'destination-out':'source-over';maskContext.strokeStyle='rgba(255,45,90,.58)';maskContext.fillStyle='rgba(255,45,90,.58)';maskContext.lineWidth=Number(form.elements.namedItem('brushSize').value);maskContext.lineCap='round';maskContext.lineJoin='round';if(last){maskContext.beginPath();maskContext.moveTo(last.x,last.y);maskContext.lineTo(current.x,current.y);maskContext.stroke();}else{maskContext.beginPath();maskContext.arc(current.x,current.y,maskContext.lineWidth/2,0,Math.PI*2);maskContext.fill();}maskContext.restore();last=current;paint();};
  canvas.addEventListener('pointerdown',(event)=>{drawing=true;last=null;canvas.setPointerCapture(event.pointerId);stroke(event);});canvas.addEventListener('pointermove',(event)=>{if(drawing)stroke(event);});const stop=()=>{drawing=false;last=null;};canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);
  const actions=node('div',undefined,'actions pending-result-actions');for(const [label,action]of [[copy.fields.applyRemoval,'apply-object-removal'],[copy.fields.clearMask,'clear-object-mask'],[copy.actions.download,'download-object-removal']]){const button=node('button',label,'button button--secondary');button.type='button';button.dataset[action]=String(true);actions.append(button);}content.append(canvas,actions,node('p',copy.fields.fillLimit,'hint'));
  if(result.changed)root._objectCurrentPixels=new Uint8ClampedArray(result.pixels);
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
  if (id === 'would-you-rather') {
    add(f.question, result.question); add(f.optionA, result.optionA); add(f.optionB, result.optionB);
    add(f.votesForA, result.votesForA); add(f.votesForB, result.votesForB); add(f.totalVotes, result.totalVotes);
    const reset = node('button', f.resetRound, 'button button--secondary'); reset.type = 'button';
    reset.addEventListener('click', () => { const root = content.closest('[data-tool]'); root._wouldYouRatherVotes = { signature: '', a: 0, b: 0 }; content.replaceChildren(); root.querySelector('[data-result]').hidden = true; root.querySelector('[data-status]').textContent = ''; });
    const actions = node('div', undefined, 'actions pending-result-actions'); actions.append(reset); content.append(actions);
  }
  else if (id === 'never-have-i-ever') {
    const root = content.closest('[data-tool]');
    add(f.prompt, result.prompt);
    add(f.voteProgress, `${result.votes} / ${result.participants}`);
    if (result.complete) {
      add(f.haveDone, `${result.haveDone} (${Math.round(result.haveDone / result.participants * 100)}%)`);
      add(f.haveNotDone, `${result.haveNotDone} (${Math.round(result.haveNotDone / result.participants * 100)}%)`);
    } else content.append(node('p', f.passDevice, 'hint'));
    const reset = node('button', f.resetRound, 'button button--secondary'); reset.type = 'button';
    reset.addEventListener('click', () => { root._neverHaveIEverVotes = { signature: '', yes: 0, no: 0, votes: 0, complete: false }; content.replaceChildren(); root.querySelector('[data-result]').hidden = true; root.querySelector('[data-status]').textContent = ''; });
    const actions = node('div', undefined, 'actions pending-result-actions'); actions.append(reset); content.append(actions);
  }
  else if (id === 'basketball-shooting-game') {
    const root = content.closest('[data-tool]');
    root._basketballStats ??= { made: 0, attempts: 0 };
    root._basketballStats.attempts++;
    if (result.made) root._basketballStats.made++;
    add(f.angle, `${result.angle.toFixed(0)}°`); add(f.power, `${result.power.toFixed(1)} m/s`); add(f.distance, `${result.distance.toFixed(1)} m`);
    add(f.shotResult, result.made ? f.shotMade : f.shotMissed);
    add(f.shotsMade, `${root._basketballStats.made} / ${root._basketballStats.attempts}`);
    add(f.targetHeight, `${result.heightAtTarget.toFixed(2)} m`);
    const width = 360; const height = 220; const left = 28; const right = 330;
    const minY = Math.min(0, ...result.trajectory.map(({ y }) => y)); const maxY = Math.max(3.05, ...result.trajectory.map(({ y }) => y));
    const scaleY = 130 / Math.max(1, maxY - minY); const point = ({ x, y }) => `${left + x / result.distance * (right - left)},${30 + (maxY - y) * scaleY}`;
    const path = result.trajectory.map((entry, index) => `${index ? 'L' : 'M'} ${point(entry)}`).join(' ');
    const graphic = svgElement('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': f.trajectoryLabel, class: 'pending-chart pending-basketball-shot' });
    const baseline = 30 + maxY * scaleY;
    graphic.append(svgElement('line', { x1: 16, y1: baseline, x2: 344, y2: baseline, stroke: 'currentColor', 'stroke-opacity': '.35' }));
    graphic.append(svgElement('path', { d: path, fill: 'none', stroke: 'var(--accent,#c6f45b)', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
    const hoopY = 30 + (maxY - 3.05) * scaleY;
    graphic.append(svgElement('line', { x1: right - 12, y1: hoopY, x2: right + 12, y2: hoopY, stroke: 'currentColor', 'stroke-width': 4 }));
    const [ballX, ballY] = point(result.trajectory.at(-1)).split(',');
    graphic.append(svgElement('circle', { cx: ballX, cy: ballY, r: 7, fill: '#df6a2f' }));
    content.append(graphic);
    const reset = node('button', f.resetScore, 'button button--secondary'); reset.type = 'button';
    reset.addEventListener('click', () => { root._basketballStats = { made: 0, attempts: 0 }; content.replaceChildren(); root.querySelector('[data-result]').hidden = true; root.querySelector('[data-status]').textContent = ''; });
    const actions = node('div', undefined, 'actions pending-result-actions'); actions.append(reset); content.append(actions);
  }
  else if (id === 'chinese-zodiac') {
    if (!result.supported) content.append(node('p', f.calendarUnsupported, 'hint'));
    else {
      add(f.animal, f[result.animalKey]);
      add(f.lunarYear, result.relatedYear);
      add(f.lunarDate, result.lunarDate);
    }
  }
  else if (id === 'egfr-calculator') {
    add(f.estimatedGfr, `${result.estimate.toFixed(1)} ${f.gfrUnits}`);
    add(f.equation, f.equation2021);
    add(f.creatinineMgDl, `${result.serumCreatinineMgDl.toFixed(2)} mg/dL`);
  }
  else if (id === 'india-gratuity-calculator') {
    const money = (amount) => new Intl.NumberFormat(document.documentElement.lang || 'en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);
    add(f.eligibility, result.eligible ? f.eligibleStatus : f.notEligible);
    add(f.creditedYears, result.completedYears);
    add(f.uncappedAmount, money(result.uncappedAmount));
    add(f.statutoryCap, money(result.statutoryCap));
    add(f.estimate, money(result.estimate));
    add(f.ceilingStatus, result.capApplied ? f.capAppliedStatus : f.notCapped);
    const guidance=node('a',f.officialGuidance);guidance.href='https://www.labour.gov.in/static/uploads/2026/03/a4ccf4c6d97c4f1f36a6d83f8c64213d.pdf';guidance.target='_blank';guidance.rel='noopener noreferrer';content.append(guidance);
  }
  else if (id === 'india-epf-calculator') {
    const money=(amount)=>new Intl.NumberFormat(document.documentElement.lang||'en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(amount);
    add(f.employeeContribution,money(result.employeeContribution));add(f.employerContribution,money(result.employerContribution));add(f.epsContribution,money(result.epsContribution));add(f.employerEpfContribution,money(result.employerEpfContribution));add(f.combinedMonthlyContribution,money(result.combinedMonthlyContribution));
    const link=node('a',f.officialRates);link.href='https://www.epfindia.gov.in/site_docs/PDFs/MiscPDFs/ContributionRate.pdf';link.target='_blank';link.rel='noopener noreferrer';content.append(link);
  }
  else if (id === 'brazil-termination-calculator') {
    const money=(amount)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:2}).format(amount);
    add(f.noticeDays,`${result.noticeDays} ${f.days??'days'}`);add(f.salaryBalance,money(result.salaryBalance));add(f.thirteenthSalary,money(result.thirteenthSalary));add(f.proportionalVacation,money(result.proportionalVacation));add(f.noticePay,money(result.noticePay));add(f.cashBeforeDeductions,money(result.cashBeforeDeductions));add(f.fgtsPenalty,`${money(result.fgtsPenalty)} (${(result.fgtsRate*100).toFixed(0)}%)`);add(f.totalIncludingFgtsPenalty,money(result.totalIncludingFgtsPenalty));
    for(const [label,url] of [[f.officialNotice,f.officialNoticeUrl],[f.officialFgts,f.officialFgtsUrl]]){const link=node('a',label);link.href=url;link.target='_blank';link.rel='noopener noreferrer';content.append(link);}
  }
  else if (id === 'germany-net-salary') {
    const money=(amount)=>new Intl.NumberFormat(document.documentElement.lang||'de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(amount);
    add(f.estimatedMonthlyNet,money(result.estimatedMonthlyNet));add(f.estimatedAnnualNet,money(result.estimatedAnnualNet));
    add(f.incomeTaxMonthly,money(result.incomeTaxMonthly));add(f.pensionMonthly,money(result.pensionMonthly));add(f.unemploymentMonthly,money(result.unemploymentMonthly));
    add(f.healthMonthly,money(result.healthMonthly));add(f.careMonthly,money(result.careMonthly));add(f.churchTaxMonthly,money(result.churchTaxMonthly));
    add(f.taxableIncomeAnnual,money(result.taxableIncomeAnnual));add(f.careRate,`${result.careRate.toFixed(2)}%`);
    for(const [label,url] of [[f.taxSource,'https://esth.bundesfinanzministerium.de/lsth/2026/A-Einkommensteuergesetz/IV-Tarif-31-34b/Paragraf-32a/inhalt.html'],[f.ceilingsSource,'https://www.bundesregierung.de/breg-de/aktuelles/beitragsgemessensgrenzen-2386514'],[f.healthSource,'https://www.bundesgesundheitsministerium.de/beitraege'],[f.careSource,'https://www.bundesgesundheitsministerium.de/themen/pflege/online-ratgeber-pflege/die-pflegeversicherung/finanzierung'],[f.pensionSource,'https://www.deutsche-rentenversicherung.de/DRV/DE/Experten/Zahlen-und-Fakten/Werte-der-Rentenversicherung/werte-der-rentenversicherung']]){const link=node('a',label);link.href=url;link.target='_blank';link.rel='noopener noreferrer';content.append(link);}
  }
  else if (id === 'sleepiness-questionnaire') {
    add(f.totalScore,result.total);add(f.averageScore,result.average.toFixed(1));add(f.mostFrequentSituation,f[`situation${result.highestItem}`]);add(f.repeatedSituations,result.highFrequencyCount);
    const list=node('ol');for(let i=0;i<result.answers.length;i++)list.append(node('li',`${f[`situation${i+1}`]}: ${f[`response${result.answers[i]}`]}`));content.append(list);
  }
  else if (id === 'futures-position-calculator') {
    const currency=String(form.elements.namedItem('currency')?.value??'USD').trim().toUpperCase();if(!/^[A-Z]{3}$/u.test(currency))throw new RangeError('Enter a three-letter currency code.');
    const money=(amount)=>new Intl.NumberFormat(document.documentElement.lang||'en',{style:'currency',currency,maximumFractionDigits:4}).format(amount);
    add(f.notionalExposure,money(result.notionalExposure));add(f.estimatedRisk,money(result.estimatedRisk));add(f.estimatedReward,money(result.estimatedReward));add(f.rewardRiskRatio,result.rewardRiskRatio===null?f.notAvailable:`${result.rewardRiskRatio.toFixed(2)}:1`);
    content.append(node('p',f.currencyNote));
  }
  else if (id === 'pet-feeding-calculator') {
    add(f.foodCalories,result.foodKcal.toFixed(1));add(f.foodGramsPerDay,`${result.gramsPerDay.toFixed(1)} g`);add(f.foodGramsPerMeal,`${result.gramsPerMeal.toFixed(1)} g`);add(f.treatShare,`${result.treatSharePercent.toFixed(1)}%`);content.append(node('p',f.calculationNote));
  }
  else if (id === 'font-editor') {
    const preview=node('div',result.text,'pending-font-preview');preview.style.fontFamily=result.fontFamily;preview.style.fontSize=`${result.fontSize}px`;preview.style.fontWeight=String(result.fontWeight);preview.style.lineHeight=String(result.lineHeight);preview.style.letterSpacing=`${result.letterSpacing}px`;preview.style.color=result.textColor;preview.style.backgroundColor=result.backgroundColor;preview.style.padding='1rem';preview.style.whiteSpace='pre-wrap';preview.style.overflowWrap='anywhere';preview.setAttribute('aria-label',f.previewLabel);content.append(preview);
    const css=`.font-preview {\n  font-family: ${result.fontFamily};\n  font-size: ${result.fontSize}px;\n  font-weight: ${result.fontWeight};\n  line-height: ${result.lineHeight};\n  letter-spacing: ${result.letterSpacing}px;\n  color: ${result.textColor};\n  background-color: ${result.backgroundColor};\n}`;addActions(content,copy,css);
  }
  else if (id === 'password-breach-checker') {
    add(f.checkStatus,result.found?f.foundStatus:f.notFoundStatus);add(f.occurrences,result.count);add(f.checkedAt,new Intl.DateTimeFormat(document.documentElement.lang||'en',{dateStyle:'medium',timeStyle:'short'}).format(new Date(result.checkedAt)));
    const link=node('a',f.aboutPwnedPasswords);link.href='https://haveibeenpwned.com/Passwords';link.target='_blank';link.rel='noopener noreferrer';content.append(link);
  }
  else if (id === 'survival-analysis') {
    add(f.observationCount,result.count);add(f.eventCount,result.eventCount);add(f.censoredCount,result.censoredCount);add(f.medianTime,result.median===null?f.medianNotReached:`${result.median} ${result.timeUnit}`);
    const table=node('table',undefined,'pending-table');table.setAttribute('aria-label',f.tableLabel);const head=node('tr');for(const label of [f.time,f.atRisk,f.events,f.censored,f.survivalProbability])head.append(node('th',label));const thead=node('thead');thead.append(head);table.append(thead);const body=node('tbody');for(const row of result.table){const tr=node('tr');for(const value of [row.time,row.atRisk,row.events,row.censored,`${(row.survival*100).toFixed(2)}%`])tr.append(node('td',value));body.append(tr);}table.append(body);content.append(table);
  }
  else if (id === 'lithophane-generator') {
    add(f.modelSize,`${result.widthMm.toFixed(1)} × ${result.heightMm.toFixed(1)} mm`);add(f.samples,`${result.sampleWidth} × ${result.sampleHeight}`);add(f.triangles,result.triangleCount);add(f.thicknessRange,`${result.minThicknessMm.toFixed(2)}–${result.maxThicknessMm.toFixed(2)} mm`);
    const button=node('button',copy.actions.download,'button button--secondary');button.type='button';button.addEventListener('click',()=>saveBlob(new Blob([result.stl],{type:'model/stl'}),'usefulverse-lithophane.stl'));const actions=node('div',undefined,'actions pending-result-actions');actions.append(button);content.append(actions);
  }
  else if (id === 'karaoke-lyrics-editor') {
    add(f.lineCount,result.lineCount);add(f.metadataCount,result.metadataCount);add(f.duration,`${(result.durationMs/1000).toFixed(2)} ${f.seconds}`);
    const preview=node('pre',result.lrc,'pending-code-preview');preview.setAttribute('aria-label',f.previewLabel);content.append(preview);
    const button=node(copy.actions.download,'download.lrc','button button--secondary');button.type='button';button.addEventListener('click',()=>saveBlob(new Blob([result.lrc],{type:'text/plain;charset=utf-8'}),'lyrics.lrc'));const actions=node('div',undefined,'actions pending-result-actions');actions.append(button);content.append(actions);
  }
  else if (id === 'creatinine-clearance-calculator') {
    add(f.clearanceEstimate,`${result.clearanceMlMin.toFixed(1)} mL/min`);add(f.formula,result.equation);const link=node('a',f.officialEquation);link.href='https://www.fda.gov/media/71114/download';link.target='_blank';link.rel='noopener noreferrer';content.append(link);
  }
  else if (id === 'medication-schedule') {
    add(f.entryCount,result.count);const table=node('table',undefined,'pending-table');table.setAttribute('aria-label',f.scheduleTable);const head=node('tr');for(const label of [f.name,f.instructions,f.time,f.days])head.append(node('th',label));const thead=node('thead');thead.append(head);table.append(thead);const body=node('tbody');for(const entry of result.entries){const tr=node('tr');for(const value of [entry.name,entry.instructions,entry.time,entry.days.join(', ')])tr.append(node('td',value));body.append(tr);}table.append(body);content.append(table);
    const button=node('button',copy.actions.download,'button button--secondary');button.type='button';button.addEventListener('click',()=>saveBlob(new Blob([result.csv],{type:'text/csv;charset=utf-8'}),'medication-schedule.csv'));const actions=node('div',undefined,'actions pending-result-actions');actions.append(button);content.append(actions);
  }
  else if (id === 'database-migration-converter') {
    add(f.columnCount,result.columnCount);add(f.sourceDialect,result.sourceDialect);add(f.targetDialect,result.targetDialect);const pre=node('pre',result.sql,'pending-code-preview');pre.setAttribute('aria-label',f.convertedSql);content.append(pre);
    if(result.warnings.length){const list=node('ul');for(const warning of result.warnings)list.append(node('li',warning));content.append(node('h3',f.warnings),list);}
    const copyButton=node(copy.actions.copy,'copy.sql','button button--secondary');copyButton.type='button';copyButton.addEventListener('click',()=>copyText(content.closest('.pending-tool'),result.sql,copy));const downloadButton=node(copy.actions.download,'download.sql','button button--secondary');downloadButton.type='button';downloadButton.addEventListener('click',()=>saveBlob(new Blob([result.sql],{type:'text/sql;charset=utf-8'}),'migration.sql'));const actions=node('div',undefined,'actions pending-result-actions');actions.append(copyButton,downloadButton);content.append(actions);
  }
  else if (id === 'color-vision-check') {
    const root=content.closest('.pending-tool');const session=root._colorDifferenceSession??{round:0,score:0,rounds:result.rounds??6,difficulty:result.difficulty??'clear'};root._colorDifferenceSession=session;
    if(result.summary){content.append(node('p',`${f.score}: ${session.score} / ${session.rounds}`),node('p',f.exerciseOnly));return;}
    content.append(node('p',`${f.round}: ${session.round+1} / ${session.rounds}`));const target=node('span');target.className='pending-color-target';target.style.backgroundColor=result.target;target.setAttribute('aria-label',f.targetSwatch);content.append(node('p',f.instruction),target);
    const choices=node('div',undefined,'pending-color-choices');choices.setAttribute('role','group');choices.setAttribute('aria-label',f.choicesLabel);result.options.forEach((color,index)=>{const button=node('button',`${f.option} ${index+1}`,'pending-color-choice');button.type='button';button.style.backgroundColor=color;button.setAttribute('aria-label',`${f.option} ${index+1}`);button.addEventListener('click',()=>{session.score+=index===result.answerIndex?1:0;session.round++;content.replaceChildren();if(session.round>=session.rounds){renderResult(content,id,{summary:true,rounds:session.rounds,difficulty:session.difficulty},copy);return;}renderResult(content,id,{...createColorDifferenceRound({difficulty:session.difficulty}),rounds:session.rounds},copy);});choices.append(button);});content.append(choices);return;
  }
  else if (id === 'audio-denoiser') {
    add(f.duration,`${result.durationSeconds.toFixed(1)} ${f.seconds}`);add(f.sampleRate,`${result.sampleRate.toLocaleString()} Hz`);add(f.channelCount,result.channels);add(f.outputFormat,result.format);add(f.noiseSettings,`${result.thresholdDb} dB threshold · ${result.reductionDb} dB maximum reduction`);
    const button=node('button',copy.actions.download,'button button--secondary');button.type='button';button.addEventListener('click',()=>saveBlob(new Blob([result.wav],{type:'audio/wav'}),'noise-gated-audio.wav'));const actions=node('div',undefined,'actions pending-result-actions');actions.append(button);content.append(actions);
  }
  else if (id === 'india-income-tax-calculator') {
    const money=(amount)=>new Intl.NumberFormat(document.documentElement.lang||'en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(amount);
    add(f.income,money(result.taxableIncome));add(f.taxBeforeRebate,money(result.baseTax));add(f.rebate,money(result.rebate));add(f.taxAfterRebate,money(result.taxAfterRebate));add(f.cess,money(result.cess));add(f.estimatedTax,money(result.estimatedTax));add(f.effectiveRate,`${result.effectiveRate.toFixed(2)}%`);
    for(const [label,url] of [[f.officialAct,'https://www.incometaxindia.gov.in/Documents/Act/Income-tax-Act-2025.pdf'],[f.officialRates,'https://www.incometaxindia.gov.in/documents/81799/11848482/memo-2026.pdf']]){const link=node('a',label);link.href=url;link.target='_blank';link.rel='noopener noreferrer';content.append(link);content.append(document.createElement('br'));}
  }
  else if (id === 'india-ppf-calculator') {
    const money=(amount)=>new Intl.NumberFormat(document.documentElement.lang||'en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(amount);
    add(f.totalDeposits,money(result.totalDeposits));add(f.totalInterest,money(result.totalInterest));add(f.maturityValue,money(result.maturityValue));
    const table=node('table',undefined,'pending-table');table.setAttribute('aria-label',f.scheduleLabel);const header=node('tr');for(const label of [f.year,f.deposit,f.openingBalance,f.interest,f.closingBalance])header.append(node('th',label));const thead=node('thead');thead.append(header);table.append(thead);const body=node('tbody');for(const row of result.schedule){const tr=node('tr');for(const value of [row.year,money(row.deposit),money(row.openingBalance),money(row.interest),money(row.balance)])tr.append(node('td',value));body.append(tr);}table.append(body);content.append(table);
    const guidance=node('a',f.officialRates);guidance.href='https://dea.gov.in/budget-division/475';guidance.target='_blank';guidance.rel='noopener noreferrer';content.append(guidance);
  }
  else if (id === 'dns-lookup') {
    const statusKey = ({ 0: 'dnsStatusNoError', 1: 'dnsStatusFormatError', 2: 'dnsStatusServerFailure', 3: 'dnsStatusNameError', 4: 'dnsStatusNotImplemented', 5: 'dnsStatusRefused' })[result.status];
    add(f.domain, result.name); add(f.recordType, result.type); add(f.lookupStatus, `${statusKey ? f[statusKey] : f.dnsStatusUnknown} (${result.status})`); add(f.dnssec, result.dnssec ? f.dnssecYes : f.dnssecNo); add(f.resolver, result.resolver);
    if (!result.answers.length) content.append(node('p', f.noRecords, 'hint'));
    else {
      const table = node('table', undefined, 'pending-table'); table.setAttribute('aria-label', f.answerRecords);
      const header = node('tr'); for (const label of [f.domain, f.recordValue, f.ttl]) header.append(node('th', label)); const thead = node('thead'); thead.append(header); table.append(thead);
      const body = node('tbody');
      for (const record of result.answers) { const row = node('tr'); for (const value of [record.name, record.value, record.ttl ?? copy.messages.noEvent]) row.append(node('td', value)); body.append(row); }
      table.append(body); content.append(table);
    }
  }
  else if (id === 'rdap-domain-lookup') {
    const stateKey = ({ ok: 'queryOk', 'no-registry': 'noRegistry', 'not-found': 'notFound', unavailable: 'registryUnavailable', 'rate-limited': 'rateLimited', 'response-too-large': 'responseTooLarge', 'invalid-response': 'invalidResponse' })[result.queryState];
    add(f.domain, result.domain); add(f.queryStatus, f[stateKey] ?? f.invalidResponse);
    if (result.registryHost) add(f.registry, result.registryHost);
    if (result.queryState === 'ok') {
      if (result.handle) add(f.handle, result.handle);
      if (result.unicodeName && result.unicodeName !== result.domain) add(f.unicodeName, result.unicodeName);
      if (result.status.length) add(f.registrationStatus, result.status.join(' · '));
      add(f.delegationSigned, result.delegationSigned === null ? f.notReported : result.delegationSigned ? f.signed : f.unsigned);
      if (result.nameservers.length) {
        const list = node('ul', undefined, 'pending-rdap-list'); list.setAttribute('aria-label', f.nameservers);
        for (const nameserver of result.nameservers) list.append(node('li', nameserver)); content.append(node('h3', f.nameservers), list);
      }
      if (result.events.length) {
        const table = node('table', undefined, 'pending-table'); table.setAttribute('aria-label', f.events);
        const header = node('tr'); header.append(node('th', f.eventAction), node('th', f.eventDate)); const thead = node('thead'); thead.append(header); table.append(thead);
        const body = node('tbody'); for (const event of result.events) { const row = node('tr'); row.append(node('td', event.action), node('td', event.date)); body.append(row); } table.append(body); content.append(table);
      }
    }
  }
  else if (id === 'charades') {
    add(f.promptCount, result.promptCount);
    const prompt = node('section', undefined, 'pending-charades-prompt'); prompt.append(node('h3', f.prompt));
    const word = node('p', result.prompt, 'pending-charades-prompt__word'); word.hidden = true;
    const reveal = node('button', f.revealPrompt, 'button button--secondary'); reveal.type = 'button';
    reveal.addEventListener('click', () => { word.hidden = !word.hidden; reveal.textContent = word.hidden ? f.revealPrompt : f.hidePrompt; });
    prompt.append(word, reveal); content.append(prompt);
  }
  else if (id === 'word-cloud-generator') {
    add(f.totalWords, result.totalWords); add(f.uniqueTerms, result.uniqueTerms);
    const list = node('ul', undefined, 'pending-word-cloud'); list.setAttribute('aria-label', f.cloudLabel);
    const largest = Math.max(...result.entries.map((entry) => entry.count));
    for (const entry of result.entries) {
      const item = node('li'); const word = node('span', entry.word); word.style.fontSize = `${1 + 1.3 * Math.sqrt(entry.count / largest)}rem`; word.setAttribute('aria-label', `${entry.word}: ${entry.count}`); item.append(word); list.append(item);
    }
    content.append(list);
    const button = node('button', f.exportSvg, 'button button--secondary'); button.type = 'button';
    button.addEventListener('click', () => {
      const width = 1000; const measure = document.createElement('canvas').getContext('2d'); const positioned = []; let x = 20; let y = 55; let rowHeight = 0;
      for (const entry of result.entries) {
        const size = 18 + Math.round(34 * Math.sqrt(entry.count / largest));
        if (measure) measure.font = `${size}px system-ui, sans-serif`;
        const wordWidth = Math.min(940, measure?.measureText(entry.word).width ?? Array.from(entry.word).length * size * 0.65);
        if (x + wordWidth > width - 20 && x > 20) { x = 20; y += rowHeight + 16; rowHeight = 0; }
        positioned.push({ entry, size, x, y }); x += wordWidth + 24; rowHeight = Math.max(rowHeight, size);
      }
      const svg = svgElement('svg', { xmlns: NS, viewBox: `0 0 ${width} ${y + rowHeight + 20}`, role: 'img', 'aria-label': f.cloudLabel });
      const title = svgElement('title'); title.textContent = f.cloudLabel; svg.append(title);
      for (const item of positioned) { const text = svgElement('text', { x: item.x, y: item.y, 'font-size': item.size, fill: 'currentColor', 'font-family': 'system-ui, sans-serif' }); text.textContent = item.entry.word; svg.append(text); }
      saveBlob(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' }), 'usefulverse-word-cloud.svg');
    });
    const actions = node('div', undefined, 'actions pending-result-actions'); actions.append(button); content.append(actions);
  }
  else if (id === 'hanoi-tower') {
    const root = content.closest('[data-tool]'); root._hanoiGame = result; root._hanoiSource = null;
    add(f.moveCount, result.moves); add(f.minimumMoves, result.minimumMoves);
    const stats = node('dl'); for (const [label, value] of rows) stats.append(node('dt', label), node('dd', value)); content.append(stats);
    const board = node('div', undefined, 'pending-hanoi-board'); board.setAttribute('role', 'group'); board.setAttribute('aria-label', f.resultTitle);
    const rods = [f.rodA, f.rodB, f.rodC]; const number = new Intl.NumberFormat(document.documentElement.lang || 'en');
    const draw = () => {
      board.replaceChildren();
      root._hanoiGame.towers.forEach((stack, index) => {
        const button = node('button', undefined, `pending-hanoi-rod${root._hanoiSource === index ? ' is-selected' : ''}`); button.type = 'button'; button.setAttribute('aria-pressed', String(root._hanoiSource === index));
        button.setAttribute('aria-label', `${f.rod} ${rods[index]}, ${number.format(stack.length)} ${f.diskCount}${root._hanoiSource === index ? `, ${f.selectedRod}` : ''}`);
        const pile = node('span', undefined, 'pending-hanoi-rod__pile');
        for (const disk of [...stack].reverse()) { const block = node('span', undefined, 'pending-hanoi-disk'); block.style.width = `${28 + 68 * disk / result.diskCount}%`; block.textContent = number.format(disk); pile.append(block); }
        button.append(pile, node('span', rods[index], 'pending-hanoi-rod__label'));
        button.addEventListener('click', () => {
          if (root._hanoiSource === null) {
            if (!root._hanoiGame.towers[index].length) { announce(root, f.emptyRod, 'error'); return; }
            root._hanoiSource = index; draw(); announce(root, f.selectDestination, 'info'); return;
          }
          if (root._hanoiSource === index) { root._hanoiSource = null; draw(); return; }
          try {
            root._hanoiGame = moveHanoiDisk(root._hanoiGame, root._hanoiSource, index); root._hanoiSource = null; draw();
            if (root._hanoiGame.complete) announce(root, f.gameComplete, 'success');
          } catch { root._hanoiSource = null; draw(); announce(root, f.invalidMove, 'error'); }
        });
        board.append(button);
      });
    };
    draw(); content.append(board); return result;
  }
  else if (id === 'raci-matrix-builder') {
    const root = content.closest('[data-tool]'); root._raciMatrix = { roles: [...result.roles], rows: result.rows.map((row) => ({ task: row.task, assignments: [...row.assignments] })) };
    const table = node('table', undefined, 'pending-table pending-raci-table'); table.setAttribute('aria-label', f.matrixLabel);
    const header = node('tr'); header.append(node('th', f.task)); for (const role of result.roles) header.append(node('th', role));
    const thead = node('thead'); thead.append(header); table.append(thead); const body = node('tbody');
    const values = [['R', f.responsible], ['A', f.accountable], ['C', f.consulted], ['I', f.informed]];
    result.rows.forEach((row, rowIndex) => {
      const tr = node('tr'); tr.dataset.raciRow = String(rowIndex); tr.append(node('th', row.task));
      row.assignments.forEach((_, columnIndex) => {
        const cell = node('td'); const select = node('select'); select.dataset.raciCell = `${rowIndex}:${columnIndex}`; select.setAttribute('aria-label', `${f.responsibility}: ${row.task} — ${result.roles[columnIndex]}`);
        const empty = node('option', f.unassigned); empty.value = ''; select.append(empty);
        for (const [code, label] of values) { const option = node('option', `${code} — ${label}`); option.value = code; select.append(option); }
        select.addEventListener('change', () => { root._raciMatrix.rows[rowIndex].assignments[columnIndex] = select.value; root._raciMatrix.validated = false; tr.removeAttribute('aria-invalid'); validation.replaceChildren(); });
        cell.append(select); tr.append(cell);
      });
      body.append(tr);
    });
    table.append(body); const scroller = node('div', undefined, 'pending-raci-scroll'); scroller.append(table); content.append(scroller);
    const validation = node('div', undefined, 'pending-raci-validation'); validation.setAttribute('role', 'status'); validation.setAttribute('aria-live', 'polite'); content.append(validation);
    const actions = node('div', undefined, 'actions pending-result-actions');
    const validate = node('button', f.validateMatrix, 'button button--secondary'); validate.type = 'button';
    validate.addEventListener('click', () => {
      const issues = [];
      root._raciMatrix.rows.forEach((row, index) => {
        const accountables = row.assignments.filter((code) => code === 'A').length; const responsibles = row.assignments.filter((code) => code === 'R').length; const messages = [];
        if (accountables !== 1) messages.push(f.rowAccountableCount);
        if (responsibles < 1) messages.push(f.rowMissingResponsible);
        const tr = body.querySelector(`[data-raci-row="${index}"]`); tr.setAttribute('aria-invalid', String(messages.length > 0));
        if (messages.length) issues.push(`${row.task}: ${messages.join(' ')}`);
      });
      root._raciMatrix.validated = true; validation.replaceChildren(node('p', issues.length ? `${f.validationIssues} ${issues.join(' · ')}` : f.validationPassed, issues.length ? 'status status--error' : 'status status--success'));
    });
    const download = node('button', f.exportCsv, 'button button--secondary'); download.type = 'button';
    download.addEventListener('click', () => {
      const protect = (value) => { const text = String(value ?? ''); const safe = /^[\s\u0000-\u0020]*[=+\-@]/u.test(text) ? `'${text}` : text; return `"${safe.replaceAll('"', '""')}"`; };
      const rows = [[f.task, ...root._raciMatrix.roles], ...root._raciMatrix.rows.map((row) => [row.task, ...row.assignments])];
      saveBlob(new Blob([`\uFEFF${rows.map((row) => row.map(protect).join(',')).join('\r\n')}`], { type: 'text/csv;charset=utf-8' }), 'usefulverse-raci-matrix-builder.csv');
    });
    actions.append(validate, download); content.append(actions); return result;
  }
  else if (id === 'business-model-canvas') {
    const grid = node('div', undefined, 'pending-business-canvas'); grid.setAttribute('aria-label', f.resultTitle);
    const blocks = ['keyPartners','keyActivities','keyResources','valuePropositions','customerRelationships','channels','customerSegments','costStructure','revenueStreams'];
    for (const key of blocks) { const card = node('section', undefined, `pending-business-canvas__block pending-business-canvas__block--${key}`); card.append(node('h3', f[key])); card.append(node('p', result[key] || f.emptyBlock)); grid.append(card); }
    content.append(grid);
    const button = node('button', f.exportMarkdown, 'button button--secondary'); button.type = 'button';
    button.addEventListener('click', () => {
      const markdown = `# ${f.resultTitle}\n\n${blocks.map((key) => `## ${f[key]}\n\n${result[key] || ''}`).join('\n\n')}\n`;
      saveBlob(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }), 'usefulverse-business-model-canvas.md');
    });
    const actions = node('div', undefined, 'actions pending-result-actions'); actions.append(button); content.append(actions); return result;
  }
  else if (id === 'fancy-text-generator') {
    const list = node('div', undefined, 'pending-fancy-text-list');
    for (const item of result) {
      const card = node('section', undefined, 'pending-fancy-text-card');
      const title = f[`style_${item.id}`] ?? item.id;
      const heading = node('h3', title);
      const output = node('textarea', undefined, 'pending-fancy-text-output');
      output.value = item.value;
      output.readOnly = true;
      output.rows = Math.min(5, Math.max(2, item.value.split('\n').length));
      output.setAttribute('aria-label', `${title} — ${f.resultTitle}`);
      const copyButton = node('button', copy.actions.copy, 'button button--secondary');
      copyButton.type = 'button';
      copyButton.addEventListener('click', () => copyText(content.closest('.pending-tool'), item.value, copy));
      card.append(heading, output, copyButton);
      list.append(card);
    }
    const note = node('p', f.accessibilityNote, 'hint');
    content.append(list, note);
    return result;
  }
  if (id === 'qibla-compass') {
    const compass = svgElement('svg', { viewBox: '0 0 200 200', role: 'img', 'aria-label': f.compassLabel });
    compass.classList.add('pending-qibla-compass');
    compass.append(svgElement('circle', { cx: 100, cy: 100, r: 88, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }));
    compass.append(svgElement('line', { x1: 100, y1: 19, x2: 100, y2: 31, stroke: 'currentColor', 'stroke-width': 3 }));
    const north = svgElement('text', { x: 100, y: 15, 'text-anchor': 'middle', 'font-size': 13 });
    north.textContent = f.north;
    compass.append(north);
    if (result.bearingDegrees !== null) {
      const arrow = svgElement('g', { transform: `rotate(${result.bearingDegrees} 100 100)` });
      arrow.append(svgElement('path', { d: 'M100 38 L113 104 L100 93 L87 104 Z', fill: 'currentColor' }));
      arrow.append(svgElement('circle', { cx: 100, cy: 100, r: 5, fill: 'currentColor' }));
      compass.append(arrow);
    }
    content.append(compass);
    add(f.bearing, result.bearingDegrees === null ? f.bearingUndefined : `${result.bearingDegrees.toFixed(1)}°`);
    add(f.distance, `${result.distanceKm.toLocaleString(copy.copyLanguage?.replaceAll('_', '-') ?? undefined, { maximumFractionDigits: 1 })} km`);
    const details = node('dl', undefined, 'pending-qibla-details');
    for (const [label, value] of rows) { details.append(node('dt', label), node('dd', value)); }
    content.append(details);
    addActions(content, copy, result);
    return result;
  }
  if (id === 'gamepad-tester') {
    if (!result.length) { content.append(node('p', f.noControllers, 'hint')); return result; }
    const list = node('div', undefined, 'pending-gamepad-list');
    for (const pad of result) {
      const section = node('section', undefined, 'pending-gamepad-card');
      section.dataset.gamepadIndex = String(pad.index);
      section.append(node('h3', `${f.controller} ${pad.index + 1}: ${pad.id}`));
      section.append(node('p', `${f.mapping}: ${pad.mapping || copy.messages.noEvent}`));
      const controls = node('dl', undefined, 'pending-gamepad-values');
      pad.buttons.forEach((button, index) => {
        const value = node('dd', `${button.pressed ? f.pressed : f.released} · ${button.value.toFixed(2)}`);
        value.dataset.gamepadButtonValue = String(index);
        controls.append(node('dt', `${f.button} ${index + 1}`), value);
      });
      pad.axes.forEach((axis, index) => {
        const value = node('dd', axis.toFixed(2));
        value.dataset.gamepadAxisValue = String(index);
        controls.append(node('dt', `${f.axis} ${index + 1}`), value);
      });
      section.append(controls);
      const vibration = node('button', f.testVibration, 'button button--secondary');
      vibration.type = 'button';
      vibration.addEventListener('click', async () => {
        const current = navigator.getGamepads?.()[pad.index];
        const actuator = current?.vibrationActuator ?? current?.hapticActuators?.[0];
        if (!actuator) { announce(content.closest('.pending-tool'), f.vibrationUnsupported, 'error'); return; }
        try {
          if (typeof actuator.playEffect === 'function') await actuator.playEffect('dual-rumble', { startDelay: 0, duration: 160, weakMagnitude: 0.35, strongMagnitude: 0.35 });
          else if (typeof actuator.pulse === 'function') await actuator.pulse(0.35, 160);
          else { announce(content.closest('.pending-tool'), f.vibrationUnsupported, 'error'); return; }
          announce(content.closest('.pending-tool'), f.vibrationDone, 'success');
        } catch { announce(content.closest('.pending-tool'), f.vibrationUnsupported, 'error'); }
      });
      section.append(vibration); list.append(section);
    }
    content.append(list);
    addActions(content, copy, result);
    return result;
  }
  if (id === 'project-risk-matrix') {
    renderRiskMatrix(content, result, copy);
    const table = node('table', undefined, 'pending-table'); const head = node('tr'); for (const label of [f.risk, f.likelihood, f.impact, f.score, f.level]) head.append(node('th', label)); table.append(node('thead')).firstChild.append(head); const body = node('tbody'); for (const risk of result) { const tr = node('tr'); for (const value of [risk.name, risk.likelihood, risk.impact, risk.score, f[risk.level.toLowerCase()]]) tr.append(node('td', value)); body.append(tr); } table.append(body); content.append(table); return result;
  }
  if (id === 'org-chart-maker') { const ul = node('ul', undefined, 'pending-org-tree'); appendTree(ul, result); content.append(ul); return result; }
  if (id === 'radar-chart-maker') { renderRadar(content, result, copy); const table = node('ul'); for (const row of result) table.append(node('li', `${row.label}: ${row.score}`)); content.append(table); return result; }
  if (id === 'image-histogram') { renderHistogram(content, result, copy); return result; }
  if (id === 'color-palette-from-image') { const palette = node('div', undefined, 'pending-palette'); for (const color of result) { const swatch = node('button', `${color.hex} · ${color.count}`); swatch.type = 'button'; swatch.style.setProperty('--swatch', color.hex); swatch.addEventListener('click', async () => { try { await navigator.clipboard.writeText(color.hex); announce(content.closest('.pending-tool'), copy.messages.copied, 'success'); } catch { announce(content.closest('.pending-tool'), copy.messages.copyUnavailable, 'error'); } }); palette.append(swatch); } content.append(palette); return result; }
  if (id === 'decision-tree-maker') { const list = node('ol', undefined, 'pending-decision-tree'); appendDecisionTree(list, result.root, copy); content.append(list); const paths=node('details'); paths.append(node('summary',f.allPaths)); const listPaths=node('ul'); for(const path of result.paths) listPaths.append(node('li',path)); paths.append(listPaths); content.append(paths); addActions(content,copy,result.paths); return result; }
  if (id === 'would-you-rather' || id === 'never-have-i-ever' || id === 'basketball-shooting-game' || id === 'chinese-zodiac' || id === 'egfr-calculator' || id === 'dns-lookup' || id === 'rdap-domain-lookup' || id === 'charades' || id === 'word-cloud-generator' || id === 'hanoi-tower' || id === 'raci-matrix-builder' || id === 'business-model-canvas') { /* Result-specific output was added above. */ }
  else if (id === 'sankey-diagram-generator') { renderSankey(content,result,copy); const list = node('ol'); for (const flow of result.entries) list.append(node('li', `${flow.source} → ${flow.target}: ${flow.value}`)); content.append(list); add(f.totalFlow, result.total); }
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
  else if (id === 'grammar-checker') {
    const number = new Intl.NumberFormat(document.documentElement.lang || 'en');
    content.append(node('p', `${f.characterCount}: ${number.format(result.characterCount)} · ${f.findingCount}: ${number.format(result.findingCount)}`));
    if (!result.findingCount) content.append(node('p', f.noFindings, 'status status--success'));
    else {
      const list = node('ol', undefined, 'pending-text-review-list');
      for (const finding of result.findings) {
        const item = node('li'); const title = node('strong', f[finding.kind] ?? finding.kind);
        item.append(title, node('p', `${f.findingPosition}: ${number.format(finding.start + 1)} · ${f.sample}: “${finding.sample}”`)); list.append(item);
      }
      content.append(list);
    }
    return result;
  }
  else if (id === 'music-interval-calculator') {
    const number = new Intl.NumberFormat(document.documentElement.lang || 'en');
    add(f.intervalNumber, number.format(result.number));
    add(f.quality, f[result.quality] ?? result.quality);
    add(f.semitones, number.format(result.semitones));
    add(f.direction, f[result.direction]);
    add(f.alteration, `${result.alteration > 0 ? '+' : ''}${number.format(result.alteration)}`);
  }
  else if (id === 'music-transposition') {
    const number = new Intl.NumberFormat(document.documentElement.lang || 'en');
    add(f.noteCount, number.format(result.noteCount));
    add(f.semitones, `${result.semitones > 0 ? '+' : ''}${number.format(result.semitones)}`);
    add(f.spelling, f[result.spelling === 'flat' ? 'preferFlats' : 'preferSharps']);
    const details = node('dl'); for (const [label, value] of rows) details.append(node('dt', label), node('dd', value)); content.append(details);
    const download = node('button', f.downloadResult, 'button button--secondary'); download.type = 'button';
    download.addEventListener('click', () => saveBlob(new Blob([result.xml], { type: 'application/vnd.recordare.musicxml+xml;charset=utf-8' }), 'transposed-score.musicxml'));
    const actions = node('div', undefined, 'actions pending-result-actions'); actions.append(download); content.append(actions);
    return result;
  }
  else if (id === 'france-housing-benefit') {
    const number=new Intl.NumberFormat(document.documentElement.lang||'en',{style:'currency',currency:'EUR',maximumFractionDigits:2});const rows=[[f.resourceCeiling,number.format(result.resourceCeiling)],[f.rentCeiling,number.format(result.rentCeiling)],[f.rentCounted,number.format(result.rentCounted)],[f.rentAboveCeiling,number.format(result.rentAboveCeiling)],[f.effectiveDate,result.effectiveDate],[f.underResourceCeiling,result.underResourceCeiling?copy.fields.underResourceCeiling:copy.fields.overResourceCeiling]];const details=node('dl',undefined,'pending-orbital-details');for(const [label,value]of rows)details.append(node('dt',label),node('dd',String(value)));content.append(details,node('p',f.thresholdNote,'hint'));return result;
  }
  else if (id === 'skyscrapers-puzzle') {
    const root=content.closest('.pending-tool');root._skyscraperEntries=result.entries.map((row)=>[...row]);const table=node('table',undefined,'pending-skyscrapers');table.setAttribute('role','grid');table.setAttribute('aria-label',f.gridLabel);const head=node('thead');const top=node('tr');top.append(node('th',''));for(let col=0;col<result.size;col++){const clue=node('th',String(result.top[col]));clue.setAttribute('aria-label',`${f.topClue} ${col+1}: ${result.top[col]}`);top.append(clue);}top.append(node('th',''));head.append(top);table.append(head);const body=node('tbody');
    for(let row=0;row<result.size;row++){const tr=node('tr');const leftClue=node('th',String(result.left[row]));leftClue.setAttribute('aria-label',`${f.leftClue} ${row+1}: ${result.left[row]}`);tr.append(leftClue);for(let col=0;col<result.size;col++){const value=result.entries[row][col];const td=node('td');const button=node('button',value?String(value):'·','pending-skyscraper-cell');button.type='button';button.dataset.skyscraperCell=`${row},${col}`;button.setAttribute('role','gridcell');button.setAttribute('aria-label',`${f.rowLabel} ${row+1}, ${f.columnLabel} ${col+1}: ${value?f.cellValue.replace('{value}',value):f.blankCell}`);button.setAttribute('aria-invalid',String(Boolean(value)&&(!result.rowValid[row]||!result.columnValid[col])));td.append(button);tr.append(td);}const rightClue=node('th',String(result.right[row]));rightClue.setAttribute('aria-label',`${f.rightClue} ${row+1}: ${result.right[row]}`);tr.append(rightClue);body.append(tr);}table.append(body);const bottom=node('tr');bottom.append(node('th',''));for(let col=0;col<result.size;col++){const clue=node('th',String(result.bottom[col]));clue.setAttribute('aria-label',`${f.bottomClue} ${col+1}: ${result.bottom[col]}`);bottom.append(clue);}bottom.append(node('th',''));const foot=node('tfoot');foot.append(bottom);table.append(foot);const status=node('p',result.complete?f.puzzleComplete:f.puzzleIncomplete,result.complete?'status status--success':'status');content.append(table,status);const newButton=node('button',f.newPuzzle,'button button--secondary');newButton.type='button';newButton.dataset.newSkyscraper='true';content.append(newButton);return result;
  }
  else if (id === 'linear-algebra-visualizer') {
    const width = 620; const height = 500; const padding = 40;
    const all = result.meshes.flat(2); const xs = all.map(([x]) => x); const ys = all.map(([, y]) => y);
    const minX = Math.min(-1, ...xs); const maxX = Math.max(1, ...xs); const minY = Math.min(-1, ...ys); const maxY = Math.max(1, ...ys);
    const scale = Math.min((width - padding * 2) / (maxX - minX || 1), (height - padding * 2) / (maxY - minY || 1));
    const cx = width / 2 - (minX + maxX) * scale / 2; const cy = height / 2 + (minY + maxY) * scale / 2;
    const svg = svgElement('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': f.meshLabel, class: 'pending-chart pending-linear-grid' });
    const colors = ['#737b8c', '#2872d8', '#29a36a'];
    result.meshes.forEach((mesh, index) => {
      for (let row = 0; row < 5; row++) {
        const points = mesh[row].map(([x, y]) => `${cx + x * scale},${cy - y * scale}`).join(' ');
        svg.append(svgElement('polyline', { points, fill: 'none', stroke: colors[index], 'stroke-width': index ? 2 : 1.3, 'stroke-opacity': index ? '.8' : '.5' }));
      }
      for (let col = 0; col < 5; col++) {
        const points = mesh.map((row) => row[col]).map(([x, y]) => `${cx + x * scale},${cy - y * scale}`).join(' ');
        svg.append(svgElement('polyline', { points, fill: 'none', stroke: colors[index], 'stroke-width': index ? 2 : 1.3, 'stroke-opacity': index ? '.8' : '.5' }));
      }
    });
    const legend = node('ul', undefined, 'pending-histogram-legend');
    for (const [index, label] of [[0, f.originalGrid], [1, f.afterA], [2, f.afterComposition]]) {
      const entry = node('li', label); entry.style.setProperty('--histogram-color', colors[index]); legend.append(entry);
    }
    const number = new Intl.NumberFormat(document.documentElement.lang || 'en', { maximumFractionDigits: 4 });
    const details = node('dl', undefined, 'pending-orbital-details');
    const basisA = result.basisA.map((vector) => vector.map((value) => number.format(value)).join(', ')).join(' · ');
    const basisComposed = result.basisComposed.map((vector) => vector.map((value) => number.format(value)).join(', ')).join(' · ');
    const rows = [[f.determinantA, result.determinantA], [f.determinantB, result.determinantB], [f.determinantComposed, result.determinantComposed], [f.basisA, basisA], [f.basisComposed, basisComposed]];
    for (const [label, value] of rows) details.append(node('dt', label), node('dd', String(typeof value === 'number' ? number.format(value) : value)));
    content.append(svg, legend, details); return result;
  }
  else if (id === 'object-remover') { renderObjectRemover(content,result,copy); return result; }
  else if (id === 'gpx-track-editor') {
    const number=new Intl.NumberFormat(document.documentElement.lang||'en',{maximumFractionDigits:2});const unit=result.distanceUnit==='mi'?'mi':'km';
    const details=node('dl',undefined,'pending-orbital-details');for(const [label,value] of [[f.segmentCount,result.segments.length],[f.pointCount,result.total.points],[f.totalDistance,`${number.format(result.distance)} ${unit}`],[f.elevationGain,`${number.format(result.total.elevationGain)} m`],[f.elevationLoss,`${number.format(result.total.elevationLoss)} m`]])details.append(node('dt',label),node('dd',String(value)));
    const button=node('button',copy.actions.download,'button button--secondary');button.type='button';button.addEventListener('click',()=>saveBlob(new Blob([result.xml],{type:'application/gpx+xml;charset=utf-8'}),result.fileName||'edited-track.gpx'));
    const actions=node('div',undefined,'actions pending-result-actions');actions.append(button);content.append(details,actions);return result;
  }
  else if (id === 'star-battle') {
    const root=content.closest('.pending-tool');root._starBattleBoard=result.board.map((row)=>row.map(Boolean));
    const grid=node('div',undefined,'pending-star-battle');grid.setAttribute('role','grid');grid.setAttribute('aria-label',f.starBoardLabel);
    result.board.forEach((row,rowIndex)=>row.forEach((isStar,columnIndex)=>{
      const region=(rowIndex>=4?2:0)+(columnIndex>=4?1:0);const button=node('button',isStar?'★':'·',`pending-star-battle__cell pending-star-battle__cell--region-${region}`);button.type='button';button.setAttribute('role','gridcell');button.setAttribute('aria-pressed',String(isStar));button.setAttribute('aria-label',`${f.rowLabel} ${rowIndex+1}, ${f.columnLabel} ${columnIndex+1}: ${isStar?f.starCell:f.emptyCell}`);button.dataset.starBattleCell=`${rowIndex},${columnIndex}`;grid.append(button);
    }));
    const summary=node('dl',undefined,'pending-orbital-details');
    for(const [label,counts] of [[f.rowCounts,result.rowCounts],[f.columnCounts,result.columnCounts],[f.regionCounts,result.regionCounts]])summary.append(node('dt',label),node('dd',counts.map((count,index)=>`${index+1}: ${count}`).join(' · ')));
    summary.append(node('dt',f.starCount),node('dd',String(result.starCount)),node('dt',f.touchingPairs),node('dd',String(result.touchingPairs)));
    const status=node('p',result.complete?f.boardComplete:f.boardIncomplete,result.complete?'status status--success':'status');content.append(grid,summary,status);return result;
  }
  else if (id === 'recipe-nutrition-analyzer') {
    const number = new Intl.NumberFormat(document.documentElement.lang || 'en', { maximumFractionDigits: 1 });
    const table = node('table', undefined, 'pending-table'); const head = node('tr');
    for (const label of [f.ingredient, f.amountUsed, f.calories, f.protein, f.carbohydrates, f.fat]) head.append(node('th', label));
    const thead = node('thead'); thead.append(head); table.append(thead); const body = node('tbody');
    for (const ingredient of result.ingredients) { const row = node('tr'); for (const value of [ingredient.name, number.format(ingredient.grams), number.format(ingredient.calories), number.format(ingredient.protein), number.format(ingredient.carbohydrates), number.format(ingredient.fat)]) row.append(node('td', value)); body.append(row); }
    table.append(body); content.append(table);
    const summary = node('dl', undefined, 'pending-orbital-details');
    for (const [heading, values] of [[f.recipeTotals, result.totals], [f.perServing, result.perServing]]) {
      summary.append(node('dt', heading), node('dd', `${number.format(values.calories)} kcal · ${f.protein} ${number.format(values.protein)} · ${f.carbohydrates} ${number.format(values.carbohydrates)} · ${f.fat} ${number.format(values.fat)}`));
    }
    content.append(summary); return result;
  }
  else if (id === 'orbital-visualizer') { renderOrbitalVisualizer(content, result, copy); return result; }
  else if (id === 'speed-reading-app') { renderReader(content, result, copy); return result; }
  else if (id === 'logo-maker') { renderLogo(content, result, copy); return result; }
  else { for (const [key,value] of Object.entries(result)) if (typeof value !== 'object' && value !== null) add(f[key] ?? key,value); }
  const dl=node('dl'); for (const [label,value] of rows) { dl.append(node('dt',label),node('dd',value)); } content.prepend(dl);
  if (id !== 'would-you-rather' && id !== 'never-have-i-ever' && id !== 'basketball-shooting-game' && id !== 'chinese-zodiac' && id !== 'egfr-calculator' && id !== 'rdap-domain-lookup' && id !== 'charades' && id !== 'word-cloud-generator' && id !== 'hanoi-tower' && id !== 'raci-matrix-builder' && id !== 'business-model-canvas' && id !== 'font-editor' && id !== 'lithophane-generator' && id !== 'karaoke-lyrics-editor' && id !== 'medication-schedule' && id !== 'database-migration-converter' && id !== 'audio-denoiser') addActions(content,copy,result); return result;
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
  if(id==='would-you-rather') root._wouldYouRatherVotes={signature:'',a:0,b:0};
  if(id==='never-have-i-ever') root._neverHaveIEverVotes={signature:'',yes:0,no:0,votes:0,complete:false};
  const clear=()=>{content.replaceChildren();result.hidden=true;root.querySelector('[data-status]').textContent='';};
  if(id==='egfr-calculator'){
    const creatinine=form.elements.namedItem('creatinine');const unit=form.elements.namedItem('unit');
    const setUnitBounds=()=>{creatinine.min=unit.value==='umol-l'?'8.84':'0.1';creatinine.max=unit.value==='umol-l'?'1768':'20';};
    let priorUnit=unit.value;setUnitBounds();
    unit.addEventListener('change',()=>{const value=Number(creatinine.value);if(Number.isFinite(value)){const mgDl=priorUnit==='umol-l'?value/88.4:value;creatinine.value=unit.value==='umol-l'?String(Number((mgDl*88.4).toFixed(2))):String(Number(mgDl.toFixed(3)));}priorUnit=unit.value;setUnitBounds();clear();});
    form.addEventListener('reset',()=>queueMicrotask(()=>{priorUnit=unit.value;setUnitBounds();}));
  }
  if(id==='grammar-checker'){
    const text=form.elements.namedItem('text');const language=form.elements.namedItem('language');
    const setWritingLanguage=()=>{const tag=language.value.trim();text.lang=/^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/u.test(tag)?tag:'und';};
    setWritingLanguage();language.addEventListener('input',setWritingLanguage);language.addEventListener('change',setWritingLanguage);
  }
  async function run(event){
    event?.preventDefault();clear();
    try{
      const input=collect(form);
      if(id==='writing-prompt-generator'&&!input.seed)input.seed=String(crypto.getRandomValues(new Uint32Array(2)).join('-'));
      if(id==='subscription-tracker'){
        const aliases=new Map([[copy.fields.periodWeekly,'weekly'],[copy.fields.periodMonthly,'monthly'],[copy.fields.periodQuarterly,'quarterly'],[copy.fields.periodYearly,'yearly']].map(([key,value])=>[String(key).trim().toLocaleLowerCase(),value]));
        input.rows=String(input.rows).split(/\r?\n/u).map(line=>{const parts=line.split('|');if(parts.length>=3){const last=parts[parts.length-1].trim().toLocaleLowerCase();parts[parts.length-1]=aliases.get(last)??parts.at(-1).trim();}return parts.join('|');}).join('\n');
      }
      let data=input;
      if(id==='color-vision-check')root._colorDifferenceSession={round:0,score:0,rounds:Number(input.rounds),difficulty:input.difficulty};
      if(id==='audio-denoiser'){
        const file=input.audioFile;if(!file)throw new RangeError(copy.messages.chooseFile);if(file.size>20*1024*1024)throw new RangeError(copy.fields.fileLimit);
        const AudioContextClass=window.AudioContext??window.webkitAudioContext;if(!AudioContextClass)throw new Error('Audio processing is unavailable in this browser.');const audioContext=new AudioContextClass();let decoded;try{decoded=await audioContext.decodeAudioData(await file.arrayBuffer());}finally{await audioContext.close();}
        if(decoded.duration>60||decoded.numberOfChannels>2||decoded.sampleRate>48000)throw new RangeError(copy.fields.audioLimit);data={...input,channels:Array.from({length:decoded.numberOfChannels},(_,index)=>new Float32Array(decoded.getChannelData(index))),sampleRate:decoded.sampleRate};
      }
      if(id==='word-cloud-generator')data={...input,locale:document.documentElement.lang||navigator.language||'en'};
      if(id==='object-remover'){
        const file=input.file;if(!file)throw new RangeError(copy.messages.chooseFile);if(file.size>15*1024*1024){const error=new RangeError('Image too large.');error.copyMessage=copy.fields.fileLimit;throw error;}
        const bitmap=await createImageBitmap(file);const ratio=Math.min(1,900/Math.max(bitmap.width,bitmap.height),Math.sqrt(600000/(bitmap.width*bitmap.height)));const width=Math.max(1,Math.floor(bitmap.width*ratio)),height=Math.max(1,Math.floor(bitmap.height*ratio));const source=document.createElement('canvas');source.width=width;source.height=height;const context=source.getContext('2d',{willReadFrequently:true});if(!context){bitmap.close();throw new Error('Canvas unavailable');}context.drawImage(bitmap,0,0,width,height);bitmap.close();const pixels=context.getImageData(0,0,width,height).data;root._objectImage={width,height,pixels};data={...input,width,height,pixels,action:'preview'};
      }
      if(id==='gpx-track-editor'){const file=input.file;if(!file)throw new RangeError(copy.messages.chooseFile);if(file.size>15*1024*1024)throw new RangeError(copy.fields.fileLimit);data={...input,xml:await file.text(),fileName:file.name};}
      if(id==='lithophane-generator'){
        const file=input.imageFile;if(!file)throw new RangeError(copy.messages.chooseFile);if(file.size>15*1024*1024)throw new RangeError(copy.fields.fileLimit);
        const bitmap=await createImageBitmap(file);const ratio=Math.min(1,128/Math.max(bitmap.width,bitmap.height));const width=Math.max(2,Math.floor(bitmap.width*ratio)),height=Math.max(2,Math.floor(bitmap.height*ratio));const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const context=canvas.getContext('2d',{willReadFrequently:true});if(!context){bitmap.close();throw new Error('Canvas unavailable');}context.drawImage(bitmap,0,0,width,height);bitmap.close();data={...input,pixels:context.getImageData(0,0,width,height)};
      }
      if(id==='gamepad-tester')data={...input,gamepads:Array.from(navigator.getGamepads?.()??[]).filter(Boolean)};
      if(IMAGE_TOOLS.has(id)){if(!input.file)throw new RangeError(copy.messages.chooseFile);data={pixels:await getPixels(input.file),colors:6};}
      let output=await calculate(data);
      if(id==='would-you-rather'){
        const signature=JSON.stringify([output.question,output.optionA,output.optionB]);
        if(root._wouldYouRatherVotes.signature!==signature)root._wouldYouRatherVotes={signature,a:0,b:0};
        root._wouldYouRatherVotes.a+=output.votesForA;root._wouldYouRatherVotes.b+=output.votesForB;
        output={...output,votesForA:root._wouldYouRatherVotes.a,votesForB:root._wouldYouRatherVotes.b,totalVotes:root._wouldYouRatherVotes.a+root._wouldYouRatherVotes.b};
      }
      if(id==='never-have-i-ever'){
        const tally=root._neverHaveIEverVotes;const signature=JSON.stringify([output.prompt,output.participants]);
        if(tally.signature!==signature)root._neverHaveIEverVotes={signature,yes:0,no:0,votes:0,complete:false};
        const current=root._neverHaveIEverVotes;if(current.complete){announce(root,copy.fields.roundComplete,'error');return null;}
        current[output.answer]++;current.votes++;current.complete=current.votes>=output.participants;
        output={...output,haveDone:current.yes,haveNotDone:current.no,votes:current.votes,complete:current.complete};
      }
      if(id==='mockup-generator'){const meta=await renderImageMockup(content,input,copy);result.hidden=false;announce(root,copy.messages.complete,'success');return meta;}
      renderResult(content,id,output,copy);result.hidden=false;announce(root,copy.messages.complete,'success');return output;
    }catch(error){const message=error.copyMessage??(error.code==='rules-expired'&&copy.messages.expired?copy.messages.expired:error.code==='rules-not-effective'&&copy.messages.notEffective?copy.messages.notEffective:id==='rdap-domain-lookup'&&!(error instanceof RangeError)?copy.fields.registryUnavailable:error instanceof RangeError?copy.messages.error:copy.messages.fileError);announce(root,message,'error');return null;}
  }
  form.addEventListener('submit',run);form.addEventListener('reset',()=>queueMicrotask(()=>{clear();if(id==='skyscrapers-puzzle'){form.elements.namedItem('entries').value='';run();}if(id==='never-have-i-ever')root._neverHaveIEverVotes={signature:'',yes:0,no:0,votes:0,complete:false};if(id==='star-battle'){root._starBattleBoard=Array.from({length:8},()=>Array(8).fill(false));run();}}));
  if(id==='object-remover')root.addEventListener('click',async(event)=>{
    if(event.target.closest('[data-clear-object-mask]')){root._objectMaskCanvas?.getContext('2d')?.clearRect(0,0,root._objectMaskCanvas.width,root._objectMaskCanvas.height);if(root._objectCurrentPixels&&root._objectImage){root._objectCurrentPixels=new Uint8ClampedArray(root._objectImage.pixels);renderResult(content,id,{...root._objectImage,pixels:root._objectCurrentPixels,changed:false},copy);}return;}
    if(event.target.closest('[data-download-object-removal]')){if(!root._objectCurrentPixels)return;const canvas=document.createElement('canvas');canvas.width=root._objectImage.width;canvas.height=root._objectImage.height;canvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(root._objectCurrentPixels),canvas.width,canvas.height),0,0);canvas.toBlob((blob)=>{if(blob)saveBlob(blob,'object-removed.png');},'image/png');return;}
    if(!event.target.closest('[data-apply-object-removal]'))return;
    try{const {width,height,pixels}=root._objectImage??{};if(!root._objectMaskCanvas)throw new RangeError(copy.messages.chooseFile);const alpha=root._objectMaskCanvas.getContext('2d').getImageData(0,0,width,height).data;const mask=new Uint8Array(width*height);for(let i=0;i<mask.length;i++)mask[i]=alpha[i*4+3]>8?1:0;const output=await calculate({width,height,pixels,mask,action:'inpaint'});root._objectCurrentPixels=new Uint8ClampedArray(output.pixels);root._objectImage.pixels=new Uint8ClampedArray(output.pixels);renderResult(content,id,output,copy);result.hidden=false;announce(root,copy.fields.removalComplete,'success');}catch(error){announce(root,error instanceof RangeError?copy.messages.error:copy.messages.fileError,'error');}
  });
    if(id==='skyscrapers-puzzle')root.addEventListener('click',(event)=>{if(event.target.closest('[data-new-skyscraper]')){form.elements.namedItem('seed').value=String(Math.floor(Math.random()*2147483647));form.elements.namedItem('entries').value='';run();return;}const cell=event.target.closest('[data-skyscraper-cell]');if(!cell)return;const [row,column]=cell.dataset.skyscraperCell.split(',').map(Number);const size=Number(form.elements.namedItem('size').value);root._skyscraperEntries[row][column]=(root._skyscraperEntries[row][column]+1)%(size+1);form.elements.namedItem('entries').value=root._skyscraperEntries.map((values)=>values.join(' ')).join('\n');run();});
    if(id==='star-battle')root.addEventListener('click',(event)=>{const cell=event.target.closest('[data-star-battle-cell]');if(!cell)return;const [row,column]=cell.dataset.starBattleCell.split(',').map(Number);root._starBattleBoard[row][column]=!root._starBattleBoard[row][column];form.elements.namedItem('board').value=root._starBattleBoard.map((cells)=>cells.map((value)=>value?'*':'.').join('')).join('\n');run();});
  root.querySelector('[data-action="example"]')?.addEventListener('click',()=>{if(id==='writing-prompt-generator'){const seed=form.elements.namedItem('seed');seed.value=String(Date.now());}if(id==='qibla-compass'){form.elements.namedItem('latitude').value='40.4168';form.elements.namedItem('longitude').value='-3.7038';} if(id==='color-palette-from-image'||id==='image-histogram'||id==='mockup-generator'||id==='gamepad-tester')return;run();});
  if(id==='orbital-visualizer'){
    const n=form.elements.namedItem('n'), l=form.elements.namedItem('l'), m=form.elements.namedItem('m');
    const rebuild=(select,values,keyPrefix,preserve)=>{select.replaceChildren();for(const value of values){const option=document.createElement('option');option.value=String(value);option.textContent=copy.fields[`${keyPrefix}${value}`]??String(value);select.append(option);}select.value=values.includes(preserve)?String(preserve):String(values[0]);};
    const updateL=()=>{const oldL=Number(l.value);rebuild(l,Array.from({length:Number(n.value)},(_,i)=>i),'angular',oldL);updateM();};
    const updateM=()=>{const oldM=Number(m.value),degree=Number(l.value);rebuild(m,Array.from({length:2*degree+1},(_,i)=>i-degree),'magnetic',oldM);};
    n.addEventListener('change',updateL);l.addEventListener('change',updateM);updateL();
  }
  for(const control of form.querySelectorAll('[data-input]')) control.addEventListener('input',()=>{if(id==='object-remover'&&['brushSize','mode'].includes(control.name))return;clear();});
  if(id==='star-battle'||id==='skyscrapers-puzzle')run();
  if(id==='gamepad-tester'){
    let lastDevices=null;
    setInterval(async()=>{
      if(document.visibilityState==='hidden')return;
      const devices=Array.from(navigator.getGamepads?.()??[]).filter(Boolean);
      const signature=JSON.stringify(devices.map(({index,id:deviceId,connected})=>({index,id:deviceId,connected})));
      if(signature!==lastDevices||(result.hidden&&devices.length)){lastDevices=signature;await run();return;}
      if(result.hidden)return;
      try{
        const snapshot=await calculate({deadzone:Number(form.elements.namedItem('deadzone')?.value??0.15)});
        for(const pad of snapshot){
          const card=content.querySelector(`[data-gamepad-index="${pad.index}"]`);if(!card)continue;
          pad.buttons.forEach((button,index)=>{const value=card.querySelector(`[data-gamepad-button-value="${index}"]`);if(value)value.textContent=`${button.pressed?copy.fields.pressed:copy.fields.released} · ${button.value.toFixed(2)}`;});
          pad.axes.forEach((axis,index)=>{const value=card.querySelector(`[data-gamepad-axis-value="${index}"]`);if(value)value.textContent=axis.toFixed(2);});
        }
      }catch{}
    },100);
  }
}
