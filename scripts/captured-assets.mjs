import { createHash } from 'node:crypto';
import { basename } from 'node:path';
const prefix = 'assets/recovered-live-only-106/published/assets/vendor/';
const responseSHA = 'ad18e27d5cd0b990fe6b6bd810e49717d177ad040fba2a4abfb5192acdae4b6f';
const capturedHTML = new Set([prefix + 'pdf.worker.mjs', prefix + 'qcms_bg.js']);
// Reviewed references are PDF.js's Node-only default, a source-map comment,
// and WebAssembly import-module keys, not browser requests to these files.
// Pin complete referring bytes: changed/new code requires another review.
const reviewed = new Map([
  ['assets/vendor/pdf.min.mjs', 'f401927e692efc7735e0cd528c490d0dd31b7f0972c122b7040df805be45cce4'],
  ['assets/vendor/pdf.worker.min.mjs', 'a33cfe728c584fdba4fcc1fd54bcdc2f9f2f13889ddbb5b2bd1d0f8cbe49b84e'],
  ['assets/market-tools/vendor/pdf.min.mjs', '495588717f62303a839e91a5343deebf1b41f52e2f9f6361e73dee6ea6a4355e'],
  ['assets/market-tools/vendor/pdf.worker.min.mjs', 'f2870db902eaff8397442c912b69459980ac91f6f4b5ed827167b12cf7057930'],
  [prefix + 'extract-images-pdf-engine.mjs', '1cbff22f30731e9c7e8e01b8385b73a7fedf39684546c3f477f271315574cf12'],
  [prefix + 'extract-images-pdf-worker.mjs', 'f2870db902eaff8397442c912b69459980ac91f6f4b5ed827167b12cf7057930'],
]);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const unversion = text => text.replace(/(assets\/recovered-live-only-106\/)[a-f0-9]{24}\//gu, '$1');
export function capturedSoft404(path, bytes) {
  if (!/\.(?:m?js|css)$/iu.test(path) || !/^\s*(?:<!doctype\s+html|<html\b)/iu.test(bytes.toString('utf8'))) return false;
  if (!capturedHTML.has(unversion(path)) || sha(bytes) !== responseSHA) throw Error(`Unexpected HTML response masquerading as an asset: ${path}`);
  return true;
}
export function checkQuarantinedReferences(path, bytes, quarantined) {
  if (!quarantined.length) return;
  const text = unversion(bytes.toString('utf8'));
  const originalPath = unversion(path);
  for (const asset of quarantined) {
    if (text.includes(unversion(asset.path))) throw Error(`Reference to quarantined HTML asset: ${path}`);
    if (text.includes(basename(asset.path)) && reviewed.get(originalPath) !== sha(Buffer.from(text))) throw Error(`Unreviewed reference to quarantined asset: ${path}`);
  }
}
