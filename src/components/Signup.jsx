import React, { useState } from "react";
import Footer from "./footer";
import * as z from "zod";

function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [valid_name, setValid_name] = useState("");
  const [valid_email, setValid_email] = useState("");
  const [valid_password, setValid_password] = useState("");

  function SubmitEvent() {
    // Submit logic
  }

  const nameChange = (e) => {
    const value = e.target.value;
    setName(value);
    const username_format = z
      .string()
      .min(3, "Minimum 3 characters")
      .max(10, "Maximum 10 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, underscores");
    const response = username_format.safeParse(value);
    setValid_name(response.success ? "" : response.error.issues[0].message);
  };

  const passwordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    const pass_format = z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
        "Password must be at least 8 characters with upper, lower, number, and special char."
      );
    const response = pass_format.safeParse(value);
    setValid_password(response.success ? "" : "Invalid Password Format");
  };

  const emailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const email_format = z.string().email();
    const response = email_format.safeParse(value);
    setValid_email(response.success ? "" : "Please Enter a valid email");
  };

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center text-slate-200 p-4">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Branding */}
          <div>
            <div className="text-4xl font-bold mb-4 sm:text-6xl">
              Welcome to Hawk Wallet
            </div>
            <div className="sm:text-lg">Secure your finances in style.</div>
          </div>

          {/* Signup Form */}
          <div className="backdrop-blur-lg bg-white/10 p-8 rounded-xl shadow-lg">
            <form className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={nameChange}
                  placeholder="Username"
                  className="w-full mt-1 p-2 rounded bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-red-400 text-xs mt-1 text-right">{valid_name}</div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={emailChange}
                  placeholder="Email"
                  className="w-full mt-1 p-2 rounded bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-red-400 text-xs mt-1 text-right">{valid_email}</div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={passwordChange}
                  placeholder="Password"
                  className="w-full mt-1 p-2 rounded bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-red-400 text-xs mt-1 text-right">
                  {valid_password}
                </div>
              </div>

              {/* Already have an account? */}
              <div className="text-xs">
                Already have an account?{" "}
                <a className="text-blue-500" href="/">
                  Login
                </a>
              </div>

              {/* Submit Button */}
              <input
                type="button"
                onClick={SubmitEvent}
                value="Sign up"
                className="bg-gradient-to-b w-full from-purple-400 to-purple-700 text-white font-medium px-6 py-2 rounded-lg shadow hover:brightness-110 transition"
              />
            </form>
          </div>
        </div>
      </div>

      {/* Footer fixed at bottom */}
      <Footer />
    </div>
  );
}

export default Signup;
