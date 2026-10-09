export const jsonModelGeneratorEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'JSON Model Generator', title: 'JSON Model Generator Free | UsefulVerse',
  description: 'Generate TypeScript interfaces, C# classes or Java models from JSON. Infer optional and nullable fields locally, then copy or download your code.',
  intro: 'Paste a JSON sample to draft TypeScript, C# or Java model declarations. Arrays and nested objects are inferred from the sample; nothing is uploaded.',
  howQuestion: 'How do I generate a model from JSON?',
  howAnswer: 'Paste a JSON object or array, choose TypeScript, C# or Java, enter a root class name and generate. Review the inferred types before using the code.',
  privacyQuestion: 'Is my JSON uploaded or saved?',
  privacyAnswer: 'No. Parsing and model generation run in this browser tab. Your JSON is not sent to a server or stored by this tool.',
  fields: {
    json: 'JSON sample', jsonHint: 'Paste valid JSON up to 500 KB. Arrays sample up to 300 items for type inference.',
    language: 'Target language', typescript: 'TypeScript', csharp: 'C#', java: 'Java',
    rootName: 'Root type name', rootNameHint: 'Letters, numbers and symbols are normalized into a valid type name.',
    accuracyNote: 'Generated declarations are estimates from the sample, not schema validation or compiler-checked code. C# and Java use object types for mixed unions; Java optional/null information is shown in comments.',
    privacyNote: 'Runs locally in this browser. No account, upload or API.', output: 'Generated source code', result: 'Model declarations',
  },
  actions: { example: 'Load example', generate: 'Generate models', reset: 'Clear', copy: 'Copy code', download: 'Download source' },
  messages: {
    generated: 'Model declarations generated locally.', exampleLoaded: 'Example loaded and generated.', emptyInput: 'Paste a JSON sample first.', tooLarge: 'JSON is larger than the 500 KB limit.',
    invalidJson: 'Invalid JSON. Check its quotes, commas and brackets.', tooManyValues: 'The sample contains too many values to analyze.', tooDeep: 'JSON nesting exceeds 24 levels.',
    emptyRootArray: 'An empty root array has no values to infer. Add a sample item.', invalidLanguage: 'Choose TypeScript, C# or Java.', nameTooLong: 'The root type name is too long.', generateFirst: 'Generate models before copying or downloading.',
    copied: 'Code copied.', copyUnavailable: 'Clipboard is unavailable in this browser.', downloaded: 'Source file downloaded.', invalid: 'Could not generate models from this sample.',
  },
  additionalFaqs: [
    { question: 'How are optional and nullable properties inferred?', answer: 'A property seen with null is marked nullable where the language supports it. In an array of objects, a property missing from some sampled objects is marked optional in TypeScript or noted in generated C# and Java.' },
    { question: 'Does this check that generated code compiles?', answer: 'No. It infers declarations from the JSON example only. Review names, numeric ranges, null handling and generated syntax in your compiler before using it in an application.' },
    { question: 'What happens when the sample contains multiple value types?', answer: 'TypeScript can express union types such as string | number. C# and Java use object/Object for heterogeneous unions; Java null and optional details are comments, not runtime validation.' },
  ],
});
