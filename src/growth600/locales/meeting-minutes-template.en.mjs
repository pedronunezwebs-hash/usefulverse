export const meetingMinutesTemplateEnglishCopy = Object.freeze({
  copyLanguage: 'en', localizationStatus: 'approved', name: 'Meeting Minutes Template',
  title: 'Meeting Minutes Template Free | UsefulVerse',
  description: 'Create structured meeting minutes with attendees, decisions, and action owners and due dates. Edit, print, or export Markdown.',
  intro: 'Use a clear meeting-minutes template for attendees, agenda topics, decisions, and action items. Every action can include an owner and due date.',
  howQuestion: 'What should meeting minutes include?',
  howAnswer: 'Record the meeting title, date, facilitator, attendees, agenda, decisions, and action items. Assign an owner and due date to each action so follow-up is clear.',
  privacyQuestion: 'Are my meeting notes uploaded or saved?',
  privacyAnswer: 'No. The template runs in this browser tab. It does not automatically save or upload your notes; export a Markdown file or print them if you want a copy.',
  fields: {
    title: 'Meeting title', date: 'Meeting date', facilitator: 'Facilitator (optional)', attendees: 'Attendees (one per line)', agenda: 'Agenda topics (one per line)', decisions: 'Decisions (one per line)', actions: 'Action items (one per line: task | owner | due date YYYY-MM-DD)',
    accuracyNote: 'This is a note-taking template, not an automatic meeting recorder or transcript generator.',
    privacyNote: 'Notes remain in this tab until you close it. Download or print them to keep a copy.',
    actionHint: 'Example: Review draft | Sam | 2026-10-16. Each action needs a responsible person and a valid date.',
    preview: 'Minutes preview',
  },
  actions: { preview: 'Preview minutes', download: 'Download Markdown', print: 'Print minutes', reset: 'Clear notes', result: 'Meeting minutes' },
  messages: { previewReady: 'Meeting minutes preview is ready.', checkInputs: 'Check the meeting title, lists, and action item format.', downloaded: 'Markdown file downloaded.', cleared: 'Notes cleared.' },
  additionalFaqs: [
    { question: 'How should I format an action item?', answer: 'Enter one action per line as task | owner | due date, using a valid YYYY-MM-DD date, for example: Send notes | Sam | 2026-10-16.' },
    { question: 'Can I print or export the minutes?', answer: 'Yes. Preview the structured notes, download them as a Markdown file, or use the print option in your browser.' },
    { question: 'Does this tool record or transcribe a meeting?', answer: 'No. It does not access a microphone or create a transcript. You enter the notes and decisions yourself.' },
  ],
});
