import { parseDicomFile } from './dicom-viewer.mjs';

self.addEventListener('message', (event) => {
  const { id, buffer, name } = event.data ?? {};
  try {
    const image = parseDicomFile(buffer, { name });
    self.postMessage({ id, image: { ...image, pixels: image.pixels.buffer } }, [image.pixels.buffer]);
  } catch (error) {
    self.postMessage({ id, error: error?.message || 'invalidDicom' });
  }
});
