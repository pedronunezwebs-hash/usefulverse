export const fontPairingToolEnglishCopy = Object.freeze({
  name: 'Font Pairing Tool',
  title: 'Font Pairing Tool: Free & Unlimited | UsefulVerse',
  description: 'Preview heading and body font pairs, adjust type scale, and copy CSS. Free, local font pairing with no account or remote font downloads.',
  intro: 'Compare heading and body fonts in a live sample. Start with system font pairings or choose files from your device; nothing is uploaded.',
  howQuestion: 'How do I preview a font pairing?',
  howAnswer: 'Choose a preset or select a heading and body font, then adjust sizes, weights and line height. Copy the generated CSS when the sample looks right.',
  privacyQuestion: 'Are my font files uploaded?',
  privacyAnswer: 'No. A font file you select is loaded into this browser session only. Clear the added fonts or reset the page to release them.',
  fields: {
    preset: 'Pairing preset', headingFont: 'Heading font', bodyFont: 'Body font', fontFiles: 'Add font files from this device (WOFF, WOFF2, TTF or OTF; up to 8 files, 5 MB each and 15 MB total)',
    accuracyNote: 'System fonts vary by device. Selected font files stay in this browser and use its memory; this tool cannot check their licence. No font catalog or external font is downloaded.',
    sampleHeading: 'Design that feels clear', sampleBody: 'A thoughtful type pairing makes a page easier to scan. Adjust the heading and body styles, then copy the CSS for your project.', hierarchyLabel: 'Live type preview',
    headingSize: 'Heading size', bodySize: 'Body size', headingWeight: 'Heading weight', bodyWeight: 'Body weight', lineHeight: 'Body line height',
    familyGeorgia: 'Georgia serif', familyTimes: 'Times serif', familyArial: 'Arial sans serif', familyVerdana: 'Verdana sans serif', familyTrebuchet: 'Trebuchet sans serif', familyMono: 'Courier monospace', familySystem: 'System sans serif',
    presetEditorial: 'Editorial', presetModern: 'Modern', presetClassic: 'Classic', presetTechnical: 'Technical', presetFriendly: 'Friendly', presetSystem: 'System',
  },
  actions: { applyPreset: 'Apply pairing', swap: 'Swap fonts', copyCss: 'Copy CSS', clearFonts: 'Clear added fonts', reset: 'Reset' },
  messages: {
    fontLoaded: 'Font loaded in this browser session.', fontLoadFailed: 'This font could not be loaded. Try another supported font file.', noFiles: 'Choose at least one font file.', tooMany: 'You can add up to 8 font files.', unsupported: 'Choose a WOFF, WOFF2, TTF or OTF font file.', fileTooLarge: 'Each font file must be 5 MB or smaller.', totalTooLarge: 'Added font files cannot exceed 15 MB in total.',
    copied: 'CSS copied.', copyUnavailable: 'Clipboard access is unavailable in this browser.', fontsCleared: 'Added fonts were removed from this session.', presetApplied: 'Pairing applied.', rolesSwapped: 'Heading and body fonts swapped.',
  },
  additionalFaqs: [
    { question: 'Can I use my own font files?', answer: 'Yes. Choose WOFF, WOFF2, TTF or OTF files from your device. They are loaded only in this browser session and are not uploaded. The tool accepts up to eight files, with a 5 MB per-file and 15 MB total limit.' },
    { question: 'Will the CSS look the same on every device?', answer: 'Not always. System fonts can differ by operating system, and another visitor may not have your selected font. For consistent results, your project must have a valid licence and provide the font itself; this tool does not host it.' },
    { question: 'Does this check font licences or download fonts?', answer: 'No. Built-in pairings use system font stacks. Optional files are chosen by you and stay in the browser; check the font provider’s licence before using a font in a project.' },
  ],
});
