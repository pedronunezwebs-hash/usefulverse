export function parsePresentationDraft(value) {
  const lines = String(value ?? '').replaceAll('\r', '').split('\n').map((line) => line.trim()).filter(Boolean);
  if (!lines.length) throw Object.assign(new RangeError('Add slide content.'), { code: 'empty-presentation' });
  if (lines.length > 20) throw Object.assign(new RangeError('Too many slides.'), { code: 'slide-limit' });
  const slides = lines.map((line) => {
    const [title = '', ...body] = line.split('|');
    const cleanTitle = title.trim(); const cleanBody = body.join('|').trim();
    if (!cleanTitle || cleanTitle.length > 120 || cleanBody.length > 2000) throw Object.assign(new RangeError('Invalid slide content.'), { code: 'invalid-slide' });
    return Object.freeze({ title: cleanTitle, body: cleanBody });
  });
  return Object.freeze(slides);
}
export function escapePresentationHtml(value) { return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;'); }
export function exportPresentationHtml(slides, title, labels = {}) {
  const safeTitle = escapePresentationHtml(title || 'Presentation');
  const language = /^[A-Za-z0-9-]{1,16}$/u.test(labels.language ?? '') ? labels.language : 'en';
  const text = { slides, labels: { previous: labels.previous || 'Previous', next: labels.next || 'Next', slide: labels.slide || 'Slide', of: labels.of || 'of' } };
  const payload = JSON.stringify(text).replaceAll('<','\\u003c').replaceAll('>','\\u003e').replaceAll('&','\\u0026').replaceAll('\u2028','\\u2028').replaceAll('\u2029','\\u2029');
  return `<!doctype html><html lang="${language}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${safeTitle}</title><style>body{margin:0;background:#161923;color:#fff;font:18px system-ui}main{max-width:1000px;margin:5vh auto;padding:3rem;min-height:65vh;background:#252a38;border-radius:1rem}h1{font-size:clamp(2rem,6vw,4rem)}p{white-space:pre-wrap;line-height:1.6}nav{display:flex;justify-content:space-between;max-width:1000px;margin:1rem auto}button{padding:.7rem 1rem;font:inherit}</style><main tabindex="0" aria-live="polite"><h1></h1><p></p><span></span></main><nav><button id="prev"></button><span id="count"></span><button id="next"></button></nav><script type="application/json" id="deck">${payload}</script><script>const data=JSON.parse(document.querySelector('#deck').textContent),d=data.slides,l=data.labels,h=document.querySelector('h1'),p=document.querySelector('p'),c=document.querySelector('#count'),prev=document.querySelector('#prev'),next=document.querySelector('#next');prev.textContent=l.previous;next.textContent=l.next;let i=0;function show(){h.textContent=d[i].title;p.textContent=d[i].body;c.textContent=l.slide+' '+(i+1)+' '+l.of+' '+d.length}prev.onclick=()=>{i=(i+d.length-1)%d.length;show()};next.onclick=()=>{i=(i+1)%d.length;show()};document.querySelector('main').onkeydown=e=>{if(e.key==='ArrowRight')next.click();if(e.key==='ArrowLeft')prev.click()};show();</script></html>`;
}
