async () => {
  const main = document.querySelector('main');
  if (!main || !document.querySelector('meta[name="robots"][content="noindex,follow"]')) throw Error('Missing noindex 404');
  const rect = main.getBoundingClientRect();
  const targets = [...document.querySelectorAll('a')].map(a => ({ label: a.textContent.trim(), width: a.getBoundingClientRect().width, height: a.getBoundingClientRect().height }));
  const failures = targets.filter(t => t.width < 44 || t.height < 44);
  if (document.documentElement.scrollWidth > innerWidth || Math.min(rect.left, innerWidth - rect.right) < 16 || failures.length) throw Error(JSON.stringify({ overflow: document.documentElement.scrollWidth - innerWidth, failures }));
  if (!window.axe) throw Error('Load the QA-only axe script before this probe');
  const a = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } });
  if (a.violations.length) throw Error(JSON.stringify(a.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))));
  return { url: location.href, title: document.title, lang: document.documentElement.lang, dir: document.documentElement.dir, width: innerWidth, scrollWidth: document.documentElement.scrollWidth, margins: [rect.left, innerWidth - rect.right], targets: targets.length, axeViolations: 0 };
}
