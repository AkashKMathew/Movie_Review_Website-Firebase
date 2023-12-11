import "./App.css";
import Login from "./components/Login.js";
import Home from "./components/Home.js";
import Reviews from "./components/Reviews.js";
import Update from "./components/Update.js";
import Nav from "./components/Nav.js";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";

function App() {
  const [add, setAdd] = useState(0)

  return (
    <div className="App">
      
      <Routes>
        <Route path="/" element={<><Nav/><Home /></>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/reviews" element={<><Nav/><Reviews setAdd={setAdd}/></>}/>
        <Route path="/add" element={<Update add={add} setAdd={setAdd} />}/>
        <Route path="/update/:itemId" element={<Update add={add} setAdd={setAdd} />}/>
      </Routes>
    </div>
  );
}

export default App;
