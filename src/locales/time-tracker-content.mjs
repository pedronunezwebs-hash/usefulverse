import { timeTrackerLocaleData } from './time-tracker.mjs';

export const timeTrackerEnglishCopy = [
  'Free Time Tracker',
  'Time tracker',
  'Track work sessions by task or project, pause and resume timers, then save locally or export a CSV.',
  'free time tracker, project time tracker, task time tracker, work session tracker, time log, free online time tracker',
  'Enter a task or project, start the timer, then pause or save the session.',
  'Your sessions stay in this browser unless exported. No account or sync is used; background tabs or sleeping devices may delay the timer. Save a backup before clearing browser data.',
];

const corrections = {
  ha: { copy: { 0: 'Mai bin diddigin lokaci kyauta' } },
};

export function timeTrackerContent(language) {
  if (language === 'en') return {
    ui: {
      'Task or project': 'Task or project', 'Start timer': 'Start timer', Pause: 'Pause', Resume: 'Resume',
      'Finish and save session': 'Finish and save session', 'Current session': 'Current session',
      'No timer is running.': 'No timer is running.', 'Timer paused.': 'Timer paused.', 'Total time tracked': 'Total time tracked',
      'Saved sessions on this page': 'Saved sessions on this page', 'No sessions yet.': 'No sessions yet.',
      'Save sessions on this device': 'Save sessions on this device', 'Load saved sessions': 'Load saved sessions',
      'Delete saved sessions': 'Delete saved sessions', 'Download CSV backup': 'Download CSV backup',
      'Clear this page': 'Clear this page', 'Remove session': 'Remove session',
      'Sessions stay in this browser. Nothing is uploaded. Keep this page open while a timer is running; background tabs and sleeping devices may delay updates.': 'Sessions stay in this browser. Nothing is uploaded. Keep this page open while a timer is running; background tabs and sleeping devices may delay updates.',
      'Time entry saved.': 'Time entry saved.', 'Time entry removed.': 'Time entry removed.',
      'Sessions saved on this device.': 'Sessions saved on this device.', 'Saved sessions loaded.': 'Saved sessions loaded.',
      'Saved sessions deleted from this device.': 'Saved sessions deleted from this device.', 'CSV download started.': 'CSV download started.',
      'This page was cleared. Saved data was not deleted.': 'This page was cleared. Saved data was not deleted.',
      'Could not save sessions. Browser storage may be unavailable or full.': 'Could not save sessions. Browser storage may be unavailable or full.',
      'No saved sessions were found.': 'No saved sessions were found.', 'The timer could not be paused. Try again.': 'The timer could not be paused. Try again.',
      'The timer could not be resumed. Try again.': 'The timer could not be resumed. Try again.',
      'This page can hold up to 500 sessions. Save or clear some first.': 'This page can hold up to 500 sessions. Save or clear some first.',
      'The session could not be saved.': 'The session could not be saved.', 'Could not create the CSV backup.': 'Could not create the CSV backup.',
      'Browser storage is unavailable.': 'Browser storage is unavailable.', 'Could not load saved sessions.': 'Could not load saved sessions.',
      'Started at': 'Started at', 'Ended at': 'Ended at', 'Duration (seconds)': 'Duration (seconds)',
      'Check the task name and try again.': 'Check the task name and try again.',
      'Timer started.': 'Timer started.', 'Timer resumed.': 'Timer resumed.',
    },
    copy: timeTrackerEnglishCopy,
  };
  const data = timeTrackerLocaleData[language];
  if (!data || Object.keys(data.ui ?? {}).length !== 41 || data.copy?.length !== timeTrackerEnglishCopy.length || data.copy.some((text) => !text)) {
    throw new Error(`Time tracker translations are incomplete for ${language}.`);
  }
  const copy = [...data.copy];
  copy[0] = copy[0].replace(/\.$/u, '');
  copy[1] = copy[1].replace(/\.$/u, '');
  const ui = { ...data.ui };
  delete ui.Project;
  Object.assign(ui, corrections[language]?.ui);
  Object.assign(copy, corrections[language]?.copy);
  return { ui, copy };
}
