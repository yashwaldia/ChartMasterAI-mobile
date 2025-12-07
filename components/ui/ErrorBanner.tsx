// components/ui/ErrorBanner.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

interface ErrorBannerProps {
  message: string;
  onClose?: () => void;
  autoClose?: number;
}

export default function ErrorBanner({
  message,
  onClose,
  autoClose = 5000,
}: ErrorBannerProps) {
  const [visible, setVisible] = useState(true);
  const theme = Colors.dark;

  useEffect(() => {
    if (!autoClose) return;
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, autoClose);
    return () => clearTimeout(timer);
  }, [autoClose, onClose]);

  if (!visible || !message) return null;

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      exiting={FadeOutUp.duration(300)}
      style={[
        styles.container,
        {
          backgroundColor: theme.error + '20',
          borderColor: theme.error,
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="alert-circle" size={20} color={theme.error} />
      </View>
      <Text style={[styles.text, { color: theme.text }]} numberOfLines={3}>
        {message}
      </Text>
      <TouchableOpacity
        onPress={handleClose}
        style={styles.closeButton}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={20} color={theme.error} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderLeftWidth: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },
  closeButton: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
