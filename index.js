// TODO replace with JSX after getting babel
const myElem = React.createElement(
  "h1" /* React / HTML element name */,
  {style: `color: red;`} /* props */,
  "Hello World!" /* children */
)
const container = document.getElementById("root")
ReactDOM.render(myElem, container)
