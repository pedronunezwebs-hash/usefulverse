import { calculateYatzyTotals, scoreYatzyCategory } from './yatzy.mjs';

const root = document.querySelector('[data-market-tool="yatzy"]');

if (root) {
  const f = JSON.parse(root.querySelector('[data-tool-copy]').textContent).fields;
  const categories = f.categories;
  const keys = Object.keys(categories);
  let dice = [1, 1, 1, 1, 1];
  let held = [false, false, false, false, false];
  let rolls = 0;
  let scores = {};
  let turn = 1;
  const board = root.querySelector('[data-yatzy-scorecard]');
  const diceBox = root.querySelector('[data-yatzy-dice]');

  function render() {
    diceBox.replaceChildren(...dice.map((die, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = String(die);
      button.setAttribute('aria-pressed', String(held[index]));
      button.setAttribute('aria-label', `${f.die} ${index + 1}: ${die} · ${held[index] ? f.held : f.hold}`);
      button.addEventListener('click', () => { held[index] = !held[index]; render(); });
      return button;
    }));

    const { upperSubtotal, bonus, lowerSubtotal, total } = calculateYatzyTotals(scores);
    const table = document.createElement('table');
    const body = document.createElement('tbody');
    const addRow = (label, value) => {
      const row = document.createElement('tr');
      const heading = document.createElement('th');
      const cell = document.createElement('td');
      heading.scope = 'row';
      heading.textContent = label;
      cell.textContent = String(value);
      row.append(heading, cell);
      body.append(row);
    };
    for (const key of keys) {
      const row = document.createElement('tr');
      const heading = document.createElement('th');
      const cell = document.createElement('td');
      const button = document.createElement('button');
      heading.scope = 'row';
      heading.textContent = categories[key];
      button.type = 'button';
      button.textContent = key in scores ? String(scores[key]) : f.scoreHere;
      button.disabled = key in scores || rolls === 0;
      button.addEventListener('click', () => {
        scores[key] = scoreYatzyCategory(dice, key);
        rolls = 0;
        held.fill(false);
        turn += 1;
        render();
      });
      cell.append(button);
      row.append(heading, cell);
      body.append(row);
    }
    addRow(f.upperSubtotal, upperSubtotal);
    addRow(f.bonus, bonus);
    addRow(f.lowerSubtotal, lowerSubtotal);
    addRow(f.total, total);
    table.append(body);
    board.replaceChildren(table);

    const complete = keys.every((key) => key in scores);
    root.querySelector('[data-action="yatzy-roll"]').disabled = rolls >= 3 || complete;
    root.querySelector('[data-yatzy-status]').textContent = rolls
      ? `${f.turn} ${turn} · ${f.rollsRemaining}: ${3 - rolls}`
      : complete ? f.gameComplete : f.ready;
  }

  root.querySelector('[data-action="yatzy-roll"]').addEventListener('click', () => {
    if (rolls >= 3 || keys.every((key) => key in scores)) return;
    dice = dice.map((die, index) => held[index] ? die : 1 + Math.floor(Math.random() * 6));
    rolls += 1;
    render();
  });
  root.querySelector('[data-action="yatzy-new"]').addEventListener('click', () => {
    dice = [1, 1, 1, 1, 1];
    held.fill(false);
    rolls = 0;
    scores = {};
    turn = 1;
    render();
  });
  root.querySelector('[data-action="yatzy-export"]').addEventListener('click', () => {
    const { upperSubtotal, bonus, lowerSubtotal, total } = calculateYatzyTotals(scores);
    const rows = [
      [f.category, f.scoreHere],
      ...keys.map((key) => [categories[key], scores[key] ?? '']),
      [f.upperSubtotal, upperSubtotal], [f.bonus, bonus], [f.lowerSubtotal, lowerSubtotal], [f.total, total],
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'yatzy-score.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  root.querySelector('[data-action="yatzy-print"]').addEventListener('click', () => window.print());
  render();
}
