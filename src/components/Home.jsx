import { useState } from "react";
import Header from './Header';
import axios from "axios";

import { useAppContext } from "./AppContext";
// logo imports

import down_arrow from '../assets/down-arrow.png';


function Home() { 
    const {
      signedIn,
      updateSignedIn,
      email,
      updateEmail,
      mnemonic,
      updateMnemonic,
      token,
      updateToken,
    } = useAppContext();


    const logoutHandle = () => {
      console.log("Logout")
      updateSignedIn(false);
      updateEmail("");
      updateMnemonic("");
      updateToken("");
      localStorage.setItem('token','');
    }

    const handleAuth = ()=>{
        const token = localStorage.getItem('token');
        if (token){
          let response = axios.get("http://localhost:3000/api/verify",{},{
            headers : {token}
          });
          if (response.status == 200){
            // To write the logic to get the mnemoic with the user password
          }else {
            location.href('/');
          }
        }
    }
    if(!signedIn){
      handleAuth();
    }
    

    return (
      <>
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 min-h-screen">
          <Header logoutHandle={logoutHandle}/>
          {/* Phrase handle*/}
          <div className="backdrop-blur-lg bg-white/10 p-4 rounded-3xl m-4">
            <div className="flex justify-between">
              <div className="text-lg font-semibold">Phrase</div>
              <button className="" onClick={()=>{
                console.log("hello");
              }}>
                <img src={down_arrow} alt="down arrow" className="w-5 h-auto" />
              </button>
            </div>
          </div>
        </div>
      </>
    );
}

export default Home;