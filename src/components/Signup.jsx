import React, { useState } from "react";
import { toast } from 'sonner';
import Footer from "./footer";
import * as z from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [valid_name, setValid_name] = useState("");
  const [valid_email, setValid_email] = useState("");
  const [valid_password, setValid_password] = useState("");
  

  async function SubmitEvent() {
      if (valid_name || valid_email || valid_password) {
        toast.error("Please fix the errors before submitting.");
        return;
      }
      const data = {
        name,
        email,
        password 
      }

      try {
        let response = await axios.post(BACKEND_URL + "/api/signup", data);
        if (response.status === 200) {
          toast.success("Signup successful! Please login.");
          window.location.href = "/";
        } else {
          toast.error(response.data.message || "Signup failed. Please try again.");
        }
      } catch (error) {
        console.error('Signup error:', error);
        toast.error('An error occurred during signup.');
      }
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
    setValid_password(response.success ? "" : response.error.issues[0].message);
  };

  const emailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const email_format = z.string().email();
    const response = email_format.safeParse(value);
    setValid_email(response.success ? "" : "Please Enter a valid email");
  };

  return (
    <div className="bg-gradient-to-t from-matisse-950 via-gray-900 to-black h-screen w-full flex flex-col">
      <div className="flex-1 flex items-center justify-center text-matisse-400 p-4">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Branding */}
          <div className="m-auto">
            <div className="sm:text-2xl text-xl font-bold mb-4 md:text-6xl">
              Welcome to{" "}
              <span className="font-quintessential text-primary leading-relaxed">
                Hawk Wallet
              </span>
            </div>
            <div className="sm:text-lg text-md">Secure your finances in style.</div>
          </div>

          {/* Signup Form */}
          <div className="backdrop-blur-lg border border-matisse-200/20 bg-matisse-950/30 p-8 rounded-xl shadow-lg m-auto max-w-[300px] sm:max-w-[500px]">
            <form className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-light">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={nameChange}
                  placeholder="Username"
                  className="input-text"
                />
                <div className="warn-line">
                  {valid_name}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-light">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={emailChange}
                  placeholder="Email"
                  className="input-text"
                />
                <div className="warn-line">
                  {valid_email}
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-light">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={passwordChange}
                  placeholder="password"
                  className="input-text"
                />
                <div className="warn-line">
                  {valid_password}
                </div>
              </div>

              {/* Already have an account? */}
              <div className="text-xs">
                Already have an account?{" "}
                <a className="text-blue-500" onClick={()=>{
                  navigate('/');
                }}>
                  Login
                </a>
              </div>

              {/* Submit Button */}
              <input
                type="button"
                onClick={SubmitEvent}
                value="Sign up"
                className="submit-button"
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
