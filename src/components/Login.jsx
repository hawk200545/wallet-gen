import React, { useState } from "react";
import * as z from "zod";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [valid_email, setValid_email] = useState("");
  const [valid_password, setValid_password] = useState("");

  function SubmitEvent() {
    //submit logic to the endpoint and wait for the response and Give the appropriate
  }

  const passwordChange = (e) => {
    setPassword(e.target.value);
    const pass_format = z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{5,}$/,
        "Password must contain at least one uppercase, one lowercase, one number, one special character, and be at least 8 characters long."
      );
    let response = pass_format.safeParse(password);
    if (!response.success) {
      setValid_password("Invalid Password Format");
    } else {
      setValid_password("");
    }
  };

  const emailChange = (e) => {
    setEmail(e.target.value);
    const email_format = z.email();
    let response = email_format.safeParse(email);
    console.log(response);
    if (!response.success) {
      setValid_email("Please Enter a valid email");
    } else {
      setValid_email("");
    }
  };

  return (
    <>
      <div className=" bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 ">
        <div className=" min-h-screen flex items-center justify-center text-slate-200 p-4">
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Branding */}
            <div>
              <div className="text-4xl font-bold mb-4 sm:text-6xl">
                Welcome to Hawk Wallet
              </div>
              <div className="text-m sm:text-lg">
                Secure your finances in style.
              </div>
            </div>

            {/* Right Side - Login Card */}
            <div className="backdrop-blur-lg bg-white/10 p-8 rounded-xl shadow-lg">
              <form className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">
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
                  <div className="text-red-400 text-sm mt-1">{valid_email}</div>
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
                  <div className="text-red-400 text-sm mt-1">
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
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
                />
              </form>
            </div>
          </div>
        </div>
        <div className="footer w-full backdrop:blur-2xl bg-black/10 flex flex-row justify-center gap-5 p-2">
          <div className="linkedin">
            <a href="https://www.linkedin.com/in/girisangar/">Linkedin</a>
          </div>
          <div className="github">
            <a href="https://github.com/hawk200545">GitHub</a>
          </div>
        </div>
      </div>
    </>
  );

}

export default Login;
