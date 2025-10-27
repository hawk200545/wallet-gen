import React, { useCallback, useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import CoinSelector from '../components/CoinSelector';
import MnemonicSection from '../components/MnemonicSection';
import WalletList from '../components/WalletList';
import CreateWalletModal from '../components/CreateWalletModal';
import useAppContext from '../hooks/useAppContext';
import { apiClient } from '../services/api';
import { generateWalletKeys } from '../utils/wallets';

const INITIAL_COUNTS = {
  bitcoin: 0,
  ethereum: 0,
  solana: 0,
};

const INITIAL_ADDRESSES = {
  bitcoin: [],
  ethereum: [],
  solana: [],
};

const HomeScreen = ({ navigation }) => {
  const { signedIn, hydrated, token, mnemonic } = useAppContext();
  const [activeCoin, setActiveCoin] = useState('bitcoin');
  const [walletCounts, setWalletCounts] = useState(INITIAL_COUNTS);
  const [walletAddresses, setWalletAddresses] = useState(INITIAL_ADDRESSES);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (hydrated && !signedIn) {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  }, [hydrated, signedIn, navigation]);

  const fetchWallets = useCallback(async () => {
    if (!token) return;

    setError('');
    setLoading(true);
    try {
      const { data } = await apiClient.get('/api/wallets');
      const response = data?.data || data || {};
      setWalletCounts({
        bitcoin: response.bitcoin || 0,
        ethereum: response.ethereum || 0,
        solana: response.solana || 0,
      });
    } catch (err) {
      console.error('Failed to fetch wallets', err);
      setError('Unable to fetch wallets. Pull to retry.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (signedIn) {
      fetchWallets();
    }
  }, [signedIn, fetchWallets]);

  useEffect(() => {
    if (!mnemonic) {
      setWalletAddresses(INITIAL_ADDRESSES);
      return;
    }

    const buildAddresses = () => {
      const next = { bitcoin: [], ethereum: [], solana: [] };
      try {
        (['bitcoin', 'ethereum', 'solana']).forEach((coin) => {
          const count = walletCounts[coin] || 0;
          if (!count) return;

          const addresses = [];
          for (let index = 1; index <= count; index += 1) {
            const keys = generateWalletKeys(mnemonic, index, coin);
            addresses.push(keys);
          }
          next[coin] = addresses;
        });
        setWalletAddresses(next);
      } catch (err) {
        console.error('Failed to derive wallet addresses', err);
        setError('Failed to derive wallet addresses locally.');
      }
    };

    buildAddresses();
  }, [mnemonic, walletCounts.bitcoin, walletCounts.ethereum, walletCounts.solana]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchWallets();
    setRefreshing(false);
  }, [fetchWallets]);

  const handleGenerateWallet = async () => {
    if (!mnemonic) {
      Alert.alert('Missing mnemonic', 'Unable to generate wallets without recovery phrase.');
      return;
    }

    try {
      setGenerating(true);
      const nextIndex = (walletCounts[selectedCoin] || 0) + 1;
      generateWalletKeys(mnemonic, nextIndex, selectedCoin);
      await apiClient.post('/api/increment-wallet', { coinType: selectedCoin });
      setWalletCounts((prev) => ({ ...prev, [selectedCoin]: nextIndex }));
      setModalVisible(false);
    } catch (err) {
      console.error('Wallet generation failed', err);
      const message = err.response?.data?.message || err.message || 'Failed to generate wallet.';
      Alert.alert('Wallet generation failed', message);
    } finally {
      setGenerating(false);
    }
  };

  const combinedWallets = {
    bitcoin: {
      count: walletCounts.bitcoin,
      addresses: walletAddresses.bitcoin,
    },
    ethereum: {
      count: walletCounts.ethereum,
      addresses: walletAddresses.ethereum,
    },
    solana: {
      count: walletCounts.solana,
      addresses: walletAddresses.solana,
    },
  };

  return (
    <View style={styles.container}>
      <HeaderBar onCreateWallet={() => { setSelectedCoin(activeCoin); setModalVisible(true); }} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38bdf8" />}>
        <MnemonicSection mnemonic={mnemonic} />

        <View style={styles.walletSection}>
          <CoinSelector activeCoin={activeCoin} onSelect={setActiveCoin} />
          <WalletList
            wallets={combinedWallets}
            activeCoin={activeCoin}
            loading={loading && !refreshing}
            error={error}
          />
        </View>
      </ScrollView>

      <CreateWalletModal
        visible={modalVisible}
        selectedCoin={selectedCoin}
        onSelectCoin={setSelectedCoin}
        onGenerate={handleGenerateWallet}
        onClose={() => setModalVisible(false)}
        loading={generating}
        disabled={generating}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  walletSection: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
});

export default HomeScreen;
