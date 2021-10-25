"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
  * An JS (React) object representing a Node in DOM, as well as ...
  * a node in Fiber tree data structure
  */
var Element = /*#__PURE__*/function () {
  /*
   * @param {string} type: A HTML tagname, or "TEXT_ELEMENT" for text nodes
   * @param {Object} props: React properties
   * @param {Array<Element>} children: children React Elements
   */
  function Element(type, props, children) {
    _classCallCheck(this, Element);

    this.type = type;
    this.props = props !== null && props !== void 0 ? props : {};
    this.children = children;
  }
  /**
   * Create a DOM node based on this React Element
   * @return {HTMLElement}
   */


  _createClass(Element, [{
    key: "createDomNode",
    value: function createDomNode() {
      var _this = this;

      var domNode = null; // Create the DOM node based on type

      switch (this.type) {
        case "TEXT_ELEMENT":
          domNode = document.createTextNode(""); // nodeValue will be set later as a prop to overwrite the empty string

          break;

        default:
          domNode = document.createElement(this.type);
      } // Assign element props to the node


      Object.keys(this.props).forEach(function (name) {
        domNode[name] = _this.props[name];
      });
      return domNode;
    }
  }]);

  return Element;
}();
/**
 * createElement equivalent of React
 * @param  {string} type                   type of element. e.g. h1
 * @param  {Object} props                  properties of the element. e.g. {disabled: true}
 * @param  {Array<Element>} children               Any number of children elements. e.g. React.createElement("div")
 * @return {Element}          An JS object representing a Node in DOM
 */


function createElement(type, props) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  // Convert primitive types to TextElement
  var elementChildren = children.map(function (child) {
    return child instanceof Element ? child : createTextElement(child);
  });
  return new Element(type, props, elementChildren);
}

function createTextElement(primitiveVal) {
  var props = {
    nodeValue: primitiveVal.toString()
  };
  return new Element("TEXT_ELEMENT"
  /* elem type */
  , props, []
  /* no children */
  );
}

var React = {
  createElement: createElement
};