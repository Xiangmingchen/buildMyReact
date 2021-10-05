/**
  * An JS (React) object representing a Node in DOM, as well as ...
  * a node in Fiber tree data structure

  */
class Element {
 /*
  * @param {string} type: A HTML tagname, or "TEXT_ELEMENT" for text nodes
  * @param {Object} props: React properties
  * @param {Array<Element>} children: children React Elements
  */
  constructor(type, props, children) {
    this.type = type;
    this.props = props;
    this.children = children;
  }
  /**
   * Create a DOM node based on this React Element
   * @return {HTMLElement}
   */
  createDomNode() {
    let domNode = null;
    // Create the DOM node based on type
    switch (this.type) {
      case "TEXT_ELEMENT":
        domNode = document.createTextNode("")
        // nodeValue will be set later as a prop to overwrite the empty string
        break;
      default:
        domNode = document.createElement(this.type)
    }
    // Assign element props to the node
    Object.keys(this.props)
      .forEach(name => {
        domNode[name] = this.props[name]
      })
    return domNode
  }
}

/**
 * createElement equivalent of React
 * @param  {string} type                   type of element. e.g. h1
 * @param  {Object} props                  properties of the element. e.g. {disabled: true}
 * @param  {Array<Element>} children               Any number of children elements. e.g. React.createElement("div")
 * @return {Element}          An JS object representing a Node in DOM
 */
function createElement(type, props, ...children) {
  // Convert primitive types to TextElement
  const elementChildren = children.map(child =>
    (child instanceof Element) ? child : createTextElement(child)
  )
  return new Element(type, props, elementChildren)
}

function createTextElement(primitiveVal) {
  const props = {
    nodeValue: primitiveVal.toString()
  }
  return new Element("TEXT_ELEMENT"/* elem type */, props, [] /* no children */)
}


const React = {
  createElement,
}
