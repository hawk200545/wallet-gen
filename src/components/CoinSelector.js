import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COINS = [
  { id: 'bitcoin', label: 'Bitcoin' },
  { id: 'ethereum', label: 'Ethereum' },
  { id: 'solana', label: 'Solana' },
];

const CoinSelector = ({ activeCoin, onSelect }) => (
  <View style={styles.container}>
    {COINS.map((coin) => {
      const isActive = coin.id === activeCoin;
      return (
        <TouchableOpacity
          key={coin.id}
          style={[styles.chip, isActive && styles.activeChip]}
          onPress={() => onSelect(coin.id)}
        >
          <Text style={[styles.chipText, isActive && styles.activeChipText]}>{coin.label}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    marginRight: 12,
  },
  activeChip: {
    backgroundColor: '#0ea5e9',
  },
  chipText: {
    color: '#e2e8f0',
    fontWeight: '500',
  },
  activeChipText: {
    color: '#0f172a',
    fontWeight: '600',
  },
});

export default CoinSelector;
