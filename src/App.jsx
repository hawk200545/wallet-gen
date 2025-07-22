import React,{useState} from "react";
import Login from './components/Login'
import Signup from "./components/Signup";
import Home from "./components/Home";
import Header from "./components/Header";

function App() {
  const [home,SetHome] = useState(false);
  const [login,SetLogin] = useState(true);
  return (
    <>
     {login && <Login />}
     {/* <Signup /> */}
      <Header mail="hello@gmail.com"/>
      {/* <Home></Home> */}
    </>
  );
}

export default App;
