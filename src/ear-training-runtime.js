import { checkEarTrainingAnswer, createEarTrainingQuestion, validateEarTrainingSettings } from './ear-training-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);
const $$ = (selector, root) => [...root.querySelectorAll(selector)];
const locale = window.usefulverseLocale ?? {};
const say = (phrase) => locale.runtime?.[phrase] ?? locale.messages?.[phrase] ?? phrase;
const fill = (phrase, values) => Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), say(phrase));

export function setupEarTraining(root) {
  const round = $('[data-ear-round]', root);
  const start = $('[data-ear-start]', root);
  const play = $('[data-ear-play]', root);
  const next = $('[data-ear-next]', root);
  const feedback = $('[data-ear-feedback]', root);
  const summary = $('[data-ear-summary]', root);
  const stats = $('[data-ear-stats]', root);
  const answerButtons = $$('[data-ear-answer]', root);
  let audio = null;
  let voices = [];
  let questions = 0;
  let index = 0;
  let score = 0;
  let streak = 0;
  let question = null;
  let answered = false;
  const stopVoices = () => {
    for (const voice of voices) { try { voice.stop(); } catch {} }
    voices = [];
  };
  const renderStats = () => {
    stats.textContent = `${fill('Round {current} of {total}', { current: Math.min(index + 1, questions), total: questions })} · ${fill('Score: {score}', { score })} · ${fill('Streak: {streak}', { streak })}`;
  };
  const makeQuestion = () => {
    question = createEarTrainingQuestion({ direction: $('[data-ear-direction]', root).value });
    answered = false;
    answerButtons.forEach((button) => { button.disabled = false; button.classList.remove('is-success', 'is-error'); });
    play.disabled = false;
    next.hidden = true;
    feedback.textContent = say('Your round is ready.');
    renderStats();
  };
  const finish = () => {
    round.hidden = true;
    summary.hidden = false;
    summary.textContent = fill('Round complete: {score}/{total} correct.', { score, total: questions });
    $('[data-ear-direction]', root).disabled = false;
    $('[data-ear-count]', root).disabled = false;
    start.disabled = false;
    start.focus();
  };
  const playInterval = async () => {
    try {
      const Context = window.AudioContext ?? window.webkitAudioContext;
      if (!Context) throw new Error('audio');
      audio ??= new Context();
      await audio.resume();
      stopVoices();
      const startAt = audio.currentTime + 0.04;
      const frequencies = [question.firstMidi, question.secondMidi].map((midi) => 440 * 2 ** ((midi - 69) / 12));
      frequencies.forEach((frequency, noteIndex) => {
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        const begins = startAt + noteIndex * 0.78;
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, begins);
        gain.gain.exponentialRampToValueAtTime(0.12, begins + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, begins + 0.62);
        oscillator.connect(gain).connect(audio.destination);
        oscillator.start(begins);
        oscillator.stop(begins + 0.64);
        voices.push(oscillator);
      });
      feedback.textContent = say('Listen, then choose the interval.');
    } catch {
      feedback.textContent = say('Audio could not start. Tap Play interval and check browser audio.');
    }
  };
  start.addEventListener('click', () => {
    try {
      const options = validateEarTrainingSettings({ questions: $('[data-ear-count]', root).value, direction: $('[data-ear-direction]', root).value });
      questions = options.questions; index = 0; score = 0; streak = 0; summary.hidden = true; round.hidden = false;
      $('[data-ear-direction]', root).disabled = true;
      $('[data-ear-count]', root).disabled = true;
      start.disabled = true;
      makeQuestion();
    } catch { feedback.textContent = say('Choose a valid practice setup.'); }
  });
  play.addEventListener('click', playInterval);
  answerButtons.forEach((button) => button.addEventListener('click', () => {
    if (!question || answered) return;
    answered = true;
    stopVoices();
    const correct = checkEarTrainingAnswer(question, button.dataset.earAnswer);
    answerButtons.forEach((item) => { item.disabled = true; });
    const correctButton = answerButtons.find((item) => item.dataset.earAnswer === question.intervalId);
    correctButton?.classList.add('is-success');
    if (correct) { score += 1; streak += 1; feedback.textContent = say('Correct!'); }
    else {
      streak = 0;
      const interval = say(({ 'minor-second': 'Minor second', 'major-second': 'Major second', 'minor-third': 'Minor third', 'major-third': 'Major third', 'perfect-fourth': 'Perfect fourth', tritone: 'Tritone', 'perfect-fifth': 'Perfect fifth', octave: 'Octave' })[question.intervalId]);
      button.classList.add('is-error');
      feedback.textContent = fill('Not quite. It was {interval}.', { interval });
    }
    renderStats();
    next.hidden = false;
    next.focus();
  }));
  next.addEventListener('click', () => {
    index += 1;
    if (index >= questions) { finish(); return; }
    makeQuestion();
    play.focus();
  });
  window.addEventListener('pagehide', () => { stopVoices(); if (audio && audio.state !== 'closed') void audio.close(); }, { once: true });
}
