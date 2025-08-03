import { useState, useCallback } from 'react';
import {
  generateSecureMnemonic,
  deriveWalletKeys,
  encryptData,
  decryptData
} from './wallet-gen';

export function useWallet() {
  const [mnemonic, setMnemonic] = useState('');
  const [wallets, setWallets] = useState({});
  const [encryptedMnemonic, setEncryptedMnemonic] = useState(null);

  // Initialize with new mnemonic
  const initializeWallet = useCallback(() => {
    const newMnemonic = generateSecureMnemonic();
    setMnemonic(newMnemonic);
    return newMnemonic;
  }, []);

  // Encrypt mnemonic with password
  const encryptMnemonic = useCallback((password) => {
    if (!mnemonic) throw new Error("No mnemonic to encrypt");
    const encrypted = encryptData(mnemonic, password);
    setEncryptedMnemonic(encrypted);
    return encrypted;
  }, [mnemonic]);

  // Decrypt mnemonic with password
  const decryptMnemonic = useCallback(async (encryptedData, password) => {
    const decrypted = await decryptData(encryptedData, password);
    setMnemonic(decrypted);
    return decrypted;
  }, []);

  // Generate wallets for a specific coin type
  const generateWallets = useCallback((coinType, count = 1) => {
    if (!mnemonic) throw new Error("Mnemonic not available");
    
    const newWallets = deriveWalletKeys(mnemonic, coinType, 0, count);
    setWallets(prev => ({
      ...prev,
      [coinType]: newWallets
    }));
    
    return newWallets;
  }, [mnemonic]);

  return {
    mnemonic,
    wallets,
    encryptedMnemonic,
    initializeWallet,
    encryptMnemonic,
    decryptMnemonic,
    generateWallets
  };
}