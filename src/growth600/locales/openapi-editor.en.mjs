export const openApiEditorEnglishCopy = Object.freeze({
  name: 'OpenAPI editor',
  title: 'OpenAPI Editor Free | UsefulVerse',
  description: 'Edit and lint OpenAPI 3.0 or 3.1 JSON and YAML locally. Free editor with local references and a documentation preview.',
  intro: 'Edit an OpenAPI contract, check common structure issues, and preview its documented operations. Your text stays in this browser.',
  howQuestion: 'Can I try API endpoints here?',
  howAnswer: 'No. This editor checks and previews the contract only. It never sends requests to the API described in your file.',
  privacyQuestion: 'Is my OpenAPI file uploaded?',
  privacyAnswer: 'No. The contract is parsed in this browser. YAML support loads a small local parser file on first use; there is no conversion API.',
  fields: {
    format: 'Document format', autoFormat: 'Detect automatically', jsonFormat: 'JSON', yamlFormat: 'YAML', document: 'OpenAPI document', upload: 'Import a JSON or YAML file (maximum 300 KB)',
    accuracyNote: 'Checks common OpenAPI 3.0/3.1 structure and local references; not a complete standards certification. Remote $ref links are rejected and never fetched. No API endpoint is contacted.',
    previewTitle: 'Contract preview', operations: 'Operations', issues: 'Findings', yamlLicense: 'YAML parser license (MIT)',
  },
  actions: { validate: 'Check contract', example: 'Load example', format: 'Format document', download: 'Download file', copyReport: 'Copy report' },
  messages: {
    empty: 'Enter an OpenAPI document first.', tooLarge: 'The document exceeds the 300 KB limit.', yamlUnavailable: 'The local YAML parser could not be loaded. Check that this page is online, then try again.', invalidSyntax: 'The document is not valid JSON or YAML.',
    valid: 'No issues found in the checks provided.', invalid: 'Review the findings below.', noOperations: 'No supported operations were found.', operationCount: '{count} operations found.', exampleLoaded: 'Example loaded.', formatted: 'Document formatted locally.', downloaded: 'Document downloaded.', copied: 'Report copied.', copyUnavailable: 'Clipboard access is unavailable.',
    rootObject: 'The document root must be an object.', version: 'Use an OpenAPI 3.0.x or 3.1.x version.', info: 'Add info.title and info.version.', paths: 'Add a non-empty paths object.', tooManyPaths: 'The path limit is 500.', complexity: 'The document is too complex to inspect safely.',
    invalidPath: 'A path must start with /.', invalidPathItem: 'A path item must be an object.', invalidOperation: 'An operation must be an object.', operationId: 'Add an operationId.', duplicateOperationId: 'operationId must be unique.', responses: 'Add at least one response.', responseDescription: 'Use a valid response code and a non-empty description.', parameter: 'A parameter needs a name and location.', pathParameter: 'Declare this path parameter with in: path.', remoteReference: 'Only local JSON Pointer references are allowed; this reference was not fetched.', unresolvedReference: 'This local reference does not resolve.',
  },
  additionalFaqs: [
    { question: 'Does this run API calls or check whether a server is online?', answer: 'No. It never calls the API described by the contract, so it cannot test authentication, responses, or server availability.' },
    { question: 'Does it validate the complete OpenAPI standard?', answer: 'No. It checks common version, info, path, operation, response, parameter, and local reference rules. Use an authoritative validator for full schema conformance.' },
    { question: 'Are remote references downloaded?', answer: 'No. Only local JSON Pointer references inside the document are checked. URLs and other remote references are reported and never requested.' },
  ],
});
