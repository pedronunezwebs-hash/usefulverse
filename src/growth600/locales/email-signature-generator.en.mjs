export const emailSignatureGeneratorEnglishCopy = Object.freeze({
  copyLanguage: 'en', localizationStatus: 'approved', name: 'Email Signature Generator',
  title: 'Email Signature Generator Free | UsefulVerse',
  description: 'Create a simple email signature with links and an optional small logo. Preview and copy it free in your browser.',
  intro: 'Build a clean, compact email signature with your contact details, a color accent, and an optional logo. Preview it, then copy the formatted block or its HTML.',
  howQuestion: 'How do I make an email signature?',
  howAnswer: 'Add your name and optional contact details, choose an accent color, then generate the signature. Copy the formatted block into your email settings or copy its HTML if your email app supports it.',
  privacyQuestion: 'Are my details uploaded?',
  privacyAnswer: 'No. Your details and optional logo are handled in this browser tab and are not uploaded or automatically saved.',
  fields: Object.freeze({
    fullName: 'Full name', jobTitle: 'Job title', organization: 'Organization', email: 'Email address', phone: 'Phone number', website: 'Website', location: 'Location', accentColor: 'Accent color', logoFile: 'Optional logo image', logoAlt: 'Logo description',
    logoHint: 'PNG, JPEG, or GIF; up to 512 KiB and 1,600 × 1,600 px. The image is embedded in the signature, but some email apps remove embedded images.',
    clientNote: 'Email apps display signatures differently. A table layout and inline styles improve compatibility, but check the result in your email app before sending.',
    privacyNote: 'Your details and image stay in this browser tab. Nothing is uploaded or automatically saved.',
    resultTitle: 'Signature preview', htmlLabel: 'HTML source',
  }),
  actions: Object.freeze({ generate: 'Create signature', copy: 'Copy formatted signature', copyHtml: 'Copy HTML', download: 'Download HTML', reset: 'Reset' }),
  messages: Object.freeze({ generated: 'Signature created.', checkInputs: 'Check the name, contact details, website, and logo.', copied: 'Formatted signature copied.', copiedHtml: 'HTML source copied.', copyUnavailable: 'Copy is not available in this browser.', downloaded: 'HTML file downloaded.', logoUnavailable: 'That image could not be read. Choose a PNG, JPEG, or GIF up to 512 KiB.' }),
  additionalFaqs: Object.freeze([
    Object.freeze({ question: 'Will this signature look identical in every email app?', answer: 'No. Email apps support different HTML and image features. This generator uses a compact table and inline styles, but you should test the pasted signature in your own email app.' }),
    Object.freeze({ question: 'Can I use a logo in my signature?', answer: 'Yes. Choose a PNG, JPEG, or GIF up to 512 KiB. It is embedded as image data; some email apps block or remove embedded images, so a text-only signature may be more reliable.' }),
    Object.freeze({ question: 'Does the generator send or save my contact details?', answer: 'No. It builds the signature in this browser tab. You choose when to copy or download it; this page does not upload or automatically save your details.' }),
  ]),
});
