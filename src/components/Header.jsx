import { useState } from "react";

function Header(props) {

    return (
        <>
        <div className="Header">
            <div className="mail">
                {props.mail}
            </div>
            <button className="logout">Logout</button>
        </div>
        </>
    )
}

export default Header;