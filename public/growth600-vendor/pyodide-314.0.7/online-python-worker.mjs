const pyodideRoot = new URL('/assets/pyodide-314.0.7/', self.location.origin).href;

self.postMessage({ type: 'loading' });

try {
  const { loadPyodide } = await import(`${pyodideRoot}pyodide.mjs`);
  const runtime = await loadPyodide({ indexURL: pyodideRoot });

  // Load the runtime first, then remove worker networking capabilities before user code runs.
  for (const name of ['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'importScripts', 'eval', 'Function', 'indexedDB', 'caches', 'BroadcastChannel', 'SharedWorker']) {
    try { Object.defineProperty(self, name, { configurable: false, writable: false, value: undefined }); } catch { /* unavailable on this browser */ }
  }
  self.onmessage = async ({ data }) => {
    if (data?.type !== 'run') return;
    const output = [];
    const push = (value) => {
      if (output.join('').length < 24000) output.push(String(value).slice(0, 24000));
    };
    runtime.setStdout({ batched: push }); runtime.setStderr({ batched: push });
    const inputLines = String(data.stdin ?? '').split(/\r?\n/u);
    let inputIndex = 0;
    runtime.setStdin({ stdin: () => inputIndex < inputLines.length ? inputLines[inputIndex++] : null });
    let ok = true;
    try { await runtime.runPythonAsync(String(data.code ?? '')); }
    catch (error) { ok = false; push(error?.message ?? 'Python execution failed.'); }
    self.postMessage({ type: 'result', ok, output: output.join('').slice(0, 24000) });
  };
  self.postMessage({ type: 'ready' });
} catch {
  self.postMessage({ type: 'error' });
}
