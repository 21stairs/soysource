import React from "react";
// import { Counter } from "./features/counter/Counter";
import "./App.scss";
// import { Router } from "react-router-dom";
import MyNav from "./components/myNav";
import Home from "./components/Home";

function App() {
  return (
    <div className="App">
      <MyNav />
      <Home />
    </div>
  );
}

export default App;
