import React, { useState } from 'react';
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

const nameSchema = z
  .string()
  .min(3, 'Minimum 3 characters required.')
  .max(16, 'Maximum 16 characters allowed.')
  .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed.');

const emailSchema = z.string().email('Please enter a valid email.');

const passwordSchema = z
  .string()
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
    'Password must contain upper, lower, number, special character, min 8 chars.',
  );

const SignupScreen = ({ navigation }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    let schema;
    if (field === 'name') schema = nameSchema;
    if (field === 'email') schema = emailSchema;
    if (field === 'password') schema = passwordSchema;

    if (!schema) return;

    const result = schema.safeParse(value);
    setErrors((prev) => ({ ...prev, [field]: result.success ? '' : result.error.issues[0]?.message }));
  };

  const handleSubmit = async () => {
    const nameResult = nameSchema.safeParse(form.name.trim());
    const emailResult = emailSchema.safeParse(form.email.trim());
    const passwordResult = passwordSchema.safeParse(form.password);

    if (!nameResult.success || !emailResult.success || !passwordResult.success) {
      setErrors({
        name: nameResult.success ? '' : nameResult.error.issues[0]?.message,
        email: emailResult.success ? '' : 'Please enter a valid email.',
        password: passwordResult.success ? '' : passwordResult.error.issues[0]?.message,
      });
      Alert.alert('Invalid input', 'Please resolve validation errors before signing up.');
      return;
    }

    try {
      setSubmitting(true);
      await apiClient.post('/api/signup', {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      Alert.alert('Signup complete', 'Account created successfully. Please log in.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      console.error('Signup error', error);
      const message = error.response?.data?.message || 'An error occurred during signup.';
      Alert.alert('Signup failed', message);
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
          <Text style={styles.title}>Create a Hawk Wallet account</Text>
          <Text style={styles.subtitle}>Generate secure crypto wallets in seconds.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            value={form.name}
            onChangeText={(value) => handleChange('name', value)}
            placeholder="Username"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />
          {!!errors.name && <Text style={styles.validation}>{errors.name}</Text>}

          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(value) => handleChange('email', value)}
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />
          {!!errors.email && <Text style={styles.validation}>{errors.email}</Text>}

          <Text style={styles.label}>Password</Text>
          <TextInput
            secureTextEntry
            value={form.password}
            onChangeText={(value) => handleChange('password', value)}
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />
          {!!errors.password && <Text style={styles.validation}>{errors.password}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign up</Text>}
          </TouchableOpacity>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.switchLink}>Log in</Text>
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
    fontSize: 28,
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

export default SignupScreen;
