// components/layout/GradientButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function GradientButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  size = 'md',
  fullWidth = true,
}: GradientButtonProps) {
  const theme = Colors.dark;

  const gradientColors: Record<typeof variant, readonly [string, string, string]> = {
    primary: ['#8B5CF6', '#6C3EFF', '#7C3AED'], // purple gradient
    secondary: ['#22d3ee', '#06b6d4', '#0891b2'], // cyan gradient
    danger: ['#ef4444', '#dc2626', '#b91c1c'], // red gradient
  };

  const paddingMap: Record<
    typeof size,
    { paddingVertical: number; paddingHorizontal: number }
  > = {
    sm: { paddingVertical: 10, paddingHorizontal: 20 },
    md: { paddingVertical: 14, paddingHorizontal: 28 },
    lg: { paddingVertical: 16, paddingHorizontal: 32 },
  };

  const fontSizeMap: Record<typeof size, number> = {
    sm: 13,
    md: 15,
    lg: 16,
  };

  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle = {
    width: fullWidth ? '100%' : 'auto',
    opacity: isDisabled ? 0.5 : 1,
  };

  // Dynamic shadow styles - only apply when button is enabled
  const shadowStyle: ViewStyle = isDisabled
    ? {}
    : {
        shadowColor: variant === 'primary' ? '#6C3EFF' : variant === 'secondary' ? '#06b6d4' : '#dc2626',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
      };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={containerStyle}
    >
      <LinearGradient
        colors={gradientColors[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.button,
          paddingMap[size],
          shadowStyle, // Apply shadow conditionally
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={[styles.title, { fontSize: fontSizeMap[size] }]}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});