let runtime;
const send = (message) => postMessage(message);

self.addEventListener('message', async ({ data }) => {
  if (data?.type !== 'subset' || runtime) return;
  try {
    const base = new URL('/assets/pyodide-314.0.7/', self.location.origin);
    const module = await import(new URL('pyodide.mjs', base));
    runtime = await module.loadPyodide({ indexURL: base.href });
    await runtime.loadPackage('fonttools');
    runtime.FS.writeFile('/tmp/input-font.bin', new Uint8Array(data.bytes));
    const py = `import io, json
from fontTools.ttLib import TTFont
from fontTools.subset import Options, Subsetter
raw = open('/tmp/input-font.bin', 'rb').read()
text = ${JSON.stringify(data.text)}
font = TTFont(io.BytesIO(raw), recalcBBoxes=True, recalcTimestamp=False)
before = len(font.getBestCmap() or {})
options = Options()
options.recalc_timestamp = False
subsetter = Subsetter(options=options)
subsetter.populate(text=text)
subsetter.subset(font)
after = len(font.getBestCmap() or {})
missing = sorted(set(map(ord, text)) - set((font.getBestCmap() or {}).keys()))
if missing: raise ValueError('One or more requested characters are absent from this font.')
out = io.BytesIO()
font.save(out)
result = out.getvalue()
check = TTFont(io.BytesIO(result), recalcTimestamp=False)
if not set(map(ord, text)).issubset(set((check.getBestCmap() or {}).keys())):
    raise ValueError('The exported font did not retain every requested character.')
if check.flavor != font.flavor:
    raise ValueError('The exported font format changed unexpectedly.')
open('/tmp/output-font.bin', 'wb').write(result)
json.dumps({'before': before, 'after': after, 'bytes': len(result)})`;
    const result = JSON.parse(runtime.runPython(py));
    const bytes = runtime.FS.readFile('/tmp/output-font.bin');
    send({ type: 'result', bytes: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), before: result.before, after: result.after, outputBytes: result.bytes }, [bytes.buffer]);
  } catch (error) {
    send({ type: 'error', message: String(error?.message || error).slice(0, 500) });
  }
});
