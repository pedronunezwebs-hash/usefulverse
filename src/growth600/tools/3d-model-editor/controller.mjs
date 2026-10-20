import { createBoxMesh, exportMeshObj, extrudeMeshFace, transformMesh } from './logic.mjs';

const root = document.querySelector('[data-mesh-editor]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('[data-mesh-form]'), canvas = root.querySelector('canvas'), ctx = canvas.getContext('2d');
  const status = root.querySelector('[data-status]'), faces = form.elements.namedItem('face'), output = root.querySelector('[data-mesh-summary]');
  let mesh;
  function say(message, error = false) { status.textContent = message; status.classList.toggle('status--error', error); status.classList.toggle('status--success', Boolean(message) && !error); }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!mesh) return;
    const c = Math.cos(0.65), s = Math.sin(0.65), points = mesh.vertices.map(([x,y,z]) => ({ x: canvas.width/2 + (x*c-y*s)*65, y: canvas.height/2 + (x*s+y*c-z*0.8)*65, depth: x*s+y*c+z*0.8 }));
    const polygons = mesh.faces.map((face, index) => ({ face, index, depth: face.reduce((sum, i) => sum + points[i].depth, 0) / face.length })).sort((a,b) => a.depth-b.depth);
    for (const {face,index} of polygons) {
      ctx.beginPath(); face.forEach((vertex, i) => { const p = points[vertex]; if (i) ctx.lineTo(p.x,p.y); else ctx.moveTo(p.x,p.y); }); ctx.closePath();
      ctx.fillStyle = `hsl(${205 + (index % 6) * 12} 58% 72%)`; ctx.fill(); ctx.strokeStyle = '#26394d'; ctx.lineWidth = 1.5; ctx.stroke();
      const center = face.reduce((p,i) => ({x:p.x+points[i].x/face.length,y:p.y+points[i].y/face.length}),{x:0,y:0});
      ctx.fillStyle = '#152537'; ctx.font = '13px sans-serif'; ctx.fillText(String(index+1),center.x-3,center.y+4);
    }
    faces.replaceChildren(...mesh.faces.map((_,i) => new Option(`${copy.fields.face} ${i+1}`, String(i))));
    output.textContent = copy.messages.meshSummary.replace('{vertices}',String(mesh.vertices.length)).replace('{faces}',String(mesh.faces.length));
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    try {
      const data = new FormData(form), operation = event.submitter?.value;
      if (operation === 'box') mesh = createBoxMesh({ width: data.get('width'), height: data.get('height'), depth: data.get('depth') });
      else if (!mesh) throw new Error('no-mesh');
      else if (operation === 'extrude') mesh = extrudeMeshFace(mesh, Number(faces.value), data.get('distance'));
      else mesh = transformMesh(mesh, { translate: [data.get('x'),data.get('y'),data.get('z')], scale: [data.get('sx'),data.get('sy'),data.get('sz')], rotateDegrees: [data.get('rx'),data.get('ry'),data.get('rz')] });
      draw(); say(copy.messages.complete);
    } catch (error) { say(error.message === 'no-mesh' ? copy.messages.createFirst : copy.messages.invalid, true); }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { mesh = undefined; faces.replaceChildren(); output.textContent = ''; draw(); say(''); }));
  root.querySelector('[data-export]').addEventListener('click', () => {
    if (!mesh) return;
    const url = URL.createObjectURL(new Blob([exportMeshObj(mesh)], {type:'text/plain;charset=utf-8'}));
    const a = document.createElement('a'); a.href = url; a.download = 'usefulverse-model.obj'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  draw();
}
