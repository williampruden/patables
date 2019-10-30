import React from "react";
import ReactDOM from "react-dom";
import Patables from './src/Patables'

function App() {
  return (
    <div className="App">
      <Patables />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
