export const mindMapMakerEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Mind Map Maker',
  title: 'Free Mind Map Maker: Branching Ideas | UsefulVerse',
  description: 'Make a mind map online: add branches, move ideas, undo edits, and export SVG or JSON. Free in your browser, no account.',
  intro: 'Start with one central topic, then build and rearrange branches as your ideas grow. Your map stays in this page until you export it.',
  howQuestion: 'How do I make a mind map?',
  howAnswer: 'Enter a central topic and create the map. Add an idea with the shared field, then use the branch controls to edit, reorder, move or remove it. Collapse branches to focus, undo a change, or export the full tree as SVG or JSON.',
  privacyQuestion: 'Are my ideas uploaded or saved?',
  privacyAnswer: 'No. The map stays in this browser tab and is not uploaded or saved to an account. Export JSON if you want to keep it or continue on another device.',
  fields: {
    centralTopic: 'Central topic (up to 160 characters)', newIdea: 'New idea for a child branch (up to 160 characters)', privacyNote: 'Your map stays in this tab unless you export it. It is not uploaded or automatically saved. Maps support up to 500 ideas.',
    mapLabel: 'Mind map ideas', editIdea: 'Edit idea', moveTo: 'Move idea under', jsonFile: 'Choose a JSON map backup', importHint: 'Import replaces the map currently shown. JSON files up to 500 KB are accepted.',
  },
  actions: {
    generate: 'Create mind map', reset: 'Clear map', example: 'Load an example', result: 'Your mind map', addChild: 'Add child idea', removeNode: 'Remove branch', moveUp: 'Move up', moveDown: 'Move down', moveNode: 'Move idea', collapse: 'Collapse branch', expand: 'Expand branch', undo: 'Undo', redo: 'Redo', exportSvg: 'Download SVG', exportJson: 'Download JSON', importJson: 'Import JSON backup',
  },
  messages: {
    created: 'Mind map ready.', updated: 'Idea updated.', added: 'Child idea added.', removed: 'Branch removed.', imported: 'Mind map imported.', importFailed: 'This is not a valid mind-map backup.', checkTopic: 'Enter a central topic up to 160 characters.', checkIdea: 'Check the idea text and map structure.', enterIdea: 'Enter an idea before adding a branch.',
  },
  additionalFaqs: [
    { question: 'Can I move an idea to another branch?', answer: 'Yes. Choose another valid parent and move the idea. The tool blocks moves that would make a node its own ancestor or create a cycle.' },
    { question: 'What is the difference between a mind map and a flowchart?', answer: 'A mind map organizes related ideas around a central topic with branches. A flowchart shows ordered steps and decisions; use the separate diagram maker for a simple linear process.' },
    { question: 'How do I keep or share a mind map?', answer: 'Download an SVG for a static diagram or JSON to reopen and edit the tree later. The tool does not upload the map or provide live collaboration.' },
  ],
});
