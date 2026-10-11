export const intervalTimerEnglishCopy = Object.freeze({
  name: 'Interval Timer',
  title: 'Free HIIT Interval Timer & Tabata Clock | UsefulVerse',
  description: 'Free HIIT/Tabata timer: edit work/rest rounds, optional sound, pause and resume. No signup or limit. Background tabs or sleeping devices may delay cues.',
  intro: 'Build a simple work-and-rest interval session for HIIT, Tabata-style workouts or custom circuits. Choose the interval lengths, rounds and a preparation countdown, then start the timer.',
  howQuestion: 'How do I use this interval timer?',
  howAnswer: 'Choose a preset or enter whole seconds for work, rest, rounds and optional preparation. Press Start to begin. Pause and resume preserve the current interval; Reset ends the session. The final round has no extra rest.',
  privacyQuestion: 'Does the interval timer upload my workout settings?',
  privacyAnswer: 'No. The timer runs in this browser and does not upload, store or send your settings to a server.',
  fields: {
    preset: 'Quick setup', custom: 'Custom intervals', tabata: 'Tabata · 20 s work / 10 s rest × 8', hiit: 'HIIT · 40 s work / 20 s rest × 10',
    workSeconds: 'Work interval (seconds)', restSeconds: 'Rest interval (seconds; 0 disables rest)', rounds: 'Rounds (1–99)', prepSeconds: 'Preparation countdown (seconds; optional)', secondsUnit: 'seconds',
    sound: 'Sound cues', soundHint: 'Play a short sound at phase changes and when finished',
    accuracyNote: 'Keep this page open and the device awake for best timing. Browsers may delay timers and sound in background tabs or while a device sleeps. Sound is optional and starts only after you press Start; no notification permission is needed.',
    phaseLabel: 'Phase', roundLabel: 'Round', remainingLabel: 'Time left', totalLabel: 'Session length', progressLabel: 'Progress',
    prep: 'Get ready', work: 'Work', rest: 'Rest', complete: 'Complete',
  },
  actions: { start: 'Start', pause: 'Pause', resume: 'Resume', reset: 'Reset' },
  messages: {
    started: 'Interval session started.', paused: 'Timer paused.', resumed: 'Timer resumed.', reset: 'Timer reset.', finished: 'Session complete. Nice work!',
    checkInputs: 'Enter whole seconds within the limits and choose 1–99 rounds.', workCue: 'Work interval.', restCue: 'Rest interval.', prepCue: 'Get ready.', soundUnavailable: 'Sound is unavailable in this browser; the timer still works.',
  },
  additionalFaqs: [
    { question: 'How long is a Tabata timer session?', answer: 'The common Tabata pattern is 20 seconds of work and 10 seconds of rest for 8 rounds: 4 minutes total, without an added rest after the final work interval.' },
    { question: 'Will the timer keep sounding if I switch tabs or lock my phone?', answer: 'Not reliably. Browsers can throttle background pages, and a sleeping device can delay both the timer and audio. Keep the page open and the device awake when precise cues matter.' },
    { question: 'Can I turn off the interval timer sound?', answer: 'Yes. Uncheck Sound cues before starting. The timer and visual phase changes continue without audio.' },
  ],
  copyLanguage: 'en', localizationStatus: 'approved',
});
