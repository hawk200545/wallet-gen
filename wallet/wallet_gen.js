import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import crypto from "crypto";

const coin_type = {
  bitcoin: 0,
  ethereum: 60,
  solana: 501,
};

function key_gen(mnemonic, idx, coin) {
  const seed = mnemonicToSeedSync(mnemonic);

  const path = `m/44'/${coin_type[coin]}'/${idx}'/0'`;
  const derivedSeed = derivePath(path, seed.toString("hex")).key;

  const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
  const keypair = Keypair.fromSecretKey(secret);

  return {
    Pub_Key: keypair.publicKey.toBase58(),
    Priv_Key: bs58.encode(secret),
  };
}

function mnemonic_gen() {
  return generateMnemonic();
}

function generateKey(password, salt) {
  return crypto.scryptSync(password, salt, 32); 
}

function encryptMnemonic(mnemonic, password, iv) {
  const salt = crypto.randomBytes(16); 

  const key = generateKey(password, salt);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(mnemonic, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    salt: salt.toString("hex"),
    encryptedMnemonic: encrypted,
  };
}

function decryptMnemonic(encryptedData, password) {
  const { salt, iv, encryptedMnemonic } = encryptedData;

  
  const saltBuffer = Buffer.from(salt, "hex");
  const ivBuffer = Buffer.from(iv, "hex");

  const key = generateKey(password, saltBuffer);

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, ivBuffer);

  let decrypted = decipher.update(encryptedMnemonic, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

export {key_gen,mnemonic_gen,encryptMnemonic,decryptMnemonic};