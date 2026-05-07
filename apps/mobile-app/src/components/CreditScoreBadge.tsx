import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { creditScoreColor, creditScoreLabel, getMaxLoanAmount } from '../utils/credit';

interface Props {
  score: number;
}

export default function CreditScoreBadge({ score }: Props) {
  const color = creditScoreColor(score);
  const label = creditScoreLabel(score);
  const maxLoan = getMaxLoanAmount(score);

  return (
    <View style={[styles.container, { borderColor: color }]}>
      <Text style={[styles.score, { color }]}>{score}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.limit}>Max loan: ${maxLoan}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderWidth: 3,
    borderRadius: 60,
    width: 120,
    height: 120,
    justifyContent: 'center',
  },
  score: { fontSize: 28, fontWeight: '800' },
  label: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  limit: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
});
