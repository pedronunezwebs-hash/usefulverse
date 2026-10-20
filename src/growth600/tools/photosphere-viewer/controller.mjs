import { isEquirectangularSize, validatePanoramaFile } from './logic.mjs';

const root = document.querySelector('[data-tool="photosphere-viewer"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const make = (tag, text, className) => { const element = document.createElement(tag); if (text !== undefined) element.textContent = String(text); if (className) element.className = className; return element; };
  let bitmap = null;
  let gl = null;
  let texture = null;
  let program = null;
  let uniformResolution = null;
  let uniformYaw = null;
  let uniformPitch = null;
  let uniformFov = null;
  let yaw = 0;
  let pitch = 0;
  let fov = 75;
  let canvas = null;
  let resizeObserver = null;

  function setStatus(message, error = false) {
    status.textContent = message;
    status.classList.toggle('status--error', error);
  }
  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(message || 'shader-error');
    }
    return shader;
  }
  function draw() {
    if (!gl || !program || !canvas) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
    const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    gl.viewport(0, 0, width, height);
    gl.useProgram(program);
    gl.uniform2f(uniformResolution, width, height);
    gl.uniform1f(uniformYaw, yaw * Math.PI / 180);
    gl.uniform1f(uniformPitch, pitch * Math.PI / 180);
    gl.uniform1f(uniformFov, fov * Math.PI / 180);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function initializeGL() {
    gl = canvas.getContext('webgl', { alpha: false, antialias: true, preserveDrawingBuffer: false });
    if (!gl) throw Object.assign(new Error('WebGL unavailable.'), { code: 'webgl-unavailable' });
    const vertex = compileShader(gl.VERTEX_SHADER, 'attribute vec2 p; void main(){gl_Position=vec4(p,0.0,1.0);}');
    const fragmentSource = `precision highp float;uniform vec2 resolution;uniform float yaw;uniform float pitch;uniform float fov;uniform sampler2D pano;const float PI=3.141592653589793;void main(){vec2 p=(gl_FragCoord.xy/resolution)*2.0-1.0;p.y=-p.y;p.x*=resolution.x/resolution.y;float focal=1.0/tan(fov*0.5);vec3 forward=vec3(sin(yaw)*cos(pitch),sin(pitch),cos(yaw)*cos(pitch));vec3 right=normalize(vec3(forward.z,0.0,-forward.x));vec3 up=normalize(cross(right,forward));vec3 direction=normalize(forward*focal+right*p.x+up*p.y);float longitude=atan(direction.x,direction.z);float latitude=asin(clamp(direction.y,-1.0,1.0));vec2 uv=vec2(longitude/(2.0*PI)+0.5,latitude/PI+0.5);gl_FragColor=texture2D(pano,uv);}`;
    const fragment = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    program = gl.createProgram(); gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'program-error');
    gl.deleteShader(vertex); gl.deleteShader(fragment);
    gl.useProgram(program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'p'); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    uniformResolution = gl.getUniformLocation(program, 'resolution'); uniformYaw = gl.getUniformLocation(program, 'yaw'); uniformPitch = gl.getUniformLocation(program, 'pitch'); uniformFov = gl.getUniformLocation(program, 'fov');
    texture = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(gl.getUniformLocation(program, 'pano'), 0);
    resizeObserver = new ResizeObserver(draw); resizeObserver.observe(canvas);
  }
  function addRangeControl(parent, key, min, max, initial, change) {
    const field = make('div', undefined, 'field');
    const input = make('input'); input.type = 'range'; input.min = String(min); input.max = String(max); input.value = String(initial); input.step = '1'; input.setAttribute('data-view-control', key);
    const label = make('label', copy.fields[key]); label.htmlFor = `photosphere-${key}`; input.id = label.htmlFor;
    const value = make('output', `${initial}°`, 'photosphere-value'); value.htmlFor = input.id;
    input.addEventListener('input', () => { const next = Number(input.value); change(next); value.value = `${next}°`; value.textContent = `${next}°`; draw(); });
    field.append(label, input, value); parent.append(field);
  }
  function clearViewer() {
    resizeObserver?.disconnect(); resizeObserver = null;
    if (gl && texture) gl.deleteTexture(texture);
    if (gl && program) gl.deleteProgram(program);
    if (bitmap) bitmap.close(); bitmap = null;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    gl = null; texture = null; program = null; canvas = null;
  }
  async function loadImage(event) {
    event.preventDefault(); clearViewer(); content.replaceChildren(); result.hidden = true; setStatus(copy.messages.loading);
    try {
      const file = form.elements.namedItem('imageFile').files?.[0];
      validatePanoramaFile(file);
      bitmap = await createImageBitmap(file);
      const imageWidth = bitmap.width; const imageHeight = bitmap.height;
      const warning = !isEquirectangularSize(bitmap.width, bitmap.height);
      canvas = make('canvas', undefined, 'photosphere-canvas');
      canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', copy.fields.canvasLabel); canvas.tabIndex = 0;
      const stage = make('div', undefined, 'photosphere-stage'); stage.append(canvas); content.append(stage);
      const controls = make('div', undefined, 'photosphere-controls');
      addRangeControl(controls, 'yaw', -180, 180, 0, (value) => { yaw = value; });
      addRangeControl(controls, 'pitch', -80, 80, 0, (value) => { pitch = value; });
      addRangeControl(controls, 'fieldOfView', 45, 110, 75, (value) => { fov = value; });
      const reset = make('button', copy.fields.resetView, 'button button--secondary'); reset.type = 'button'; reset.addEventListener('click', () => { yaw = 0; pitch = 0; fov = 75; controls.querySelector('[data-view-control="yaw"]').value = '0'; controls.querySelector('[data-view-control="pitch"]').value = '0'; controls.querySelector('[data-view-control="fieldOfView"]').value = '75'; for (const output of controls.querySelectorAll('output')) { output.value = '0°'; output.textContent = '0°'; } controls.querySelectorAll('output')[2].value = '75°'; controls.querySelectorAll('output')[2].textContent = '75°'; draw(); });
      controls.append(reset); content.append(controls);
      if (warning) content.append(make('p', copy.fields.projectionWarning, 'hint'));
      canvas.addEventListener('pointerdown', (pointer) => { canvas.setPointerCapture(pointer.pointerId); canvas.dataset.lastX = String(pointer.clientX); canvas.dataset.lastY = String(pointer.clientY); });
      canvas.addEventListener('pointermove', (pointer) => { if (!canvas.hasPointerCapture(pointer.pointerId)) return; const dx = pointer.clientX - Number(canvas.dataset.lastX); const dy = pointer.clientY - Number(canvas.dataset.lastY); canvas.dataset.lastX = String(pointer.clientX); canvas.dataset.lastY = String(pointer.clientY); yaw = ((yaw - dx * 0.25 + 180) % 360 + 360) % 360 - 180; pitch = Math.max(-80, Math.min(80, pitch + dy * 0.25)); controls.querySelector('[data-view-control="yaw"]').value = String(Math.round(yaw)); controls.querySelector('[data-view-control="pitch"]').value = String(Math.round(pitch)); controls.querySelectorAll('output')[0].value = `${Math.round(yaw)}°`; controls.querySelectorAll('output')[0].textContent = `${Math.round(yaw)}°`; controls.querySelectorAll('output')[1].value = `${Math.round(pitch)}°`; controls.querySelectorAll('output')[1].textContent = `${Math.round(pitch)}°`; draw(); });
      canvas.addEventListener('keydown', (key) => { if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(key.key)) return; key.preventDefault(); if (key.key === 'ArrowLeft') yaw -= 5; if (key.key === 'ArrowRight') yaw += 5; if (key.key === 'ArrowUp') pitch = Math.min(80, pitch + 5); if (key.key === 'ArrowDown') pitch = Math.max(-80, pitch - 5); controls.querySelector('[data-view-control="yaw"]').value = String(Math.round(yaw)); controls.querySelector('[data-view-control="pitch"]').value = String(Math.round(pitch)); controls.querySelectorAll('output')[0].value = `${Math.round(yaw)}°`; controls.querySelectorAll('output')[0].textContent = `${Math.round(yaw)}°`; controls.querySelectorAll('output')[1].value = `${Math.round(pitch)}°`; controls.querySelectorAll('output')[1].textContent = `${Math.round(pitch)}°`; draw(); });
      initializeGL();
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      if (imageWidth > maxTextureSize || imageHeight > maxTextureSize) throw Object.assign(new RangeError('Image exceeds the current graphics limit.'), { code: 'gpu-limit' });
      gl.bindTexture(gl.TEXTURE_2D, texture); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
      draw(); bitmap.close(); bitmap = null;
      result.hidden = false; setStatus(`${copy.messages.complete} ${copy.fields.imageDimensions}: ${imageWidth}×${imageHeight}`);
    } catch (error) {
      clearViewer(); content.replaceChildren(); result.hidden = false;
      setStatus(copy.messages[error?.code] ?? copy.messages.decodeFailed, true);
    }
  }
  form.addEventListener('submit', loadImage);
  form.addEventListener('reset', () => queueMicrotask(() => { clearViewer(); content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
