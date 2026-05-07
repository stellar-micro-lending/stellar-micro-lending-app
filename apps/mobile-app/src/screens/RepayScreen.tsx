import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TextInput, Alert, ScrollView,
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import { useLoansStore } from '../store/loansStore';
import { repayLoan } from '../services/api';
import { formatUSD } from '../utils/credit';
import Button from '../components/Button';
import LoanCard from '../components/LoanCard';
import Card from '../components/Card';

export default function RepayScreen() {
  const user = useAuthStore((s) => s.user);
  const { loans, updateLoan } = useLoansStore();
  const activeLoan = loans.find((l) => l.status === 'active');

  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const totalDue = activeLoan
    ? (parseFloat(activeLoan.amount) * (1 + parseFloat(activeLoan.interestRate) / 100)).toFixed(2)
    : '0';

  async function handleRepay() {
    if (!activeLoan || !user) return;
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      Alert.alert('Error', 'Enter a valid repayment amount.');
      return;
    }
    setLoading(true);
    try {
      const updated = await repayLoan(activeLoan.id, { payerId: user.id, amount: num });
      updateLoan(activeLoan.id, { status: updated.status });
      if (updated.status === 'repaid') {
        Alert.alert('🎉 Paid!', 'Loan fully repaid. Your credit score increased by +20.');
      } else {
        Alert.alert('✅ Payment received', `${formatUSD(num)} applied to your loan.`);
      }
      setAmount('');
    } catch {
      Alert.alert('Error', 'Repayment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Repay Loan</Text>

        {!activeLoan ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No active loan to repay.</Text>
          </Card>
        ) : (
          <>
            <LoanCard loan={activeLoan} />

            <Card style={styles.dueCard}>
              <Text style={styles.dueLabel}>Total due (principal + 10%)</Text>
              <Text style={styles.dueAmount}>{formatUSD(totalDue)}</Text>
            </Card>

            <Text style={styles.label}>Repayment Amount (USD)</Text>
            <TextInput
              style={styles.input}
              placeholder={`Up to ${formatUSD(totalDue)}`}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
            <Button title="Submit Repayment" onPress={handleRepay} loading={loading} />
            <Text style={styles.hint}>
              Partial repayments accepted. Full repayment earns +20 credit score.
            </Text>
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
  dueCard: { backgroundColor: '#fef3c7' },
  dueLabel: { fontSize: 12, color: '#92400e', textTransform: 'uppercase' },
  dueAmount: { fontSize: 28, fontWeight: '800', color: '#92400e', marginTop: 4 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151' },
  input: {
    borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10,
    padding: 12, fontSize: 18,
  },
  hint: { fontSize: 12, color: '#9ca3af', textAlign: 'center' },
  emptyCard: { alignItems: 'center', padding: 24 },
  emptyText: { color: '#6b7280' },
});
