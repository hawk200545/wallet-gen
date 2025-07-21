import React, { useState } from "react";
import * as z from "zod";
function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [valid_name,setValid_name] = useState("");
  const [valid_email, setValid_email] = useState("");
  const [valid_password, setValid_password] = useState("");

  function SubmitEvent() {
    //submit logic to the endpoint and wait for the response and Give the appropriate
  }

const nameChange = (e) => {
  const value = e.target.value;
  setName(value);
  const username_format = z
    .string()
    .min(3, "Minimum 3 characters")
    .max(10, "Maximum 10 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    );
  const response = username_format.safeParse(value);
  if (!response.success) {
    console.log(response)
    setValid_name(response.error.issues[0].message); 
  } else {
    setValid_name("");
  }
};


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
      <button>Signup</button>
      <button>Login</button>
      <form action="">
        <label htmlFor="name">Name:</label>
        <input
          type="name"
          id="name"
          name="name"
          value={name}
          onChange={nameChange}
        />
        <div>{valid_name}</div>
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

export default Signup;
