import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../services/api';

const AUTH_STORAGE_KEY = 'hawk_wallet_auth';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [hydrated, setHydrated] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [mnemonic, setMnemonic] = useState('');

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          setToken(data.token || '');
          setEmail(data.email || '');
        }
      } catch (error) {
        console.warn('Failed to hydrate auth state', error);
      } finally {
        setHydrated(true);
      }
    };

    loadAuthState();
  }, []);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const persistAuthState = async (nextToken, nextEmail) => {
    try {
      if (nextToken) {
        const payload = JSON.stringify({ token: nextToken, email: nextEmail });
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, payload);
      } else {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Failed to persist auth state', error);
    }
  };

  const handleUpdateToken = async (nextToken, nextEmail = email) => {
    setToken(nextToken);
    if (nextEmail !== email) {
      setEmail(nextEmail);
    }
    await persistAuthState(nextToken, nextEmail);
  };

  const handleLogout = async () => {
    setToken('');
    setEmail('');
    setMnemonic('');
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      hydrated,
      token,
      email,
      mnemonic,
      signedIn: Boolean(token),
      updateToken: handleUpdateToken,
      updateEmail: setEmail,
      updateMnemonic: setMnemonic,
      logout: handleLogout,
    }),
    [hydrated, token, email, mnemonic],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
