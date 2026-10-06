import { encodePcm16Wav } from './audio-editor-logic.mjs';
import { createTangramPuzzle, moleculeCatalog, moveBackgammonChecker, moveTangramPiece, newBackgammonGame, getBackgammonMoves, rollBackgammon, scoreNotes, tangramIsSolved, validateAudioLoop } from './planned-tools-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);
const cache = new WeakMap();
function say(root, key, values = {}) {
  let map = cache.get(root);
  if (!map) { try { map = JSON.parse(root.dataset.plannerMessages || '{}'); } catch { map = {}; } cache.set(root, map); }
  return (map[key] ?? key).replace(/\{(\w+)\}/gu, (match, name) => values[name] ?? match);
}
function status(root, key, error = false, values = {}) { const node = $('#op-status', root); if (node) { node.textContent = say(root, key, values); node.className = `tool-status${error ? ' is-error' : ''}`; } }
function saveBlob(link, blob, filename) {
  if (link.dataset.url) URL.revokeObjectURL(link.dataset.url);
  link.href = URL.createObjectURL(blob); link.dataset.url = link.href; link.download = filename; link.hidden = false;
}
function clearLink(link) { if (link?.dataset.url) URL.revokeObjectURL(link.dataset.url); if (link) { link.removeAttribute('href'); delete link.dataset.url; link.hidden = true; } }

function setupAudioLooper(root) {
  const fileInput = $('[data-loop-file]', root); const start = $('[data-loop-start]', root); const end = $('[data-loop-end]', root); const count = $('[data-loop-count]', root);
  let context; let buffer; let source; let generation = 0;
  const stop = () => { try { source?.stop(); } catch {} source = null; };
  const cleanup = async () => { generation += 1; stop(); if (context && context.state !== 'closed') await context.close().catch(() => {}); context = null; buffer = null; clearLink($('[data-loop-download]', root)); };
  fileInput.addEventListener('change', async () => {
    await cleanup(); const file = fileInput.files?.[0]; if (!file) return;
    if (file.size > 25 * 1024 * 1024) { fileInput.value = ''; return status(root, 'Choose an audio file under 25 MB and 90 seconds.', true); }
    const current = generation;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext; if (!Audio) throw new Error('unsupported');
      context = new Audio(); const decoded = await context.decodeAudioData(await file.arrayBuffer());
      if (current !== generation) return;
      if (!Number.isFinite(decoded.duration) || decoded.duration > 90 || decoded.numberOfChannels > 2) throw new RangeError('bounds');
      buffer = decoded; start.value = '0'; end.value = decoded.duration.toFixed(2); end.max = String(decoded.duration); start.max = String(decoded.duration);
      [start, end, count, $('[data-loop-preview]', root), $('[data-loop-export]', root)].forEach((control) => { control.disabled = false; });
      status(root, 'Audio loop ready to export.');
    } catch (error) { if (current === generation) { await cleanup(); fileInput.value = ''; status(root, error instanceof RangeError ? 'Choose an audio file under 25 MB and 90 seconds.' : 'This browser cannot decode this audio format.', true); } }
  });
  root.addEventListener('click', async (event) => {
    if (event.target.closest('[data-loop-stop]')) { stop(); $('[data-loop-stop]', root).disabled = true; return status(root, 'Audio cleared from this page.'); }
    if (event.target.closest('[data-loop-preview]')) {
      try {
        const range = validateAudioLoop(start.value, end.value, buffer?.duration, count.value);
        if (context.state === 'closed') context = new (window.AudioContext || window.webkitAudioContext)(); await context.resume(); stop();
        source = context.createBufferSource(); source.buffer = buffer; source.loop = true; source.loopStart = range.start; source.loopEnd = range.end; source.connect(context.destination); source.start(0, range.start); $('[data-loop-stop]', root).disabled = false;
      } catch { return status(root, 'Set a valid loop range and repeat count.', true); }
    }
    if (event.target.closest('[data-loop-export]')) {
      try {
        const range = validateAudioLoop(start.value, end.value, buffer?.duration, count.value); const frames = Math.ceil(range.duration * buffer.sampleRate);
        if (frames * buffer.numberOfChannels * 2 > 128 * 1024 * 1024) throw new RangeError('size');
        const channels = Array.from({ length: buffer.numberOfChannels }, (_, channel) => {
          const out = new Float32Array(frames); const sourceChannel = buffer.getChannelData(channel); const begin = Math.floor(range.start * buffer.sampleRate);
          for (let pass = 0; pass < range.repeats; pass += 1) out.set(sourceChannel.subarray(begin, begin + Math.min(frames - pass * (Math.floor((range.end - range.start) * buffer.sampleRate)), Math.floor((range.end - range.start) * buffer.sampleRate))), pass * Math.floor((range.end - range.start) * buffer.sampleRate));
          return out;
        });
        status(root, 'Rendering repeated audio on this device…');
        const wav = encodePcm16Wav(channels, buffer.sampleRate); saveBlob($('[data-loop-download]', root), new Blob([wav], { type: 'audio/wav' }), 'usefulverse-loop.wav'); status(root, 'Repeated WAV is ready.');
      } catch (error) { status(root, error instanceof RangeError ? 'The repeated audio must be 120 seconds or less.' : 'Audio loop export failed. Try a shorter clip.', true); }
    }
    if (event.target.closest('[data-loop-clear]')) { await cleanup(); fileInput.value = ''; [start,end,count,$('[data-loop-preview]',root),$('[data-loop-export]',root)].forEach((control)=>{control.disabled=true;}); status(root, 'Audio cleared from this page.'); }
  });
  window.addEventListener('pagehide', cleanup, { once: true });
}

const svgNs = 'http://www.w3.org/2000/svg';
function svgNode(name, attrs = {}, text = '') { const node = document.createElementNS(svgNs, name); for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value)); if (text) node.textContent = text; return node; }
function setupMoleculeViewer(root) {
  const select = $('[data-molecule-select]', root);
  for (const molecule of moleculeCatalog) { const option = document.createElement('option'); option.value = molecule.id; option.textContent = say(root, molecule.name); select.append(option); }
  const draw = () => {
    const molecule = moleculeCatalog.find(({ id }) => id === select.value); const svg = $('[data-molecule-svg]', root); svg.replaceChildren();
    for (const [from, to, order = 1] of molecule.bonds) {
      const a = molecule.atoms[from]; const b = molecule.atoms[to];
      for (let strand = 0; strand < order; strand += 1) { const offset = strand - (order - 1) / 2; const dx = (b.y - a.y) / 12 * offset; const dy = (a.x - b.x) / 12 * offset; svg.append(svgNode('line', { x1: a.x + dx, y1: a.y + dy, x2: b.x + dx, y2: b.y + dy, stroke: '#334155', 'stroke-width': 4, 'stroke-linecap': 'round' })); }
    }
    for (const atom of molecule.atoms) { const color = atom.e === 'O' ? '#ef7b69' : atom.e === 'N' ? '#6285d9' : atom.e === 'C' ? '#6f7785' : '#fff'; svg.append(svgNode('circle', { cx: atom.x, cy: atom.y, r: 22, fill: color, stroke: '#253047', 'stroke-width': 2 })); svg.append(svgNode('text', { x: atom.x, y: atom.y + 6, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 700, fill: atom.e === 'H' ? '#182235' : '#fff' }, atom.e)); }
    $('[data-molecule-name]', root).textContent = say(root, molecule.name); $('[data-molecule-formula]', root).textContent = molecule.formula; $('[data-molecule-atoms]', root).textContent = String(molecule.atoms.length); $('[data-molecule-bonds]', root).textContent = String(molecule.bonds.length); svg.setAttribute('aria-label', `${say(root, 'Molecule diagram')}: ${say(root, molecule.name)} ${molecule.formula}`);
  };
  draw(); select.addEventListener('change', draw);
}

const pitchMidi = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function setupScoreEditor(root) {
  const svg = $('[data-score-svg]', root); const notes = []; let context; let timers = []; let scoreDownloadUrl;
  const draw = () => {
    svg.replaceChildren();
    for (let i = 0; i < 5; i += 1) svg.append(svgNode('line', { x1: 50, x2: 860, y1: 62 + i * 24, y2: 62 + i * 24, stroke: '#29364b', 'stroke-width': 2 }));
    svg.append(svgNode('text', { x: 8, y: 133, 'font-size': 74, fill: '#172239' }, '𝄞'));
    notes.forEach((note, index) => {
      const x = 100 + index * 23; const diatonic = note.octave * 7 + ['C','D','E','F','G','A','B'].indexOf(note.pitch); const y = 158 - (diatonic - 30) * 6;
      svg.append(svgNode('ellipse', { cx: x, cy: y, rx: 8, ry: 5.5, transform: `rotate(-18 ${x} ${y})`, fill: '#172239' }));
      if (note.duration !== 'w') svg.append(svgNode('line', { x1: x + 7, y1: y, x2: x + 7, y2: y - 34, stroke: '#172239', 'stroke-width': 2 }));
      if (note.duration === 'q') svg.append(svgNode('text', { x: x + 10, y: y - 29, 'font-size': 12 }, '♪'));
    });
    svg.setAttribute('aria-label', `${say(root, 'Music notes on a treble staff')}: ${notes.map(({ pitch, octave, duration }) => `${pitch}${octave}${duration}`).join(' ')}`);
    status(root, notes.length ? 'Note added.' : 'Add notes to build a melody.');
  };
  root.addEventListener('click', async (event) => {
    if (event.target.closest('[data-score-add]')) { if (notes.length >= 32) return status(root, 'A score can contain up to 32 notes.', true); notes.push(...scoreNotes([{ pitch: $('[data-score-note]', root).value, octave: $('[data-score-octave]', root).value, duration: $('[data-score-duration]', root).value }])); draw(); }
    if (event.target.closest('[data-score-undo]')) { notes.pop(); draw(); }
    if (event.target.closest('[data-score-clear]')) { notes.length = 0; draw(); status(root, 'Score cleared.'); }
    if (event.target.closest('[data-score-stop]')) { timers.forEach(clearTimeout); timers = []; if (context && context.state !== 'closed') await context.close().catch(()=>{}); context=null; return status(root, 'Playback stopped.'); }
    if (event.target.closest('[data-score-play]')) {
      if (!notes.length) return status(root, 'Add notes to build a melody.', true);
      try { timers.forEach(clearTimeout); timers = []; if (context && context.state !== 'closed') await context.close().catch(() => {}); const Audio = window.AudioContext || window.webkitAudioContext; if (!Audio) throw new Error(); context = new Audio(); await context.resume(); let at = context.currentTime + .04;
        for (const note of notes) { const midi = 12 * (note.octave + 1) + pitchMidi[note.pitch]; const duration = note.duration === 'w' ? 1.6 : note.duration === 'h' ? .8 : .4; const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.frequency.value = 440 * (2 ** ((midi - 69) / 12)); gain.gain.setValueAtTime(.0001, at); gain.gain.exponentialRampToValueAtTime(.12, at + .015); gain.gain.setValueAtTime(.12, at + duration * .85); gain.gain.exponentialRampToValueAtTime(.0001, at + duration); oscillator.connect(gain); gain.connect(context.destination); oscillator.start(at); oscillator.stop(at + duration); at += duration; }
        status(root, 'Melody playback started.'); timers.push(setTimeout(async()=>{ if(context&&context.state!=='closed') await context.close().catch(()=>{}); context=null; status(root,'Playback stopped.'); }, Math.max(0,(at-context.currentTime)*1000)));
      } catch { status(root, 'Audio is not available in this browser.', true); }
    }
    if (event.target.closest('[data-score-export]')) {
      if (!notes.length) return status(root, 'Add notes to build a melody.', true);
      const link = document.createElement('a'); const copy = svg.cloneNode(true); copy.setAttribute('xmlns', svgNs); const blob = new Blob([new XMLSerializer().serializeToString(copy)], { type: 'image/svg+xml;charset=utf-8' }); if (scoreDownloadUrl) URL.revokeObjectURL(scoreDownloadUrl); scoreDownloadUrl = URL.createObjectURL(blob); link.href=scoreDownloadUrl; link.download='usefulverse-score.svg'; link.click(); status(root,'Score SVG ready.');
    }
  });
  window.addEventListener('pagehide', () => { timers.forEach(clearTimeout); if (context && context.state !== 'closed') context.close().catch(() => {}); if (scoreDownloadUrl) URL.revokeObjectURL(scoreDownloadUrl); }, { once: true });
  draw();
}

function setupBackgammon(root) {
  let game = newBackgammonGame(); let selected = null;
  const render = () => {
    const board = $('[data-bg-board]', root); board.replaceChildren();
    const bars = $('[data-bg-bars]', root); bars.replaceChildren();
    const offs = $('[data-bg-offs]', root); offs.replaceChildren();
    for (const player of [0, 1]) { const button = document.createElement('button'); button.type = 'button'; button.className = 'button button--ghost'; button.dataset.bgBar = String(player); button.textContent = `${say(root, player ? 'Black bar' : 'White bar')}: ${game.bar[player]}`; button.disabled = player !== game.turn || !game.bar[player] || !getBackgammonMoves(game).some((move) => move.from === 'bar'); button.setAttribute('aria-pressed', String(selected === 'bar' && player === game.turn)); bars.append(button); }
    for (const player of [0, 1]) { const button = document.createElement('button'); button.type = 'button'; button.className = 'button button--ghost'; button.dataset.bgOff = String(player); button.textContent = `${say(root, player ? 'Black off' : 'White off')}: ${game.off[player]}`; button.disabled = player !== game.turn || selected === null || !getBackgammonMoves(game).some((move) => move.from === selected && move.to === 'off'); offs.append(button); }
    const pointOrder = [...Array(12).keys()].reverse().concat([...Array(12).keys()].map((n)=>n+12));
    for (const point of pointOrder) {
      const button = document.createElement('button'); button.type='button'; button.className='backgammon__point'; button.dataset.point=String(point); button.setAttribute('role','gridcell');
      const moves = getBackgammonMoves(game); const legal = moves.filter((move)=>move.from===point); const target = selected !== null && moves.some((move)=>move.from===selected&&move.to===point); if(target)button.classList.add('is-legal-target'); const pointState=game.points[point].map((n,i)=>n?`${say(root,i?'Black checker':'White checker')} ${n}`:'').filter(Boolean).join(', ')||say(root,'Empty');button.setAttribute('aria-label',say(root,'Point {number}: {state}',{number:point+1,state:pointState})); button.setAttribute('aria-pressed',String(selected===point));
      button.innerHTML = `<span>${point+1}</span><i>${game.points[point][0]?`⚪ ${game.points[point][0]}`:''}</i><b>${game.points[point][1]?`⚫ ${game.points[point][1]}`:''}</b>${legal.length?'<em>•</em>':''}`; board.append(button);
    }
    $('[data-bg-dice]',root).textContent=game.dice.length?say(root,'Dice: {first}',{first:game.dice.join(', ')}):'';
    $('[data-bg-roll]',root).disabled=game.winner!==null;
    $('[data-bg-stats]',root).textContent=say(root,'Bar: white {white}, black {black}',{white:game.bar[0],black:game.bar[1]})+' · '+say(root,'Off: white {white}, black {black}',{white:game.off[0],black:game.off[1]});
    $('[data-bg-pass]',root).hidden=!(game.dice.length>0&&getBackgammonMoves(game).length===0);
    status(root,game.winner===null?(game.dice.length?say(root,game.turn?'Black to move':'White to move'):say(root,'Pass device to {player}.',{player:say(root,game.turn?'White':'Black')})):say(root,game.winner?'Black wins!':'White wins!'));
  };
  root.addEventListener('click',(event)=>{
    if(event.target.closest('[data-bg-new]')){game=newBackgammonGame();selected=null;render();return;}
    if(event.target.closest('[data-bg-pass]')){if(!game.dice.length||getBackgammonMoves(game).length)return;game={...game,turn:1-game.turn,dice:[]};selected=null;render();return;}
    if(event.target.closest('[data-bg-roll]')){if(game.winner!==null)return;const dice=[1+Math.floor(Math.random()*6),1+Math.floor(Math.random()*6)];game=rollBackgammon(game,dice);selected=null;render();return;}
    const offButton=event.target.closest('[data-bg-off]');if(offButton){const player=Number(offButton.dataset.bgOff);if(player===game.turn&&selected!==null){const move=getBackgammonMoves(game).filter((candidate)=>candidate.from===selected&&candidate.to==='off').sort((a,b)=>b.die-a.die)[0];if(move){game=moveBackgammonChecker(game,move.from,move.to,move.die);selected=null;render()}}return;}
    const barButton=event.target.closest('[data-bg-bar]');if(barButton){if(Number(barButton.dataset.bgBar)===game.turn&&getBackgammonMoves(game).some((move)=>move.from==='bar')){selected='bar';render()}return;}
    const pointButton=event.target.closest('[data-point]'); if(!pointButton)return; const point=Number(pointButton.dataset.point);
    const moves=getBackgammonMoves(game);
    if(selected!==null){const candidate=moves.filter((move)=>move.from===selected&&move.to===point).sort((a,b)=>b.die-a.die)[0];if(candidate){game=moveBackgammonChecker(game,candidate.from,candidate.to,candidate.die);selected=null;render();return;}}
    if(moves.some((move)=>move.from===point)){selected=point;render();}else status(root,'Select a checker, then a highlighted destination.',true);
  });
  render();
}

function setupTangram(root) {
  const board = $('[data-tangram-board]', root); const shapeSelect = $('[data-tangram-shape]', root); let pieces = []; let selected = -1; let drag = null;
  const shape = () => shapeSelect.value;
  const reset = () => { pieces = createTangramPuzzle(shape()); selected = -1; render(); status(root, 'Puzzle reset.'); };
  const render = () => {
    board.replaceChildren();
    const colors = ['#4f77d1', '#e77763', '#70a982', '#d7a83e', '#8b68c5', '#3d9bb3', '#d36b9a'];
    pieces.forEach((piece) => board.append(svgNode('polygon', { points: piece.points, transform: `translate(${piece.target.x} ${piece.target.y}) rotate(${piece.target.r})`, class: 'tangram__target' })));
    pieces.forEach((piece, index) => {
      const group = svgNode('g', { transform: `translate(${piece.x} ${piece.y}) rotate(${piece.rotation}) scale(${piece.flip ? -1 : 1} 1)`, tabindex: 0, role: 'button', 'aria-label': say(root, 'Piece {number}', { number: index + 1 }), 'aria-pressed': String(selected === index), class: `tangram__piece${selected === index ? ' is-selected' : ''}`, 'data-tangram-piece': index });
      group.append(svgNode('polygon', { points: piece.points, fill: colors[index], stroke: '#243149', 'stroke-width': 3, 'stroke-linejoin': 'round' })); board.append(group);
    });
  };
  const setPiece = (index, patch) => { pieces = moveTangramPiece(pieces, index, patch); selected = index; render(); };
  board.addEventListener('pointerdown', (event) => {
    const group = event.target.closest('[data-tangram-piece]'); if (!group) return;
    const index = Number(group.dataset.tangramPiece); selected = index; const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(board.getScreenCTM().inverse());
    drag = { index, dx: pieces[index].x - point.x, dy: pieces[index].y - point.y }; board.setPointerCapture(event.pointerId); render();
  });
  board.addEventListener('pointermove', (event) => { if (!drag) return; const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(board.getScreenCTM().inverse()); pieces = moveTangramPiece(pieces, drag.index, { x: Math.round(point.x + drag.dx), y: Math.round(point.y + drag.dy) }); render(); });
  board.addEventListener('pointerup', () => { drag = null; }); board.addEventListener('pointercancel', () => { drag = null; });
  board.addEventListener('click', (event) => { const group = event.target.closest('[data-tangram-piece]'); if (group) { selected = Number(group.dataset.tangramPiece); render(); } });
  board.addEventListener('keydown', (event) => {
    if (selected < 0 || !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault(); const step = event.shiftKey ? 20 : 5; const piece = pieces[selected];
    setPiece(selected, { x: piece.x + (event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0), y: piece.y + (event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0) });
  });
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-tangram-new]')) return reset();
    if (event.target.closest('[data-tangram-reset]')) return reset();
    if (event.target.closest('[data-tangram-rotate]')) { if (selected < 0) return status(root, 'Select a piece, then move it with arrow keys or drag it.', true); setPiece(selected, { rotation: pieces[selected].rotation + 45 }); return status(root, 'Piece rotated.'); }
    if (event.target.closest('[data-tangram-flip]')) { if (selected < 0) return status(root, 'Select a piece, then move it with arrow keys or drag it.', true); setPiece(selected, { flip: !pieces[selected].flip }); return status(root, 'Piece flipped.'); }
    if (event.target.closest('[data-tangram-check]')) return status(root, tangramIsSolved(pieces, shape()) ? 'Puzzle solved!' : 'Not quite. Keep arranging the pieces.');
  });
  shapeSelect.addEventListener('change', reset); pieces = createTangramPuzzle(shape()); render();
}

export function setupPlannedTool(id, root) {
  if (id === 'audio-looper') return setupAudioLooper(root);
  if (id === 'molecule-viewer') return setupMoleculeViewer(root);
  if (id === 'music-score-editor') return setupScoreEditor(root);
  if (id === 'backgammon') return setupBackgammon(root);
  if (id === 'tangram') return setupTangram(root);
}
