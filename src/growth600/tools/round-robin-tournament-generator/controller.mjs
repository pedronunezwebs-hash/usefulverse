import { announce, readToolCopy } from '../controller-helpers.mjs';
import { calculateStandings, createRoundRobinSchedule, parseEntrants, scheduleToCsv, validateScore } from './logic.mjs';

const root = document.querySelector('[data-tool="round-robin-tournament-generator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const entrantsInput = form.elements.namedItem('participants');
  const result = root.querySelector('[data-result]');
  const summary = root.querySelector('[data-round-robin-summary]');
  const roundsRoot = root.querySelector('[data-round-robin-rounds]');
  const standingsTable = root.querySelector('[data-round-robin-standings]');
  const copy = readToolCopy(root);
  let schedule = null;
  let scores = {};

  function drawStandings() {
    if (!schedule) return;
    const header = document.createElement('tr');
    for (const key of ['rank', 'team', 'played', 'wins', 'draws', 'losses', 'goalsFor', 'goalsAgainst', 'goalDifference', 'points']) {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = copy.fields[key];
      header.append(th);
    }
    standingsTable.tHead.replaceChildren(header);
    const body = standingsTable.tBodies[0] ?? standingsTable.createTBody();
    body.replaceChildren();
    for (const [index, row] of calculateStandings(schedule, scores).entries()) {
      const tr = document.createElement('tr');
      for (const value of [index + 1, row.team, row.played, row.wins, row.draws, row.losses, row.goalsFor, row.goalsAgainst, row.goalDifference, row.points]) {
        const td = document.createElement('td');
        td.textContent = String(value);
        tr.append(td);
      }
      body.append(tr);
    }
  }

  function appendScoreField(parent, fixture, side, team) {
    const wrap = document.createElement('label');
    wrap.className = 'round-robin-score';
    const text = document.createElement('span');
    text.textContent = `${copy.fields[side === 'home' ? 'homeScore' : 'awayScore']} (${team})`;
    const input = document.createElement('input');
    input.type = 'number';
    input.id = `round-robin-score-${fixture.id}-${side}`;
    input.name = `score-${fixture.id}-${side}`;
    input.inputMode = 'numeric';
    input.min = '0';
    input.max = '999';
    input.step = '1';
    input.autocomplete = 'off';
    input.setAttribute('aria-label', text.textContent);
    input.dataset.scoreId = fixture.id;
    input.dataset.scoreSide = side;
    input.value = scores[fixture.id]?.[side] ?? '';
    wrap.append(text, input);
    parent.append(wrap);
  }

  function renderSchedule() {
    if (!schedule) return;
    roundsRoot.replaceChildren();
    const totalMatches = schedule.rounds.reduce((total, round) => total + round.matches.length, 0);
    summary.textContent = `${copy.fields.team}: ${schedule.entrants.length} · ${copy.fields.round}: ${schedule.rounds.length} · ${copy.fields.fixtureTableLabel}: ${totalMatches}`;
    for (const [index, round] of schedule.rounds.entries()) {
      const details = document.createElement('details');
      details.className = 'round-robin-round';
      details.open = index === 0;
      const heading = document.createElement('summary');
      heading.textContent = `${copy.fields.round} ${round.number} · ${copy.fields.leg} ${round.leg}`;
      const list = document.createElement('ol');
      list.className = 'round-robin-fixtures';
      for (const fixture of round.matches) {
        const item = document.createElement('li');
        item.className = 'round-robin-fixture';
        const matchup = document.createElement('p');
        matchup.className = 'round-robin-matchup';
        matchup.textContent = `${fixture.home} — ${fixture.away}`;
        item.append(matchup);
        const scoreRow = document.createElement('div');
        scoreRow.className = 'round-robin-score-row';
        appendScoreField(scoreRow, fixture, 'home', fixture.home);
        const separator = document.createElement('span');
        separator.setAttribute('aria-hidden', 'true');
        separator.textContent = '–';
        scoreRow.append(separator);
        appendScoreField(scoreRow, fixture, 'away', fixture.away);
        item.append(scoreRow);
        list.append(item);
      }
      if (round.bye) {
        const bye = document.createElement('p');
        bye.className = 'hint round-robin-bye';
        bye.textContent = `${copy.fields.bye}: ${round.bye}`;
        list.append(bye);
      }
      details.append(heading, list);
      roundsRoot.append(details);
    }
    drawStandings();
    result.hidden = false;
  }

  function createSchedule(namesText = entrantsInput.value) {
    try {
      const entrants = parseEntrants(namesText);
      schedule = createRoundRobinSchedule(entrants, {
        doubleRound: form.elements.namedItem('doubleRound').checked,
        randomize: form.elements.namedItem('shuffle').checked,
      });
      scores = {};
      renderSchedule();
      announce(root, copy.messages.scheduleReady, 'success');
      return true;
    } catch (error) {
      schedule = null;
      scores = {};
      roundsRoot.replaceChildren();
      standingsTable.tHead.replaceChildren();
      standingsTable.tBodies[0]?.replaceChildren();
      result.hidden = true;
      const tooFew = namesText.split(/\r?\n/u).map((name) => name.trim()).filter(Boolean).length < 2;
      announce(root, tooFew ? copy.messages.noNames : copy.messages.invalidNames, 'error');
      entrantsInput.focus();
      return false;
    }
  }

  function printResults() {
    if (!schedule) {
      announce(root, copy.messages.noSchedule, 'error');
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      announce(root, copy.messages.printBlocked, 'error');
      return;
    }
    const target = printWindow.document;
    target.documentElement.lang = document.documentElement.lang || 'en';
    const title = target.createElement('title');
    title.textContent = copy.name;
    const style = target.createElement('style');
    style.textContent = 'body{font:10pt/1.4 system-ui,sans-serif;color:#111;margin:16mm}h1,h2{margin:0 0 5mm}section{break-inside:avoid;margin:0 0 8mm}table{border-collapse:collapse;width:100%;margin:3mm 0 6mm}th,td{border:1px solid #888;padding:2mm;text-align:start}thead{display:table-header-group}tr{break-inside:avoid}@page{size:A4 landscape;margin:12mm}';
    target.head.replaceChildren(title, style);
    const heading = target.createElement('h1');
    heading.textContent = copy.name;
    const table = target.createElement('table');
    const head = table.createTHead().insertRow();
    for (const label of [copy.fields.round, copy.fields.leg, copy.fields.home, copy.fields.homeScore, copy.fields.awayScore, copy.fields.away, copy.fields.bye]) {
      const th = target.createElement('th');
      th.textContent = label;
      head.append(th);
    }
    const body = table.createTBody();
    for (const round of schedule.rounds) {
      for (const fixture of round.matches) {
        const row = body.insertRow();
        const score = scores[fixture.id] ?? {};
        for (const value of [round.number, round.leg, fixture.home, score.home ?? '', score.away ?? '', fixture.away, '']) {
          const cell = row.insertCell();
          cell.textContent = String(value);
        }
      }
      if (round.bye) {
        const row = body.insertRow();
        for (const value of [round.number, round.leg, '', '', '', '', round.bye]) {
          const cell = row.insertCell();
          cell.textContent = String(value);
        }
      }
    }
    const standingsHeading = target.createElement('h2');
    standingsHeading.textContent = copy.fields.standingsLabel;
    const standings = target.createElement('table');
    const standingsHead = standings.createTHead().insertRow();
    for (const key of ['rank', 'team', 'played', 'wins', 'draws', 'losses', 'goalsFor', 'goalsAgainst', 'goalDifference', 'points']) {
      const th = target.createElement('th');
      th.textContent = copy.fields[key];
      standingsHead.append(th);
    }
    const standingsBody = standings.createTBody();
    for (const [index, team] of calculateStandings(schedule, scores).entries()) {
      const row = standingsBody.insertRow();
      for (const value of [index + 1, team.team, team.played, team.wins, team.draws, team.losses, team.goalsFor, team.goalsAgainst, team.goalDifference, team.points]) {
        const cell = row.insertCell();
        cell.textContent = String(value);
      }
    }
    target.body.replaceChildren(heading, table, standingsHeading, standings);
    printWindow.addEventListener('afterprint', () => printWindow.close(), { once: true });
    printWindow.focus();
    setTimeout(() => printWindow.print(), 100);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    createSchedule();
  });

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    entrantsInput.value = 'Lions\nTigers\nBears\nWolves\nEagles';
    createSchedule();
    if (schedule) announce(root, copy.messages.exampleLoaded, 'success');
  });

  root.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
    setTimeout(() => {
      schedule = null;
      scores = {};
      roundsRoot.replaceChildren();
      standingsTable.tHead.replaceChildren();
      standingsTable.tBodies[0]?.replaceChildren();
      summary.textContent = '';
      result.hidden = true;
      announce(root, '');
    }, 0);
  });

  root.addEventListener('input', (event) => {
    const input = event.target.closest('[data-score-id]');
    if (!input || !schedule) return;
    try {
      validateScore(input.value);
      input.setCustomValidity('');
      const score = scores[input.dataset.scoreId] ?? { home: '', away: '' };
      score[input.dataset.scoreSide] = input.value;
      scores[input.dataset.scoreId] = score;
      drawStandings();
      announce(root, '');
    } catch {
      input.setCustomValidity(copy.messages.invalidScore);
      input.value = '';
      const invalidScore = scores[input.dataset.scoreId] ?? { home: '', away: '' };
      invalidScore[input.dataset.scoreSide] = '';
      scores[input.dataset.scoreId] = invalidScore;
      drawStandings();
      announce(root, copy.messages.invalidScore, 'error');
    }
  });

  root.querySelector('[data-action="downloadCsv"]')?.addEventListener('click', () => {
    if (!schedule) {
      announce(root, copy.messages.noSchedule, 'error');
      return;
    }
    try {
      const blob = new Blob([`\uFEFF${scheduleToCsv(schedule, scores, copy.fields)}`], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'round-robin-schedule.csv';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      announce(root, copy.messages.copied, 'success');
    } catch {
      announce(root, copy.messages.copyUnavailable, 'error');
    }
  });

  root.querySelector('[data-action="print"]')?.addEventListener('click', printResults);
}
