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
  let shouldYeild = false;

  while(nextUnitOfWork != null && ! shouldYeild) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYeild = deadline.timeRemaining() < 1
  }

  if (nextUnitOfWork == null && wipRoot != null) {
    commitRoot();
  }

  requestIdleCallback(workLoop)
}

let nextUnitOfWork = null; // "next unit of render"
let wipRoot = null; // "work in progress" root. Rendered, but not yet commited

/**
 * Start the rendering process by initializing fiber root
 * @param  {Element} element
 * @param  {HTMLElement} container
 */
function render(element, container) {
  const sentinelRootElement = new Element("ROOT", {}, [element]);
  wipRoot = new FiberNode(sentinelRootElement, null, container);
  nextUnitOfWork = wipRoot;
}

function performUnitOfWork(currFiber) {
  // Render phase: Construct DOM node for the current element
  // Skip root fiber node, whose domNode is the overall container, also no parent
  if (!currFiber.isRoot()) {
    currFiber.domNode = currFiber.element.createDomNode(); // Unit of work
    // Leave the insertion of DOM node to Commit phase
  }

  let prevChild = null
  // Create a new fiber node for each child, and make relations
  currFiber.element.children.forEach((child, idx) => {
    const childFiberNode = new FiberNode(child, currFiber)
    if (idx === 0) {
      currFiber.firstChild = childFiberNode;
    }
    if (prevChild != null) {
      prevChild.sibling = childFiberNode
    }
    prevChild = childFiberNode;
  })

  // Search for next unit of work
  // First check if we have children
  if (currFiber.firstChild != null) {
    return currFiber.firstChild;
  }
  // When no children, check sibling
  let fiberToCheck = currFiber;
  // When no sibling, go up then check sibling
  while (fiberToCheck.sibling == null && !fiberToCheck.isRoot()) {
    fiberToCheck = fiberToCheck.parent;
  }
  // If we are back to root, we are done
  if (fiberToCheck.isRoot()) {
    return null
  }
  // Otherwise we have a sibling to work on next
  return fiberToCheck.sibling;
}

// Call recursive helper to commit the rendered DOM nodes to DOM
function commitRoot() {
  commitNode(wipRoot.firstChild);
  wipRoot = null;
}

/**
 * Recursively insert all children and sibling into parent's DOM node
 * @param  {FiberNode} fiberNode
 */
function commitNode(fiberNode) {
  if (!fiberNode) {
    return
  }
  // Insert the DOM node we rendered before to its parent's DOM node
  fiberNode.parent.domNode.appendChild(fiberNode.domNode);
  commitNode(fiberNode.firstChild);
  commitNode(fiberNode.sibling);
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
class FiberNode {
  /**
   * @param {Element} element The react element
   * @param {FiberNode} parent   Must pass in non-null when this node is not root
   * @param {HTMLElement} domNode  Only pass this in when creating root node
   */
  constructor(element, parent, domNode = null) {
    this.element = element;
    this.parent = parent;
    this.domNode = domNode;
  }
  isRoot() {
    return this.parent == null;
  }
}

const ReactDOM = {
  render,
}

// Start the loop
requestIdleCallback(workLoop)
