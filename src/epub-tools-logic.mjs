import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate';

const MAX_FILE = 25 * 1024 * 1024; const MAX_EXPANDED = 70 * 1024 * 1024; const MAX_ENTRIES = 1200;
function readU16(view, offset) { return view.getUint16(offset, true); }
function readU32(view, offset) { return view.getUint32(offset, true); }
export function validateEpubArchive(bytes) {
  if (!(bytes instanceof Uint8Array) || bytes.byteLength < 22 || bytes.byteLength > MAX_FILE) throw new RangeError('Choose an EPUB file no larger than 25 MiB.');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength); let eocd = -1;
  for (let at = Math.max(0, bytes.length - 65557); at <= bytes.length - 22; at += 1) if (readU32(view, at) === 0x06054b50) eocd = at;
  if (eocd < 0) throw new TypeError('The ZIP directory is missing.');
  const count = readU16(view, eocd + 10); const cdSize = readU32(view, eocd + 12); let offset = readU32(view, eocd + 16);
  if (count < 1 || count > MAX_ENTRIES || count === 0xffff || offset + cdSize > eocd) throw new RangeError('The EPUB archive has unsupported ZIP limits.');
  let total = 0; const paths = new Set();
  for (let index = 0; index < count; index += 1) {
    if (readU32(view, offset) !== 0x02014b50) throw new TypeError('The EPUB ZIP directory is invalid.');
    const flags = readU16(view, offset + 8); const method = readU16(view, offset + 10); const packed = readU32(view, offset + 20); const expanded = readU32(view, offset + 24);
    const nameLength = readU16(view, offset + 28); const extraLength = readU16(view, offset + 30); const commentLength = readU16(view, offset + 32);
    const name = new TextDecoder().decode(bytes.subarray(offset + 46, offset + 46 + nameLength));
    if (flags & 1 || !name || name.startsWith('/') || name.includes('\\') || name.split('/').includes('..') || paths.has(name)) throw new TypeError('The EPUB archive contains an unsafe or encrypted entry.');
    if (![0, 8].includes(method)) throw new TypeError('This EPUB uses an unsupported compression method.');
    if (expanded > 25 * 1024 * 1024 || (packed === 0 ? expanded > 0 : expanded / packed > 150)) throw new RangeError('The EPUB contains an oversized compressed entry.');
    total += expanded; if (total > MAX_EXPANDED) throw new RangeError('The EPUB expanded content exceeds the 70 MiB memory limit.');
    paths.add(name); offset += 46 + nameLength + extraLength + commentLength;
  }
  if (offset > eocd + cdSize || !paths.has('mimetype') || !paths.has('META-INF/container.xml')) throw new TypeError('This archive does not appear to be a valid EPUB.');
  return { count, expandedBytes: total, paths };
}

function normalizeArchivePath(path) {
  const clean = decodeURIComponent(String(path).split(/[?#]/u, 1)[0]); const parts = [];
  for (const part of clean.split('/')) { if (!part || part === '.') continue; if (part === '..') { if (!parts.length) throw new TypeError('An EPUB reference leaves the archive.'); parts.pop(); } else parts.push(part); }
  return parts.join('/');
}
function xmlDocument(bytes) {
  const document = new DOMParser().parseFromString(strFromU8(bytes), 'application/xml');
  if (document.querySelector('parsererror')) throw new TypeError('The EPUB XML is invalid.');
  return document;
}
function readPackage(files) {
  const mime = files.mimetype;
  if (!mime || strFromU8(mime) !== 'application/epub+zip') throw new TypeError('The EPUB mimetype is invalid.');
  const container = xmlDocument(files['META-INF/container.xml']); const rootfile = container.querySelector('rootfile[full-path]');
  if (!rootfile) throw new TypeError('The EPUB package file is missing.');
  const packagePath = normalizeArchivePath(rootfile.getAttribute('full-path')); const packageBytes = files[packagePath];
  if (!packageBytes) throw new TypeError('The EPUB package file is missing.');
  const document = xmlDocument(packageBytes); const manifest = new Map();
  for (const item of document.querySelectorAll('manifest item[id][href]')) manifest.set(item.getAttribute('id'), { href: item.getAttribute('href'), properties: item.getAttribute('properties') ?? '' });
  const base = packagePath.includes('/') ? packagePath.slice(0, packagePath.lastIndexOf('/') + 1) : '';
  const chapters = [...document.querySelectorAll('spine itemref[idref]')].map((item, index) => {
    const resource = manifest.get(item.getAttribute('idref')); if (!resource) return null;
    const path = normalizeArchivePath(base + resource.href); const chapter = files[path]; if (!chapter) return null;
    const doc = new DOMParser().parseFromString(strFromU8(chapter), 'text/html');
    const text = doc.body?.innerText ?? doc.body?.textContent ?? '';
    return { index, path, title: doc.querySelector('title')?.textContent?.trim() || '', text: text.replace(/\s+/gu, ' ').trim().slice(0, 250_000) };
  }).filter((chapter) => chapter?.text);
  return { document, packagePath, packageBytes, chapters };
}
function unzip(bytes) { validateEpubArchive(bytes); const files = unzipSync(bytes, { filter: (file) => !file.name.endsWith('/') }); readPackage(files); return files; }

export function extractEpubText(bytes) {
  const files = unzip(bytes); const { document, chapters } = readPackage(files);
  const title = document.querySelector('metadata title, metadata > *[localName="title"]')?.textContent?.trim() || '';
  const author = document.querySelector('metadata creator, metadata > *[localName="creator"]')?.textContent?.trim() || '';
  if (!chapters.length) throw new TypeError('No readable EPUB chapters were found.');
  return { title, author, chapters };
}

export function readEpubMetadata(bytes) {
  const files = unzip(bytes); const { document } = readPackage(files); const metadata = document.getElementsByTagNameNS('*', 'metadata')[0] ?? document.querySelector('metadata');
  const read = (name) => [...(metadata?.children ?? [])].find((child) => child.localName === name)?.textContent?.trim() ?? '';
  return { title: read('title'), author: read('creator'), language: read('language') };
}

export function editEpubMetadata(bytes, values) {
  const title = String(values.title ?? '').trim(); const author = String(values.author ?? '').trim(); const language = String(values.language ?? '').trim();
  if (!title || title.length > 200 || author.length > 200 || !/^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/u.test(language)) throw new TypeError('Enter a title and valid author and language values.');
  const files = unzip(bytes); const { document, packagePath } = readPackage(files);
  const metadata = document.querySelector('metadata'); if (!metadata) throw new TypeError('The EPUB metadata section is missing.');
  const upsert = (localName, value) => {
    let node = [...metadata.children].find((child) => child.localName === localName && (!child.namespaceURI || child.namespaceURI.includes('dc')));
    if (!node) { const namespace = metadata.lookupNamespaceURI('dc') || 'http://purl.org/dc/elements/1.1/'; node = document.createElementNS(namespace, `dc:${localName}`); metadata.append(node); }
    node.textContent = value;
  };
  upsert('title', title); upsert('creator', author); upsert('language', language);
  files[packagePath] = strToU8(new XMLSerializer().serializeToString(document));
  const ordered = { mimetype: [files.mimetype, { level: 0 }] };
  for (const [name, data] of Object.entries(files)) if (name !== 'mimetype') ordered[name] = data;
  return zipSync(ordered, { level: 6 });
}
