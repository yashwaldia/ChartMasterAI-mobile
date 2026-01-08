// components/layout/GradientButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
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
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const gradientColors: Record<typeof variant, readonly [string, string, string]> = {
    primary: [theme.primaryGradientStart, theme.primary, theme.primaryGradientEnd],
    secondary: ['#22d3ee', '#06b6d4', '#0891b2'],
    danger: ['#ef4444', '#dc2626', '#b91c1c'],
  };

  const paddingMap: Record<
    typeof size,
    { paddingVertical: number; paddingHorizontal: number }
  > = {
    sm: { paddingVertical: 12, paddingHorizontal: 24 },
    md: { paddingVertical: 14, paddingHorizontal: 28 },
    lg: { paddingVertical: 16, paddingHorizontal: 32 },
  };

  const fontSizeMap: Record<typeof size, number> = {
    sm: 14,
    md: 15,
    lg: 16,
  };

  const borderRadiusMap: Record<typeof size, number> = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle = {
    width: fullWidth ? '100%' : 'auto',
    opacity: isDisabled ? 0.5 : 1,
  };

  const shadowStyle: ViewStyle = isDisabled
    ? {}
    : {
        shadowColor: variant === 'primary' ? theme.primary : variant === 'secondary' ? '#06b6d4' : '#dc2626',
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: variant === 'primary' ? 0.4 : 0.3,
        shadowRadius: 24,
        elevation: 8,
      };

  // ✅ Safe haptic feedback with try-catch
  const triggerHaptic = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Silently fail if haptics not available on device
      console.log('Haptics not available:', error);
    }
  };

  const handlePressIn = () => {
    if (!isDisabled) {
      triggerHaptic();
      Animated.spring(scaleValue, {
        toValue: 0.96,
        useNativeDriver: true,
        friction: 3,
        tension: 200,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!isDisabled) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        friction: 3,
        tension: 200,
      }).start();
    }
  };

  const handlePress = () => {
    if (!isDisabled) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      activeOpacity={0.9}
      style={containerStyle}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <LinearGradient
          colors={gradientColors[variant]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.button,
            paddingMap[size],
            { borderRadius: borderRadiusMap[size] },
            shadowStyle,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={[styles.title, { fontSize: fontSizeMap[size] }]}>{title}</Text>
          )}
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
