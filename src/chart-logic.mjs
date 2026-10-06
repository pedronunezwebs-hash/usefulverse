const number = (value) => {
  const parsed = Number(String(value).trim());
  if (!String(value).trim() || !Number.isFinite(parsed) || Math.abs(parsed) > 1e12) throw new TypeError('Enter 2–60 label,value CSV lines with a number in the second column.');
  return parsed;
};

export function parseChartCsv(csv) {
  const source = String(csv ?? '');
  if (!source.trim() || source.length > 20_000) throw new TypeError('Enter 2–60 label,value CSV lines with a number in the second column.');
  const rows = []; let row = []; let field = ''; let quoted = false; let quoteClosed = false;
  const pushField = () => { row.push(field.trim()); field = ''; quoteClosed = false; };
  const pushRow = () => { pushField(); if (row.some(Boolean)) rows.push(row); row = []; };
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (quoted) {
      if (char === '"' && source[index + 1] === '"') { field += '"'; index += 1; }
      else if (char === '"') { quoted = false; quoteClosed = true; }
      else field += char;
      continue;
    }
    if (char === '"' && field.length === 0 && !quoteClosed) { quoted = true; continue; }
    if (char === ',' || char === '\n' || char === '\r') {
      if (char === ',') pushField();
      else { if (char === '\r' && source[index + 1] === '\n') index += 1; pushRow(); }
      continue;
    }
    if (quoteClosed && /\s/u.test(char)) continue;
    if (quoteClosed || char === '"') throw new SyntaxError('Check the quotes in your CSV labels.');
    field += char;
  }
  if (quoted) throw new SyntaxError('A quoted CSV label is missing its closing quote.');
  if (field.length || row.length) pushRow();
  if (rows.some((cells) => cells.length !== 2)) throw new TypeError('Each CSV row must contain exactly a label and a number.');
  if (rows.length > 1 && !Number.isFinite(Number(rows[0][1]))) rows.shift();
  if (rows.length < 2 || rows.length > 60 || rows.some(([label]) => !label || /[\r\n\u0000-\u001f]/u.test(label))) {
    throw new TypeError('Enter 2–60 label,value CSV lines with a number in the second column.');
  }
  return rows.map(([label, value]) => ({ label: [...label].slice(0, 40).join(''), value: number(value) }));
}
