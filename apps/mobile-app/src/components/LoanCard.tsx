import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Loan } from '../types';
import { formatUSD } from '../utils/credit';
import Card from './Card';

const STATUS_COLOR: Record<string, string> = {
  active: '#f59e0b',
  repaid: '#22c55e',
  defaulted: '#ef4444',
};

interface Props {
  loan: Loan;
  onPress?: () => void;
}

export default function LoanCard({ loan }: Props) {
  const color = STATUS_COLOR[loan.status] ?? '#6b7280';
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.amount}>{formatUSD(loan.amount)}</Text>
        <View style={[styles.badge, { backgroundColor: color }]}>
          <Text style={styles.badgeText}>{loan.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.meta}>
        Interest: {loan.interestRate}% · Due: {new Date(loan.dueDate).toLocaleDateString()}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amount: { fontSize: 22, fontWeight: '700', color: '#1f2937' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  meta: { marginTop: 6, color: '#6b7280', fontSize: 13 },
});
