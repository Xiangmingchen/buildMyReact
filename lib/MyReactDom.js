"use strict";

/**
 * Render element inside container
 * @param  {element} element
 * @param  {HTMLElement} container
 */
function render(element, container) {
  var domNode = element.createDomNode();
  element.children.forEach(function (child) {
    return render(child, domNode);
  });
  container.appendChild(domNode);
}

var ReactDOM = {
  render: render
};