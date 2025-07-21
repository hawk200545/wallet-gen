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
      <form action="">
        
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={emailChange}
        />
        <div>{valid_email}</div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={passwordChange}
        />
        <div>{valid_password}</div>
      </form>
      <input type="button" onClick={SubmitEvent} value="Submit" />
    </>
  );
}

export default Login;
