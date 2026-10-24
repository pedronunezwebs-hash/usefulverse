export const PDF_IMPOSITION_LIMITS = Object.freeze({ bytes: 25 * 1024 * 1024, pages: 100, gutterMm: 20 });
export function bookletPageOrder(pageCount, binding = 'left') {
  if (!Number.isInteger(pageCount) || pageCount < 1 || pageCount > PDF_IMPOSITION_LIMITS.pages || !['left','right'].includes(binding)) throw new RangeError('Invalid page count or binding direction.');
  const padded = Math.ceil(pageCount / 4) * 4, sheets = padded / 4, order = [];
  for (let sheet = 0; sheet < sheets; sheet++) {
    const front = binding === 'left' ? [padded - 1 - 2 * sheet, 2 * sheet] : [2 * sheet, padded - 1 - 2 * sheet];
    const back = binding === 'left' ? [2 * sheet + 1, padded - 2 - 2 * sheet] : [padded - 2 - 2 * sheet, 2 * sheet + 1];
    order.push({ side: 'front', pages: front.map((index) => index < pageCount ? index : null) }, { side: 'back', pages: back.map((index) => index < pageCount ? index : null) });
  }
  return Object.freeze(order.map((sheet) => Object.freeze({ side: sheet.side, pages: Object.freeze(sheet.pages) })));
}
export function bookletSheetSize(pageSizes, gutterMm = 0) {
  const gutter = Number(gutterMm);
  if (!Number.isFinite(gutter) || gutter < 0 || gutter > PDF_IMPOSITION_LIMITS.gutterMm || !pageSizes.length) throw new RangeError('Invalid gutter or page size.');
  const width = Math.max(...pageSizes.map(({ width: value }) => value)); const height = Math.max(...pageSizes.map(({ height: value }) => value));
  return Object.freeze({ width: width * 2 + gutter * 72 / 25.4, height, gutter: gutter * 72 / 25.4, pageWidth: width, pageHeight: height });
}
