import { useState } from "react";
import Header from './Header';
function Home() {
    
    return (
      <>
        <Header/>
        <div>Welcome to Hawk Wallet</div>
        <div>
          <button>Signup</button>
          <button>Login</button>
        </div>
      </>
    );
}

export default Home;