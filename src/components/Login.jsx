import React, { useState, useEffect } from "react";
import * as z from "zod";
import Footer from "./footer";
import axios from "axios";
import useAppContext from "../hooks/useAppContext";
import { useNavigate } from "react-router-dom";
function Login() {
  const {updateEmail,updateSignedIn,updateMnemonic,updateToken} = useAppContext();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState();
  const [valid_email, setValid_email] = useState("");
  const [valid_password, setValid_password] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/home');
    }
  }, [navigate]);

  async function SubmitEvent() {
    
    if (valid_email || valid_password) {
      alert("Please fix the errors before submiting");
      return;
    }
    const data = {
      email,
      password,
    };
    let response = await axios.post("http://localhost:3000/api/login", data);
    if((await response).status == 200){
      alert('login successfull');
      console.log(response.data);
      updateEmail(email);
      updateMnemonic(response.data.mnemonic);
      updateToken(response.data.token);
      updateSignedIn(true);
      navigate("/home");
      
    }
  }

  const passwordChange = (e) => {
    setPassword(e.target.value);
    const pass_format = z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{5,}$/,
        "Password must contain at least one uppercase, one lowercase, one number, one special character, and be at least 8 characters long."
      );
    let response = pass_format.safeParse(e.target.value);
    if (!response.success) {
      setValid_password("Invalid Password Format");
    } else {
      setValid_password("");
    }
  };

  const emailChange = (e) => {
    setEmail(e.target.value);
    const email_format = z.email();
    let response = email_format.safeParse(e.target.value);
    console.log(response);
    if (!response.success) {
      setValid_email("Please Enter a valid email");
    } else {
      setValid_email("");
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 min-h-screen flex flex-col justify-between">
        <div className="flex-1 flex items-center justify-center flex-col text-slate-200 ">
          <div className="max-w-4xl w-full grid grid-cols-1 align-middle md:grid-cols-2 gap-8 items-center mt-auto">
            {/* Left Side - Branding */}
            <div className="mx-4">
              <div className="text-4xl text-left font-bold mb-4 sm:text-6xl">
                Welcome to Hawk Wallet
              </div>
              <div className="text-m text-left sm:text-lg">
                Secure your finances in style.
              </div>
            </div>
            <div>
              {/* Right Side - Login Card */}
              <div className="backdrop-blur-lg mx-4 bg-white/10 p-8 rounded-xl shadow-lg ">
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium"
                    >
                      Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      value={email}
                      onChange={emailChange}
                      className="w-full mt-1 p-2 rounded bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="text-red-400 text-xs mt-1 text-right">
                      {valid_email}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium"
                    >
                      Password:
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      value={password}
                      onChange={passwordChange}
                      className="w-full mt-1 p-2 rounded bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="text-red-400 text-xs mt-1 text-right">
                      {valid_password}
                    </div>
                  </div>
                  <div className="text-xs">
                    Don't have account?{" "}
                    <a className="text-blue-500" href="/signup">
                      Signup
                    </a>
                  </div>
                  <input
                    type="button"
                    onClick={SubmitEvent}
                    value="Submit"
                    className="bg-gradient-to-b w-full from-purple-400 to-purple-700 text-white font-medium px-6 py-2 rounded-lg shadow hover:brightness-110 transition"
                  />
                </form>
              </div>
            </div>
          </div>
          {/* Footer Here */}
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Login;
