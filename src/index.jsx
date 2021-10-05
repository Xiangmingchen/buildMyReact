const myElem = <div
  className="btn btn-success m-3"
  onClick={() => {alert("Hello!")}}>
    Hello, React!
  </div>

const container = document.getElementById("root")
ReactDOM.render(myElem, container)
