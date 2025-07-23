import React,{useState} from "react";
import Login from './components/Login'
import Signup from "./components/Signup";
import Home from "./components/Home";


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home email={"Hello@gmail.com"}/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
