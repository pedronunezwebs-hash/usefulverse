export const MAX_PDFA_BYTES = 50 * 1024 * 1024;
export const MAX_PDFA_PAGES = 100;
export const MAX_PDFA_PIXELS = 40_000_000;
export const MAX_PDFA_SIDE = 12_000;

export function validatePdfAInput(bytes) {
  if (!(bytes instanceof Uint8Array)) throw new TypeError('Choose a valid PDF file.');
  if (bytes.byteLength > MAX_PDFA_BYTES) throw new RangeError('This local tool supports PDF files up to 50 MB.');
  if (bytes.length < 8 || !new TextDecoder('latin1').decode(bytes.subarray(0, 1024)).includes('%PDF-')) {
    throw new TypeError('Choose a valid PDF file.');
  }
}

export function pdfaPixelPlan(pageSizes, dpi) {
  const resolution = Number(dpi);
  if (!Number.isFinite(resolution) || ![100, 150, 200].includes(resolution)) {
    throw new RangeError('Choose a supported PDF/A resolution.');
  }
  if (!Array.isArray(pageSizes) || pageSizes.length < 1) throw new RangeError('The PDF has no pages.');
  if (pageSizes.length > MAX_PDFA_PAGES) throw new RangeError(`This local tool supports up to ${MAX_PDFA_PAGES} pages.`);
  const pages = pageSizes.map(({ width, height }) => {
    if (![width, height].every((value) => Number.isFinite(value) && value > 0)) {
      throw new RangeError('The PDF contains a page with invalid dimensions.');
    }
    const pixelWidth = Math.ceil((width * resolution) / 72);
    const pixelHeight = Math.ceil((height * resolution) / 72);
    if (pixelWidth > MAX_PDFA_SIDE || pixelHeight > MAX_PDFA_SIDE) {
      throw new RangeError('A page is too large to render at this resolution. Choose a lower resolution.');
    }
    return { width: pixelWidth, height: pixelHeight, pixels: pixelWidth * pixelHeight };
  });
  const totalPixels = pages.reduce((total, page) => total + page.pixels, 0);
  if (totalPixels > MAX_PDFA_PIXELS) {
    throw new RangeError('This PDF needs too much memory at this resolution. Choose a lower resolution or fewer pages.');
  }
  return { dpi: resolution, totalPixels, pages };
}
