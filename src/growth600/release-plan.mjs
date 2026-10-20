// Keep draft source in the public repository without exceeding the live Pages
// project's file limit. Only the isolated preview includes unpublished tools.
export function growthReleasePlan(tools, { previewOnly = false } = {}) {
  const selected = tools.filter((tool) => previewOnly ? tool.indexable === false : tool.indexable !== false);
  if (!selected.length) throw new Error('Growth release has no tools for the selected publication mode.');
  const noindexToolIds = selected.filter((tool) => tool.indexable === false).map(({ id }) => id);
  return { tools: selected, noindexToolIds, noindexHome: previewOnly, allowUnapprovedToolIds: noindexToolIds };
}
