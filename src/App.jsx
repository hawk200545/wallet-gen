import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";

import { AppContextProvider } from "./components/AppContext";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <AppContextProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home/>} />
          </Routes>
      </AppContextProvider>
      <ToastContainer />
    </>
  );
}

export default App;
