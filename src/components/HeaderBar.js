import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useAppContext from '../hooks/useAppContext';

const HeaderBar = ({ onCreateWallet }) => {
  const { email, logout } = useAppContext();

  const handleLogout = () => {
    Promise.resolve(logout()).catch((error) => {
      console.warn('Failed to logout', error);
    });
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.email}>{email || 'Unknown user'}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={onCreateWallet}>
          <Text style={styles.primaryText}>Create wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout}>
          <Text style={styles.secondaryText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
  },
  label: {
    color: '#94a3b8',
    fontSize: 12,
  },
  email: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
  },
  primaryText: {
    color: '#0f172a',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#38bdf8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  secondaryText: {
    color: '#38bdf8',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default HeaderBar;
