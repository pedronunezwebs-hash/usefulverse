const shell = (id, content) => `<div class="tool-workspace expanded-tool-workspace" data-tool="${id}">${content}</div>`;

const templates = {
  'age-calculator': () => shell('age-calculator', `
    <div class="calculator-grid">
      <section class="calculator-card" aria-labelledby="age-calculate-title">
        <h2 id="age-calculate-title">Calculate age</h2>
        <label class="field-label" for="age-birth">Date of birth</label><input id="age-birth" class="tool-input" type="date" required>
        <label class="field-label" for="age-as-of">Age on date</label><input id="age-as-of" class="tool-input" type="date" required>
        <label class="field-label" for="age-leap-policy">Leap-day birthday in a non-leap year</label>
        <select id="age-leap-policy" class="tool-input"><option value="feb28">February 28</option><option value="march1">March 1</option></select>
        <div class="tool-actions"><button class="button button--primary" type="button" data-action="calculate-age">Calculate age</button><button class="button button--ghost" type="button" data-action="clear">Clear</button></div>
        <p class="tool-status" id="tool-status" aria-live="polite"></p>
      </section>
      <section class="calculator-card" aria-labelledby="age-result-title">
        <h2 id="age-result-title">Exact age</h2>
        <output class="calculation-result" id="age-exact" aria-live="polite">—</output>
        <div class="conversion-results">
          <p><span>Years</span><output id="age-years">—</output></p>
          <p><span>Months</span><output id="age-months">—</output></p>
          <p><span>Days</span><output id="age-days">—</output></p>
          <p><span>Total days alive</span><output id="age-total-days">—</output></p>
          <p><span>Next birthday</span><output id="age-next-birthday">—</output></p>
          <p><span>Days until birthday</span><output id="age-birthday-countdown">—</output></p>
        </div>
      </section>
    </div>`),

  'business-days-calculator': () => shell('business-days-calculator', `
    <div class="segmented" role="group" aria-label="Business day calculation">
      <button class="segment is-active" type="button" data-business-mode="between" aria-pressed="true">Business days between dates</button>
      <button class="segment" type="button" data-business-mode="add" aria-pressed="false">Add or subtract workdays</button>
    </div>
    <div class="calculator-grid">
      <section class="calculator-card" aria-labelledby="business-input-title">
        <h2 id="business-input-title">Choose dates</h2>
        <label class="field-label" for="business-start">Start date</label><input id="business-start" class="tool-input" type="date">
        <div id="business-end-fields"><label class="field-label" for="business-end">End date</label><input id="business-end" class="tool-input" type="date"></div>
        <div id="business-offset-fields" hidden><label class="field-label" for="business-offset">Workdays to add or subtract</label><input id="business-offset" class="tool-input" type="number" step="1" value="10" inputmode="numeric"></div>
        <label class="option-row" id="business-inclusive-wrap"><input id="business-inclusive" type="checkbox" checked> Count both start and end dates</label>
      </section>
      <section class="calculator-card" aria-labelledby="business-calendar-title">
        <h2 id="business-calendar-title">Set your workweek</h2>
        <p class="tool-hint">Choose the days that are weekends in your schedule.</p>
        <div class="day-options" id="business-weekend-days" role="group" aria-label="Weekend days"></div>
        <label class="field-label" for="business-holidays">Holiday dates (optional, YYYY-MM-DD, one per line)</label>
        <textarea id="business-holidays" class="tool-textarea" rows="4" placeholder="2026-12-25&#10;2027-01-01"></textarea>
      </section>
    </div>
    <div class="tool-actions"><button class="button button--primary" type="button" data-action="calculate-business-days">Calculate workdays</button><button class="button button--ghost" type="button" data-action="clear">Clear</button></div>
    <section class="result-block" aria-live="polite"><div class="result-block__heading"><span id="business-result-label">Business days</span></div><output class="calculation-result" id="business-result">—</output></section>
    <p class="tool-status" id="tool-status" aria-live="polite"></p>`),

  'image-to-pdf': () => shell('image-to-pdf', `
    <label class="field-label" for="images-pdf-files">Choose images</label>
    <input id="images-pdf-files" class="tool-input file-picker" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/avif,image/bmp,image/gif,image/apng,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,.jpg,.jpeg,.jpe,.jfif,.pjpeg,.pjp,.png,.apng,.webp,.heic,.heif,.avif,.bmp,.gif,.svg,.ico,.cur" multiple>
    <p class="file-meta" id="images-pdf-meta">Up to 20 images · 20 megapixels per image · no fixed file-size cap. Large batches depend on your device memory.</p>
    <ol class="tool-file-list" id="images-pdf-list" aria-label="Images in PDF page order"></ol>
    <div class="calculator-grid">
      <label class="field-label" for="images-pdf-size">PDF page size<select id="images-pdf-size" class="tool-input"><option value="a4">A4</option><option value="letter">US Letter</option><option value="fit">Fit each page to its image</option></select></label>
      <label class="field-label" for="images-pdf-orientation">Page orientation<select id="images-pdf-orientation" class="tool-input"><option value="auto">Automatic</option><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label>
      <label class="field-label" for="images-pdf-margin">White margin<select id="images-pdf-margin" class="tool-input"><option value="0">None</option><option value="12" selected>Small</option><option value="24">Large</option></select></label>
    </div>
    <div class="tool-actions"><button class="button button--primary" type="button" data-action="create-images-pdf">Create PDF</button><button class="button button--ghost" type="button" data-action="clear">Clear</button></div>
    <p class="tool-hint">Transparent areas become white. Animated images use only their first frame.</p><p class="tool-hint">AVIF and some HEIC files may depend on browser support.</p><p class="tool-status" id="tool-status" aria-live="polite"></p>
    <div class="file-downloads" id="images-pdf-downloads" aria-live="polite"></div>`),

  'favicon-generator': () => shell('favicon-generator', `
    <label class="field-label" for="favicon-file">Upload a logo or image</label><input id="favicon-file" class="tool-input file-picker" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,.svg">
    <p class="file-meta" id="favicon-file-meta">Choose a square PNG, JPG, WebP or SVG image (up to 10 MB).</p>
    <div class="calculator-grid">
      <section class="calculator-card" aria-labelledby="favicon-options-title">
        <h2 id="favicon-options-title">Set up your icon files</h2>
        <label class="field-label" for="favicon-app-name">Website or app name</label><input id="favicon-app-name" class="tool-input" type="text" maxlength="50" value="My website">
        <label class="field-label" for="favicon-short-name">Short name (optional)</label><input id="favicon-short-name" class="tool-input" type="text" maxlength="20" placeholder="Short name">
        <label class="field-label" for="favicon-padding">Image padding <span id="favicon-padding-value">10%</span></label><input id="favicon-padding" type="range" min="0" max="30" value="10">
        <label class="field-label" for="favicon-background">Background<select id="favicon-background" class="tool-input"><option value="transparent">Transparent</option><option value="#ffffff">White</option><option value="#000000">Black</option></select></label>
      </section>
      <section class="calculator-card favicon-preview-card" aria-labelledby="favicon-preview-title">
        <h2 id="favicon-preview-title">Preview</h2><canvas id="favicon-preview" width="180" height="180" role="img" aria-label="Favicon preview"></canvas>
      </section>
    </div>
    <div class="tool-actions"><button class="button button--primary" type="button" data-action="generate-favicon">Generate favicon pack</button><button class="button button--ghost" type="button" data-action="clear">Clear</button></div>
    <label class="field-label" for="favicon-snippet">HTML to add to your website</label><textarea id="favicon-snippet" class="tool-textarea tool-textarea--code" readonly placeholder="Your HTML snippet will appear here…"></textarea>
    <div class="tool-actions"><button class="button button--ghost" type="button" data-action="copy-favicon-snippet">Copy HTML snippet</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Choose an image to preview the generated icons.</p>
    <div class="file-downloads" id="favicon-downloads" aria-live="polite"></div>`),

  'image-format-converter': () => shell('image-format-converter', `
    <label class="field-label" for="image-convert-files">Choose images</label>
    <input id="image-convert-files" class="tool-input file-picker" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/avif,image/bmp,image/gif,image/apng,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,.jpg,.jpeg,.jpe,.jfif,.pjpeg,.pjp,.png,.apng,.webp,.heic,.heif,.avif,.bmp,.gif,.svg,.ico,.cur" multiple>
    <p class="file-meta" id="image-convert-meta">Up to 20 images · 20 megapixels per image · no fixed file-size cap. Large batches depend on your device memory.</p>
    <div class="calculator-grid">
      <label class="field-label" for="image-convert-format">Convert to<select id="image-convert-format" class="tool-input"><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></label>
      <label class="field-label" for="image-convert-quality">Quality for JPG and WebP <span id="image-convert-quality-value">88%</span><input id="image-convert-quality" type="range" min="50" max="100" value="88"></label>
      <label class="field-label" for="image-convert-background">Background for transparent images<select id="image-convert-background" class="tool-input"><option value="#ffffff">White</option><option value="#000000">Black</option><option value="transparent">Keep transparency when possible</option></select></label>
    </div>
    <p class="tool-hint">AVIF and some HEIC inputs depend on browser support. Animated GIF, APNG and WebP files become a still image. SVG is rasterized, not converted into an editable vector. Metadata is not copied.</p>
    <div class="tool-actions"><button class="button button--primary" type="button" data-action="convert-images">Convert and download</button><button class="button button--ghost" type="button" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Your original images remain unchanged and are not uploaded.</p>
    <div class="image-convert-preview" id="image-convert-preview" hidden></div>
    <div class="file-downloads" id="image-convert-downloads" aria-live="polite"></div>`),

  'markdown-html-converter': () => shell('markdown-html-converter', `
    <div class="segmented" role="group" aria-label="Conversion direction">
      <button class="segment is-active" type="button" data-markdown-mode="markdown-html" aria-pressed="true">Markdown to HTML</button>
      <button class="segment" type="button" data-markdown-mode="html-markdown" aria-pressed="false">HTML to Markdown</button>
    </div>
    <div class="option-row" id="markdown-options"><label><input id="markdown-gfm" type="checkbox" checked> GitHub Flavored Markdown</label><label><input id="markdown-breaks" type="checkbox"> Turn line breaks into HTML breaks</label></div>
    <div class="converter-grid">
      <section class="calculator-card"><label class="field-label" id="markdown-input-label" for="markdown-input">Markdown input</label><textarea id="markdown-input" class="tool-textarea tool-textarea--code tool-textarea--large" spellcheck="false" maxlength="500000" placeholder="# A heading&#10;&#10;Write **Markdown** here."></textarea></section>
      <section class="calculator-card"><label class="field-label" id="markdown-output-label" for="markdown-output">HTML output</label><textarea id="markdown-output" class="tool-textarea tool-textarea--code tool-textarea--large" readonly spellcheck="false" placeholder="Converted text will appear here…"></textarea></section>
    </div>
    <div class="tool-actions"><button class="button button--primary" type="button" data-action="convert-markdown-html">Convert</button><button class="button button--ghost" type="button" data-action="copy-markdown-output">Copy result</button><button class="button button--ghost" type="button" data-action="download-markdown-output">Download result</button><button class="button button--ghost" type="button" data-action="clear">Clear</button></div>
    <details class="preview-details"><summary>Safe preview</summary><iframe id="markdown-preview" class="markdown-preview" sandbox="" title="Safe preview of converted content" hidden></iframe></details>
    <p class="tool-status" id="tool-status" aria-live="polite"></p><div class="file-downloads" id="markdown-downloads" aria-live="polite"></div>`),

  'json-yaml-converter': () => shell('json-yaml-converter', `
    <div class="segmented" role="group" aria-label="Conversion direction">
      <button class="segment is-active" type="button" data-json-yaml-mode="json-yaml" aria-pressed="true">JSON to YAML</button>
      <button class="segment" type="button" data-json-yaml-mode="yaml-json" aria-pressed="false">YAML to JSON</button>
    </div>
    <div class="converter-grid">
      <section class="calculator-card"><label class="field-label" id="json-yaml-input-label" for="json-yaml-input">JSON input</label><textarea id="json-yaml-input" class="tool-textarea tool-textarea--code tool-textarea--large" spellcheck="false" maxlength="500000" placeholder='{"name":"UsefulVerse","fast":true}'></textarea></section>
      <section class="calculator-card"><label class="field-label" id="json-yaml-output-label" for="json-yaml-output">YAML output</label><textarea id="json-yaml-output" class="tool-textarea tool-textarea--code tool-textarea--large" readonly spellcheck="false" placeholder="Converted text will appear here…"></textarea></section>
    </div>
    <p class="tool-hint" id="json-yaml-note">YAML comments and formatting are not preserved when converting to JSON.</p>
    <div class="tool-actions"><button class="button button--primary" type="button" data-action="convert-json-yaml">Convert</button><button class="button button--ghost" type="button" data-action="copy-json-yaml">Copy result</button><button class="button button--ghost" type="button" data-action="download-json-yaml">Download result</button><button class="button button--ghost" type="button" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite"></p><div class="file-downloads" id="json-yaml-downloads" aria-live="polite"></div>`),
};

export function expandedToolMarkup(id) {
  return templates[id]?.() ?? '';
}
