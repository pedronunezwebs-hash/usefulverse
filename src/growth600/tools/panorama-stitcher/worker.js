let cvPromise;

function loadCv() {
  if (!cvPromise) {
    cvPromise = new Promise((resolve, reject) => {
      let readyTimer;
      let timeout;
      let settled = false;
      const finish = (error) => {
        if (settled) return;
        settled = true;
        clearInterval(readyTimer);
        clearTimeout(timeout);
        if (error) { reject(error); return; }
        // OpenCV.js exposes a thenable module object that resolves to itself. Passing it
        // directly to a native Promise resolver causes endless thenable assimilation.
        const runtime = self.cv;
        const api = Object.create(null);
        for (const key of Object.getOwnPropertyNames(runtime)) {
          if (key !== 'then') Object.defineProperty(api, key, Object.getOwnPropertyDescriptor(runtime, key));
        }
        resolve(api);
      };
      try {
        importScripts('/assets/panorama-stitcher/opencv-4.12.0.js');
        const module = self.cv;
        if (!module) throw new Error('OpenCV module unavailable');
        if (module.Mat) { finish(); return; }
        // Emscripten can finish between importScripts returning and handler registration.
        // Poll for the exported API as well as listening for its callback to avoid that race.
        const previous = module.onRuntimeInitialized;
        module.onRuntimeInitialized = () => { try { previous?.(); } finally { finish(); } };
        readyTimer = setInterval(() => { if (self.cv?.Mat) finish(); }, 50);
        timeout = setTimeout(() => finish(new Error('opencv-init-timeout')), 60_000);
      } catch (error) { finish(error); }
    });
  }
  return cvPromise;
}

function point(matrix, index) {
  const item = matrix.get(index);
  return item.pt ?? item;
}

function releaseAll(items) {
  for (const item of items) { try { item?.delete?.(); } catch {} }
}

function transformPoint(h, x, y) {
  const m = h.data64F?.length ? h.data64F : h.data32F;
  const d = m[6] * x + m[7] * y + m[8];
  return { x: (m[0] * x + m[1] * y + m[2]) / d, y: (m[3] * x + m[4] * y + m[5]) / d };
}

function median(values) {
  if (!values.length) return 1;
  values.sort((a, b) => a - b);
  return values[Math.floor(values.length / 2)];
}

function stitch(cv, leftData, rightData) {
  const created = [];
  const own = (value) => { created.push(value); return value; };
  try {
    const left = own(cv.matFromImageData(new ImageData(new Uint8ClampedArray(leftData.data), leftData.width, leftData.height)));
    const right = own(cv.matFromImageData(new ImageData(new Uint8ClampedArray(rightData.data), rightData.width, rightData.height)));
    const grayLeft = own(new cv.Mat()), grayRight = own(new cv.Mat());
    cv.cvtColor(left, grayLeft, cv.COLOR_RGBA2GRAY); cv.cvtColor(right, grayRight, cv.COLOR_RGBA2GRAY);
    const detector = own(new cv.ORB(1800, 1.2, 8, 31, 0, 2, cv.ORB_HARRIS_SCORE, 31, 20));
    const keyLeft = own(new cv.KeyPointVector()), keyRight = own(new cv.KeyPointVector());
    const descLeft = own(new cv.Mat()), descRight = own(new cv.Mat());
    self.postMessage({ type: 'progress', message: 'finding-features' });
    detector.detectAndCompute(grayLeft, new cv.Mat(), keyLeft, descLeft);
    detector.detectAndCompute(grayRight, new cv.Mat(), keyRight, descRight);
    if (descLeft.empty() || descRight.empty()) throw new Error('few-features');
    self.postMessage({ type: 'progress', message: 'matching-features' });
    const matcher = own(new cv.BFMatcher(cv.NORM_HAMMING, true));
    const matches = own(new cv.DMatchVector());
    matcher.match(descLeft, descRight, matches);
    const sorted = Array.from({ length: matches.size() }, (_, i) => matches.get(i)).sort((a, b) => a.distance - b.distance);
    const good = sorted.filter((match) => match.distance <= Math.max(38, (sorted[0]?.distance ?? 0) * 2.6)).slice(0, 400);
    if (good.length < 14) throw new Error('few-matches');
    const sourcePoints = own(new cv.Mat(good.length, 1, cv.CV_32FC2));
    const targetPoints = own(new cv.Mat(good.length, 1, cv.CV_32FC2));
    for (let i = 0; i < good.length; i += 1) {
      const a = point(keyLeft, good[i].queryIdx), b = point(keyRight, good[i].trainIdx);
      sourcePoints.data32F[i * 2] = a.x; sourcePoints.data32F[i * 2 + 1] = a.y;
      targetPoints.data32F[i * 2] = b.x; targetPoints.data32F[i * 2 + 1] = b.y;
    }
    const mask = own(new cv.Mat());
    const homography = own(cv.findHomography(sourcePoints, targetPoints, cv.RANSAC, 4, mask));
    self.postMessage({ type: 'progress', message: 'composing' });
    if (homography.empty()) throw new Error('alignment-failed');
    let inliers = 0;
    for (let i = 0; i < mask.data.length; i += 1) if (mask.data[i]) inliers += 1;
    if (inliers < 10) throw new Error('alignment-weak');
    const corners = [transformPoint(homography, 0, 0), transformPoint(homography, left.cols, 0), transformPoint(homography, left.cols, left.rows), transformPoint(homography, 0, left.rows), {x:0,y:0},{x:right.cols,y:0},{x:right.cols,y:right.rows},{x:0,y:right.rows}];
    const minX = Math.floor(Math.min(...corners.map(p => p.x))), minY = Math.floor(Math.min(...corners.map(p => p.y)));
    const maxX = Math.ceil(Math.max(...corners.map(p => p.x))), maxY = Math.ceil(Math.max(...corners.map(p => p.y)));
    const width = maxX - minX, height = maxY - minY;
    if (!Number.isSafeInteger(width * height) || width < 1 || height < 1 || width * height > 30_000_000) throw new Error('panorama-too-large');
    const shift = own(cv.Mat.eye(3, 3, cv.CV_64F)); shift.data64F[2] = -minX; shift.data64F[5] = -minY;
    const shifted = own(new cv.Mat()), zero = own(new cv.Mat()); cv.gemm(shift, homography, 1, zero, 0, shifted);
    const warped = own(new cv.Mat());
    cv.warpPerspective(left, warped, shifted, new cv.Size(width, height), cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar(0,0,0,0));
    const outputCanvas = new OffscreenCanvas(width, height); const context = outputCanvas.getContext('2d', { willReadFrequently: true });
    const rightCanvas = new OffscreenCanvas(right.cols, right.rows); rightCanvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(rightData.data), right.cols, right.rows), 0, 0);
    context.drawImage(rightCanvas, -minX, -minY);
    const base = context.getImageData(0, 0, width, height); const a = warped.data; const b = base.data;
    const ratios = [[], [], []];
    for (let y = 0; y < height; y += 8) for (let x = 0; x < width; x += 8) {
      const i = (y * width + x) * 4;
      if (a[i+3] > 220 && b[i+3] > 220) for (let c = 0; c < 3; c += 1) if (a[i+c] > 16 && b[i+c] > 16) ratios[c].push(b[i+c] / a[i+c]);
    }
    if (ratios[0].length < 40) throw new Error('overlap-too-small');
    const gains = ratios.map(values => Math.max(0.55, Math.min(1.8, median(values))));
    for (let i = 0; i < b.length; i += 4) {
      if (a[i+3] > 0 && b[i+3] > 0) {
        for (let c = 0; c < 3; c += 1) b[i+c] = Math.round(Math.min(255, (a[i+c] * gains[c] + b[i+c]) / 2));
        b[i+3] = 255;
      } else if (a[i+3] > 0) {
        for (let c = 0; c < 3; c += 1) b[i+c] = Math.round(Math.min(255, a[i+c] * gains[c]));
        b[i+3] = 255;
      }
    }
    context.putImageData(base, 0, 0);
    return outputCanvas.convertToBlob({ type: 'image/jpeg', quality: 0.92 }).then(blob => ({ blob, width, height, matches: good.length, inliers, gains }));
  } finally { releaseAll(created); }
}

self.addEventListener('message', async (event) => {
  try {
    self.postMessage({ type: 'progress', message: 'loading-engine' });
    const cv = await loadCv();
    self.postMessage({ type: 'progress', message: 'aligning' });
    const result = await stitch(cv, event.data.left, event.data.right);
    const buffer = await result.blob.arrayBuffer();
    self.postMessage({ type: 'result', buffer, width: result.width, height: result.height, matches: result.matches, inliers: result.inliers }, [buffer]);
  } catch (error) {
    const code = error?.message || 'stitch-failed';
    self.postMessage({ type: 'error', code });
  }
});
