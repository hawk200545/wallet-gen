import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';

const WalletCard = ({ wallet, coinType }) => {
  const [showPrivate, setShowPrivate] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (!copiedField) return;
    const timer = setTimeout(() => setCopiedField(null), 1500);
    return () => clearTimeout(timer);
  }, [copiedField]);

  if (!wallet) {
    return (
      <View style={[styles.container, styles.loadingCard]}>
        <Text style={styles.loadingText}>Loading wallet...</Text>
      </View>
    );
  }

  const handleCopy = async (value, field) => {
    try {
      await Clipboard.setStringAsync(value);
      setCopiedField(field);
    } catch (error) {
      console.warn('Failed to copy value', error);
    }
  };

  const privateKeyValue = wallet.privateKey || 'Unavailable';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {coinType.charAt(0).toUpperCase() + coinType.slice(1)} Wallet #{wallet.index}
        </Text>
        <TouchableOpacity onPress={() => setShowPrivate((prev) => !prev)}>
          <Text style={styles.toggle}>{showPrivate ? 'Hide key' : 'Show key'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Public Key</Text>
        <TouchableOpacity onPress={() => handleCopy(wallet.publicKey, 'public')}>
          <Text style={styles.copy}>{copiedField === 'public' ? 'Copied' : 'Copy'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.value}>{wallet.publicKey}</Text>

      {showPrivate && (
        <View style={styles.privateSection}>
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, styles.privateLabel]}>Private Key</Text>
            <TouchableOpacity
              onPress={() => handleCopy(privateKeyValue, 'private')}
              disabled={!wallet.privateKey}
            >
              <Text
                style={[
                  styles.copy,
                  styles.privateCopy,
                  !wallet.privateKey && styles.copyDisabled,
                ]}
              >
                {copiedField === 'private' ? 'Copied' : wallet.privateKey ? 'Copy' : 'Unavailable'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.value, styles.privateValue]}>{privateKeyValue}</Text>
          <Text style={styles.warning}>Never share your private key with anyone.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(30, 64, 175, 0.3)',
  },
  loadingCard: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    color: '#94a3b8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  toggle: {
    color: '#38bdf8',
    fontWeight: '500',
  },
  field: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    color: '#cbd5f5',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  copy: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '600',
  },
  copyDisabled: {
    color: '#64748b',
  },
  value: {
    marginTop: 6,
    color: '#e2e8f0',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    fontSize: 12,
  },
  privateSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  privateLabel: {
    color: '#f87171',
  },
  privateCopy: {
    color: '#fca5a5',
  },
  privateValue: {
    color: '#fca5a5',
  },
  warning: {
    marginTop: 12,
    color: '#f87171',
    fontSize: 12,
  },
});

export default WalletCard;
