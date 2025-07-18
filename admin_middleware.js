import dotenv from "dotenv";
dotenv.config();
import express from "express";
import jwt from "jsonwebtoken";

const JWT_USER_SECRET = process.env.JWT_USER_SECRET;

function user_middleware(req, res, next) {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    const decoded = jwt.verify(token, JWT_USER_SECRET);

    req.user = { id: decoded.id }; 
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(403).json({ error: "Invalid credentials" });
  }
}
  

export { user_middleware };
