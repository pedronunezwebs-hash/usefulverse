import { createRandomTeamSeed, createRandomTeams, parseParticipantNames, parseSeparationPairs, serializeRandomTeamsCsv } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="random-team-generator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const result = root.querySelector('[data-result]');
  const resultContent = root.querySelector('[data-result-content]');
  const seedOutput = root.querySelector('[data-team-seed-output]');
  const copyButton = root.querySelector('[data-action="copy"]');
  const downloadButton = root.querySelector('[data-action="download"]');
  let latest = null;

  function clearOutput() {
    latest = null;
    result.hidden = true;
    resultContent.replaceChildren();
    seedOutput.textContent = '';
    copyButton.disabled = true;
    downloadButton.disabled = true;
  }

  function getNames() {
    try { return parseParticipantNames(form.elements.namedItem('names').value); }
    catch (error) {
      if (error.code === 'invalid-count') throw new Error(copy.messages.invalidCount);
      if (error.code === 'duplicate-name') throw new Error(copy.messages.duplicateName);
      throw new Error(copy.messages.checkInputs);
    }
  }

  function getRules(names) {
    try { return parseSeparationPairs(form.elements.namedItem('separations').value, names); }
    catch (error) {
      if (error.code === 'unknown-pair-name') throw new Error(copy.messages.unknownName);
      throw new Error(copy.messages.invalidPair);
    }
  }

  function renderTeams(draw) {
    const groups = draw.teams.map((team, index) => {
      const section = document.createElement('section');
      section.className = 'random-team-group';
      const heading = document.createElement('h3');
      heading.textContent = `${copy.actions.team} ${index + 1} · ${team.members.length} ${copy.actions.participant}`;
      const list = document.createElement('ul');
      for (const name of team.members) {
        const item = document.createElement('li');
        item.textContent = name;
        list.append(item);
      }
      section.append(heading, list);
      return section;
    });
    resultContent.replaceChildren(...groups);
    seedOutput.textContent = `${copy.actions.seedLabel}: ${draw.seed}`;
    latest = draw;
    result.hidden = false;
    copyButton.disabled = false;
    downloadButton.disabled = false;
  }

  function generate(event) {
    event?.preventDefault();
    clearOutput();
    try {
      const names = getNames();
      const teamCount = Number(form.elements.namedItem('teamCount').value);
      const pairs = getRules(names);
      const seedInput = form.elements.namedItem('seed');
      const seed = seedInput.value.trim() || createRandomTeamSeed();
      seedInput.value = seed;
      const draw = createRandomTeams({ names, teamCount, separationPairs: pairs, seed });
      if (!draw.ok) {
        announce(root, draw.reason === 'search-limit' ? copy.messages.searchLimit : copy.messages.incompatible, 'error');
        return;
      }
      renderTeams(draw);
      announce(root, copy.messages.generated, 'success');
    } catch (error) {
      const message = error.message === 'secure-random-unavailable' ? copy.messages.seedUnavailable : error.message;
      announce(root, message || copy.messages.checkInputs, 'error');
    }
  }

  function plainText() {
    return latest.teams.map((team, index) => `${copy.actions.team} ${index + 1}\n${team.members.map((name) => `- ${name}`).join('\n')}`).join('\n\n') + `\n\n${copy.actions.seedLabel}: ${latest.seed}`;
  }

  function downloadCsv() {
    if (!latest) return;
    const csv = serializeRandomTeamsCsv(latest, copy.actions);
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'random-teams.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce(root, copy.messages.downloadReady, 'success');
  }

  form.addEventListener('submit', generate);
  form.addEventListener('reset', () => setTimeout(() => { clearOutput(); announce(root, ''); }, 0));
  form.addEventListener('input', (event) => {
    if (event.target.matches('textarea, input')) {
      clearOutput();
      announce(root, '');
    }
  });
  root.querySelector('[data-action="example"]').addEventListener('click', () => {
    form.elements.namedItem('names').value = 'Alex\nSam\nJordan\nTaylor\nMorgan\nRiley\nCasey\nJamie';
    form.elements.namedItem('teamCount').value = '2';
    form.elements.namedItem('separations').value = 'Alex | Sam';
    form.elements.namedItem('seed').value = '';
    generate();
  });
  copyButton.addEventListener('click', async () => {
    if (!latest) return;
    try {
      await navigator.clipboard.writeText(plainText());
      announce(root, copy.messages.copied, 'success');
    } catch {
      announce(root, copy.messages.copyUnavailable, 'error');
    }
  });
  downloadButton.addEventListener('click', downloadCsv);
  clearOutput();
}
