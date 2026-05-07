import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParams } from '../navigation/RootNavigator';
import Button from '../components/Button';

type Props = NativeStackScreenProps<AuthStackParams, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.emoji}>🌍</Text>
        <Text style={styles.title}>MicroLend</Text>
        <Text style={styles.subtitle}>
          Instant micro-loans on Stellar.{'\n'}Built for the unbanked.
        </Text>
      </View>
      <View style={styles.actions}>
        <Button title="Get Started" onPress={() => navigation.navigate('Register')} />
        <Text style={styles.note}>Powered by Stellar · USDC · Soroban</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f3ff', justifyContent: 'space-between' },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emoji: { fontSize: 72, marginBottom: 16 },
  title: { fontSize: 40, fontWeight: '800', color: '#4f46e5' },
  subtitle: { fontSize: 18, color: '#6b7280', textAlign: 'center', marginTop: 12, lineHeight: 26 },
  actions: { padding: 32, gap: 16 },
  note: { textAlign: 'center', color: '#9ca3af', fontSize: 12 },
});
