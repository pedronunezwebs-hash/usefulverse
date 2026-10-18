import { compareNorwayElectricitySupport, parseNorwayElectricityCsv } from './norway-electricity-support.mjs';

const root = document.querySelector('[data-electricity-support-tool]');
if (root) {
  const copy = JSON.parse(root.closest('[data-market-tool]')?.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const q = (selector) => root.querySelector(selector);
  const file = q('#electricity-csv');
  const fileStatus = q('[data-electricity-file-status]');
  const status = q('[data-electricity-status]');
  const output = q('[data-electricity-result]');
  let records = null;
  let lastResult = null;
  const money = (amount) => new Intl.NumberFormat(document.documentElement.lang, { style: 'currency', currency: 'NOK', maximumFractionDigits: 2 }).format(amount);
  const number = (amount) => new Intl.NumberFormat(document.documentElement.lang, { maximumFractionDigits: 2 }).format(amount);
  const scenarioRows = (scenario) => [
    [copy.fields.energy, money(scenario.energyExVatNok)],
    [copy.fields.vatAmount, money(scenario.vatNok)],
    [copy.fields.network, money(scenario.networkChargesNok)],
    [copy.fields.other, money(scenario.otherChargesNok)],
    [copy.fields.adjustment, money(scenario.adjustmentNok)],
    [copy.fields.eligible, `${number(scenario.eligibleKwh)} kWh`],
    [copy.fields.total, money(scenario.totalNok)],
  ];
  function renderResult(result) {
    output.replaceChildren();
    const heading = document.createElement('h3'); heading.textContent = copy.fields.resultHeading; output.append(heading);
    const summary = document.createElement('p');
    summary.textContent = `${copy.fields.priceArea}: ${result.priceArea} · ${copy.fields.totalConsumption}: ${number(result.totalKwh)} kWh · ${copy.fields.period}: ${result.monthCount}`;
    output.append(summary);
    for (const [key, label] of [['market', copy.fields.marketHeading], ['electricitySupport', copy.fields.supportHeading], ['norgespris', copy.fields.norgesprisHeading]]) {
      const section = document.createElement('section');
      const title = document.createElement('h4'); title.textContent = label; section.append(title);
      const list = document.createElement('dl');
      for (const [termText, detailText] of scenarioRows(result[key])) {
        const term = document.createElement('dt'); term.textContent = termText;
        const detail = document.createElement('dd'); detail.textContent = detailText;
        list.append(term, detail);
      }
      section.append(list); output.append(section);
    }
    const note = document.createElement('p'); note.className = 'hint'; note.textContent = copy.fields.noPrices; output.append(note);
    output.hidden = false;
  }
  const csvCell = (value) => {
    const text = String(value);
    const safe = /^[=+\-@\t\r]/u.test(text) ? `'${text}` : text;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  async function loadFile() {
    if (!file.files?.[0]) throw new Error('Choose a CSV first.');
    if (file.files[0].size > 20_000_000 || !file.files[0].name.toLowerCase().endsWith('.csv')) throw new Error('Invalid CSV.');
    records = parseNorwayElectricityCsv(await file.files[0].text());
    fileStatus.textContent = `${file.files[0].name} · ${number(records.length)} hours · ${number(records.reduce((sum, row) => sum + row.consumptionKwh, 0))} kWh`;
  }
  file.addEventListener('change', async () => {
    records = null; lastResult = null; output.hidden = true;
    try { await loadFile(); } catch { fileStatus.textContent = copy.fields.invalid; }
  });
  q('[data-electricity-template]').addEventListener('click', () => {
    const header = 'timestamp,consumption_kwh,spot_price_nok_per_kwh_ex_vat\r\n';
    const url = URL.createObjectURL(new Blob([header], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'norway-hourly-electricity-template.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  q('[data-electricity-calculate]').addEventListener('click', async () => {
    try {
      if (!records) await loadFile();
      lastResult = compareNorwayElectricitySupport({
        records,
        meterType: q('#electricity-meter-type').value,
        priceArea: q('#electricity-price-area').value,
        vatPct: Number(q('#electricity-vat').value),
        networkVariableNokPerKwh: q('#electricity-network-variable').value,
        networkFixedNokPerMonth: q('#electricity-network-fixed').value,
        otherVariableNokPerKwh: q('#electricity-other-variable').value,
        otherFixedNokPerMonth: q('#electricity-other-fixed').value,
      });
      renderResult(lastResult); status.textContent = copy.fields.resultHeading;
    } catch {
      lastResult = null; output.hidden = true; status.textContent = copy.fields.invalid;
    }
  });
  q('[data-electricity-clear]').addEventListener('click', () => {
    file.value = ''; records = null; lastResult = null; output.hidden = true; output.replaceChildren();
    q('#electricity-meter-type').value = 'household'; q('#electricity-price-area').value = 'NO1'; q('#electricity-vat').value = '25';
    for (const selector of ['#electricity-network-variable', '#electricity-network-fixed', '#electricity-other-variable', '#electricity-other-fixed']) q(selector).value = '0';
    fileStatus.textContent = copy.fields.ready; status.textContent = copy.fields.ready;
  });
  q('[data-electricity-export]').addEventListener('click', () => {
    if (!lastResult) { status.textContent = copy.fields.ready; return; }
    const rows = [[copy.fields.resultHeading, copy.fields.energy, copy.fields.vatAmount, copy.fields.network, copy.fields.other, copy.fields.adjustment, copy.fields.total]];
    for (const [key, label] of [['market', copy.fields.marketHeading], ['electricitySupport', copy.fields.supportHeading], ['norgespris', copy.fields.norgesprisHeading]]) {
      const item = lastResult[key]; rows.push([label, item.energyExVatNok, item.vatNok, item.networkChargesNok, item.otherChargesNok, item.adjustmentNok, item.totalNok]);
    }
    const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'norway-electricity-support-comparison.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  q('[data-electricity-print]').addEventListener('click', () => window.print());
}
