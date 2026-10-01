export const MAX_PDF_CROP_BYTES = 100 * 1024 * 1024;
export const MAX_PDF_CROP_PAGES = 300;

export async function cropPdfLocally(PDFDocument, bytes, margins) {
  if (!(bytes instanceof Uint8Array) || bytes.length < 8) throw new TypeError('Choose a valid PDF file.');
  if (bytes.byteLength > MAX_PDF_CROP_BYTES) throw new RangeError('This local tool supports PDF files up to 100 MB.');
  if (!new TextDecoder('latin1').decode(bytes.subarray(0, 1024)).includes('%PDF-')) throw new TypeError('The selected file does not look like a PDF.');

  const values = ['top', 'right', 'bottom', 'left'].map((side) => Number(margins?.[side]));
  if (values.some((value) => !Number.isFinite(value) || value < 0 || value > 500)) {
    throw new RangeError('Enter margins from 0 to 500 mm.');
  }

  const document = await PDFDocument.load(bytes, { updateMetadata: false });
  if (document.getPageCount() > MAX_PDF_CROP_PAGES) throw new RangeError('This local tool supports up to 300 PDF pages.');
  const [topMm, rightMm, bottomMm, leftMm] = values;
  const points = (mm) => (mm * 72) / 25.4;
  const top = points(topMm); const right = points(rightMm); const bottom = points(bottomMm); const left = points(leftMm);

  for (const page of document.getPages()) {
    if (page.getRotation().angle % 360 !== 0) throw new RangeError('Rotate pages to 0° before cropping this PDF.');
    const box = page.getCropBox();
    const width = box.width - left - right;
    const height = box.height - top - bottom;
    if (width < 1 || height < 1) throw new RangeError('The margins are too large for at least one page.');
    page.setCropBox(box.x + left, box.y + bottom, width, height);
  }

  return new Uint8Array(await document.save({ useObjectStreams: true }));
}
