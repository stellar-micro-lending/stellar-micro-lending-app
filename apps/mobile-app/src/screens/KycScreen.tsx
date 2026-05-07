import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParams } from '../navigation/RootNavigator';
import { updateKyc } from '../services/api';
import { useAuthStore } from '../store/authStore';
import Button from '../components/Button';
import Card from '../components/Card';

type Props = NativeStackScreenProps<AuthStackParams, 'Kyc'>;

export default function KycScreen({ route }: Props) {
  const { userId } = route.params;
  const updateUser = useAuthStore((s) => s.updateUser);
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      // In dev, auto-approve. In production this triggers SEP-12 flow.
      const updated = await updateKyc(userId, 'approved');
      updateUser({ kycStatus: updated.kycStatus });
      setSubmitted(true);
      // Trigger re-auth by setting full user (navigates to main via store)
      if (user) setUser({ ...user, kycStatus: 'approved' });
    } catch {
      Alert.alert('Error', 'KYC submission failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Identity Verification</Text>
        <Text style={styles.subtitle}>
          We need to verify your identity before you can borrow.
        </Text>

        <Card style={styles.card}>
          <Text style={styles.step}>✅ Phone number verified</Text>
          <Text style={styles.step}>✅ Stellar address linked</Text>
          <Text style={[styles.step, submitted && styles.done]}>
            {submitted ? '✅' : '⏳'} KYC approval (SEP-12)
          </Text>
        </Card>

        {submitted ? (
          <Text style={styles.success}>
            KYC approved! You can now request loans.
          </Text>
        ) : (
          <Button
            title="Submit KYC"
            onPress={handleSubmit}
            loading={loading}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#1f2937' },
  subtitle: { fontSize: 15, color: '#6b7280' },
  card: { gap: 12 },
  step: { fontSize: 15, color: '#374151' },
  done: { color: '#22c55e' },
  success: { fontSize: 16, color: '#22c55e', fontWeight: '600', textAlign: 'center' },
});
