import "./App.css";
import Login from "./components/Login.js";
import Home from "./components/Home.js";
import Reviews from "./components/Reviews.js";
import Update from "./components/Update.js";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/reviews" element={<Reviews/>}/>
        <Route path="/add" element={<Update/>}/>
        <Route path="/update" element={<Update/>}/>
      </Routes>
    </div>
  );
}

export default App;
