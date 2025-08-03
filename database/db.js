import mongoose from "mongoose";

import {mongo_url} from '../.config/config.js'

console.log("MongoDB URL:", mongo_url);

// Connect to MongoDB
const mongo_connect = async () => {
  try {
    await mongoose.connect(mongo_url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  encryptedMnemonic: {
    type: String,
    required: true,
  },
  iv: {
    type: String,
    required: true,
  },
  coins: {
    type: Map,
    of: Number,
    default: {
      bitcoin: 0,
      ethereum: 0,
      solana: 0,
    },
  },
  salt: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Create the User model
const user_schema = mongoose.model("User", userSchema);

// Connect to the database
mongo_connect();

export const User = user_schema;
