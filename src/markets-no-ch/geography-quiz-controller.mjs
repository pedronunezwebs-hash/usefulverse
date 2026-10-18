import { answerGeographyQuestion, continentGroup, flagEmoji, localizedGeographyContinents, makeGeographyQuestion } from './geography-quiz.mjs';
import { geographyMapFeatures, geographyMapUpdatedAt } from './geography-quiz-data.mjs';

const root = document.querySelector('[data-geography-quiz]');
if (root) {
  const copy = JSON.parse(root.closest('[data-market-tool]').querySelector('[data-tool-copy]').textContent);
  const f = copy.fields;
  const $ = (selector) => root.querySelector(selector);
  const main = root.closest('[data-market-tool]');
  const lang = document.documentElement.lang || 'en';
  const savedKey = 'usefulverse.geography-map-quiz.v1';
  const displayNames = (() => { try { return new Intl.DisplayNames([lang], { type: 'region' }); } catch { return null; } })();
  const continentLabels = localizedGeographyContinents(f);
  const countries = Object.fromEntries(geographyMapFeatures.map((feature) => [feature.id, feature]));
  let storageAvailable = true;
  let saved = { attempts: 0, correct: 0, missedIds: [] };
  try {
    const value = JSON.parse(localStorage.getItem(savedKey) || 'null');
    if (value && Number.isInteger(value.attempts) && Number.isInteger(value.correct) && Array.isArray(value.missedIds)) {
      saved = { attempts: Math.max(0, value.attempts), correct: Math.max(0, value.correct), missedIds: [...new Set(value.missedIds.filter((id) => countries[id]?.iso2))].slice(0, 240) };
    }
  } catch { storageAvailable = false; }
  let round = null;
  let seen = [];
  let reviewIds = null;
  let answered = false;

  const localCountry = (feature) => {
    if (feature?.iso2 && displayNames) { try { return displayNames.of(feature.iso2) || feature.name; } catch { /* keep source name */ } }
    return feature?.name ?? '';
  };
  const template = (text, values) => Object.entries(values).reduce((output, [key, value]) => output.replaceAll(`{${key}}`, String(value)), text);
  const rand = () => {
    const secureCrypto = globalThis.crypto;
    return secureCrypto?.getRandomValues
      ? secureCrypto.getRandomValues(new Uint32Array(1))[0] / 0x100000000
      : Math.random();
  };
  const updateTotals = () => {
    $('[data-geo-total]').textContent = String(saved.correct);
    $('[data-geo-missed]').textContent = String(saved.missedIds.length);
    $('[data-geo-review]').hidden = !saved.missedIds.length || Boolean(reviewIds);
    if (!storageAvailable) { $('[data-geo-storage]').hidden = false; $('[data-geo-storage]').textContent = f.storageUnavailable; }
  };
  const persist = () => {
    try { localStorage.setItem(savedKey, JSON.stringify(saved)); }
    catch { storageAvailable = false; }
    updateTotals();
  };
  const drawMap = (question) => {
    const group = $('[data-geo-shapes]');
    const svg = $('[data-geo-map]');
    const fragment = document.createDocumentFragment();
    for (const feature of geographyMapFeatures) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', feature.path);
      path.setAttribute('class', 'geo-shape');
      path.dataset.geoId = feature.id;
      path.setAttribute('aria-hidden', 'true');
      if (question?.mode === 'continent' && feature.id === question.target.id) path.classList.add('is-target');
      if (question?.mode === 'country' && feature.iso2) path.classList.add('is-selectable');
      fragment.append(path);
    }
    group.replaceChildren(fragment);
    const targetLabel = question?.mode === 'continent' ? localCountry(question.target) : '';
    svg.setAttribute('aria-label', targetLabel ? `${f.mapLabel}: ${targetLabel}` : f.mapLabel);
  };
  const renderRoundCount = () => { $('[data-geo-score]').textContent = String(round?.score ?? 0); };
  const showRoundEnd = () => {
    $('[data-geo-prompt]').textContent = template(f.roundComplete, { score: round.score, total: round.total });
    $('[data-geo-feedback]').textContent = '';
    $('[data-geo-options]').replaceChildren();
    $('[data-geo-flag]').hidden = true;
    $('[data-geo-next]').hidden = true;
    $('[data-geo-new]').hidden = false;
    $('#geo-mode').disabled = false;
    $('#geo-scope').disabled = $('#geo-mode').value === 'continent';
    $('[data-geo-scope-label]').hidden = $('#geo-mode').value === 'continent';
    drawMap(null);
    round = null; reviewIds = null;
    $('[data-geo-review]').hidden = !saved.missedIds.length;
  };
  const nextQuestion = () => {
    if (!round) return;
    if (round.index >= round.total) { showRoundEnd(); return; }
    const mode = reviewIds ? 'country' : $('#geo-mode').value;
    const scope = reviewIds ? 'world' : ($('#geo-scope').disabled ? 'world' : $('#geo-scope').value);
    try {
      const question = makeGeographyQuestion({ features: geographyMapFeatures, mode, scope, random: rand, excludedIds: seen, includedIds: reviewIds ?? [] });
      round.question = question;
      round.index += 1;
      seen.push(question.target.id);
      answered = false;
      const country = localCountry(question.target);
      const region = continentLabels[continentGroup(question.target.continent)] || question.target.continent;
      $('[data-geo-prompt]').textContent = template(f.question, { number: round.index, total: round.total });
      const modeText = mode === 'flag'
        ? f.flagPrompt
        : mode === 'continent' ? template(f.continentPrompt, { country }) : template(f.countryPrompt, { country });
      $('[data-geo-feedback]').textContent = modeText;
      const flag = $('[data-geo-flag]');
      flag.hidden = mode !== 'flag';
      flag.textContent = mode === 'flag' ? flagEmoji(question.target.iso2) : '';
      if (mode === 'flag') flag.setAttribute('aria-label', f.flagImageLabel);
      const labels = question.options.map((option) => mode === 'continent' ? continentLabels[option] || option : localCountry(countries[option]));
      const options = $('[data-geo-options]');
      options.replaceChildren();
      question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'geo-answer'; button.dataset.geoAnswer = option; button.textContent = labels[index];
        button.addEventListener('click', () => answer(option));
        options.append(button);
      });
      $('[data-geo-next]').hidden = true;
      $('[data-geo-new]').hidden = true;
      drawMap(question); renderRoundCount();
    } catch {
      round = null;
      $('[data-geo-feedback]').textContent = f.noMissed;
      $('[data-geo-new]').hidden = false;
      $('[data-geo-review]').hidden = true;
    }
  };
  const answer = (value) => {
    if (!round?.question || answered) return;
    const question = round.question;
    answered = true;
    const right = answerGeographyQuestion(question, value);
    const country = localCountry(question.target);
    const region = continentLabels[continentGroup(question.target.continent)] || question.target.continent;
    const buttons = [...$('[data-geo-options]').querySelectorAll('[data-geo-answer]')];
    for (const button of buttons) {
      button.disabled = true;
      const correct = question.mode === 'continent' ? button.dataset.geoAnswer === question.correctValue : button.dataset.geoAnswer === question.target.id;
      if (correct) button.classList.add('is-correct');
      else if (button.dataset.geoAnswer === value && !right) button.classList.add('is-wrong');
    }
    saved.attempts += 1;
    if (right) {
      round.score += 1; saved.correct += 1;
      if (reviewIds) saved.missedIds = saved.missedIds.filter((id) => id !== question.target.id);
      $('[data-geo-feedback]').textContent = template(question.mode === 'continent' ? f.continentCorrect : f.correct, { country, continent: region });
    } else {
      if (!saved.missedIds.includes(question.target.id)) saved.missedIds.push(question.target.id);
      $('[data-geo-feedback]').textContent = template(f.incorrect, { country, continent: region });
    }
    persist(); renderRoundCount();
    if (round.index >= round.total) $('[data-geo-next]').textContent = f.nextQuestion;
    $('[data-geo-next]').hidden = false;
  };
  const start = (ids = null) => {
    reviewIds = ids ? [...ids] : null;
    seen = [];
    round = { index: 0, total: Math.min(10, reviewIds?.length ?? 10), score: 0, question: null };
    $('#geo-mode').disabled = Boolean(reviewIds);
    $('#geo-scope').disabled = Boolean(reviewIds) || $('#geo-mode').value === 'continent';
    $('[data-geo-scope-label]').hidden = $('#geo-mode').value === 'continent';
    $('[data-geo-review]').hidden = true;
    $('[data-geo-new]').hidden = true;
    $('[data-geo-feedback]').textContent = '';
    $('[data-geo-score]').textContent = '0';
    nextQuestion();
  };
  $('[data-geo-new]').addEventListener('click', () => start());
  $('[data-geo-next]').addEventListener('click', nextQuestion);
  $('[data-geo-review]').addEventListener('click', () => start(saved.missedIds));
  $('#geo-mode').addEventListener('change', () => { $('#geo-scope').disabled = $('#geo-mode').value === 'continent'; $('[data-geo-scope-label]').hidden = $('#geo-mode').value === 'continent'; });
  $('[data-geo-shapes]').addEventListener('click', (event) => {
    const path = event.target.closest('[data-geo-id]');
    if (path && round?.question?.mode === 'country' && countries[path.dataset.geoId]?.iso2) answer(path.dataset.geoId);
  });
  updateTotals(); drawMap(null);
  $('[data-geo-prompt]').textContent = '';
  $('[data-geo-feedback]').textContent = f.mapLabel;
  void geographyMapUpdatedAt;
}
