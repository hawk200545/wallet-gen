import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';
import { apiClient } from '../services/api';
import useAppContext from '../hooks/useAppContext';
import { decryptMnemonic } from '../utils/crypto';

const emailSchema = z.string().email();
const passwordSchema = z
  .string()
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
    'Password must contain upper, lower, number, special character, min 8 chars.',
  );

function ValidationMessage({ message }) {
  if (!message) {
    return null;
  }
  return <Text style={styles.validation}>{message}</Text>;
}

const LoginScreen = ({ navigation }) => {
  const { updateMnemonic, updateToken, updateEmail, signedIn, hydrated } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (hydrated && signedIn) {
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    }
  }, [hydrated, signedIn, navigation]);

  const handleEmailChange = (value) => {
    setEmail(value.trim());
    const result = emailSchema.safeParse(value.trim());
    setErrors((prev) => ({ ...prev, email: result.success ? '' : 'Invalid email address.' }));
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    const result = passwordSchema.safeParse(value);
    setErrors((prev) => ({ ...prev, password: result.success ? '' : result.error.issues[0]?.message }));
  };

  const handleSubmit = async () => {
    const emailResult = emailSchema.safeParse(email);
    const passwordResult = passwordSchema.safeParse(password);

    if (!emailResult.success || !passwordResult.success) {
      setErrors({
        email: emailResult.success ? '' : 'Invalid email address.',
        password: passwordResult.success ? '' : passwordResult.error.issues[0]?.message,
      });
      Alert.alert('Invalid input', 'Please fix validation errors before continuing.');
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await apiClient.post('/api/login', { email, password });
      const decryptedMnemonic = await decryptMnemonic(
        {
          salt: data.salt,
          iv: data.iv,
          encryptedMnemonic: data.encryptedMnemonic,
        },
        password,
      );

      updateEmail(email);
      await updateToken(data.token, email);
      updateMnemonic(decryptedMnemonic);

      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error) {
      console.error('Login error', error);
      const message = error.response?.data?.message || 'An error occurred during login.';
      Alert.alert('Login failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Hawk Wallet</Text>
          <Text style={styles.subtitle}>Secure your finances in style.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={handleEmailChange}
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />
          <ValidationMessage message={errors.email} />

          <Text style={styles.label}>Password</Text>
          <TextInput
            secureTextEntry
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />
          <ValidationMessage message={errors.password} />

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
          </TouchableOpacity>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.switchLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#38bdf8',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#cbd5f5',
  },
  form: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  label: {
    color: '#e2e8f0',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: 'rgba(226, 232, 240, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#f8fafc',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)',
  },
  validation: {
    color: '#fca5a5',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#0284c7',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#f8fafc',
    fontWeight: '600',
    fontSize: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  switchText: {
    color: '#94a3b8',
    marginRight: 8,
  },
  switchLink: {
    color: '#38bdf8',
    fontWeight: '600',
  },
});

export default LoginScreen;
