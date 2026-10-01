export const MAX_QPDF_INPUT_BYTES = 200 * 1024 * 1024;

export function validateQpdfRequest({ action, bytes, password = '', confirmPassword = '', ownerPassword = '' }) {
  if (!['protect', 'unlock', 'repair'].includes(action)) throw new TypeError('Choose a supported PDF action.');
  if (!(bytes instanceof Uint8Array) || bytes.length < 8) throw new TypeError('Choose a valid PDF file.');
  if (bytes.byteLength > MAX_QPDF_INPUT_BYTES) throw new RangeError('This local tool supports PDF files up to 200 MB to help protect device memory.');
  const header = new TextDecoder('latin1').decode(bytes.subarray(0, Math.min(bytes.length, 1024)));
  if (!header.includes('%PDF-')) throw new TypeError('The selected file does not look like a PDF.');

  if (action === 'protect') {
    if (password.length < 8) throw new RangeError('Use an opening password with at least 8 characters.');
    if (confirmPassword !== password) throw new TypeError('The password confirmation does not match.');
    if (ownerPassword.length < 8) throw new RangeError('Use an owner password with at least 8 characters.');
    if (ownerPassword === password) throw new TypeError('Choose different opening and owner passwords.');
  }
  if (action === 'unlock' && !password) throw new TypeError('Enter the current PDF password.');
  return true;
}

export function runQpdfTask(qpdf, request) {
  const { action, bytes, password = '', confirmPassword = '', ownerPassword = '' } = request;
  validateQpdfRequest(request);
  const inputPath = '/usefulverse-input.pdf';
  const outputPath = '/usefulverse-output.pdf';
  for (const path of [inputPath, outputPath]) {
    try { qpdf.FS.unlink(path); } catch {}
  }
  qpdf.FS.writeFile(inputPath, bytes);
  let args;
  try {
    if (action === 'protect') args = ['--encrypt', password, ownerPassword, '256', '--', inputPath, outputPath];
    else if (action === 'unlock') args = [`--password=${password}`, '--decrypt', inputPath, outputPath];
    else args = ['--warning-exit-0', inputPath, outputPath];

    const exitCode = qpdf.callMain(args);
    args.fill('');
    if (exitCode !== 0) throw new Error('PDF processing failed.');
    const output = qpdf.FS.readFile(outputPath);
    if (!(output instanceof Uint8Array) || output.length < 8) throw new Error('PDF processing did not create a usable file.');
    const outputHeader = new TextDecoder('latin1').decode(output.subarray(0, Math.min(output.length, 1024)));
    if (!outputHeader.includes('%PDF-')) throw new Error('PDF processing did not create a usable file.');

    if (action === 'repair') {
      const checkCode = qpdf.callMain(['--check', '--warning-exit-0', outputPath]);
      if (checkCode !== 0) throw new Error('The repaired copy did not pass a basic PDF structure check.');
    }
    return new Uint8Array(output);
  } catch {
    if (action === 'unlock') throw new Error('The password may be incorrect, or this PDF may use an unsupported feature.');
    if (action === 'repair') throw new Error('This PDF could not be rebuilt or did not pass a basic structure check.');
    throw new Error('This PDF could not be protected. Check the file and try again.');
  } finally {
    if (args) args.fill('');
    for (const path of [inputPath, outputPath]) {
      try { qpdf.FS.unlink(path); } catch {}
    }
  }
}
