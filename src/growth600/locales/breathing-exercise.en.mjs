export const breathingExerciseEnglishCopy = Object.freeze({
  copyLanguage: 'en', localizationStatus: 'approved', name: 'Breathing Exercise', title: 'Breathing Exercise — Free Online | UsefulVerse',
  description: 'Follow a free breathing timer with box, 4-7-8 or custom pacing. Optional sound, pause and reset; no account or upload.',
  intro: 'Choose a gentle breathing pace and follow the visual guide. Keep the session comfortable; stop whenever you want.',
  howQuestion: 'How do I use this breathing exercise?', howAnswer: 'Choose a preset or set each phase, select a session length and press Start. Pause or reset at any time. Audio is optional and begins only after you start.',
  privacyQuestion: 'Is my breathing session uploaded?', privacyAnswer: 'No. Timing runs in this page. No account, upload, API or saved session is used.',
  fields: { pattern: 'Breathing pattern', custom: 'Custom', balanced: 'Easy pace · inhale 4 / exhale 6', box: 'Box breathing · 4 / 4 / 4 / 4', fourSevenEight: '4-7-8 · inhale 4 / hold 7 / exhale 8', inhale: 'Inhale (seconds)', holdIn: 'Hold after inhale (seconds)', exhale: 'Exhale (seconds)', holdOut: 'Hold after exhale (seconds)', duration: 'Session length (seconds)', sound: 'Sound cues', soundHint: 'Play a soft tone when the phase changes', motionNote: 'The guide avoids forced movement when reduced motion is enabled.', safetyNote: 'This is a general wellness timer, not medical care. Breathe comfortably and stop if you feel unwell.', phase: 'Current phase', cycle: 'Cycle', remaining: 'Time left', inhaleCue: 'Breathe in', holdCue: 'Hold gently', exhaleCue: 'Breathe out', complete: 'Complete' },
  actions: { start: 'Start', pause: 'Pause', resume: 'Resume', reset: 'Reset' },
  messages: { started: 'Breathing session started.', paused: 'Session paused.', resumed: 'Session resumed.', reset: 'Session reset.', finished: 'Session complete. Take a comfortable breath.', checkInputs: 'Enter whole seconds within the shown limits.', soundUnavailable: 'Sound is unavailable here; the visual guide still works.', inhaleCue: 'Breathe in.', holdCue: 'Hold gently.', exhaleCue: 'Breathe out.' },
  example: { pattern: 'box', inhaleSeconds: 4, holdAfterInhaleSeconds: 4, exhaleSeconds: 4, holdAfterExhaleSeconds: 4, durationSeconds: 60 },
  additionalFaqs: [
    { question: 'Can I use box breathing or 4-7-8?', answer: 'Yes. Choose either preset or adjust the phase lengths. These are pacing patterns, not medical treatment.' },
    { question: 'Will it keep running when I close the tab?', answer: 'No guarantee. Browsers can pause background tabs and sleeping devices. Keep this page open and the device awake for the most reliable timing.' },
    { question: 'Can I turn off sound or stop early?', answer: 'Yes. Sound is optional, starts after you press Start and can be unchecked. Pause or Reset ends the active timing immediately.' },
  ],
});
