import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useLoansStore } from '../store/loansStore';
import LoanCard from '../components/LoanCard';
import type { Loan } from '../types';

export default function LoanHistoryScreen() {
  const loans = useLoansStore((s) => s.loans);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Loan History</Text>
        <Text style={styles.count}>{loans.length} loan{loans.length !== 1 ? 's' : ''}</Text>
      </View>
      {loans.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No loans yet.</Text>
        </View>
      ) : (
        <FlatList<Loan>
          data={loans}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <LoanCard loan={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 20, paddingBottom: 8,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#1f2937' },
  count: { fontSize: 14, color: '#6b7280' },
  list: { padding: 20, paddingTop: 8 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#9ca3af', fontSize: 16 },
});
