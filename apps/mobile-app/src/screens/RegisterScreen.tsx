import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, SafeAreaView,
  ScrollView, Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParams } from '../navigation/RootNavigator';
import { registerUser } from '../services/api';
import { useAuthStore } from '../store/authStore';
import Button from '../components/Button';

type Props = NativeStackScreenProps<AuthStackParams, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const setUser = useAuthStore((s) => s.setUser);
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [stellarAddress, setStellarAddress] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!phone || !country || !stellarAddress) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    setLoading(true);
    try {
      const user = await registerUser({ stellarAddress, phoneNumber: phone, country });
      setUser(user);
      navigation.navigate('Kyc', { userId: user.id });
    } catch {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join MicroLend to access instant loans</Text>

        <Text style={styles.label}>Stellar Address</Text>
        <TextInput
          style={styles.input}
          placeholder="G..."
          value={stellarAddress}
          onChangeText={setStellarAddress}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="+254700000000"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Country Code</Text>
        <TextInput
          style={styles.input}
          placeholder="KE"
          value={country}
          onChangeText={(t) => setCountry(t.toUpperCase())}
          maxLength={2}
          autoCapitalize="characters"
        />

        <Button title="Register" onPress={handleRegister} loading={loading} style={styles.btn} />
        <Button
          title="Back"
          onPress={() => navigation.goBack()}
          variant="outline"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 24, gap: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#1f2937', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#6b7280', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151' },
  input: {
    borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10,
    padding: 12, fontSize: 15, marginBottom: 8,
  },
  btn: { marginTop: 8, marginBottom: 8 },
});
