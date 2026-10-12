export const familyTreeMakerEnglishCopy = Object.freeze({
  copyLanguage: 'en', localizationStatus: 'approved', name: 'Family Tree Maker',
  title: 'Family Tree Maker Free: Build & Export | UsefulVerse',
  description: 'Build a private family tree, check parent links, and export SVG or GEDCOM. Free, local and no account or genealogy lookup.',
  intro: 'Create a family chart from information you already know. Add people, connect parent links, then export a diagram or a GEDCOM file. The page does not search records or save your family data.',
  howQuestion: 'How do I make a family tree?',
  howAnswer: 'Add each person once, then connect a parent to a child. The chart blocks duplicate links, more than two listed parents and ancestry cycles. Export an SVG diagram or GEDCOM text file when you are ready.',
  privacyQuestion: 'Is my family information uploaded or saved?',
  privacyAnswer: 'No. The chart stays in this page session. It is not uploaded or saved to browser storage. An exported file is yours to store and share, so check it for private details first.',
  fields: {
    personName: 'Person name', birthDate: 'Birth date (optional)', deathDate: 'Death date (optional)', notes: 'Private note (optional)',
    parent: 'Parent', child: 'Child', relationship: 'Parent relationship', biological: 'Biological', adoptive: 'Adoptive', foster: 'Foster',
    people: 'People in this tree', emptyTree: 'Add a person to begin.', privacyNote: 'Family details can be sensitive. Data stays in memory until you close or reset this page; exports may contain private information.',
  },
  actions: { addPerson: 'Add person', linkPeople: 'Connect parent and child', exportSvg: 'Download SVG chart', exportGedcom: 'Download GEDCOM', reset: 'Start a new tree', result: 'Family tree' },
  messages: { personAdded: 'Person added.', linkAdded: 'Family link added.', invalidEntry: 'Check the person details and selected relationship.', emptyTree: 'Add people and parent links first.', exported: 'Your file was downloaded.' },
  additionalFaqs: [
    { question: 'Can this tool find relatives or public records?', answer: 'No. It only organizes details you enter. It does not search records, verify identities or establish legal relationships.' },
    { question: 'What is a GEDCOM file?', answer: 'GEDCOM is a text format used to move family-history records between compatible genealogy programs. Check an exported file before sharing it.' },
    { question: 'Does the chart support more than two parents?', answer: 'This version allows up to two listed parents per person. A family relationship may be more complex than this chart can represent.' },
  ],
});
