export function getParentNodes(el) {
  var parentNodes = [];
  while (el) {
    parentNodes.unshift(el);
    el = el.parentNode;
  }

  parentNodes.pop();

  return parentNodes;
}
