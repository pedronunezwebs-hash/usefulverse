import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { capturedSoft404, checkQuarantinedReferences } from './captured-assets.mjs';
const prefix = 'assets/recovered-live-only-106/published/assets/vendor/';
const source = new URL('../src/growth600/live-only-106-source/', import.meta.url);
test('the two captured home responses must be quarantined rather than served as JavaScript', async () => {
  for (const name of ['pdf.worker.mjs', 'qcms_bg.js']) {
    const bytes = await readFile(new URL(prefix + name, source));
    assert.equal(capturedSoft404(prefix + name, bytes), true);
    assert.throws(() => capturedSoft404('assets/new.mjs', bytes), /masquerading/u);
  }
});
test('a different response or a new caller never inherits the quarantine review', () => {
  assert.throws(() => capturedSoft404(prefix + 'pdf.worker.mjs', Buffer.from('<!doctype html>new response')), /masquerading/u);
  assert.throws(() => checkQuarantinedReferences('assets/new.js', Buffer.from('new Worker("./pdf.worker.mjs")'), [{ path: prefix + 'pdf.worker.mjs' }]), /Unreviewed/u);
});
test('known WASM module keys and comments pass only with their complete reviewed bytes', async () => {
  const path = prefix + 'extract-images-pdf-worker.mjs';
  const bytes = await readFile(new URL(path, source)), quarantined = [{ path: prefix + 'pdf.worker.mjs' }, { path: prefix + 'qcms_bg.js' }];
  assert.equal(capturedSoft404(path, bytes), false); checkQuarantinedReferences(path, bytes, quarantined);
  assert.throws(() => checkQuarantinedReferences(path, Buffer.concat([bytes, Buffer.from('\n// changed')]), quarantined), /Unreviewed/u);
  assert.throws(() => checkQuarantinedReferences(path, Buffer.from(`import '/${prefix}qcms_bg.js'`), quarantined), /Reference/u);
});
