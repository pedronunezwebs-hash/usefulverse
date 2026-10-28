// Native-DOM regressions for the maintainer's 3.4.17 security fixes:
// https://github.com/cure53/DOMPurify/releases/tag/3.4.17
// GHSA-cg2g-xh64-v4q7, GHSA-mrv2-3pqr-j5jr, GHSA-c6gr-qvv4-5v3f.
// Payloads are inspected, never evaluated or clicked; no network is needed.
export function checkDOMPurifySecurity(factory, window) {
  const document = window.document;
  const checks = [];
  const check = (id, run) => {
    try { run(); checks.push({ id, passed: true }); }
    catch (error) { checks.push({ id, passed: false, error: error.message }); }
  };
  const expect = (value, message) => { if (!value) throw Error(message); };

  check('ordinary-html-preserves-content-and-removes-executable-markup', () => {
    const sanitizer = factory(window);
    const clean = sanitizer.sanitize('<p>Hello <strong>world</strong><a href="https://example.com/">link</a></p><img onerror="probe()"><script>probe()</script>');
    expect(clean.includes('<strong>world</strong>') && clean.includes('https://example.com/'), 'ordinary content was lost');
    expect(!/onerror|<script/iu.test(clean), 'executable markup survived');
  });

  check('GHSA-cg2g-xh64-v4q7-shadow-text-is-scrubbed-after-merging', () => {
    const host = document.createElement('div');
    const shadow = host.attachShadow({ mode: 'open' });
    shadow.append(document.createTextNode('$'), document.createElement('object'), document.createTextNode('{regressionMarker}'));
    factory(window).sanitize(host, { IN_PLACE: true, SAFE_FOR_TEMPLATES: true });
    shadow.normalize();
    expect(!shadow.textContent.includes('${'), 'a template expression survived in the shadow tree');
  });

  check('GHSA-mrv2-3pqr-j5jr-detached-subtrees-are-neutralized', () => {
    for (const mode of ['parent', 'nextSibling']) {
      const sanitizer = factory(window);
      const root = document.createElement('div');
      root.innerHTML = '<figure><img class="remove-trigger"><img id="detached" onerror="regressionMarker()"></figure><p>Keep this</p>';
      document.body.append(root);
      const detached = root.querySelector('#detached');
      sanitizer.addHook('afterSanitizeAttributes', node => {
        if (node.classList?.contains('remove-trigger')) {
          if (mode === 'parent') node.parentNode.remove();
          else node.nextElementSibling?.remove();
        }
      });
      try {
        sanitizer.sanitize(root, { IN_PLACE: true });
        expect(!detached.hasAttribute('onerror'), `${mode}: a detached element kept its handler`);
      } finally { root.remove(); }
    }
  });

  check('GHSA-c6gr-qvv4-5v3f-xhtml-svg-animation-cannot-rewrite-href', () => {
    const sanitizer = factory(window);
    const clean = sanitizer.sanitize('<svg xmlns="http://www.w3.org/2000/svg"><a><animate attributeName="href" values="x;javascript:regressionMarker()" dur="1s" fill="freeze"/><text>Link</text></a></svg>', {
      PARSER_MEDIA_TYPE: 'application/xhtml+xml',
      ALLOWED_TAGS: ['svg', 'a', 'animate', 'text'],
      ALLOWED_ATTR: ['attributeName', 'values', 'dur', 'fill'],
    });
    expect(!/attributeName\s*=\s*["']href["']/iu.test(clean), 'an animation can still change the link destination');
  });
  return { version: factory(window).version, checks, passed: checks.every(c => c.passed) };
}
