"use strict";

var myElem = /*#__PURE__*/React.createElement("div", {
  className: "btn btn-success m-3",
  onClick: function onClick() {
    alert("Hello!");
  }
}, "Hello, React!");
var container = document.getElementById("root");
ReactDOM.render(myElem, container);