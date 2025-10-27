import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import WalletCard from './WalletCard';

const WalletList = ({ wallets, activeCoin, loading, error }) => {
  const walletData = wallets?.[activeCoin] || { addresses: [], count: 0 };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#38bdf8" />
        <Text style={styles.loadingText}>Fetching wallets...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const data = walletData.addresses?.length
    ? walletData.addresses
    : Array.from({ length: walletData.count }, (_, index) => ({
        index: index + 1,
        publicKey: 'Generating...'
      }));

  return (
    <View>
      <Text style={styles.sectionTitle}>
        {activeCoin.charAt(0).toUpperCase() + activeCoin.slice(1)} Wallets ({
          walletData.addresses?.length || walletData.count || 0
        })
      </Text>
      <FlatList
        data={data}
        keyExtractor={(item) => `${activeCoin}-${item.index}`}
        renderItem={({ item }) => <WalletCard wallet={item} coinType={activeCoin} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No wallets yet.</Text>}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 12,
  },
  errorText: {
    color: '#f87171',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 16,
  },
  separator: {
    height: 16,
  },
  emptyText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 24,
  },
});

export default WalletList;
