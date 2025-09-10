import React, { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import Footer from "./footer";
import axios from "axios";
import { decryptMnemonic } from "../progs/wallet-gen.js";
import { useNavigate } from "react-router-dom";
import useAppContext from "../hooks/useAppContext";
function Login() {

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { updateEmail, updateSignedIn, updateMnemonic, updateToken } =
    useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [valid_email, setValid_email] = useState("");
  const [valid_password, setValid_password] = useState("");

  const navigate = useNavigate();

  async function SubmitEvent() {
    if (valid_email || valid_password) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    const data = {
      email,
      password,
    };
    try {
      let response = await axios.post(BACKEND_URL + "/api/login", data);
      if (response.status === 200) {
        toast.success("Login successful!");
        const { salt, iv, encryptedMnemonic } = response.data;
        const decryptedMnemonic = await decryptMnemonic(
          { salt, iv, encryptedMnemonic },
          password
        );
        updateEmail(email);
        updateMnemonic(decryptedMnemonic);
        updateToken(response.data.token);
        updateSignedIn(true);
        navigate("/home");
      } else {
        toast.error(response.data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login.");
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
    if (!response.success) {
      setValid_email("Please Enter a valid email");
    } else {
      setValid_email("");
    }
  };

  return (
    <>
      <div className="bg-gradient-to-t from-matisse-950 via-gray-900 to-black h-screen w-full flex flex-col">
        <div className="flex-1 flex items-center justify-center text-matisse-400 p-4">
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Branding */}
            <div className="m-auto">
              <div className="sm:text-2xl text-xl font-bold mb-4 md:text-6xl">
                Welcome to{" "}
                <span className="font-quintessential text-primary leading-relaxed">
                  Hawk Wallet
                </span>
              </div>
              <div className="sm:text-lg text-md">
                Secure your finances in style.
              </div>
            </div>
            {/* Right Side - Login Card */}
            <div>
              <div className="backdrop-blur-lg border border-matisse-200/20 bg-matisse-950/30 p-8 rounded-xl shadow-lg m-auto max-w-[300px] sm:max-w-[500px] ">
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
                      className="input-text"
                    />
                    <div className="warn-line">
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
                      className="input-text"
                    />
                    <div className="warn-line">
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
                    className="submit-button"
                  />
                </form>
              </div>
            </div>
          </div>
          {/* Footer Here */}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Login;
