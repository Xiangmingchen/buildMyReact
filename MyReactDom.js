/**
 * Render element inside container
 * @param  {element} element
 * @param  {HTMLElement} container
 */
function render(element, container) {
  const domNode = element.createDomNode()
  element.children.forEach(child => render(child, domNode))
  container.appendChild(domNode)
}

const ReactDOM = {
  render,
}
