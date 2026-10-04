export const MAX_SPRITE_FRAMES = 128;
export const MAX_SPRITE_DIMENSION = 8192;
export const MAX_SPRITE_PIXELS = 16_000_000;

export function layoutSpriteFrames(frames, { frameWidth, frameHeight, columns, gap = 0, padding = 0 } = {}) {
  if (!Array.isArray(frames) || frames.length < 1 || frames.length > MAX_SPRITE_FRAMES) {
    throw new Error(`Choose between 1 and ${MAX_SPRITE_FRAMES} images.`);
  }
  const width = Number(frameWidth);
  const height = Number(frameHeight);
  const count = Number(columns);
  const spacing = Number(gap);
  const inset = Number(padding);
  if (![width, height, count, spacing, inset].every(Number.isInteger)
    || width < 1 || height < 1 || width > MAX_SPRITE_DIMENSION || height > MAX_SPRITE_DIMENSION
    || count < 1 || count > frames.length || spacing < 0 || spacing > 128 || inset < 0 || inset > 128) {
    throw new Error('Enter valid frame size, columns, gap and padding.');
  }
  for (const [index, frame] of frames.entries()) {
    if (!Number.isInteger(frame.width) || !Number.isInteger(frame.height) || frame.width < 1 || frame.height < 1
      || frame.width > MAX_SPRITE_DIMENSION || frame.height > MAX_SPRITE_DIMENSION) {
      throw new Error(`Image ${index + 1} has unsupported dimensions.`);
    }
  }
  const rows = Math.ceil(frames.length / count);
  const sheetWidth = inset * 2 + count * width + Math.max(0, count - 1) * spacing;
  const sheetHeight = inset * 2 + rows * height + Math.max(0, rows - 1) * spacing;
  if (sheetWidth > MAX_SPRITE_DIMENSION || sheetHeight > MAX_SPRITE_DIMENSION || sheetWidth * sheetHeight > MAX_SPRITE_PIXELS) {
    throw new Error('The sprite sheet would be too large for a reliable browser export. Reduce frame size, columns or padding.');
  }
  const items = frames.map((frame, index) => {
    const column = index % count;
    const row = Math.floor(index / count);
    const scale = Math.min(width / frame.width, height / frame.height, 1);
    const drawWidth = Math.max(1, Math.round(frame.width * scale));
    const drawHeight = Math.max(1, Math.round(frame.height * scale));
    return {
      index,
      name: String(frame.name ?? `Frame ${index + 1}`),
      x: inset + column * (width + spacing),
      y: inset + row * (height + spacing),
      width,
      height,
      drawX: inset + column * (width + spacing) + Math.floor((width - drawWidth) / 2),
      drawY: inset + row * (height + spacing) + Math.floor((height - drawHeight) / 2),
      drawWidth,
      drawHeight,
      sourceWidth: frame.width,
      sourceHeight: frame.height,
    };
  });
  return { width: sheetWidth, height: sheetHeight, frameWidth: width, frameHeight: height, columns: count, rows, gap: spacing, padding: inset, items };
}

export function spriteSheetMetadata(layout) {
  return {
    image: { width: layout.width, height: layout.height },
    frame: { width: layout.frameWidth, height: layout.frameHeight },
    columns: layout.columns,
    rows: layout.rows,
    gap: layout.gap,
    padding: layout.padding,
    frames: layout.items.map(({ index, name, x, y, width, height, sourceWidth, sourceHeight }) => ({
      index, name, x, y, width, height, sourceWidth, sourceHeight,
    })),
  };
}
