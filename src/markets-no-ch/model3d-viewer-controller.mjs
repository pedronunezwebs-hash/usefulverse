const root = document.querySelector('[data-model3d-viewer]');
if (root) {
  const copy = JSON.parse(root.closest('main').querySelector('[data-tool-copy]').textContent);
  const f = copy.fields;
  const q = (selector) => root.querySelector(selector);
  const fileInput = q('#model3d-file');
  const status = q('[data-model3d-status]');
  const cancelButton = q('[data-model3d-cancel]');
  const stepControls = q('[data-model3d-step-controls]');
  const stepUnit = q('#model3d-step-unit');
  const loadStepButton = q('[data-model3d-load-step]');
  let worker = null;
  let viewer = null;
  let taskId = 0;

  const setStatus = (message, error = false) => {
    status.textContent = message; status.classList.toggle('result--error', error);
  };

  function clearModel() {
    taskId += 1;
    worker?.terminate(); worker = null;
    viewer?.dispose(); viewer = null;
    cancelButton.hidden = true;
    stepControls.hidden = true; stepUnit.value = ''; loadStepButton.disabled = true;
  }

  function cancelLoading() {
    clearModel(); fileInput.value = ''; setStatus(f.cancelled);
  }

  function errorMessage(code) {
    return ({ unsupported: f.unsupported, external: f.remoteReference, geometryTooLarge: f.geometryTooLarge, renderUnsupported: f.renderUnsupported })[code] ?? f.invalid;
  }

  async function startLoad(file, extension, linearUnit = '') {
    clearModel();
    if (file.size > 25 * 1024 * 1024) { setStatus(f.tooLarge, true); return; }
    const isStep = extension === '.step' || extension === '.stp';
    setStatus(isStep ? f.stepLoading : f.loading); cancelButton.hidden = false;
    const requestId = ++taskId;
    try {
      const buffer = await file.arrayBuffer();
      if (requestId !== taskId) return;
      worker = isStep
        ? new Worker(new URL('./model3d-step-worker.js', import.meta.url))
        : new Worker(new URL('./model3d-viewer-worker.mjs', import.meta.url), { type: 'module' });
      worker.onmessage = async ({ data }) => {
        if (requestId !== taskId) return;
        worker?.terminate(); worker = null;
        if (!data.ok) { cancelButton.hidden = true; setStatus(errorMessage(data.error), true); return; }
        try {
          const { mountModel3dViewer } = await import('./model3d-viewer-runtime.mjs');
          if (requestId !== taskId) return;
          const unitLabel = isStep
            ? ({ millimeter: f.stepMm, centimeter: f.stepCm, meter: f.stepM, inch: f.stepIn, foot: f.stepFt })[data.units] ?? f.fileUnits
            : /\.(gltf|glb)$/iu.test(file.name) ? f.gltfUnits : f.fileUnits;
          viewer = mountModel3dViewer(root, file, data.meshes, copy, unitLabel);
          cancelButton.hidden = true;
          setStatus(f.loaded);
        } catch (error) {
          if (requestId === taskId) { cancelButton.hidden = true; setStatus(errorMessage(error.message), true); }
        }
      };
      worker.onerror = () => {
        if (requestId !== taskId) return;
        worker?.terminate(); worker = null; cancelButton.hidden = true; setStatus(f.invalid, true);
      };
      worker.postMessage({ id: requestId, buffer, extension, linearUnit }, [buffer]);
    } catch {
      if (requestId === taskId) { cancelButton.hidden = true; setStatus(f.invalid, true); }
    }
  }

  fileInput.addEventListener('change', () => {
    clearModel();
    const file = fileInput.files?.[0];
    if (!file) { setStatus(f.ready); return; }
    const extension = `.${file.name.split('.').pop().toLowerCase()}`;
    if (extension === '.step' || extension === '.stp') {
      if (file.size > 25 * 1024 * 1024) { setStatus(f.tooLarge, true); return; }
      stepControls.hidden = false; setStatus(f.stepUnitRequired); return;
    }
    if (!['.stl', '.obj', '.gltf', '.glb'].includes(extension)) { setStatus(f.unsupported, true); return; }
    void startLoad(file, extension);
  });

  stepUnit.addEventListener('change', () => { loadStepButton.disabled = !stepUnit.value; });
  loadStepButton.addEventListener('click', () => {
    const file = fileInput.files?.[0];
    if (!file || !stepUnit.value) { setStatus(f.stepUnitRequired, true); return; }
    const extension = `.${file.name.split('.').pop().toLowerCase()}`;
    void startLoad(file, extension, stepUnit.value);
  });

  cancelButton.addEventListener('click', cancelLoading);
  q('[data-model3d-clear]').addEventListener('click', () => { clearModel(); fileInput.value = ''; setStatus(f.ready); });
  window.addEventListener('pagehide', clearModel, { once: true });
}
