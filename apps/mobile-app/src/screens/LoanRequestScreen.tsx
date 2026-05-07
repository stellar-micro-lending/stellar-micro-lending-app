import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TextInput, Alert, ScrollView,
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import { useLoansStore } from '../store/loansStore';
import { requestLoan } from '../services/api';
import { getMaxLoanAmount, formatUSD } from '../utils/credit';
import Button from '../components/Button';
import Card from '../components/Card';

export default function LoanRequestScreen() {
  const user = useAuthStore((s) => s.user);
  const addLoan = useLoansStore((s) => s.addLoan);
  const maxLoan = getMaxLoanAmount(user?.creditScore ?? 500);

  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleRequest() {
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      Alert.alert('Error', 'Enter a valid amount.');
      return;
    }
    if (num > maxLoan) {
      Alert.alert('Error', `Max loan for your score is ${formatUSD(maxLoan)}.`);
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const loan = await requestLoan({ borrowerId: user.id, amount: num, dueDate });
      addLoan(loan);
      setSuccess(true);
      setAmount('');
    } catch {
      Alert.alert('Error', 'Loan request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Request a Loan</Text>

        <Card style={styles.infoCard}>
          <Text style={styles.infoLabel}>Your credit score</Text>
          <Text style={styles.infoValue}>{user?.creditScore ?? 500}</Text>
          <Text style={styles.infoLabel}>Maximum loan amount</Text>
          <Text style={styles.infoValue}>{formatUSD(maxLoan)}</Text>
          <Text style={styles.infoLabel}>Interest rate</Text>
          <Text style={styles.infoValue}>10% · 30-day term</Text>
        </Card>

        {success ? (
          <Card style={styles.successCard}>
            <Text style={styles.successText}>
              ✅ Loan approved! USDC will be sent to your Stellar wallet.
            </Text>
          </Card>
        ) : (
          <>
            <Text style={styles.label}>Amount (USD)</Text>
            <TextInput
              style={styles.input}
              placeholder={`Up to ${formatUSD(maxLoan)}`}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
            <Button
              title={`Request Loan`}
              onPress={handleRequest}
              loading={loading}
              disabled={maxLoan === 0}
            />
            {maxLoan === 0 && (
              <Text style={styles.warn}>
                Your credit score is too low to borrow. Improve it by repaying loans.
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#1f2937' },
  infoCard: { gap: 4 },
  infoLabel: { fontSize: 11, color: '#9ca3af', textTransform: 'uppercase' },
  infoValue: { fontSize: 18, fontWeight: '700', color: '#1f2937', marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151' },
  input: {
    borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10,
    padding: 12, fontSize: 18,
  },
  successCard: { backgroundColor: '#f0fdf4' },
  successText: { color: '#16a34a', fontSize: 15, fontWeight: '600' },
  warn: { color: '#ef4444', fontSize: 13, textAlign: 'center' },
});
