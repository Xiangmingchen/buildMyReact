"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Use this function as callback parameter of requestIdleCallback.
 * This function will execute as many units of work as possible given the
 * idle deadline. It executes at least 1 unit of work to begin with.
 * Rely on:
 *   performUnitOfWork(unitOfWork): execute current work, then return next
 *     unit of work
 *   nextUnitOfWork: variable that stores what this function will work on next.
 *     When it is null, then do nothing in current loop.
 */
function workLoop(deadline) {
  // shouldYeild: when true, we should stop working and let browser continue
  // main tasks. Initially is false so that we execute at least 1 unit of work
  var shouldYeild = false;

  while (nextUnitOfWork != null && !shouldYeild) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYeild = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}

var nextUnitOfWork = null;
/**
 * Start the rendering process by initializing fiber root
 * @param  {Element} element
 * @param  {HTMLElement} container
 */

function render(element, container) {
  var sentinelRootElement = new Element("ROOT", {}, [element]);
  nextUnitOfWork = new FiberNode(sentinelRootElement, null, container);
}

function performUnitOfWork(currFiber) {
  // Construct DOM node for the current element
  // Skip root fiber node, whose domNode is the overall container, also no parent
  if (!currFiber.isRoot()) {
    currFiber.domNode = currFiber.element.createDomNode(); // Unit of work
    // Insert the DOM node we just created to its parent's DOM node

    currFiber.parent.domNode.appendChild(currFiber.domNode);
  }

  var prevChild = null; // Create a new fiber node for each child, and make relations

  currFiber.element.children.forEach(function (child, idx) {
    var childFiberNode = new FiberNode(child, currFiber);

    if (idx === 0) {
      currFiber.firstChild = childFiberNode;
    }

    if (prevChild != null) {
      prevChild.sibling = childFiberNode;
    }

    prevChild = childFiberNode;
  }); // Search for next unit of work
  // First check if we have children

  if (currFiber.firstChild != null) {
    return currFiber.firstChild;
  } // When no children, check sibling


  var fiberToCheck = currFiber; // When no sibling, go up then check sibling

  while (fiberToCheck.sibling == null && !fiberToCheck.isRoot()) {
    fiberToCheck = fiberToCheck.parent;
  } // If we are back to root, we are done


  if (fiberToCheck.isRoot()) {
    return null;
  } // Otherwise we have a sibling to work on next


  return fiberToCheck.sibling;
}
/*
 * FiberNode:
 *   Attributes
 *     domNode: The DOM node rendered from element
 *     parent: The parent node, null for root
 *     element: The React element corresponding to this node
 *   Methods:
 *     isRoot(): Whether this node is root. (Check if parent is null)
 *   Relations that need to be well maintained by external functions:
 *     sibling: The next sibling node of this node. null if this is the last child
 *     firstChild: The first
 * Related Global Variables
 */


var FiberNode = /*#__PURE__*/function () {
  /**
   * @param {Element} element The react element
   * @param {FiberNode} parent   Must pass in non-null when this node is not root
   * @param {HTMLElement} domNode  Only pass this in when creating root node
   */
  function FiberNode(element, parent) {
    var domNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, FiberNode);

    this.element = element;
    this.parent = parent;
    this.domNode = domNode;
  }

  _createClass(FiberNode, [{
    key: "isRoot",
    value: function isRoot() {
      return this.parent == null;
    }
  }]);

  return FiberNode;
}();

var ReactDOM = {
  render: render
}; // Start the loop

requestIdleCallback(workLoop);