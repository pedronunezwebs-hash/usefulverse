import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function mountModel3dViewer(root, file, meshes, copy, unitLabel) {
  const f = copy.fields;
  const q = (selector) => root.querySelector(selector);
  const stage = q('[data-model3d-stage]');
  const status = q('[data-model3d-status]');
  const info = q('[data-model3d-info]');
  const metadata = q('[data-model3d-metadata]');
  let renderer; let scene; let camera; let controls; let resizeObserver;
  const events = new AbortController();
  const { signal } = events;
  let currentName = file.name.replace(/\.[^.]+$/u, '') || 'model';

  const formatNumber = (value) => new Intl.NumberFormat(document.documentElement.lang, { maximumFractionDigits: 4 }).format(value);
  const appendMetadata = (label, value) => {
    const term = document.createElement('dt'); term.textContent = label;
    const description = document.createElement('dd'); description.textContent = value;
    metadata.append(term, description);
  };
  const dispose = () => {
    resizeObserver?.disconnect();
    events.abort();
    controls?.dispose();
    scene?.traverse((item) => {
      item.geometry?.dispose();
      if (Array.isArray(item.material)) item.material.forEach((material) => material.dispose());
      else item.material?.dispose();
    });
    renderer?.dispose(); renderer?.domElement.remove();
    renderer = null; scene = null; camera = null; controls = null;
    info.hidden = true; metadata.replaceChildren();
    for (const button of root.querySelectorAll('[data-model3d-fit], [data-model3d-screenshot], [data-model3d-clear], [data-model3d-rotate], [data-model3d-zoom]')) button.disabled = true;
    stage.replaceChildren(document.createTextNode(f.ready));
  };
  const fit = () => {
    if (!scene || !camera || !controls) return;
    const bounds = new THREE.Box3().setFromObject(scene);
    const size = bounds.getSize(new THREE.Vector3()); const center = bounds.getCenter(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z, 0.001);
    controls.target.copy(center);
    camera.position.copy(center).add(new THREE.Vector3(maxDimension * 1.7, maxDimension * 1.35, maxDimension * 1.7));
    camera.near = maxDimension / 10000; camera.far = maxDimension * 100;
    camera.updateProjectionMatrix(); controls.update();
  };
  const rotate = (direction) => {
    const offset = camera.position.clone().sub(controls.target);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    if (direction === 'left') spherical.theta -= Math.PI / 12;
    if (direction === 'right') spherical.theta += Math.PI / 12;
    if (direction === 'up') spherical.phi = Math.max(0.08, spherical.phi - Math.PI / 12);
    if (direction === 'down') spherical.phi = Math.min(Math.PI - 0.08, spherical.phi + Math.PI / 12);
    camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical)); controls.update();
  };
  const zoom = (direction) => {
    camera.position.sub(controls.target).multiplyScalar(direction === 'in' ? 0.8 : 1.25).add(controls.target); controls.update();
  };

  try { renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: 'low-power' }); }
  catch { throw new Error('renderUnsupported'); }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(Math.max(stage.clientWidth, 1), Math.max(Math.min(stage.clientWidth * 0.62, 560), 260));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  scene = new THREE.Scene(); scene.background = new THREE.Color('#141b27');
  camera = new THREE.PerspectiveCamera(42, 1, 0.001, 100000);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x445066, 2.1));
  const light = new THREE.DirectionalLight(0xffffff, 2.3); light.position.set(4, 8, 6); scene.add(light);
  const model = new THREE.Group(); let totalVertices = 0; let totalTriangles = 0;
  for (const item of meshes) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(item.positions), 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(item.normals), 3));
    if (item.indices) geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(item.indices), 1));
    geometry.computeBoundingBox();
    const material = new THREE.MeshStandardMaterial({ color: 0x8bc7ff, metalness: 0.12, roughness: 0.48, side: THREE.DoubleSide });
    model.add(new THREE.Mesh(geometry, material));
    totalVertices += item.vertices; totalTriangles += item.triangles;
  }
  scene.add(model);
  const bounds = new THREE.Box3().setFromObject(model); const size = bounds.getSize(new THREE.Vector3()); const center = bounds.getCenter(new THREE.Vector3());
  appendMetadata(f.bounds, `${formatNumber(size.x)} × ${formatNumber(size.y)} × ${formatNumber(size.z)}`);
  appendMetadata(f.units, unitLabel);
  appendMetadata(f.triangles, formatNumber(totalTriangles)); appendMetadata(f.vertices, formatNumber(totalVertices));
  appendMetadata(f.meshes, formatNumber(meshes.length)); appendMetadata(f.fileSize, `${formatNumber(file.size / 1024)} KB`);
  const bufferBytes = meshes.reduce((sum, item) => sum + item.positions.byteLength + item.normals.byteLength + (item.indices?.byteLength ?? 0), 0);
  appendMetadata(f.bufferEstimate, `${formatNumber(bufferBytes / (1024 * 1024))} MB`);
  stage.replaceChildren(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.08; controls.target.copy(center);
  resizeObserver = new ResizeObserver(() => {
    if (!renderer || !camera) return;
    const width = Math.max(stage.clientWidth, 1);
    renderer.setSize(width, Math.max(Math.min(width * 0.62, 560), 260));
    camera.aspect = width / Math.max(renderer.domElement.height / renderer.getPixelRatio(), 1);
    camera.updateProjectionMatrix();
  });
  resizeObserver.observe(stage);
  const animate = () => { if (renderer) { controls?.update(); renderer.render(scene, camera); requestAnimationFrame(animate); } };
  fit(); info.hidden = false;
  for (const button of root.querySelectorAll('[data-model3d-fit], [data-model3d-screenshot], [data-model3d-clear], [data-model3d-rotate], [data-model3d-zoom]')) button.disabled = false;
  q('[data-model3d-fit]').addEventListener('click', fit, { signal });
  root.querySelectorAll('[data-model3d-rotate]').forEach((button) => button.addEventListener('click', () => rotate(button.dataset.model3dRotate), { signal }));
  root.querySelectorAll('[data-model3d-zoom]').forEach((button) => button.addEventListener('click', () => zoom(button.dataset.model3dZoom), { signal }));
  q('[data-model3d-screenshot]').addEventListener('click', () => {
    renderer?.domElement.toBlob((blob) => {
      if (!blob) { status.textContent = f.screenshotUnavailable; status.classList.add('result--error'); return; }
      const url = URL.createObjectURL(blob); const link = document.createElement('a');
      link.href = url; link.download = `${currentName}-view.png`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = f.screenshotSaved; status.classList.remove('result--error');
    }, 'image/png');
  }, { signal });
  animate();
  return { dispose };
}
