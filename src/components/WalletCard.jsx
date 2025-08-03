import {
  CurrencyDollarIcon,
  CurrencyEuroIcon,
  CurrencyPoundIcon,
  EyeIcon,
  EyeOffIcon,
  ClipboardIcon,
  CheckIcon,
  LockClosedIcon,
  LockOpenIcon
} from "@heroicons/react/solid";
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';

export default function WalletCard({
  coinType,
  wallet,
  onCopy
}) {
  const [copied, setCopied] = useState(null);
  
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const CoinIcon = {
    bitcoin: CurrencyDollarIcon,
    ethereum: CurrencyEuroIcon,
    solana: CurrencyPoundIcon,
  }[coinType];

  const coinColors = {
    bitcoin: "text-yellow-400",
    ethereum: "text-purple-400",
    solana: "text-green-400",
  };

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = (text, keyType) => {
    navigator.clipboard.writeText(text);
    setCopied(keyType);
    toast.success(`${keyType === 'public' ? 'Public' : 'Private'} key copied!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
    });
    if (onCopy) onCopy(keyType);
  };

  const handleRevealClick = () => {
    setShowPrivateKey(!showPrivateKey);
  };

  const privateKey = wallet.privateKey;

  return (
    <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm hover:bg-white/10 transition-all border border-white/10 shadow-sm">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <CoinIcon className={`h-5 w-5 mr-2 ${coinColors[coinType]}`} />
            <h4 className="font-medium truncate text-white">
              {coinType.charAt(0).toUpperCase() + coinType.slice(1)} Wallet #{wallet.index}
            </h4>
          </div>
          
          {/* Public Key Section */}
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-gray-300">Public Key</span>
              <button
                onClick={() => handleCopy(wallet.publicKey, 'public')}
                className="p-1 text-gray-400 hover:text-white rounded hover:bg-white/10 transition"
                aria-label="Copy public key"
              >
                {copied === 'public' ? (
                  <CheckIcon className="h-4 w-4 text-green-400" />
                ) : (
                  <ClipboardIcon className="h-4 w-4" />
                )}
              </button>
            </div>
            <div className="font-mono text-xs break-all bg-black/20 p-3 rounded-lg overflow-x-auto">
              {wallet.publicKey}
            </div>
          </div>
        </div>

        {/* Reveal/Hide Button */}
        <button
          onClick={handleRevealClick}
          className="ml-3 p-2 rounded-full hover:bg-white/10 transition"
          aria-label={showPrivateKey ? "Hide private key" : "Show private key"}
        >
          {showPrivateKey ? (
            <LockOpenIcon className="h-5 w-5 text-purple-400" />
          ) : (
            <LockClosedIcon className="h-5 w-5 text-purple-400" />
          )}
        </button>
      </div>

      {/* Private Key Section */}
      {showPrivateKey && (
        <div className="mt-4 bg-black/20 p-4 rounded-lg border border-red-400/20 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-red-300 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Private Key
            </span>
            <button
              onClick={() => handleCopy(privateKey, 'private')}
              className="p-1 text-red-300/70 hover:text-red-300 rounded hover:bg-red-400/10 transition"
              aria-label="Copy private key"
            >
              {copied === 'private' ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <ClipboardIcon className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="font-mono text-xs break-all bg-black/30 p-3 rounded-lg overflow-x-auto">
            {privateKey}
          </div>
          <div className="mt-3 flex items-start text-xs text-yellow-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>Never share this key. Anyone with access can control all assets in this wallet.</span>
          </div>
        </div>
      )}

      
    </div>
  );
}