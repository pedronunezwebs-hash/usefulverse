import { recompressOfficePackage } from './office-package-logic.mjs';

self.addEventListener('message', (event) => {
  const { bytes, fileName } = event.data ?? {};
  try {
    const result = recompressOfficePackage(new Uint8Array(bytes), fileName);
    if (!result.smaller) {
      self.postMessage({ ok: true, smaller: false, inputBytes: result.inputBytes, outputBytes: result.outputBytes });
      return;
    }
    self.postMessage({ ok: true, smaller: true, extension: result.extension, inputBytes: result.inputBytes, outputBytes: result.outputBytes, bytes: result.bytes.buffer }, [result.bytes.buffer]);
  } catch (error) {
    const safeMessages = new Set([
      'The file is not a supported Office package.', 'This file is larger than the 100 MB local processing limit.',
      'Choose a modern DOCX, XLSX or PPTX file.', 'The ZIP package is incomplete or damaged.',
      'The Office package contains an invalid file name.', 'This multi-disk, ZIP64 or unusually large package is not supported.',
      'The ZIP package has an unsupported or damaged directory.', 'Encrypted Office packages are not supported.',
      'This Office package uses an unsupported compression method.', 'The Office package contains an unsafe file path.',
      'The Office package contains duplicate file paths and cannot be safely repacked.', 'This ZIP64 or split package is not supported.',
      'The Office package has a damaged ZIP extension.', 'ZIP64 Office packages are not supported.',
      'Symbolic links inside Office packages are not supported.', 'The Office package contains an invalid file record.',
      'The Office package file records do not match.', 'The Office package contains an invalid compressed-data range.',
      'The expanded package exceeds the 200 MB local processing limit.', 'The Office package directory has trailing data.',
      'The Office package has overlapping file records.', 'The selected file is not a valid modern Office document of that type.',
      'Signed or macro-enabled Office files are not supported, to avoid invalidating signatures or macros.',
      'The Office package content-types record is invalid.', 'The Office package could not be safely opened.',
      'An Office package part did not pass its size check.',
    ]);
    self.postMessage({ ok: false, message: safeMessages.has(error?.message) ? error.message : 'The file could not be safely recompressed. Your original has not changed.' });
  }
});
