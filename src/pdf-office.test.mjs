import test from 'node:test';
import assert from 'node:assert/strict';
import { strToU8, unzipSync, zipSync } from 'fflate';
import { createImageSlidesPptx, createXlsx, pdfTextPagesToRows, pptxToPrintHtml, xlsxToPrintHtml } from './pdf-office.mjs';
import { inspectOfficePackage } from './office-package-logic.mjs';

test('PDF text items are grouped into page-aware spreadsheet rows in visual order', () => {
  const rows = pdfTextPagesToRows([
    [
      { str: 'Name', x: 10, y: 100, width: 28, height: 10 },
      { str: 'Alice', x: 10, y: 80, width: 25, height: 10 },
      { str: '42', x: 120, y: 80, width: 12, height: 10 },
    ],
    [{ str: 'Second page', x: 10, y: 100, width: 58, height: 10 }],
  ]);
  assert.deepEqual(rows, [['PDF page', 'Extracted text'], ['1', 'Name'], ['1', 'Alice', '42'], ['2', 'Second page']]);
});

test('PDF text to XLSX emits a readable OOXML workbook with escaped Unicode values', () => {
  const bytes = createXlsx([['PDF page', 'Extracted text'], ['1', 'Café & tea <3']]);
  const inspection = inspectOfficePackage(bytes, 'xlsx');
  assert.equal(inspection.extension, 'xlsx');
  const html = xlsxToPrintHtml(bytes, 'Sample.pdf-extracted.xlsx');
  assert.match(html, /Café &amp; tea &lt;3/u);
  assert.match(html, /Sample/u);
});

test('XLSX print parser handles shared strings, inline strings, sparse cells and escapes HTML', () => {
  const files = {
    '[Content_Types].xml': strToU8('<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/></Types>'),
    '_rels/.rels': strToU8('<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'),
    'xl/workbook.xml': strToU8('<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Data" sheetId="1" r:id="rId1"/></sheets></workbook>'),
    'xl/_rels/workbook.xml.rels': strToU8('<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'),
    'xl/sharedStrings.xml': strToU8('<sst><si><t>Safe &amp; sound</t></si></sst>'),
    'xl/worksheets/sheet1.xml': strToU8('<worksheet><sheetData><row r="1"><c r="A1" t="s"><v>0</v></c><c r="C1" t="inlineStr"><is><t>&lt;script&gt;</t></is></c></row></sheetData></worksheet>'),
  };
  const html = xlsxToPrintHtml(zipSync(files), 'input.xlsx');
  assert.match(html, /Safe &amp; sound/u);
  assert.match(html, /&lt;script&gt;/u);
  assert.doesNotMatch(html, /<script>/u);
});

test('PDF image pages create a valid PPTX package and local slide print view', () => {
  const tinyPng = new Uint8Array(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/7kQAAAAASUVORK5CYII=', 'base64'));
  const bytes = createImageSlidesPptx([{ bytes: tinyPng }, { bytes: tinyPng }]);
  const inspection = inspectOfficePackage(bytes, 'pptx');
  assert.equal(inspection.extension, 'pptx');
  const files = unzipSync(bytes);
  assert.ok(files['ppt/slides/slide1.xml']);
  assert.ok(files['ppt/slides/slide2.xml']);
  assert.ok(files['ppt/media/page1.png']);
  assert.deepEqual(files['ppt/media/page1.png'], tinyPng);
  const html = pptxToPrintHtml(bytes, 'visual.pdf-slides.pptx');
  assert.equal((html.match(/class="slide"/gu) ?? []).length, 2);
  assert.throws(() => createImageSlidesPptx([{ bytes: Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]), width: 1, height: 1 }]), /complete PNG/u);
});

test('Office parsers reject unsupported packages and excessive output sizes', () => {
  assert.throws(() => xlsxToPrintHtml(new Uint8Array(40), 'fake.xlsx'));
  assert.throws(() => createXlsx([['header']]), /readable rows/u);
  assert.throws(() => createImageSlidesPptx([]), /1–100 pages/u);
});
