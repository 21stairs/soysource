import React from "react";
import "./App.scss";
import { Route, Routes } from "react-router-dom";
import MyNav from "./components/myNav";
import Home from "./components/Home";
import RoomCreate from "./components/roomCreate";

function App() {
  return (
    <div className="App">
      <MyNav />
      <Routes>
        <Route exact={true} path="/" element={<Home />} />
        <Route exact={true} path="/room" element={<RoomCreate />} />
      </Routes>
    </div>
  );
}

export default App;
