import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAppContext from "../hooks/useAppContext";
import Header from "./Header";
import CoinTabs from "./CoinTabs";
import WalletList from "./WalletList";
import WalletGenerator from "./WalletGenerator";
import MnemonicDisplay from "./MnemonicDisplay";
import { generateWalletKeys } from "../progs/wallet-gen";
import { toast } from "sonner";

function Home() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [activeCoin, setActiveCoin] = useState("bitcoin");
  const [userWallets, setUserWallets] = useState({
    bitcoin: { count: 0, addresses: [] },
    ethereum: { count: 0, addresses: [] },
    solana: { count: 0, addresses: [] },
  });
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [generatingWallet, setGeneratingWallet] = useState(false);

  const { signedIn, token, mnemonic, logoutHandle } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!signedIn) {
      navigate("/");
    }
  }, [signedIn, navigate]);

  const fetchWallets = useCallback(async () => {
    try {
      setLoading(true);

      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await axios.get(BACKEND_URL + "/api/wallets", {
        headers: {
          token,
          "Content-Type": "application/json",
        },
      });

      if (!response.data) {
        throw new Error("Invalid response structure");
      }

      const walletCounts = response.data.data || response.data;
      setUserWallets({
        bitcoin: { count: walletCounts.bitcoin || 0, addresses: [] },
        ethereum: { count: walletCounts.ethereum || 0, addresses: [] },
        solana: { count: walletCounts.solana || 0, addresses: [] },
      });
    } catch (error) {
      console.error("Failed to fetch wallet counts:", error);
    } finally {
      setLoading(false);
    }
  }, [token, BACKEND_URL]);

  const generateNewWallet = useCallback(async () => {
    try {
      if (!mnemonic) {
        throw new Error("No mnemonic available");
      }

      setGeneratingWallet(true);
      setLoading(true);

      const nextIndex = userWallets[selectedCoin].count + 1;
      const { publicKey, privateKey } = generateWalletKeys(
        mnemonic,
        nextIndex,
        selectedCoin
      );

      if (!publicKey || !privateKey) {
        throw new Error("Key generation failed");
      }

      const response = await axios.post(
        BACKEND_URL + "/api/increment-wallet",
        { coinType: selectedCoin },
        { headers: { token } }
      );

      if (!response.data?.success) {
        throw new Error("Server failed to increment wallet count");
      }

      setUserWallets((prev) => ({
        ...prev,
        [selectedCoin]: {
          count: prev[selectedCoin].count + 1,
          addresses: [
            ...prev[selectedCoin].addresses,
            { index: nextIndex, publicKey, privateKey },
          ],
        },
      }));

      toast.success(`${selectedCoin} wallet #${nextIndex} created!`);
      updateModal((state) => !state);
    } catch (error) {
      console.error("Wallet generation failed:", error);
      toast.error(error.message || "Failed to generate wallet");
    } finally {
      setGeneratingWallet(false);
      setLoading(false);
    }
  }, [mnemonic, selectedCoin, token, userWallets, BACKEND_URL]);

  useEffect(() => {
    let isMounted = true;

    const generateAddresses = async () => {
      if (!mnemonic || !userWallets) return;

      try {
        const newAddresses = {};
        let needsUpdate = false;

        for (const coinType of Object.keys(userWallets)) {
          const { count, addresses } = userWallets[coinType];
          if (count > 0 && addresses.length !== count) {
            const generatedAddresses = [];
            for (let i = 1; i <= count; i++) {
              const { publicKey, privateKey } = generateWalletKeys(
                mnemonic,
                i,
                coinType
              );
              generatedAddresses.push({ index: i, publicKey, privateKey });
            }
            newAddresses[coinType] = generatedAddresses;
            needsUpdate = true;
          } else {
            newAddresses[coinType] = addresses;
          }
        }

        if (isMounted && needsUpdate) {
          setUserWallets((prev) => {
            const updated = { ...prev };
            for (const coin in newAddresses) {
              updated[coin].addresses = newAddresses[coin];
            }
            return updated;
          });
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error generating addresses:", error);
        }
      }
    };

    generateAddresses();

    return () => {
      isMounted = false;
    };
  }, [
    mnemonic,
    userWallets.bitcoin.count,
    userWallets.ethereum.count,
    userWallets.solana.count,
    userWallets,
  ]);

  useEffect(() => {
    if (signedIn && token) {
      fetchWallets();
    }
  }, [signedIn, token, fetchWallets]);

  const [modalState, updateModal] = useState(false);

  return (
    <div className="bg-gradient-to-t from-matisse-950 via-gray-900 to-black min-h-screen space-y-8">
      <Header logoutHandle={logoutHandle} updateModal={updateModal} />

      <div className="container mx-auto p-10">
        <MnemonicDisplay mnemonic={mnemonic} />

        <div className="backdrop-blur-lg bg-white/5 border border-matisse-200/20 px-7 py-5 rounded-xl mb-8">
          <h2 className="text-xl mb-6 text-primary">Your Wallets</h2>
          <CoinTabs activeCoin={activeCoin} setActiveCoin={setActiveCoin} />
          <WalletList wallets={userWallets} activeCoin={activeCoin} />
        </div>

        {modalState && (
          <WalletGenerator
            selectedCoin={selectedCoin}
            setSelectedCoin={setSelectedCoin}
            mnemonic={mnemonic}
            onGenerate={generateNewWallet}
            isLoading={generatingWallet || loading}
            onClose={() => {
              updateModal((state) => !state);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
