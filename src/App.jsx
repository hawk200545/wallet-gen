import React, { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import { createContext } from "react";
import { AppContextProvider } from "./components/AppContext";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <AppContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home/>} />
          </Routes>
        </Router>
      </AppContextProvider>
    </>
  );
}

export default App;
