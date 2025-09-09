import {Router} from "express";
import * as z from "zod";
import jwt from "jsonwebtoken";
import express from"express";
import {User} from "../database/db.js"
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import {key_gen, mnemonic_gen, encryptMnemonic} from "../../wallet/wallet_gen.js";
import {JWT_USER_SECRET} from '../../.config/config.js';
import {user_middleware} from "../middleware/admin_middleware.js";
const route = Router();
route.use(express.json());
route.post('/signup', async (req,res)=>{
    const user_parse = z.object({
        name: z.string().min(1, { message: "Name is required" }),
        email: z.email(),
        password: z
          .string()
          .min(5, { message: "Password Length must be atleast 5" })
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
            message:
              "Password must conatain atleat 1 Uppercase, 1 LowerCase, 1 Digit and a Special Character",
          }),
      });
      let parse_response =  user_parse.safeParse(req.body);
      if (parse_response.success){
        let data = parse_response.data;
        let response = await User.findOne({ email: data.email });
        if(response){
            res.status(403).json({
                message : "User already exist"
            })
        }else{
            const pass = data.password;
            // TODO: Consider increasing bcrypt salt rounds (e.g., to 10-12) for better security in production.
            data.password = await bcrypt.hash(data.password, 3);
            const mnemonic = mnemonic_gen();
            const { salt, iv, encryptedMnemonic } = encryptMnemonic(
              mnemonic,
              pass
            );
            data.salt = salt;
            data.iv = iv;
            data.encryptedMnemonic = encryptedMnemonic;
            let user = await User.create(data);
            res.status(200).json({
              message: "Signed up succesfully, please login",
              token: jwt.sign(
                {
                  id: user._id.toString(),
                },
                JWT_USER_SECRET
              ),
            });
        }
      }else {
        res.status(400).json({
            error : parse_response.error
        })
      }
});

route.post('/login', async (req,res)=>{
  const user_parse = z.object({
    email: z.email(),
    password: z
      .string()
      .min(5, { message: "Password Length must be atleast 5" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
        message:
          "Password must conatain atleat 1 Uppercase, 1 LowerCase, 1 Digit and a Special Character",
      }),
  });
  let parse_response = user_parse.safeParse(req.body);
  let data = parse_response.data;
  let err = parse_response.error;
  if (parse_response.success) {
    let response = await User.findOne({ email: data.email });
    if (response) {
      const check = await bcrypt.compare(data.password, response.password);
      if (check) {
        const salt = response.salt;
        const iv = response.iv;
        const encryptedMnemonic = response.encryptedMnemonic;
        res.json({
          message: "You are logged in...!",
          token: jwt.sign(
            {
              id: response._id.toString(),
            },
            JWT_USER_SECRET
          ),
          salt,
          iv,
          encryptedMnemonic,
        });
      } else{
        res.status(403).json({
          message: "Invalid Password",
        });
      }
    } else {
      res.status(404).json({ message : "Email is not registered, Please Signup" });
    }
  } else {
    res.status(400).json({ error: err });
  }
});

route.post("/generate_coin", user_middleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { mnemonic, coin } = req.body;

   
    await User.updateOne(
      { email: user.email },
      { $inc: { [`coins.${coin}`]: 1 } },
    );
    const updatedUser = await User.findOne({email : user.email});
    const idx = updatedUser.coins.get(coin);
    const keys = key_gen(mnemonic, idx, coin); 

    res.status(200).json(keys);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


route.get('/wallets', user_middleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    res.json({
      bitcoin: user.coins.get('bitcoin') || 0,
      ethereum: user.coins.get('ethereum') || 0,
      solana: user.coins.get('solana') || 0
    });
  } catch (e) {
    console.error("Error in /wallets endpoint:", e);
    res.status(500).json({ message: e });
  }
});

route.post('/increment-wallet', user_middleware, async (req, res) => {
  const { coinType } = req.body;
  try {
    const result = await User.updateOne(
      { _id: req.user.id },
      { $inc: { [`coins.${coinType}`]: 1 } }
    );
    await User.findOne({ _id: req.user.id });
    res.json({ success: true , result});
  } catch (error) {
    console.error("Error incrementing wallet:", error);
    res.status(500).json({ message: "Error incrementing wallet" });
  }
});

export const user_route = route;