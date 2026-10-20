import { ORIGAMI_MODELS, simulateOrigamiFold } from './logic.mjs';
const root = document.querySelector('[data-origami-simulator]');
if (root) {
  const copyNode = root.closest('[data-tool]')?.querySelector('[data-tool-copy]') ?? document.querySelector('[data-tool-copy]');
  const copy = JSON.parse(copyNode?.textContent ?? '{}');
  const canvas = root.querySelector('[data-canvas]'), ctx = canvas.getContext('2d');
  const modelSelect = root.querySelector('[data-model]'), stepSelect = root.querySelector('[data-step]');
  const progress = root.querySelector('[data-progress]'), status = root.querySelector('[data-status]');
  let yaw = -0.62, pitch = 0.78, drag;
  function updateSteps() {
    const model = ORIGAMI_MODELS.find(({ id }) => id === modelSelect.value);
    stepSelect.replaceChildren(...model.steps.map((_, index) => { const option = document.createElement('option'); option.value = String(index); option.textContent = copy.fields.stepNumber.replace('{number}', String(index + 1)); return option; }));
    stepSelect.disabled = model.steps.length === 1;
  }
  function draw() {
    const mesh = simulateOrigamiFold({ modelId: modelSelect.value, stepIndex: Number(stepSelect.value), progress: Number(progress.value) / 100 });
    ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const points = mesh.vertices.map((vertex) => {
      const x = vertex.x * Math.cos(yaw) - vertex.z * Math.sin(yaw);
      const z = vertex.x * Math.sin(yaw) + vertex.z * Math.cos(yaw);
      return { x: 400 + x * 390, y: 260 + (vertex.y * Math.cos(pitch) - z * Math.sin(pitch)) * 350, depth: vertex.y * Math.sin(pitch) + z * Math.cos(pitch) };
    });
    const faces = mesh.faces.map((face) => ({ points: face.map((index) => points[index]), depth: face.reduce((sum, index) => sum + points[index].depth, 0) / 3 })).sort((a, b) => a.depth - b.depth);
    for (const face of faces) {
      ctx.beginPath(); ctx.moveTo(face.points[0].x, face.points[0].y); ctx.lineTo(face.points[1].x, face.points[1].y); ctx.lineTo(face.points[2].x, face.points[2].y); ctx.closePath();
      ctx.fillStyle = face.depth < 0 ? '#dbeafe' : '#eff6ff'; ctx.fill(); ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 0.65; ctx.stroke();
    }
    status.textContent = copy.messages.progress.replace('{step}', String(mesh.stepIndex + 1)).replace('{steps}', String(mesh.stepCount)).replace('{percent}', String(Math.round(mesh.progress * 100)));
  }
  modelSelect.addEventListener('change', () => { updateSteps(); progress.value = '0'; draw(); });
  stepSelect.addEventListener('change', draw); progress.addEventListener('input', draw);
  for (const button of root.querySelectorAll('[data-rotate]')) button.addEventListener('click', () => { yaw += button.dataset.rotate === 'left' ? -0.22 : 0.22; draw(); });
  canvas.addEventListener('pointerdown', (event) => { drag = { x: event.clientX, y: event.clientY }; canvas.setPointerCapture(event.pointerId); });
  canvas.addEventListener('pointermove', (event) => { if (!drag) return; yaw += (event.clientX - drag.x) * 0.01; pitch = Math.max(-1.2, Math.min(1.2, pitch + (event.clientY - drag.y) * 0.01)); drag = { x: event.clientX, y: event.clientY }; draw(); });
  canvas.addEventListener('pointerup', () => { drag = undefined; });
  canvas.addEventListener('keydown', (event) => { if (event.key === 'ArrowLeft') yaw -= 0.12; else if (event.key === 'ArrowRight') yaw += 0.12; else if (event.key === 'ArrowUp') pitch = Math.min(1.2, pitch + 0.12); else if (event.key === 'ArrowDown') pitch = Math.max(-1.2, pitch - 0.12); else return; event.preventDefault(); draw(); });
  root.querySelector('[data-reset]').addEventListener('click', () => { modelSelect.value = 'book-fold'; updateSteps(); progress.value = '0'; yaw = -0.62; pitch = 0.78; draw(); });
  updateSteps(); draw();
}
