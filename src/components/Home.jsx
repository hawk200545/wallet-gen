import { useState } from "react";
import Header from './Header';

// logo imports

import down_arrow from '../assets/down-arrow.png';


function Home(props) {
    const email = props.email;
    const logoutHandle = () => {
      console.log("Logout")
    }
    return (
      <>
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 min-h-screen">
          <Header email={email} logoutHandle={logoutHandle}></Header>
          {/* Phrase handle*/}
          <div className="backdrop-blur-lg bg-white/10 p-4 rounded-3xl m-4">
            <div className="flex justify-between">
              <div className="text-lg font-semibold">Phrase</div>
              <button className="" onClick={()=>{
                console.log("hello");
              }}>
                <img src={down_arrow} alt="" className="w-5 h-auto" />
              </button>
            </div>
          </div>
        </div>
      </>
    );
}

export default Home;