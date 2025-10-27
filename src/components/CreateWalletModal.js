import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COIN_OPTIONS = [
  { id: 'bitcoin', label: 'Bitcoin' },
  { id: 'ethereum', label: 'Ethereum' },
  { id: 'solana', label: 'Solana' },
];

const CreateWalletModal = ({
  visible,
  selectedCoin,
  onSelectCoin,
  onGenerate,
  onClose,
  loading,
  disabled,
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>Create new wallet</Text>

        <View style={styles.selector}>
          {COIN_OPTIONS.map((coin) => {
            const isActive = coin.id === selectedCoin;
            return (
              <TouchableOpacity
                key={coin.id}
                style={[styles.option, isActive && styles.optionActive]}
                onPress={() => onSelectCoin(coin.id)}
              >
                <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                  {coin.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.generateButton, disabled && styles.disabledButton]}
          onPress={onGenerate}
          disabled={disabled}
        >
          <Text style={styles.generateText}>{loading ? 'Generating...' : 'Generate wallet'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancel} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  title: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  selector: {
    marginBottom: 24,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    marginBottom: 12,
  },
  optionActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  optionText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#0f172a',
    fontWeight: '600',
  },
  generateButton: {
    backgroundColor: '#38bdf8',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  generateText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 16,
  },
  cancel: {
    marginTop: 16,
    alignItems: 'center',
  },
  cancelText: {
    color: '#94a3b8',
    fontWeight: '500',
  },
});

export default CreateWalletModal;
