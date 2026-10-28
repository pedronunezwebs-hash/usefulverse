// Run against a rendered page at the requested emulated width. This catches the
// RTL scroll area caused by a skip link positioned thousands of pixels left.
export function inspectResponsivePage(expectedWidth) {
  const root = document.documentElement;
  const before = { width: innerWidth, scrollWidth: root.scrollWidth };
  const main = document.querySelector('main.page-shell');
  const box = main?.getBoundingClientRect();
  const margins = box ? { left: box.left, right: innerWidth - box.right } : null;
  const skip = document.querySelector('.skip-link');
  let focusVisible = false;
  if (skip) {
    skip.focus();
    const box = skip.getBoundingClientRect();
    focusVisible = document.activeElement === skip && box.width > 0 && box.height > 0
      && box.left >= 0 && box.right <= innerWidth && box.top >= 0 && box.bottom <= innerHeight;
    skip.blur();
  }
  return { ...before, expectedWidth, focusVisible, margins,
    passed: before.width === expectedWidth && before.scrollWidth <= before.width && focusVisible
      && !!margins && margins.left >= 16 && margins.right >= 16 };
}

export function inspectMarkdownTouchTargets() {
  const failures = [...document.querySelectorAll('.markdown-editor button,.markdown-editor-options label')]
    .map(element => ({ label: element.textContent.trim(), box: element.getBoundingClientRect() }))
    .filter(({ box }) => box.width < 44 || box.height < 44)
    .map(({ label, box }) => ({ label, width: box.width, height: box.height }));
  return { passed: failures.length === 0, failures };
}
