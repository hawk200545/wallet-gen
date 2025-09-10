import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { ethers } from "ethers";
import * as bitcoin from 'bitcoinjs-lib';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';

const bip32 = BIP32Factory(ecc);

const COIN_TYPE = {
  bitcoin: 0,
  ethereum: 60,
  solana: 501,
};

// Generate keys without server interaction
export function generateWalletKeys(mnemonic, index, coinType) {
  if (!validateMnemonic(mnemonic)) {
    throw new Error("Invalid mnemonic phrase");
  }

  const seed = mnemonicToSeedSync(mnemonic);
  const path = `m/44'/${COIN_TYPE[coinType]}'/${index}'/0'`;

  if (coinType === 'solana') {
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const keyPair = nacl.sign.keyPair.fromSeed(derivedSeed);
    const solanaKeypair = Keypair.fromSecretKey(keyPair.secretKey);

    return {
      publicKey: solanaKeypair.publicKey.toBase58(),
      privateKey: bs58.encode(keyPair.secretKey),
      coinType,
      index
    };
  } else if (coinType === 'ethereum') {
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
    return {
      publicKey: wallet.address,
      privateKey: wallet.privateKey,
      coinType,
      index
    };
  } else if (coinType === 'bitcoin') {
    const root = bip32.fromSeed(seed, bitcoin.networks.bitcoin);
    const child = root.derivePath(path);
    const { address } = bitcoin.payments.p2pkh({ pubkey: child.publicKey, network: bitcoin.networks.bitcoin });
    return {
      publicKey: address,
      privateKey: child.toWIF(),
      coinType,
      index
    };
  } else {
    throw new Error('Unsupported coin type');
  }
}

// Secure mnemonic generation
export function generateSecureMnemonic() {
  return generateMnemonic(256); // 24-word phrase
}

// Browser-compatible encryption
export async function encryptData(text, password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  return {
    salt: Array.from(salt).toString(),
    iv: Array.from(iv).toString(),
    encryptedData: Array.from(new Uint8Array(encrypted)).toString()
  };
}

export async function decryptData(encryptedPackage, password) {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new Uint8Array(encryptedPackage.salt.split(',').map(Number)),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
  
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(encryptedPackage.iv.split(',').map(Number))
    },
    key,
    new Uint8Array(encryptedPackage.encryptedData.split(',').map(Number))
  );
  
  return new TextDecoder().decode(decrypted);
}

export function decryptMnemonic(encryptedData, password) {
    const { salt, iv, encryptedMnemonic } = encryptedData;
    
    const encryptedPackage = {
      salt: salt,
      iv: iv,
      encryptedData: encryptedMnemonic
    }
    return decryptData(encryptedPackage, password);
  }
