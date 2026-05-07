import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { useLoansStore } from '../store/loansStore';
import { getUser } from '../services/api';
import CreditScoreBadge from '../components/CreditScoreBadge';
import LoanCard from '../components/LoanCard';
import Card from '../components/Card';

export default function DashboardScreen() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const { loans, setLoans } = useLoansStore();

  const { data, isLoading } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: () => getUser(user!.id),
    enabled: !!user?.id,
    refetchInterval: 30_000,
  });

  useEffect(() => {
    if (data) {
      updateUser({ creditScore: data.creditScore, kycStatus: data.kycStatus });
    }
  }, [data]);

  const activeLoan = loans.find((l) => l.status === 'active');

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>
          Hello 👋{'\n'}
          <Text style={styles.address} numberOfLines={1}>
            {user?.stellarAddress?.slice(0, 8)}...{user?.stellarAddress?.slice(-4)}
          </Text>
        </Text>

        <View style={styles.scoreRow}>
          <CreditScoreBadge score={user?.creditScore ?? 500} />
          <Card style={styles.kycCard}>
            <Text style={styles.kycLabel}>KYC Status</Text>
            <Text
              style={[
                styles.kycValue,
                user?.kycStatus === 'approved' ? styles.approved : styles.pending,
              ]}
            >
              {user?.kycStatus?.toUpperCase()}
            </Text>
            <Text style={styles.kycLabel}>Country</Text>
            <Text style={styles.kycValue}>{user?.country}</Text>
          </Card>
        </View>

        {activeLoan && (
          <>
            <Text style={styles.sectionTitle}>Active Loan</Text>
            <LoanCard loan={activeLoan} />
          </>
        )}

        {loans.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent Loans</Text>
            {loans.slice(0, 3).map((l) => (
              <LoanCard key={l.id} loan={l} />
            ))}
          </>
        )}

        {loans.length === 0 && (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No loans yet. Tap Borrow to get started!</Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 20, gap: 16 },
  greeting: { fontSize: 24, fontWeight: '800', color: '#1f2937' },
  address: { fontSize: 14, color: '#6b7280', fontWeight: '400' },
  scoreRow: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  kycCard: { flex: 1, gap: 4 },
  kycLabel: { fontSize: 11, color: '#9ca3af', textTransform: 'uppercase' },
  kycValue: { fontSize: 15, fontWeight: '700', color: '#1f2937' },
  approved: { color: '#22c55e' },
  pending: { color: '#f59e0b' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  emptyCard: { alignItems: 'center', padding: 24 },
  emptyText: { color: '#6b7280', textAlign: 'center' },
});
