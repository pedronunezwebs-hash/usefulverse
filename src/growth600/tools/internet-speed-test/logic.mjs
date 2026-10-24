const PROBE_PATH = '/assets/speed-test-probe.bin';
const LATENCY_PATH = '/favicon.svg';
const SAMPLE_BYTES = 512 * 1024;
const LATENCY_REQUESTS = 5;
const DOWNLOAD_SAMPLES = 3;

function uniqueQuery(url, index) {
  url.searchParams.set('uv-speed-check', `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 10)}`);
  return url;
}

async function fetchAsset(path, index, expectedBytes, timeoutMs) {
  const url = uniqueQuery(new URL(path, location.origin), index);
  const started = performance.now();
  let response;
  try {
    response = await fetch(url, {
      method: 'GET', mode: 'same-origin', credentials: 'omit', cache: 'no-store',
      redirect: 'error', referrerPolicy: 'no-referrer', headers: { Accept: 'application/octet-stream,image/svg+xml' },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    if (error?.name === 'TimeoutError') throw error;
    throw new TypeError('The local speed-test asset could not be reached.');
  }
  if (!response.ok) throw new TypeError('The local speed-test asset is unavailable.');
  if (expectedBytes && !response.headers.get('content-type')?.toLowerCase().includes('application/octet-stream')) throw new TypeError('The speed-test file returned an unsupported response.');
  const limit = expectedBytes || 20_000;
  const declaredLength = Number(response.headers.get('content-length') || 0);
  if (declaredLength > limit) throw new TypeError('The speed-test response exceeded the size limit.');
  let byteLength = 0;
  if (response.body?.getReader) {
    const reader = response.body.getReader();
    try {
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        byteLength += chunk.value.byteLength;
        if (byteLength > limit) { await reader.cancel(); throw new TypeError('The speed-test response exceeded the size limit.'); }
      }
    } finally { reader.releaseLock(); }
  } else {
    byteLength = (await response.arrayBuffer()).byteLength;
    if (byteLength > limit) throw new TypeError('The speed-test response exceeded the size limit.');
  }
  if (expectedBytes && byteLength !== expectedBytes) throw new TypeError('The speed-test file has an unexpected size.');
  return { elapsedMs: Math.max(performance.now() - started, 0.1), byteLength };
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

export async function runInternetSpeedCheck(onProgress = () => {}) {
  if (typeof location === 'undefined' || !/^https?:$/u.test(location.protocol)) throw new TypeError('This speed check requires a web page.');
  const roundTrips = [];
  let bytesReceived = 0;
  onProgress('latency');
  for (let index = 0; index < LATENCY_REQUESTS; index += 1) {
    const sample = await fetchAsset(LATENCY_PATH, index, 0, 5000);
    bytesReceived += sample.byteLength;
    if (index > 0) roundTrips.push(sample.elapsedMs);
  }
  onProgress('download');
  const rates = [];
  for (let index = 0; index < DOWNLOAD_SAMPLES; index += 1) {
    onProgress('sample', index + 1, DOWNLOAD_SAMPLES);
    const sample = await fetchAsset(PROBE_PATH, index, SAMPLE_BYTES, 10000);
    bytesReceived += sample.byteLength;
    rates.push((sample.byteLength * 8) / (sample.elapsedMs / 1000) / 1_000_000);
  }
  const jitter = roundTrips.slice(1).reduce((sum, value, index) => sum + Math.abs(value - roundTrips[index]), 0) / Math.max(roundTrips.length - 1, 1);
  return Object.freeze({
    downloadMbps: median(rates),
    sampleMbps: Object.freeze(rates),
    latencyMs: median(roundTrips),
    jitterMs: jitter,
    bytesReceived,
    completedAt: new Date().toISOString(),
  });
}
