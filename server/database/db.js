import mongoose from "mongoose";

export async function connectDB() {
  try {
    if (!process.env.MONGO_URL) throw new Error("MONGO_URL is not defined in .env");

    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 50000,
      connectTimeoutMS: 50000,
    });
    console.log("Connected to database");
  } catch (err) {
    console.error("Database connection failed", err);
    process.exit(1);
  }
}

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
export const User = mongoose.model("User", userSchema);