export const PYTHON_LIMITS = Object.freeze({ codeCharacters: 20000, stdinCharacters: 5000, outputCharacters: 24000, runMilliseconds: 12000 });

export function validatePythonInput(code, stdin = '') {
  if (typeof code !== 'string' || code.length > PYTHON_LIMITS.codeCharacters) throw new RangeError('Python source exceeds the local editor limit.');
  if (typeof stdin !== 'string' || stdin.length > PYTHON_LIMITS.stdinCharacters) throw new RangeError('Standard input exceeds the local editor limit.');
  return Object.freeze({ code, stdin });
}
