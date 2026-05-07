import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  style,
}: Props) {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity
      style={[
        styles.base,
        isPrimary ? styles.primary : styles.outline,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : '#6366f1'} />
      ) : (
        <Text style={[styles.text, !isPrimary && styles.outlineText]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primary: { backgroundColor: '#6366f1' },
  outline: { borderWidth: 2, borderColor: '#6366f1', backgroundColor: 'transparent' },
  disabled: { opacity: 0.5 },
  text: { color: '#fff', fontWeight: '700', fontSize: 16 },
  outlineText: { color: '#6366f1' },
});
