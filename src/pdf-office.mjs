import { strToU8, unzipSync, zipSync } from 'fflate';
import { inspectOfficePackage } from './office-package-logic.mjs';

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const PPTX_MIME = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
const xmlEscape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const decodeXml = (value) => String(value).replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/giu, (match, entity) => {
  const lower = entity.toLowerCase();
  if (lower === 'amp') return '&';
  if (lower === 'lt') return '<';
  if (lower === 'gt') return '>';
  if (lower === 'quot') return '"';
  if (lower === 'apos') return "'";
  const codepoint = lower.startsWith('#x') ? Number.parseInt(lower.slice(2), 16) : Number(lower.slice(1));
  return Number.isInteger(codepoint) && codepoint >= 0 && codepoint <= 0x10ffff ? String.fromCodePoint(codepoint) : match;
});

function groupLineItems(items) {
  const lines = [];
  for (const item of items) {
    const text = String(item.str ?? '').trim();
    if (!text) continue;
    const x = Number(item.x ?? item.transform?.[4] ?? 0);
    const y = Number(item.y ?? item.transform?.[5] ?? 0);
    const fontSize = Math.max(1, Number(item.fontSize ?? item.height ?? item.transform?.[3] ?? 10));
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    let line = lines.find((candidate) => Math.abs(candidate.y - y) <= Math.max(2, fontSize * 0.35));
    if (!line) {
      line = { y, items: [] };
      lines.push(line);
    }
    line.items.push({ text, x, width: Math.max(0, Number(item.width ?? fontSize * text.length * 0.45)), fontSize });
  }
  return lines.sort((a, b) => b.y - a.y).map(({ items: lineItems }) => {
    const cells = [];
    for (const item of lineItems.sort((a, b) => a.x - b.x)) {
      const current = cells.at(-1);
      const gap = current ? item.x - current.end : Infinity;
      const joinGap = Math.max(3, item.fontSize * 0.28);
      if (current && gap <= joinGap) {
        current.text += `${gap > 0 ? ' ' : ''}${item.text}`;
        current.end = Math.max(current.end, item.x + item.width);
      } else {
        cells.push({ text: item.text, end: item.x + item.width });
      }
    }
    return cells.map(({ text }) => text.trim()).filter(Boolean);
  }).filter((row) => row.length);
}

/** Best-effort text-position extraction. It does not infer merged cells, formulas or table semantics. */
export function pdfTextPagesToRows(pages) {
  if (!Array.isArray(pages) || pages.length === 0) throw new TypeError('The PDF contains no readable pages.');
  const rows = [['PDF page', 'Extracted text']];
  pages.forEach((items, index) => {
    const lines = groupLineItems(items);
    for (const cells of lines) rows.push([String(index + 1), ...cells]);
  });
  if (rows.length === 1) throw new TypeError('No selectable text was found. Run OCR first for scanned pages.');
  return rows;
}

function columnName(index) {
  let value = index + 1;
  let name = '';
  while (value > 0) {
    value -= 1;
    name = String.fromCharCode(65 + (value % 26)) + name;
    value = Math.floor(value / 26);
  }
  return name;
}

function cellXml(value, reference) {
  const text = String(value ?? '');
  if (!text) return `<c r="${reference}"/>`;
  if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/u.test(text)) return `<c r="${reference}"><v>${text}</v></c>`;
  return `<c r="${reference}" t="inlineStr"><is><t xml:space="preserve">${xmlEscape(text)}</t></is></c>`;
}

export function createXlsx(rows, sheetName = 'Extracted PDF text') {
  if (!Array.isArray(rows) || rows.length < 2 || rows.length > 100_000) throw new RangeError('The spreadsheet needs readable rows and must contain fewer than 100,000 rows.');
  const maxColumns = Math.max(...rows.map((row) => row.length));
  if (maxColumns > 200) throw new RangeError('This PDF produced more than 200 columns. Narrow the document or use PDF to Word instead.');
  const safeSheetName = String(sheetName).replace(/[\\/?*\[\]:]/gu, ' ').trim().slice(0, 31) || 'Extracted text';
  const sheetRows = rows.map((row, rowIndex) => `<row r="${rowIndex + 1}">${row.map((value, columnIndex) => cellXml(value, `${columnName(columnIndex)}${rowIndex + 1}`)).join('')}</row>`).join('');
  const files = {
    '[Content_Types].xml': strToU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>'),
    '_rels/.rels': strToU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'),
    'xl/workbook.xml': strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${xmlEscape(safeSheetName)}" sheetId="1" r:id="rId1"/></sheets></workbook>`),
    'xl/_rels/workbook.xml.rels': strToU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'),
    'xl/worksheets/sheet1.xml': strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheetRows}</sheetData></worksheet>`),
  };
  return zipSync(files, { level: 6 });
}

function officeFiles(bytes, extension) {
  const inspection = inspectOfficePackage(bytes, extension);
  const files = unzipSync(bytes);
  const textPart = (path, limit = 8 * 1024 * 1024) => {
    const data = files[path];
    if (!data) return '';
    if (data.byteLength > limit) throw new RangeError('An Office XML part is larger than the local safety limit.');
    return new TextDecoder('utf-8', { fatal: false }).decode(data);
  };
  return { inspection, files, textPart };
}

function resolvePackagePath(base, target) {
  if (!target || target.startsWith('/') || target.includes('\\') || /^[a-z]+:/iu.test(target)) throw new TypeError('This Office file contains an unsupported external or absolute reference.');
  const stack = base.split('/').filter(Boolean);
  for (const segment of target.split('/')) {
    if (!segment || segment === '.') continue;
    if (segment === '..') {
      if (!stack.length) throw new TypeError('This Office file contains an invalid internal path.');
      stack.pop();
    } else stack.push(segment);
  }
  return stack.join('/');
}

function relationMap(xml) {
  const map = new Map();
  for (const [, attrs] of xml.matchAll(/<Relationship\b([^>]*)\/?\s*>/gu)) {
    const id = /\bId="([^"]+)"/u.exec(attrs)?.[1];
    const target = /\bTarget="([^"]+)"/u.exec(attrs)?.[1];
    const mode = /\bTargetMode="([^"]+)"/u.exec(attrs)?.[1];
    if (id && target && mode !== 'External') map.set(id, decodeXml(target));
  }
  return map;
}

function safeHtmlText(value) { return xmlEscape(value).replaceAll('&apos;', '&#39;'); }

/** Parse XLSX cell values for a local, print-friendly table. Formulas are not recalculated. */
export function xlsxToPrintHtml(input, filename = 'spreadsheet.xlsx') {
  const { files, textPart } = officeFiles(input, 'xlsx');
  const workbook = textPart('xl/workbook.xml');
  const workbookRelations = relationMap(textPart('xl/_rels/workbook.xml.rels'));
  if (!workbook || !workbookRelations.size) throw new TypeError('The workbook has no readable worksheets.');
  const sharedXml = textPart('xl/sharedStrings.xml');
  const shared = [...sharedXml.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/gu)].map(([, item]) => [...item.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/gu)].map(([, text]) => decodeXml(text)).join(''));
  const sheets = [];
  for (const [, attrs] of workbook.matchAll(/<sheet\b([^>]*)\/?\s*>/gu)) {
    if (sheets.length >= 20) throw new RangeError('This local print tool supports up to 20 worksheets at once.');
    const name = decodeXml(/\bname="([^"]+)"/u.exec(attrs)?.[1] ?? `Sheet ${sheets.length + 1}`);
    const relation = /\br:id="([^"]+)"/u.exec(attrs)?.[1];
    const target = workbookRelations.get(relation);
    if (!target) continue;
    const path = resolvePackagePath('xl', target);
    const xml = textPart(path);
    const rows = [];
    for (const [, rowXml] of xml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/gu)) {
      if (rows.length >= 2_000) throw new RangeError('This local print tool supports up to 2,000 rows per worksheet. Choose a smaller range.');
      const row = [];
      for (const [, cellAttrs, cellBodyValue, emptyCellAttrs] of rowXml.matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>|<c\b([^>]*)\/>/gu)) {
        const attrsText = cellAttrs ?? emptyCellAttrs;
        const cellBody = cellBodyValue ?? '';
        const reference = /\br="([A-Z]+)\d+"/u.exec(attrsText)?.[1];
        if (!reference) continue;
        const column = [...reference].reduce((sum, character) => sum * 26 + character.charCodeAt(0) - 64, 0) - 1;
        if (column > 199) throw new RangeError('This local print tool supports up to 200 columns per worksheet.');
        while (row.length <= column) row.push('');
        const type = /\bt="([^"]+)"/u.exec(attrsText)?.[1];
        const value = /<v\b[^>]*>([\s\S]*?)<\/v>/u.exec(cellBody)?.[1];
        if (type === 's' && value !== undefined) row[column] = shared[Number(value)] ?? '';
        else if (type === 'inlineStr') row[column] = [...cellBody.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/gu)].map(([, text]) => decodeXml(text)).join('');
        else row[column] = decodeXml(value ?? '');
      }
      rows.push(row);
    }
    if (rows.length) sheets.push({ name, rows });
  }
  if (!sheets.length) throw new TypeError('No printable spreadsheet values were found.');
  const title = safeHtmlText(filename.replace(/\.[^.]+$/u, ''));
  const sections = sheets.map(({ name, rows }) => `<section><h2>${safeHtmlText(name)}</h2><table><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${safeHtmlText(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></section>`).join('');
  return `<h1>${title}</h1>${sections}`;
}

function readPngDimensions(data) {
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  if (data.byteLength < 45 || signature.some((byte, index) => data[index] !== byte)) throw new TypeError('A rendered page is not a complete PNG image.');
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  if (view.getUint32(8) !== 13 || String.fromCharCode(...data.subarray(12, 16)) !== 'IHDR') throw new TypeError('A rendered page has an invalid PNG header.');
  const width = view.getUint32(16);
  const height = view.getUint32(20);
  if (!width || !height || width > 30_000 || height > 30_000) throw new RangeError('A rendered page has dimensions outside the local safety limit.');
  let offset = 8;
  let hasImageData = false;
  let hasEnd = false;
  while (offset + 12 <= data.byteLength) {
    const length = view.getUint32(offset);
    const type = String.fromCharCode(...data.subarray(offset + 4, offset + 8));
    const next = offset + 12 + length;
    if (next > data.byteLength) break;
    if (type === 'IDAT') hasImageData = true;
    if (type === 'IEND' && length === 0) { hasEnd = true; break; }
    offset = next;
  }
  if (!hasImageData || !hasEnd) throw new TypeError('A rendered page is missing required PNG image data.');
  return { width, height };
}

/** Create a standards-based PPTX with one full-slide PNG per PDF page (visual, not text-editable). */
export function createImageSlidesPptx(pages) {
  if (!Array.isArray(pages) || pages.length === 0 || pages.length > 100) throw new RangeError('Choose a PDF with 1–100 pages for the slide export.');
  const slideW = 12_192_000;
  const slideH = 6_858_000;
  const files = Object.create(null);
  let totalImageBytes = 0;
  let totalPixels = 0;
  const types = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/><Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/><Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/><Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>${pages.map((_, index) => `<Override PartName="/ppt/slides/slide${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join('')}</Types>`;
  files['[Content_Types].xml'] = strToU8(types);
  files['_rels/.rels'] = strToU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/></Relationships>');
  const slideIds = pages.map((_, index) => `<p:sldId id="${256 + index}" r:id="rId${index + 2}"/>`).join('');
  files['ppt/presentation.xml'] = strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst><p:sldIdLst>${slideIds}</p:sldIdLst><p:sldSz cx="${slideW}" cy="${slideH}" type="screen16x9"/><p:notesSz cx="${slideH}" cy="${slideW}"/></p:presentation>`);
  files['ppt/_rels/presentation.xml.rels'] = strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>${pages.map((_, index) => `<Relationship Id="rId${index + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${index + 1}.xml"/>`).join('')}</Relationships>`);
  const group = '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>';
  files['ppt/slideMasters/slideMaster1.xml'] = strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree>${group}</p:spTree></p:cSld><p:sldLayoutIdLst><p:sldLayoutId id="1" r:id="rId1"/></p:sldLayoutIdLst><p:clrMap accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" bg1="lt1" bg2="lt2" folHlink="folHlink" hlink="hlink" tx1="dk1" tx2="dk2"/></p:sldMaster>`);
  files['ppt/slideMasters/_rels/slideMaster1.xml.rels'] = strToU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/></Relationships>');
  files['ppt/slideLayouts/slideLayout1.xml'] = strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1"><p:cSld name="Blank"><p:spTree>${group}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`);
  files['ppt/slideLayouts/_rels/slideLayout1.xml.rels'] = strToU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>');
  files['ppt/theme/theme1.xml'] = strToU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="UsefulVerse"><a:themeElements><a:clrScheme name="UsefulVerse"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="44546A"/></a:dk2><a:lt2><a:srgbClr val="E7E6E6"/></a:lt2><a:accent1><a:srgbClr val="4472C4"/></a:accent1><a:accent2><a:srgbClr val="ED7D31"/></a:accent2><a:accent3><a:srgbClr val="A5A5A5"/></a:accent3><a:accent4><a:srgbClr val="FFC000"/></a:accent4><a:accent5><a:srgbClr val="5B9BD5"/></a:accent5><a:accent6><a:srgbClr val="70AD47"/></a:accent6><a:hlink><a:srgbClr val="0563C1"/></a:hlink><a:folHlink><a:srgbClr val="954F72"/></a:folHlink></a:clrScheme><a:fontScheme name="UsefulVerse"><a:majorFont><a:latin typeface="Arial"/></a:majorFont><a:minorFont><a:latin typeface="Arial"/></a:minorFont></a:fontScheme><a:fmtScheme name="UsefulVerse"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements></a:theme>');
  pages.forEach((page, index) => {
    const data = page.bytes instanceof Uint8Array ? page.bytes : new Uint8Array(page.bytes);
    if (data.byteLength < 8 || data.byteLength > 80 * 1024 * 1024) throw new RangeError('A rendered PDF page image is empty or exceeds the 80 MB per-page safety limit.');
    const { width: pageW, height: pageH } = readPngDimensions(data);
    totalImageBytes += data.byteLength;
    totalPixels += pageW * pageH;
    if (totalImageBytes > 100 * 1024 * 1024) throw new RangeError('The presentation images exceed the 100 MB local memory budget.');
    if (totalPixels > 30_000_000) throw new RangeError('The presentation exceeds the 30-megapixel local render budget.');
    const fit = Math.min(slideW / pageW, slideH / pageH);
    const cx = Math.round(pageW * fit);
    const cy = Math.round(pageH * fit);
    const x = Math.round((slideW - cx) / 2);
    const y = Math.round((slideH - cy) / 2);
    files[`ppt/media/page${index + 1}.png`] = data;
    files[`ppt/slides/slide${index + 1}.xml`] = strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree>${group}<p:pic><p:nvPicPr><p:cNvPr id="2" name="PDF page ${index + 1}"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="rId2"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr><a:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`);
    files[`ppt/slides/_rels/slide${index + 1}.xml.rels`] = strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/page${index + 1}.png"/></Relationships>`);
  });
  return zipSync(files, { level: 1 });
}

/** Build a safe, offline print view from text and raster assets in a modern PPTX package. */
export function pptxToPrintHtml(input, filename = 'slides.pptx') {
  const { files, textPart } = officeFiles(input, 'pptx');
  const presentation = textPart('ppt/presentation.xml');
  const size = /<p:sldSz\b[^>]*\bcx="(\d+)"[^>]*\bcy="(\d+)"/u.exec(presentation);
  const slideWidth = Number(size?.[1] ?? 12_192_000);
  const slideHeight = Number(size?.[2] ?? 6_858_000);
  const rels = relationMap(textPart('ppt/_rels/presentation.xml.rels'));
  const slideIds = [...presentation.matchAll(/<p:sldId\b[^>]*\br:id="([^"]+)"/gu)].map(([, id]) => id);
  if (!slideIds.length || slideIds.length > 200) throw new RangeError('This local print tool supports 1–200 slides.');
  const slides = [];
  for (const [index, id] of slideIds.entries()) {
    const target = rels.get(id);
    if (!target) continue;
    const path = resolvePackagePath('ppt', target);
    const xml = textPart(path);
    const slideRelsPath = path.replace(/[^/]+$/u, '_rels/$&.rels');
    const slideRels = relationMap(textPart(slideRelsPath));
    const safeXml = xml.replace(/<p:grpSp\b[\s\S]*?<\/p:grpSp>/gu, '');
    const shapes = [];
    for (const [, shape] of safeXml.matchAll(/<p:sp\b[^>]*>([\s\S]*?)<\/p:sp>/gu)) {
      const text = [...shape.matchAll(/<a:t\b[^>]*>([\s\S]*?)<\/a:t>/gu)].map(([, part]) => decodeXml(part)).join('');
      if (!text.trim()) continue;
      const position = /<a:xfrm\b[^>]*>[\s\S]*?<a:off\b[^>]*\bx="(-?\d+)"[^>]*\by="(-?\d+)"[^>]*\/>[\s\S]*?<a:ext\b[^>]*\bcx="(\d+)"[^>]*\bcy="(\d+)"/u.exec(shape);
      const [, x = '0', y = '0', cx = String(slideWidth), cy = String(slideHeight)] = position ?? [];
      shapes.push(`<div class="shape" style="left:${Number(x) / slideWidth * 100}%;top:${Number(y) / slideHeight * 100}%;width:${Number(cx) / slideWidth * 100}%;height:${Number(cy) / slideHeight * 100}%">${safeHtmlText(text)}</div>`);
    }
    for (const [, picture] of safeXml.matchAll(/<p:pic\b[^>]*>([\s\S]*?)<\/p:pic>/gu)) {
      const relationId = /<a:blip\b[^>]*\br:embed="([^"]+)"/u.exec(picture)?.[1];
      const imageTarget = slideRels.get(relationId);
      if (!imageTarget) continue;
      const imagePath = resolvePackagePath(path.replace(/\/[^/]+$/u, ''), imageTarget);
      const image = files[imagePath];
      if (!image || image.byteLength > 20 * 1024 * 1024) continue;
      const ext = imagePath.split('.').at(-1)?.toLowerCase();
      const mime = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif' }[ext];
      if (!mime) continue;
      const position = /<a:xfrm\b[^>]*>[\s\S]*?<a:off\b[^>]*\bx="(-?\d+)"[^>]*\by="(-?\d+)"[^>]*\/>[\s\S]*?<a:ext\b[^>]*\bcx="(\d+)"[^>]*\bcy="(\d+)"/u.exec(picture);
      const [, x = '0', y = '0', cx = String(slideWidth), cy = String(slideHeight)] = position ?? [];
      let binary = '';
      for (let cursor = 0; cursor < image.length; cursor += 0x8000) binary += String.fromCharCode(...image.subarray(cursor, cursor + 0x8000));
      shapes.push(`<img alt="" src="data:${mime};base64,${btoa(binary)}" style="left:${Number(x) / slideWidth * 100}%;top:${Number(y) / slideHeight * 100}%;width:${Number(cx) / slideWidth * 100}%;height:${Number(cy) / slideHeight * 100}%">`);
    }
    slides.push(`<section class="slide" aria-label="Slide ${index + 1}">${shapes.join('')}</section>`);
  }
  if (!slides.length) throw new TypeError('No readable slides were found.');
  const title = safeHtmlText(filename.replace(/\.[^.]+$/u, ''));
  return `<h1>${title}</h1>${slides.join('')}`;
}

export const PDF_OFFICE_MIME = Object.freeze({ xlsx: XLSX_MIME, pptx: PPTX_MIME });
