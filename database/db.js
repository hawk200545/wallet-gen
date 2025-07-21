import mongoose from "mongoose";
import dotenv from "dotenv";
import { required } from "zod/mini";
dotenv.config();
const mongo_url = process.env.mongo_url;

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
      bitcoin : 0,
      ethereum : 0,
      solana : 0
    },
  },
  salt : {
    type : String,
    required : true
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
