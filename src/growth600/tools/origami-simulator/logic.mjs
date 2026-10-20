export const ORIGAMI_MODELS = Object.freeze([
  Object.freeze({ id: 'book-fold', name: 'Book fold', steps: Object.freeze([{ axis: 0, side: 'right', direction: 1 }]) }),
  Object.freeze({ id: 'gate-fold', name: 'Gate fold', steps: Object.freeze([{ axis: 0, side: 'right', direction: 1 }, { axis: -0.25, side: 'left', direction: -1 }]) }),
  Object.freeze({ id: 'accordion-fold', name: 'Accordion fold', steps: Object.freeze([{ axis: 0, side: 'right', direction: 1 }, { axis: -0.25, side: 'left', direction: -1 }, { axis: -0.125, side: 'right', direction: 1 }]) }),
]);
export const ORIGAMI_LIMITS = Object.freeze({ resolution: 32, minResolution: 8, maxResolution: 40 });

function applyFold(vertices, step, angle) {
  const cosine = Math.cos(angle), sine = Math.sin(angle);
  return vertices.map((vertex) => {
    const distance = vertex.x - step.axis;
    const moves = step.side === 'right' ? distance > 1e-9 : distance < -1e-9;
    if (!moves) return vertex;
    return Object.freeze({
      u: vertex.u, v: vertex.v,
      x: step.axis + distance * cosine + vertex.z * sine,
      y: vertex.y,
      z: -distance * sine + vertex.z * cosine,
    });
  });
}

export function simulateOrigamiFold({ modelId = 'book-fold', stepIndex = 0, progress = 0, resolution = ORIGAMI_LIMITS.resolution } = {}) {
  const model = ORIGAMI_MODELS.find((entry) => entry.id === modelId);
  const step = Number(stepIndex), amount = Number(progress), count = Number(resolution);
  if (!model) throw new RangeError('Choose a supported original fold model.');
  if (!Number.isInteger(step) || step < 0 || step >= model.steps.length) throw new RangeError('Fold step is outside this model.');
  if (!Number.isFinite(amount) || amount < 0 || amount > 1) throw new RangeError('Fold progress must be between 0 and 1.');
  if (!Number.isInteger(count) || count < ORIGAMI_LIMITS.minResolution || count > ORIGAMI_LIMITS.maxResolution) throw new RangeError('Mesh resolution must be between 8 and 40.');
  let vertices = [];
  for (let row = 0; row <= count; row++) for (let col = 0; col <= count; col++) {
    const u = col / count;
    vertices.push(Object.freeze({ u, v: row / count, x: u - 0.5, y: 0.5 - row / count, z: 0 }));
  }
  for (let index = 0; index < step; index++) vertices = applyFold(vertices, model.steps[index], Math.PI * model.steps[index].direction);
  const activeStep = model.steps[step];
  vertices = applyFold(vertices, activeStep, Math.PI * amount * activeStep.direction);
  const faces = [];
  const stride = count + 1;
  for (let row = 0; row < count; row++) for (let col = 0; col < count; col++) {
    const a = row * stride + col, b = a + 1, c = a + stride, d = c + 1;
    faces.push(Object.freeze([a, b, d]), Object.freeze([a, d, c]));
  }
  return Object.freeze({ modelId, modelName: model.name, stepIndex: step, stepCount: model.steps.length, progress: amount, resolution: count, vertices: Object.freeze(vertices), faces: Object.freeze(faces), fold: Object.freeze({ axis: activeStep.axis, movingSide: activeStep.side, direction: activeStep.direction }) });
}
