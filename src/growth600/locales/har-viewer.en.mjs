export const harViewerEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'HAR Viewer', title: 'HAR Viewer & Analyzer Free | UsefulVerse', description: 'View and analyze HAR files for free in your browser. Filter requests, inspect timing and errors, and see a waterfall. Files stay on your device.',
  intro: 'Open a HAR network capture locally to review requests, response codes, transfer sizes and timing. Filter the list and spot slow or failing calls. Nothing is uploaded.',
  howQuestion: 'How do I view a HAR file?', howAnswer: 'Choose a HAR or JSON file, or paste its contents, then select Analyze. Filter requests by URL text, method or status. The viewer shows a compact waterfall and summary.',
  privacyQuestion: 'Is my HAR uploaded?', privacyAnswer: 'No. The file is read and analyzed in this browser only. HAR captures can contain session cookies, authorization headers, personal data and private URLs. Query values and credentials are hidden in the request list, but inspect your original file before sharing it.',
  exampleHar: JSON.stringify({ log: { version: '1.2', creator: { name: 'UsefulVerse example', version: '1' }, entries: [
    { startedDateTime: '2026-01-01T12:00:00.000Z', time: 48, request: { method: 'GET', url: 'https://example.com/' }, response: { status: 200, bodySize: 7200, content: { size: 7200, mimeType: 'text/html' } }, timings: { blocked: 1, dns: 4, connect: 8, send: 1, wait: 24, receive: 10 } },
    { startedDateTime: '2026-01-01T12:00:00.020Z', time: 180, request: { method: 'GET', url: 'https://example.com/api/items?token=sample' }, response: { status: 503, bodySize: 320, content: { size: 320, mimeType: 'application/json' } }, timings: { blocked: 0, dns: -1, connect: -1, send: 1, wait: 170, receive: 9 } },
    { startedDateTime: '2026-01-01T12:00:00.030Z', time: 36, request: { method: 'GET', url: 'https://cdn.example.com/site.css' }, response: { status: 200, bodySize: 18400, content: { size: 18400, mimeType: 'text/css' } }, timings: { blocked: 0, dns: 2, connect: 4, send: 1, wait: 12, receive: 17 } },
  ] } }, null, 2),
  fields: {
    file: 'HAR or JSON file', paste: 'Or paste HAR JSON', pasteHint: 'The file is processed locally. Maximum file size: 5 MiB and 5,000 requests.',
    privacyWarning: 'HAR files may contain cookies, authorization tokens, personal data and private URLs. This page never uploads the file. Request query values are hidden in the list; paths and hosts may still identify private systems. Do not share a capture you have not checked.',
    search: 'Filter requests', method: 'Method', statusFilter: 'Status', all: 'All', errorsOnly: 'Errors (4xx/5xx)', successOnly: 'Successful (2xx/3xx)',
    totalRequests: 'Requests', failedRequests: 'Errors (4xx/5xx)', transferred: 'Response content', totalTime: 'Sum of request times', slowest: 'Slowest request',
    request: 'Request', response: 'Status', duration: 'Time (ms)', size: 'Content size', waterfall: 'Waterfall', results: 'Matching requests', shown: 'Showing', of: 'of',
    noMatches: 'No requests match these filters.', methodLabel: 'Method', statusLabel: 'Status', urlLabel: 'Sanitized URL', durationLabel: 'Duration', sizeLabel: 'Response size',
    timingNote: 'The sum of request times is not page-load time because requests can overlap. Waterfall positions use HAR timestamps when available.',
    unknownDate: 'No timestamp', invalid: 'Check that this is a valid HAR 1.2 file with a log.entries array.', tooMany: 'This HAR contains too many requests for a safe preview.',
  },
  actions: { analyze: 'Analyze HAR', example: 'Load example', reset: 'Clear', showMore: 'Show next 100', result: 'HAR analysis' },
  messages: { analyzed: 'HAR analyzed locally.', emptyInput: 'Choose a file or paste HAR JSON.', tooLarge: 'This file exceeds the 5 MiB limit.', invalidJson: 'The file is not valid JSON.', invalidHar: 'This JSON does not have the expected HAR log.entries structure.', tooManyEntries: 'This HAR has more than 5,000 requests.', tooManyValues: 'This HAR is too complex to process safely.', tooDeep: 'This HAR is nested too deeply.', fileReadError: 'The selected file could not be read.', invalid: 'Could not analyze this HAR file.' },
  additionalFaqs: [
    { question: 'Can I filter HAR requests by status or method?', answer: 'Yes. Search the sanitized URL, host or request metadata, then narrow the list by HTTP method or successful/error status. The summary remains based on the full capture.' },
    { question: 'Does the HAR waterfall show exact page-load time?', answer: 'No. It visualizes the request timestamps and durations recorded in the HAR. Requests can overlap, and the sum of their durations is not the page-load time.' },
    { question: 'Are cookies and authorization headers displayed?', answer: 'No. Headers and request bodies are not displayed. Query-string values are hidden in the request list, but paths or hosts could still contain private information; review the capture before sharing it.' },
  ],
});
