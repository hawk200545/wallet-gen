import { useState } from "react";

function Header(props) {
    const email = props.email;
    const logoutHandle = props.logoutHandle;
    return (
        <>
            <div className="backdrop-blur-lg bg-white/10 w-full flex justify-between">
            <div className="text-m m-4 text-slate-100 font-semi-bold font-sans">{email}</div>
            <button 
            className="bg-gradient-to-b m-2 from-purple-400 to-purple-700 text-white font-medium px-6 py-2 rounded-lg shadow hover:brightness-110 transition"
            onClick={logoutHandle}
            >logout</button>
            </div>
        </>
    )
}

export default Header;