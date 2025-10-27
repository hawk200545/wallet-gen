import { gcm } from '@noble/ciphers/aes';
import { pbkdf2 } from '@noble/hashes/pbkdf2';
import { sha256 } from '@noble/hashes/sha256';
import { Buffer } from 'buffer';

const toUint8Array = (value) => {
  if (!value) {
    return new Uint8Array();
  }
  return Uint8Array.from(value.split(',').map(Number));
};

export const decryptMnemonic = (encryptedPackage, password) => {
  if (!encryptedPackage || !password) {
    throw new Error('Missing encrypted data or password');
  }

  const salt = toUint8Array(encryptedPackage.salt);
  const iv = toUint8Array(encryptedPackage.iv);
  const cipherText = toUint8Array(encryptedPackage.encryptedMnemonic || encryptedPackage.encryptedData);

  if (!salt.length || !iv.length || !cipherText.length) {
    throw new Error('Invalid encrypted payload received');
  }

  const key = pbkdf2(sha256, Buffer.from(password, 'utf8'), salt, { c: 100000, dkLen: 32 });
  const aes = gcm(key, iv);
  const decryptedBytes = aes.decrypt(cipherText);
  return Buffer.from(decryptedBytes).toString('utf8');
};
