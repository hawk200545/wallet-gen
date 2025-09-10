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

function encryptMnemonic(mnemonic, password) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(mnemonic, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const authTag = cipher.getAuthTag();

  const encryptedData = Buffer.concat([encrypted, authTag]);

  return {
    salt: Array.from(salt).toString(),
    iv: Array.from(iv).toString(),
    encryptedMnemonic: Array.from(encryptedData).toString(),
  };
}

export {key_gen,mnemonic_gen,encryptMnemonic};